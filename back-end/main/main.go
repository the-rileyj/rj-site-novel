package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/antchfx/htmlquery"
	"github.com/gin-gonic/gin"
)

type UserPlaylistResponse struct {
	Collection []Collection `json:"collection"`
	NextHref   *string      `json:"next_href"`
	QueryUrn   *string      `json:"query_urn"`
}

type Collection struct {
	ArtworkURL     *string        `json:"artwork_url"`
	CreatedAt      string         `json:"created_at"`
	Description    *string        `json:"description"`
	DisplayDate    string         `json:"display_date"`
	Duration       int64          `json:"duration"`
	EmbeddableBy   string         `json:"embeddable_by"`
	Genre          *string        `json:"genre"`
	ID             int64          `json:"id"`
	IsAlbum        bool           `json:"is_album"`
	Kind           string         `json:"kind"`
	LabelName      *string        `json:"label_name"`
	LastModified   string         `json:"last_modified"`
	License        string         `json:"license"`
	LikesCount     int64          `json:"likes_count"`
	ManagedByFeeds bool           `json:"managed_by_feeds"`
	Permalink      string         `json:"permalink"`
	PermalinkURL   string         `json:"permalink_url"`
	Public         bool           `json:"public"`
	PublishedAt    string         `json:"published_at"`
	PurchaseTitle  *string        `json:"purchase_title"`
	PurchaseURL    *string        `json:"purchase_url"`
	ReleaseDate    *string        `json:"release_date"`
	RepostsCount   int64          `json:"reposts_count"`
	SetType        string         `json:"set_type"`
	Sharing        string         `json:"sharing"`
	TagList        string         `json:"tag_list"`
	Title          string         `json:"title"`
	TrackCount     int64          `json:"track_count"`
	Tracks         []TrackElement `json:"tracks"`
	URI            string         `json:"uri"`
	User           UserClass      `json:"user"`
	UserID         int64          `json:"user_id"`
}

type TrackElement struct {
	ArtworkURL        *string            `json:"artwork_url,omitempty"`
	CommentCount      *int64             `json:"comment_count,omitempty"`
	Commentable       *bool              `json:"commentable,omitempty"`
	CreatedAt         *string            `json:"created_at,omitempty"`
	Description       *string            `json:"description,omitempty"`
	DisplayDate       *string            `json:"display_date,omitempty"`
	DownloadCount     *int64             `json:"download_count,omitempty"`
	Downloadable      *bool              `json:"downloadable,omitempty"`
	Duration          *int64             `json:"duration,omitempty"`
	EmbeddableBy      *string            `json:"embeddable_by,omitempty"`
	FullDuration      *int64             `json:"full_duration,omitempty"`
	Genre             *string            `json:"genre,omitempty"`
	HasDownloadsLeft  *bool              `json:"has_downloads_left,omitempty"`
	ID                int64              `json:"id"`
	Kind              string             `json:"kind"`
	LabelName         *string            `json:"label_name"`
	LastModified      *string            `json:"last_modified,omitempty"`
	License           *string            `json:"license,omitempty"`
	LikesCount        *int64             `json:"likes_count,omitempty"`
	Media             *Media             `json:"media,omitempty"`
	MonetizationModel string             `json:"monetization_model"`
	Permalink         *string            `json:"permalink,omitempty"`
	PermalinkURL      *string            `json:"permalink_url,omitempty"`
	PlaybackCount     *int64             `json:"playback_count,omitempty"`
	Policy            string             `json:"policy"`
	Public            *bool              `json:"public,omitempty"`
	PublisherMetadata *PublisherMetadata `json:"publisher_metadata,omitempty"`
	PurchaseTitle     *string            `json:"purchase_title"`
	PurchaseURL       *string            `json:"purchase_url"`
	ReleaseDate       *string            `json:"release_date"`
	RepostsCount      *int64             `json:"reposts_count,omitempty"`
	Sharing           *string            `json:"sharing,omitempty"`
	State             *string            `json:"state,omitempty"`
	Streamable        *bool              `json:"streamable,omitempty"`
	TagList           *string            `json:"tag_list,omitempty"`
	Title             *string            `json:"title,omitempty"`
	URI               *string            `json:"uri,omitempty"`
	Urn               *string            `json:"urn,omitempty"`
	User              *UserClass         `json:"user,omitempty"`
	UserID            *int64             `json:"user_id,omitempty"`
	WaveformURL       *string            `json:"waveform_url,omitempty"`
}

type Media struct {
	Transcodings []Transcoding `json:"transcodings"`
}

type Transcoding struct {
	Duration int64  `json:"duration"`
	Format   Format `json:"format"`
	Preset   string `json:"preset"`
	Quality  string `json:"quality"`
	Snipped  bool   `json:"snipped"`
	URL      string `json:"url"`
}

type Format struct {
	MIMEType string `json:"mime_type"`
	Protocol string `json:"protocol"`
}

type PublisherMetadata struct {
	Artist          *string `json:"artist,omitempty"`
	ContainsMusic   *bool   `json:"contains_music,omitempty"`
	ID              int64   `json:"id"`
	Isrc            *string `json:"isrc,omitempty"`
	Urn             string  `json:"urn"`
	AlbumTitle      *string `json:"album_title,omitempty"`
	CLine           *string `json:"c_line,omitempty"`
	CLineForDisplay *string `json:"c_line_for_display,omitempty"`
	Explicit        *bool   `json:"explicit,omitempty"`
	PLine           *string `json:"p_line,omitempty"`
	PLineForDisplay *string `json:"p_line_for_display,omitempty"`
	ReleaseTitle    *string `json:"release_title,omitempty"`
	UpcOrEan        *string `json:"upc_or_ean,omitempty"`
	Publisher       *string `json:"publisher,omitempty"`
	WriterComposer  *string `json:"writer_composer,omitempty"`
}

type UserClass struct {
	AvatarURL    string  `json:"avatar_url"`
	City         *string `json:"city"`
	CountryCode  *string `json:"country_code"`
	FirstName    string  `json:"first_name"`
	FullName     string  `json:"full_name"`
	ID           int64   `json:"id"`
	Kind         string  `json:"kind"`
	LastModified string  `json:"last_modified"`
	LastName     string  `json:"last_name"`
	Permalink    string  `json:"permalink"`
	PermalinkURL string  `json:"permalink_url"`
	URI          string  `json:"uri"`
	Urn          string  `json:"urn"`
	Username     string  `json:"username"`
	Verified     bool    `json:"verified"`
}

type Song struct {
	Artist   string `json:"artist"`
	Title    string `json:"title"`
	Duration int
}

// User playlists response

type SoundCloudUserPlaylists struct {
	Collections []PlaylistCollection `json:"collection"`
	NextHref    *string              `json:"next_href"`
	QueryUrn    *string              `json:"query_urn"`
}

type PlaylistCollection struct {
	ArtworkURL     interface{} `json:"artwork_url"`
	CreatedAt      string      `json:"created_at"`
	Duration       int64       `json:"duration"`
	ID             int64       `json:"id"`
	Kind           string      `json:"kind"`
	LastModified   string      `json:"last_modified"`
	LikesCount     int64       `json:"likes_count"`
	ManagedByFeeds bool        `json:"managed_by_feeds"`
	Permalink      string      `json:"permalink"`
	PermalinkURL   string      `json:"permalink_url"`
	Public         bool        `json:"public"`
	RepostsCount   int64       `json:"reposts_count"`
	SecretToken    *string     `json:"secret_token"`
	Sharing        string      `json:"sharing"`
	Title          string      `json:"title"`
	TrackCount     int64       `json:"track_count"`
	URI            string      `json:"uri"`
	UserID         int64       `json:"user_id"`
	SetType        string      `json:"set_type"`
	IsAlbum        bool        `json:"is_album"`
	PublishedAt    string      `json:"published_at"`
	DisplayDate    string      `json:"display_date"`
	User           User        `json:"user"`
}

type User struct {
	AvatarURL    string `json:"avatar_url"`
	FirstName    string `json:"first_name"`
	FullName     string `json:"full_name"`
	ID           int64  `json:"id"`
	Kind         string `json:"kind"`
	LastModified string `json:"last_modified"`
	LastName     string `json:"last_name"`
	Permalink    string `json:"permalink"`
	PermalinkURL string `json:"permalink_url"`
	URI          string `json:"uri"`
	Urn          string `json:"urn"`
	Username     string `json:"username"`
	Verified     bool   `json:"verified"`
}

// Playlist Response

type SoundCloudPlaylist struct {
	ArtworkURL     *string        `json:"artwork_url"`
	CreatedAt      string         `json:"created_at"`
	Description    *string        `json:"description"`
	Duration       int64          `json:"duration"`
	EmbeddableBy   string         `json:"embeddable_by"`
	Genre          *string        `json:"genre"`
	ID             int64          `json:"id"`
	Kind           string         `json:"kind"`
	LabelName      *string        `json:"label_name"`
	LastModified   string         `json:"last_modified"`
	License        string         `json:"license"`
	LikesCount     int64          `json:"likes_count"`
	ManagedByFeeds bool           `json:"managed_by_feeds"`
	Permalink      string         `json:"permalink"`
	PermalinkURL   string         `json:"permalink_url"`
	Public         bool           `json:"public"`
	PurchaseTitle  *string        `json:"purchase_title"`
	PurchaseURL    *string        `json:"purchase_url"`
	ReleaseDate    *string        `json:"release_date"`
	RepostsCount   int64          `json:"reposts_count"`
	SecretToken    *string        `json:"secret_token"`
	Sharing        string         `json:"sharing"`
	TagList        string         `json:"tag_list"`
	Title          string         `json:"title"`
	URI            string         `json:"uri"`
	UserID         int64          `json:"user_id"`
	SetType        string         `json:"set_type"`
	IsAlbum        bool           `json:"is_album"`
	PublishedAt    string         `json:"published_at"`
	DisplayDate    string         `json:"display_date"`
	User           User           `json:"user"`
	Tracks         []TrackElement `json:"tracks"`
	TrackCount     int64          `json:"track_count"`
}

type SoundCloudToken struct {
	lastUpdated time.Time
	mutex       *sync.Mutex
	token       string
}

func newSoundCloudToken() (*SoundCloudToken, error) {
	clientID, err := getSoundCloudClientID()

	if err != nil {
		return nil, err
	}

	return &SoundCloudToken{
		lastUpdated: time.Now(),
		mutex:       &sync.Mutex{},
		token:       clientID,
	}, nil
}

type SoundCloudPlaylistHandler struct {
	lastupdate   time.Time
	mutex        *sync.Mutex
	token        *SoundCloudToken
	playlist     *SoundCloudPlaylist
	playlistName string
}

func (sct *SoundCloudToken) getNewClientID() string {
	clientID, err := getSoundCloudClientID()

	if err != nil {
		return sct.token
	}

	return clientID
}

func newSoundCloudPlaylistHandler(playlistName string) (*SoundCloudPlaylistHandler, error) {
	soundcloudToken, err := newSoundCloudToken()

	if err != nil {
		return nil, err
	}

	scph := &SoundCloudPlaylistHandler{
		lastupdate:   time.Now(),
		mutex:        &sync.Mutex{},
		token:        soundcloudToken,
		playlist:     nil,
		playlistName: playlistName,
	}

	return scph, scph.refreshUploadData()
}

func getUploadData(clientIDHandler *SoundCloudToken, workoutPlaylistTitle string) (*SoundCloudPlaylist, error) {
	clientID := clientIDHandler.getNewClientID()

	userPlaylistResponse, err := getSoundCloudResponse(
		http.MethodGet,
		"https://api-v2.soundcloud.com/users/371817032/playlists_without_albums?representation=mini&limit=10&offset=0&linked_partitioning=1&app_locale=en",
		clientID,
		nil,
	)

	if err != nil {
		return nil, err
	}

	var soundCloudUserPlaylists SoundCloudUserPlaylists

	err = json.NewDecoder(userPlaylistResponse.Body).Decode(&soundCloudUserPlaylists)

	userPlaylistResponse.Body.Close()

	if err != nil {
		return nil, err
	}

	var workoutPlaylistCollection *PlaylistCollection

	for _, userPlaylistCollection := range soundCloudUserPlaylists.Collections {
		if userPlaylistCollection.Title == workoutPlaylistTitle {
			workoutPlaylistCollection = &userPlaylistCollection

			break
		}
	}

	if workoutPlaylistCollection == nil {
		return nil, errors.New("could not find playlist")
	}

	playlistInfoResponse, err := getSoundCloudResponse(
		http.MethodGet,
		fmt.Sprintf(
			"https://api-v2.soundcloud.com/playlists/%d?representation=full&limit=10&offset=0&app_locale=en",
			workoutPlaylistCollection.ID,
		),
		clientID,
		nil,
	)

	if err != nil {
		return nil, err
	}

	var soundCloudPlaylist SoundCloudPlaylist

	err = json.NewDecoder(playlistInfoResponse.Body).Decode(&soundCloudPlaylist)

	playlistInfoResponse.Body.Close()

	if err != nil {
		return nil, err
	}

	fetchInfoForSongs := make([]string, 0)
	trackIndexesMap := make(map[int64]int, 0)

	for trackIndex, playlistTrack := range soundCloudPlaylist.Tracks {
		if playlistTrack.URI == nil || *playlistTrack.URI == "" {
			fetchInfoForSongs = append(fetchInfoForSongs, fmt.Sprint(playlistTrack.ID))
			trackIndexesMap[playlistTrack.ID] = trackIndex
		}
	}

	if len(fetchInfoForSongs) != 0 {
		// Get missing songs info

		var tracks []TrackElement

		start := 0
		endInfoSearch := false

		for i := 10; !endInfoSearch; i += 10 {
			if i >= len(fetchInfoForSongs) {
				i = len(fetchInfoForSongs)

				endInfoSearch = true
			}

			tracksRequest, err := http.NewRequest(
				http.MethodGet,
				"https://api-v2.soundcloud.com/tracks?app_locale=en",
				nil,
			)

			if err != nil {
				return nil, err
			}

			urlQuery := tracksRequest.URL.Query()

			urlQuery.Set("client_id", clientID)
			urlQuery.Set("ids", strings.Join(fetchInfoForSongs[start:i], ","))

			tracksRequest.URL.RawQuery = urlQuery.Encode()

			tracksRequest.Header.Set("referer", "https://soundcloud.com/")

			trackResponse, err := http.DefaultClient.Do(tracksRequest)

			if err != nil {
				panic(err)
			}

			responseBytes, err := ioutil.ReadAll(trackResponse.Body)

			trackResponse.Body.Close()

			// trackResponse.Body = ioutil.NopCloser(bytes.NewBuffer(responseBytes))

			if err != nil {
				panic(err)
			}

			var reqTracks []TrackElement

			err = json.Unmarshal(responseBytes, &reqTracks)

			if err != nil {
				return nil, err
			}

			tracks = append(tracks, reqTracks...)

			start = i
		}

		for _, playlistTrack := range tracks {
			soundCloudPlaylist.Tracks[trackIndexesMap[playlistTrack.ID]] = playlistTrack
		}
	}

	return &soundCloudPlaylist, nil
}

// Meant to be ran concurrently after/before time has been reset to now
func (scph *SoundCloudPlaylistHandler) refreshUploadDataWithUpdateTime(previousUpdateTime time.Time) error {
	err := scph.refreshUploadData()

	scph.mutex.Lock()
	defer scph.mutex.Unlock()

	if err != nil {
		// Set the update time on err to 30 seconds to prevent too many consecutive
		// requests to SC for the playlist, there will be about 30 seconds before another request is made
		scph.lastupdate = previousUpdateTime.Add(time.Second * 30)
	}

	return err
}

func (scph *SoundCloudPlaylistHandler) refreshUploadData() error {
	playlist, err := getUploadData(scph.token, scph.playlistName)

	scph.mutex.Lock()
	defer scph.mutex.Unlock()

	if err == nil {
		scph.playlist = playlist
	}

	return err
}

// Manage how often data is updated, keeping it up to date
func (scph *SoundCloudPlaylistHandler) getUploadData() *SoundCloudPlaylist {
	scph.mutex.Lock()

	if time.Now().Sub(scph.lastupdate) > time.Minute {
		go scph.refreshUploadDataWithUpdateTime(scph.lastupdate)

		// Prevent new updates from happening for at least another minute while we're fetching new results
		scph.lastupdate = time.Now()
	}

	soundcloudPlaylist := scph.playlist

	scph.mutex.Unlock()

	return soundcloudPlaylist
}

var ClientIDRegex = regexp.MustCompile(`client_id=([\d\w]{20,})`)

func getSoundCloudClientID() (string, error) {
	homepageResponse, err := http.Get("https://soundcloud.com/riley-johnson-734562913/sets/lovethemgunsounds")

	if err != nil {
		return "", err
	}

	if homepageResponse.StatusCode != http.StatusOK {
		return "", fmt.Errorf("bad status on homepage request %d", homepageResponse.StatusCode)
	}

	document, err := htmlquery.Parse(homepageResponse.Body)

	if err != nil {
		return "", err
	}

	homepageResponse.Body.Close()

	scriptNodes := htmlquery.Find(document, `//script`)

	for _, scriptNode := range scriptNodes {
		scriptSrc := htmlquery.SelectAttr(scriptNode, "src")

		if !strings.Contains(scriptSrc, "a-v2.sndcdn.com") {
			continue
		}

		scriptRequest, err := http.NewRequest(http.MethodGet, scriptSrc, nil)

		if err != nil {
			continue
		}

		scriptRequest.Header.Set("referer", "https://soundcloud.com/")

		scriptResponse, err := http.DefaultClient.Do(scriptRequest)

		if err != nil {
			continue
		}

		scriptBytes, err := ioutil.ReadAll(scriptResponse.Body)

		scriptResponse.Body.Close()

		if err != nil {
			continue
		}

		if clientIDMatch := ClientIDRegex.FindSubmatch(scriptBytes); clientIDMatch != nil {
			return string(clientIDMatch[1]), nil
		}
	}

	return "", errors.New("could not find client ID")
}

func getSoundCloudResponse(method, url, clientID string, body io.Reader) (*http.Response, error) {
	soundCloudRequest, err := http.NewRequest(method, url, body)

	if err != nil {
		return nil, err
	}

	urlQuery := soundCloudRequest.URL.Query()

	urlQuery.Set("client_id", clientID)

	soundCloudRequest.URL.RawQuery = urlQuery.Encode()

	soundCloudRequest.Header.Set("referer", "https://soundcloud.com/")

	return http.DefaultClient.Do(soundCloudRequest)
}

func main() {
	router := gin.Default()

	apiGroup := router.Group("/api")

	soundcloudPlaylistHandler, err := newSoundCloudPlaylistHandler("NormieAppropriateGymMusic")

	for err != nil {
		log.Println(err)

		time.Sleep(time.Second * 15)

		soundcloudPlaylistHandler, err = newSoundCloudPlaylistHandler("NormieAppropriateGymMusic")
	}

	apiGroup.GET("/songs", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"err":  false,
			"data": soundcloudPlaylistHandler.getUploadData(),
			"msg":  "",
		})
	})

	router.Run(":80")
}
