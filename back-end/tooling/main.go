package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"regexp"
	"regexp/syntax"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/creack/pty"
)

// A Matcher decides whether some filename matches its set of patterns.
type Matcher interface {
	// Match returns whether a filename matches.
	Match(name string) bool
	// ExcludePrefix returns whether all paths with this prefix cannot match.
	// It is allowed to return false negatives but not false positives.
	// This is used as an optimization for skipping directory watches with
	// inverted matches.
	ExcludePrefix(prefix string) bool
	String() string
}

type regexMatcher struct {
	regex   *regexp.Regexp
	inverse bool

	mu               *sync.Mutex // protects following
	canExcludePrefix bool        // This regex has no $, \z, or \b -- see ExcludePrefix
	excludeChecked   bool
}

func (m *regexMatcher) Match(name string) bool {
	return m.regex.MatchString(name) != m.inverse
}

func newRegexMatcher(regex *regexp.Regexp, inverse bool) *regexMatcher {
	return &regexMatcher{
		regex:   regex,
		inverse: inverse,
		mu:      new(sync.Mutex),
	}
}

// ExcludePrefix returns whether this matcher cannot possibly match any path
// with a particular prefix. The question is: given a regex r and some prefix p
// which r accepts, is there any string s that has p as a prefix that r does not
// accept?
//
// With a classic regular expression from CS, this can only be the case if r
// ends with $, the end-of-input token (because once the NFA is in an accepting
// state, adding more input will not change that). In Go's regular expressions,
// I think the only way to construct a regex that would not meet this criteria
// is by using zero-width lookahead. There is no arbitrary lookahead in Go, so
// the only zero-width lookahead is provided by $, \z, and \b. For instance, the
// following regular expressions match the "foo", but not "foobar":
//
//   foo$
//   foo\b
//   (foo$)|(baz$)
//
// Thus, to choose whether we can exclude this prefix, m must be an inverse
// matcher that does not contain the zero-width ops $, \z, and \b.
func (m *regexMatcher) ExcludePrefix(prefix string) bool {
	if !m.inverse {
		return false
	}
	if !m.regex.MatchString(prefix) || m.regex.String() == "" {
		return false
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	if !m.excludeChecked {
		r, err := syntax.Parse(m.regex.String(), syntax.Perl)
		if err != nil {
			panic("Cannot compile regex, but it was previously compiled!?!")
		}
		r = r.Simplify()
		stack := []*syntax.Regexp{r}
		for len(stack) > 0 {
			cur := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			switch cur.Op {
			case syntax.OpEndLine, syntax.OpEndText, syntax.OpWordBoundary:
				m.canExcludePrefix = false
				goto after
			}
			if cur.Sub0[0] != nil {
				stack = append(stack, cur.Sub0[0])
			}
			stack = append(stack, cur.Sub...)
		}
		m.canExcludePrefix = true
	after:
		m.excludeChecked = true
	}
	return m.canExcludePrefix
}

func (m *regexMatcher) String() string {
	s := "Regex"
	if m.inverse {
		s = "Inverted regex"
	}
	return fmt.Sprintf("%s match: %q", s, m.regex.String())
}

// A Backlog represents a queue of file paths that may be received while we're
// still running a command. There are a couple of different policies for how to
// handle this. If there are no {} (substitution sequences) in the command, then
// we only need to preserve one of the paths. If there is a {}, then we need to
// preserve each unique path in the backlog.
type Backlog interface {
	// Add a path to the backlog.
	Add(path string)
	// Show what path should be processed next.
	Next() string
	// Remove the next path from the backlog and return whether
	// the backlog is now empty.
	RemoveOne() (empty bool)
}

// A UnifiedBacklog only remembers one backlog item at a time.
type UnifiedBacklog struct {
	s     string
	empty bool
}

func NewUnifiedBacklog() *UnifiedBacklog {
	return &UnifiedBacklog{empty: true}
}

// Add adds path to b if there is not a path there currently.
// Otherwise it discards it.
func (b *UnifiedBacklog) Add(path string) {
	if b.empty {
		b.s = path
		b.empty = false
	}
}

// Next returns the path in b.
func (b *UnifiedBacklog) Next() string {
	if b.empty {
		panic("Next() called on empty backlog")
	}
	return b.s
}

// RemoveOne removes the path in b.
func (b *UnifiedBacklog) RemoveOne() bool {
	if b.empty {
		panic("RemoveOne() called on empty backlog")
	}
	b.empty = true
	b.s = ""
	return true
}

// A Reflex is a single watch + command to execute.
type Reflex struct {
	id int
	// Describes what started this Reflex
	source       string
	startService bool
	backlog      Backlog
	matcher      Matcher
	command      []string
	done         chan struct{}

	mu      *sync.Mutex // protects killed and running
	killed  bool
	running bool
	timeout time.Duration

	// Used for services (startService = true)
	cmd *exec.Cmd
	tty *os.File
}

func NewReflex(matchString string, command []string) (*Reflex, error) {
	regex, err := regexp.Compile(matchString)

	if err != nil {
		return nil, err
	}

	matcher := newRegexMatcher(regex, false)

	if err != nil {
		return nil, fmt.Errorf("error parsing glob/regex: %s", err)
	}

	backlog := NewUnifiedBacklog()

	reflex := &Reflex{
		id:           0,
		source:       "[command line]",
		startService: true,
		backlog:      backlog,
		matcher:      matcher,
		command:      command,
		done:         make(chan struct{}),
		timeout:      500 * time.Millisecond,
		mu:           &sync.Mutex{},
	}

	return reflex, nil
}

func (r *Reflex) String() string {
	var buf bytes.Buffer

	fmt.Fprintln(&buf, "Reflex from", r.source)
	fmt.Fprintln(&buf, "| ID:", r.id)

	for _, matcherInfo := range strings.Split(r.matcher.String(), "\n") {
		fmt.Fprintln(&buf, "|", matcherInfo)
	}

	command := make([]string, len(r.command))

	fmt.Fprintln(&buf, "| Command:", command)
	fmt.Fprintln(&buf, "+---------")

	return buf.String()
}

// filterMatching passes on messages matching the regex/glob.
func (r *Reflex) filterMatching(out chan<- string, in <-chan string) {
	for name := range in {
		if !r.matcher.Match(name) {
			continue
		}

		out <- name
	}
}

// batch receives file notification events and batches them up. It's a bit
// tricky, but here's what it accomplishes:
// * When we initially get a message, wait a bit and batch messages before
//   trying to send anything. This is because the file events come in bursts.
// * Once it's time to send, don't do it until the out channel is unblocked.
//   In the meantime, keep batching. When we've sent off all the batched
//   messages, go back to the beginning.
func (r *Reflex) batch(out chan<- string, in <-chan string) {

	const silenceInterval = 300 * time.Millisecond

	for name := range in {
		r.backlog.Add(name)
		timer := time.NewTimer(silenceInterval)
	outer:
		for {
			select {
			case name := <-in:
				r.backlog.Add(name)
				if !timer.Stop() {
					<-timer.C
				}
				timer.Reset(silenceInterval)
			case <-timer.C:
				for {
					select {
					case name := <-in:
						r.backlog.Add(name)
					case out <- r.backlog.Next():
						if r.backlog.RemoveOne() {
							break outer
						}
					}
				}
			}
		}
	}
}

// runEach runs the command on each name that comes through the names channel.
// Each {} is replaced by the name of the file. The output of the command is
// passed line-by-line to the stdout chan.
func (r *Reflex) runEach(names <-chan string) {
	for name := range names {
		if r.startService {
			if r.Running() {
				infoPrintln(r.id, "Killing service")
				r.terminate()
			}
			infoPrintln(r.id, "Starting service")
			r.runCommand(name, stdout)
		} else {
			r.runCommand(name, stdout)
			<-r.done
			r.mu.Lock()
			r.running = false
			r.mu.Unlock()
		}
	}
}

func (r *Reflex) terminate() {
	r.mu.Lock()
	r.killed = true
	r.mu.Unlock()
	// Write ascii 3 (what you get from ^C) to the controlling pty.
	// (This won't do anything if the process already died as the write will
	// simply fail.)
	r.tty.Write([]byte{3})

	timer := time.NewTimer(r.timeout)
	sig := syscall.SIGINT
	for {
		select {
		case <-r.done:
			return
		case <-timer.C:
			if sig == syscall.SIGINT {
				infoPrintln(r.id, "Sending SIGINT signal...")
			} else {
				infoPrintln(r.id, "Sending SIGKILL signal...")
			}

			// Instead of killing the process, we want to kill its
			// whole pgroup in order to clean up any children the
			// process may have created.
			if err := syscall.Kill(-1*r.cmd.Process.Pid, sig); err != nil {
				infoPrintln(r.id, "Error killing:", err)
				if err.(syscall.Errno) == syscall.ESRCH { // no such process
					return
				}
			}
			// After SIGINT doesn't do anything, try SIGKILL next.
			timer.Reset(r.timeout)
			sig = syscall.SIGKILL
		}
	}
}

// runCommand runs the given Command. All output is passed line-by-line to the
// stdout channel.
func (r *Reflex) runCommand(name string, stdout chan<- OutMsg) {
	cmd := exec.Command(r.command[0], r.command[1:]...)
	r.cmd = cmd

	tty, err := pty.Start(cmd)
	if err != nil {
		infoPrintln(r.id, err)
		return
	}
	r.tty = tty

	// Handle pty size.
	chResize := make(chan os.Signal, 1)
	signal.Notify(chResize, syscall.SIGWINCH)

	go func() {
		for range chResize {
			// Intentionally ignore errors in case stdout is not a tty
			pty.InheritSize(os.Stdout, tty)
		}
	}()

	chResize <- syscall.SIGWINCH // Initial resize.

	go func() {
		for scanner := bufio.NewScanner(tty); scanner.Scan(); {
			stdout <- OutMsg{r.id, scanner.Text()}
		}

		// Intentionally ignoring scanner.Err() for now. Unfortunately,
		// the pty returns a read error when the child dies naturally,
		// so I'm just going to ignore errors here unless I can find a
		// better way to handle it.
	}()

	r.mu.Lock()
	r.running = true
	r.mu.Unlock()
	go func() {
		err := cmd.Wait()
		if !r.Killed() && err != nil {
			stdout <- OutMsg{r.id, fmt.Sprintf("(error exit: %s)", err)}
		}
		r.done <- struct{}{}

		signal.Stop(chResize)
		close(chResize)
	}()
}

func (r *Reflex) Start(changes <-chan string) {
	filtered := make(chan string)
	batched := make(chan string)
	go r.filterMatching(filtered, changes)
	go r.batch(batched, filtered)
	go r.runEach(batched)
	if r.startService {
		// Easy hack to kick off the initial start.
		infoPrintln(r.id, "Starting service")
		r.runCommand("", stdout)
	}
}

func (r *Reflex) Killed() bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.killed
}

func (r *Reflex) Running() bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.running
}

type OutMsg struct {
	reflexID int
	msg      string
}

var (
	stdout = make(chan OutMsg, 1)

	cleanupMu = &sync.Mutex{}
)

func watchFiles(filePath string, delay time.Duration) (*os.FileInfo, error) {
	initialStat, err := os.Stat(filePath)

	if err != nil {
		return nil, err
	}

	var stat os.FileInfo

	for {
		stat, err = os.Stat(filePath)

		if err != nil {
			return nil, err
		}

		if stat.Size() != initialStat.Size() || stat.ModTime() != initialStat.ModTime() {
			break
		}

		time.Sleep(delay)
	}

	return &stat, nil
}

func normalize(path string, dir bool) string {
	path = strings.TrimPrefix(path, "./")

	if dir && !strings.HasSuffix(path, "/") {
		path = path + "/"
	}

	return path
}

func watch(watchPath string, changes chan<- string) {
	var (
		fileStat    os.FileInfo
		newFileStat *os.FileInfo
		err         error
	)

	for {
		newFileStat, err = watchFiles(watchPath, 500*time.Millisecond)

		if err != nil || newFileStat == nil {
			continue
		}

		fileStat = *newFileStat

		changes <- normalize(fileStat.Name(), fileStat.IsDir())
	}
}

func printMsg(msg OutMsg, writer io.Writer) {
	tag := ""

	if msg.reflexID < 0 {
		tag = "[info]"
	} else {
		tag = fmt.Sprintf("[%02d]", msg.reflexID)
	}

	fmt.Fprintf(writer, tag+" ")
	fmt.Fprint(writer, msg.msg)

	if !strings.HasSuffix(msg.msg, "\n") {
		fmt.Fprintln(writer)
	}
}

func printOutput(out <-chan OutMsg, outWriter io.Writer) {
	for msg := range out {
		printMsg(msg, outWriter)
	}
}

func infoPrintln(id int, args ...interface{}) {
	stdout <- OutMsg{id, strings.TrimSpace(fmt.Sprintln(args...))}
}

func cleanup(reason string, reflex *Reflex) {
	cleanupMu.Lock()

	fmt.Println(reason)

	if reflex.Running() {
		reflex.terminate()
	}

	// Give just a little time to finish printing output.
	time.Sleep(10 * time.Millisecond)

	os.Exit(0)
}

func main() {
	changes := make(chan string)
	done := make(chan error)

	go printOutput(stdout, os.Stdout)

	reflex, err := NewReflex(".*.go", []string{"go", "run", "-mod", "vendor", "./main"})

	if err != nil {
		log.Fatal(err)
	}

	// Catch ctrl-c and make sure to kill off children.
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)
	signal.Notify(signals, os.Signal(syscall.SIGTERM))

	go func() {
		s := <-signals

		reason := fmt.Sprintf("Interrupted (%s). Cleaning up children...", s)

		cleanup(reason, reflex)
	}()

	go watch("./main/main.go", changes)

	reflex.Start(changes)

	log.Fatal(<-done)
}
