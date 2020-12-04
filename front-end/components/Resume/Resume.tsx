import React, { useRef } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { makeStyles } from "@material-ui/core";

const useResumeStyles = (textFontSize: number) =>
  makeStyles(() => ({
    resumeContainer: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      fontFamily: "RJ-Roboto",
      height: "100vh",
      justifyContent: "center",
      width: "100%",
    },
    resumeWrapper: {
      backgroundColor: "white",
      boxShadow: "5px 5px 5px black",
      height: 792,
      width: 612,
    },
    downloadWrapper: {
      alignItems: "center",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      width: "100%",
    },
    skillRows: {
      display: "grid",
      fontSize: `${textFontSize}px`,
      gridColumnGap: "9px",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto",
      whiteSpace: "nowrap",
      width: "100%",
    },
  }));

interface IWorkExperience {
  date: string;
  title: string;
  location: string;
  company: string;
  description: string;
}

const workExperience: IWorkExperience[] = [
  {
    date: "1/2020 - PRESENT",
    title: "Senior Full Stack Engineer",
    location: "Sioux Falls",
    company: "Raven Industries",
    description:
      "Designing Website and Server Architecture - Implementing Robust Front-End and Resilient Microservices - Assuring Consistent Platform Uptime",
  },
  {
    date: "8/2019 - 1/2020",
    title: "Head Full Stack and Dev Ops Engineer",
    location: "Remote",
    company: "shortstop.news",
    description:
      "Designing Website and Server Architecture - Implementing Front-End and Resilient Microservices - Assuring Consistent Platform Uptime",
  },
  {
    date: "5/2019 - 8/2019",
    title: "Cyber Advanced Research and Development Intern",
    location: "Washington D.C.",
    company: "ManTech International",
    description:
      "Full Stack Web Development - Streamlining Project Deployment - Leveraging Development Best Practices",
  },
  {
    date: "8/2018 - 5/2019",
    title: "Cyber Advanced Research and Development Engineer",
    location: "Remote",
    company: "ManTech International",
    description:
      "Creating Robust Programming Solutions - Modifying and Extending the Purpose of Existing Software - Research for and Execution of Web Scraping Techniques",
  },
  {
    date: "5/2018 - 8/2018",
    title: "Cyber Advanced Research and Development Intern",
    location: "Washington D.C.",
    company: "ManTech International",
    description:
      "Crafting Software Programs - Exploitation Methods and Execution Research - Test-Driven Software Development",
  },
  {
    date: "9/2017 - 5/2018",
    title: "AWS Student Developer",
    location: "Madison, SD",
    company: "Dakota State University Information Assurance Labs",
    description:
      "Front-End and Back-End Web Development - Server Automation/Maintenance - AWS Service Orchestration",
  },
  {
    date: "6/2017 - 8/2017",
    title: "Software Quality Assurance Engineering Intern",
    location: "Fargo, ND",
    company: "OmniByte",
    description:
      "Writing Automated Testing Solutions - Supplying Scrupulous Manual Testing Abilities - Composing Testing Procedures",
  },
  {
    date: "8/2016 - 12/2016",
    title: "Student Intern",
    location: "Fargo, ND",
    company: "OmniByte",
    description:
      "Automating Wasteful Tasks - Providing Manual Testing Skills - Programming Assistance for Developers",
  },
];

const administrativeSkills: string[] = [
  "Computer Hardware",
  "Computer Networking",
  "Git",
  "MS Office",
];

const infrastructuralSkills: string[] = [
  "Amazon Web Services",
  "Google Cloud Platform",
  "Microsoft Azure Cloud",
  "Docker",
  "Kubernetes",
  "Vagrant",
];

const technicalSkills: string[] = [
  "Deep/Machine Learning",
  "Flutter",
  "Selenium",
];

const programmingSkills: string[] = [
  "Python 2/3",
  "Go",
  "Java",
  "SQL",
  "MongoDB",
  "PHP",
  "Dart",
  "PowerShell",
  "HTML",
  "CSS",
  "x86 Assembly",
  "C/C++",
  "C#  ",
  "Batch Scripting",
  "Bash Scripting",
  "JavaScript (Angular, React, Vue, Node, Typescript)",
];

// interface IAwardAndExperience {
//   date: string;
//   title: string;
// }

// const otherAwardsAndExperience: IAwardAndExperience[] = [
//   { date: "2017-2019", title: "DSU School Radio Tech Lead" },
//   { date: "2019", title: "Campus Student Leadership Award" },
//   { date: "2018-2019", title: "DSU Computer Club Officer" },
//   { date: "2018-2019", title: "DSU Programming Club Officer" },
//   { date: "2017-2018", title: "DSU Entrepreneurship Club President" },
//   { date: "2018-2019", title: "DSU Programming Club Officer" },
// ];
// force

interface IVolunteerExperience {
  date: string;
  organization: string;
  title: string;
  description: string;
}

const volunteeringExperience: IVolunteerExperience[] = [
  {
    date: "2020-PRESENT",
    organization: "Feeding South Dakota",
    title: "Volunteer",
    description: "Helping break down food crates and organize food packages",
  },
  {
    date: "2017-2019",
    organization: "Dakota State University",
    title: "Outreach Volunteer",
    description:
      "Helped High School students and parents understand the opportunities available at DSU both inside and outside the classroom",
  },
  {
    date: "2019",
    organization: "GenCyber",
    title: "Camp Staff and Teacher",
    description:
      "Facilitated the learning process for High School campers in a variety of technology areas: Programming, Computer Networking, and the fundamentals of Cyber Security.",
  },
  {
    date: "2019",
    organization: "CybHer",
    title: "Mentor",
    description:
      "Helped introduce elementary school children to STEM technologies with activities involving programming and automation",
  },
];

const Resume: React.FC = () => {
  const nameFontSize = 14;
  const headingFontSize = 11;
  const subHeadingFontSize = 9;
  const textFontSize = 8;

  const styles = useResumeStyles(textFontSize)();

  const resume = useRef<PDFExport>(null);

  const exportPDF = () => {
    if (resume !== null && resume.current !== null) resume.current.save();
  };

  return (
    <div className={styles.resumeContainer}>
      <div className={styles.resumeWrapper}>
        <PDFExport
          fileName="rjResume.pdf"
          title="Riley Johnson's Resume"
          subject=""
          keywords=""
          ref={resume}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              height: 792,
              justifyContent: "center",
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "auto 1fr",
                height: "100%",
                width: "100%",
              }}
            >
              <div
                style={{
                  backgroundColor: "#000",
                  color: "#FFF",
                  display: "flex",
                  flexDirection: "column",
                  padding: "9px",
                  width: "100%",
                }}
              >
                <div
                  style={{ fontWeight: "bold", fontSize: `${nameFontSize}px` }}
                >
                  Riley Johnson
                </div>
                <div style={{ fontSize: `${headingFontSize}px` }}>
                  Software Developer
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "45%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${subHeadingFontSize}px`,
                        }}
                      >
                        Email
                      </div>
                      <div style={{ fontSize: `${subHeadingFontSize}px` }}>
                        rj@therileyjohnson.com
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${subHeadingFontSize}px`,
                        }}
                      >
                        Website
                      </div>
                      <div style={{ fontSize: `${subHeadingFontSize}px` }}>
                        therileyjohnson.com
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "45%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${subHeadingFontSize}px`,
                        }}
                      >
                        Github
                      </div>
                      <div style={{ fontSize: `${subHeadingFontSize}px` }}>
                        github.com/the-rileyj
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: `${subHeadingFontSize}px`,
                        }}
                      >
                        LinkedIn
                      </div>
                      <div style={{ fontSize: `${subHeadingFontSize}px` }}>
                        linkedin.com/in/therileyjohnson
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  alignContent: "space-between",
                  display: "grid",
                  gridRowGap: "3px",
                  gridTemplateColumns: "1fr",
                  gridTemplateRows: "auto auto auto auto auto auto",
                  height: "100%",
                  padding: "9px",
                  width: "100%",
                  color: "black",
                }}
              >
                {/* Professional Summary */}
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      borderBottom: "solid #000 1px",
                      fontSize: `${headingFontSize}px`,
                      fontWeight: "bold",
                      margin: `0 0 ${subHeadingFontSize / 3}px 0`,
                    }}
                  >
                    Professional Summary
                  </div>
                  <div style={{ fontSize: `${textFontSize}px` }}>
                    5.5+ years of professional experience in variety of software
                    development areas such as (but not limited to) server
                    automation, web scraping, full stack web development, and
                    machine learning. Great working in teams and capable of
                    excelling individually. Always working to apply
                    communication and learning skills effectively to excel in
                    every role.
                  </div>
                </div>
                {/* Experience */}
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      borderBottom: "solid #000 1px",
                      fontSize: `${headingFontSize}px`,
                      fontWeight: "bold",
                      margin: `0 0 ${subHeadingFontSize / 3}px 0`,
                    }}
                  >
                    Experience
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridColumnGap: "4px",
                      gridTemplateColumns: "auto 1fr",
                      gridTemplateRows: "auto auto auto",
                      width: "100%",
                    }}
                  >
                    {workExperience.map((workExperienceItem, index) => (
                      <>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${subHeadingFontSize}px`,
                            paddingTop: index !== 0 ? "6px" : undefined,
                          }}
                        >
                          {workExperienceItem.date}
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${subHeadingFontSize}px`,
                            paddingTop: index !== 0 ? "6px" : undefined,
                          }}
                        >
                          {workExperienceItem.title}
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${textFontSize}px`,
                          }}
                        >
                          {workExperienceItem.location}
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${textFontSize}px`,
                            fontStyle: "italic",
                          }}
                        >
                          {workExperienceItem.company}
                        </div>
                        <div />
                        <div style={{ fontSize: `${textFontSize}px` }}>
                          {workExperienceItem.description}
                        </div>
                      </>
                    ))}
                  </div>
                </div>
                {/* Education */}
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      borderBottom: "solid #000 1px",
                      fontSize: `${headingFontSize}px`,
                      fontWeight: "bold",
                      margin: `0 0 ${subHeadingFontSize / 3}px 0`,
                    }}
                  >
                    Education
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridColumnGap: "9px",
                      gridTemplateColumns: "auto 1fr",
                      gridTemplateRows: "auto",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: `${subHeadingFontSize}px`,
                      }}
                    >
                      8/2017 - 12/2019
                    </div>
                    <div style={{ fontSize: `${textFontSize}px` }}>
                      B.S. in Computer Science from Dakota State University,
                      Minor in Center of Excellence in Computer Information
                      Systems
                    </div>
                  </div>
                </div>
                {/* Clearance */}
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      borderBottom: "solid #000 1px",
                      fontSize: `${headingFontSize}px`,
                      fontWeight: "bold",
                      margin: `0 0 ${subHeadingFontSize / 3}px 0`,
                    }}
                  >
                    Clearance
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridColumnGap: "5px",
                      gridTemplateColumns: "auto 1fr",
                      gridTemplateRows: "auto",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: `${subHeadingFontSize}px`,
                      }}
                    >
                      7/2019 - PRESENT
                    </div>
                    <div style={{ fontSize: `${textFontSize}px` }}>
                      Secret Clearance
                    </div>
                  </div>
                </div>
                {/* Skills */}
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      borderBottom: "solid #000 1px",
                      fontSize: `${headingFontSize}px`,
                      fontWeight: "bold",
                      margin: `0 0 1px 0`,
                    }}
                  >
                    Skills
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridColumnGap: "9px",
                      gridTemplateColumns: "auto auto auto 1fr",
                      width: "100%",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <span
                          style={{
                            borderBottom: "solid #000 1px",
                            fontWeight: "bold",
                            fontSize: `${subHeadingFontSize}px`,
                          }}
                        >
                          Administrative
                        </span>
                      </div>
                      <div className={styles.skillRows}>
                        {administrativeSkills.map((administrativeSkill) => (
                          <div key={administrativeSkill}>
                            {administrativeSkill}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <span
                          style={{
                            borderBottom: "solid #000 1px",
                            fontWeight: "bold",
                            fontSize: `${subHeadingFontSize}px`,
                          }}
                        >
                          Infrastructural
                        </span>
                      </div>
                      <div className={styles.skillRows}>
                        {infrastructuralSkills.map((infrastructuralSkill) => (
                          <div key={infrastructuralSkill}>
                            {infrastructuralSkill}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <span
                          style={{
                            borderBottom: "solid #000 1px",
                            fontWeight: "bold",
                            fontSize: `${subHeadingFontSize}px`,
                          }}
                        >
                          Technical
                        </span>
                      </div>
                      <div className={styles.skillRows}>
                        {technicalSkills.map((technicalSkill) => (
                          <div key={technicalSkill}>{technicalSkill}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <span
                          style={{
                            borderBottom: "solid #000 1px",
                            fontWeight: "bold",
                            fontSize: `${subHeadingFontSize}px`,
                          }}
                        >
                          Programming
                        </span>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          fontSize: `${textFontSize}px`,
                          gridColumnGap: "7px",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(75px, 1fr))",
                          gridTemplateRows: "auto",
                          width: "100%",
                        }}
                      >
                        {programmingSkills.map((programmingSkill) => (
                          <div key={programmingSkill}>{programmingSkill}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Awards & Other Experience */}
                {/* <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: "auto 1fr",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      borderBottom: "solid #000 1px",
                      fontSize: `${headingFontSize}px`,
                      fontWeight: "bold",
                      margin: `0 0 ${subHeadingFontSize / 3}px 0`,
                    }}
                  >
                    Awards & Other Experience
                  </div>
                  <div
                    style={{
                      alignContent: "start",
                      display: "grid",
                      gridAutoFlow: "column",
                      gridColumnGap: "9px",
                      gridTemplateColumns: "auto 1fr auto 1fr",
                      width: "100%",
                    }}
                  >
                    {otherAwardsAndExperience.map(
                      (
                        otherAwardAndExperience,
                        otherAwardAndExperienceIndex
                      ) => (
                        <>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: `${textFontSize}px`,
                              gridColumn:
                                1 +
                                2 *
                                  Math.round(
                                    otherAwardAndExperienceIndex /
                                      otherAwardsAndExperience.length
                                  ),
                            }}
                          >
                            {otherAwardAndExperience.date}
                          </div>
                          <div
                            style={{
                              fontSize: `${textFontSize}px`,
                              gridColumn:
                                2 +
                                2 *
                                  Math.round(
                                    otherAwardAndExperienceIndex /
                                      otherAwardsAndExperience.length
                                  ),
                            }}
                          >
                            {otherAwardAndExperience.title}
                          </div>
                        </>
                      )
                    )}
                  </div>
                </div> */}
                {/* Volunteer Experience */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: "auto 1fr",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      borderBottom: "solid #000 1px",
                      fontSize: `${headingFontSize}px`,
                      fontWeight: "bold",
                      margin: `0 0 ${subHeadingFontSize / 3}px 0`,
                    }}
                  >
                    Volunteer Experience
                  </div>
                  <div
                    style={{
                      alignContent: "start",
                      display: "grid",
                      gridColumnGap: "9px",
                      gridRowGap: "2.5px",
                      gridTemplateColumns: "auto auto auto 1fr",
                      width: "100%",
                    }}
                  >
                    {volunteeringExperience.map((volunteerExperience) => (
                      <>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: `${textFontSize}px`,
                          }}
                        >
                          {volunteerExperience.date}
                        </div>
                        <div style={{ fontSize: `${textFontSize}px` }}>
                          {volunteerExperience.organization}
                        </div>
                        <div style={{ fontSize: `${textFontSize}px` }}>
                          {volunteerExperience.title}
                        </div>
                        <div style={{ fontSize: `${textFontSize}px` }}>
                          {volunteerExperience.description}
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PDFExport>
      </div>
      <div className={styles.downloadWrapper}>
        <button onClick={exportPDF} style={{ margin: "1rem" }}>
          Download
        </button>
      </div>
    </div>
  );
};

// const CoverLetter: React.FC = () => {
//     const resume = useRef<PDFExport>(null)

//     const exportPDF = () => {
//         if (resume !== null && resume.current !== null)
//             resume.current.save()
//     }

//     const downloadWrapper: React.CSSProperties = {
//         alignItems: "center",
//         boxSizing: "border-box",
//         display: "flex",
//         justifyContent: "center",
//         width: "100%",
//     }

//     const nameFontSize = 16
//     const headingFontSize = 11
//     const subHeadingFontSize = 9
//     const textFontSize = 8

//     return (
//         <div style={{ alignContent: "center", display: "flex", flexDirection: "column", height: "100vh", justifyContent: "center" }}>
//             <div style={{ backgroundColor: 'white', boxShadow: '5px 5px 5px black', height: 792, margin: "auto", width: 612 }}>
//                 <PDFExport fileName="rjCoverLetter.pdf" title="Riley Johnson's Cover Letter" subject="" keywords="" ref={resume} >
//                     <div style={{ height: 792, width: "100%", backgroundColor: 'white', margin: "auto" }}>
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "auto 1fr", height: "100%", width: "100%" }}>
//                             <div style={{ backgroundColor: "#000", color: "#FFF", display: "flex", flexDirection: "column", padding: "9px", width: "100%" }}>
//                                 <div style={{ fontWeight: "bold", fontSize: `${nameFontSize}px` }}>
//                                     Riley Johnson
//                                 </div>
//                                 <div style={{ fontSize: `${headingFontSize}px` }}>
//                                     Software Developer
//                                 </div>
//                                 <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
//                                     <div style={{ display: "flex", flexDirection: "column", width: "45%" }}>
//                                         <div style={{ display: "flex", justifyContent: "space-between" }}>
//                                             <div style={{ fontWeight: "bold", fontSize: `${subHeadingFontSize}px` }}>
//                                                 Email
//                                             </div>
//                                             <div style={{ fontSize: `${subHeadingFontSize}px` }}>
//                                                 rj@therileyjohnson.com
//                                             </div>
//                                         </div>
//                                         <div style={{ display: "flex", justifyContent: "space-between" }}>
//                                             <div style={{ fontWeight: "bold", fontSize: `${subHeadingFontSize}px` }}>
//                                                 Website
//                                             </div>
//                                             <div style={{ fontSize: `${subHeadingFontSize}px` }}>
//                                                 therileyjohnson.com
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div style={{ display: "flex", flexDirection: "column", width: "45%" }}>
//                                         <div style={{ display: "flex", justifyContent: "space-between" }}>
//                                             <div style={{ fontWeight: "bold", fontSize: `${subHeadingFontSize}px` }}>
//                                                 Github
//                                         </div>
//                                             <div style={{ fontSize: `${subHeadingFontSize}px` }}>
//                                                 github.com/the-rileyj
//                                             </div>
//                                         </div>
//                                         <div style={{ display: "flex", justifyContent: "space-between" }}>
//                                             <div style={{ fontWeight: "bold", fontSize: `${subHeadingFontSize}px` }}>
//                                                 LinkedIn
//                                             </div>
//                                             <div style={{ fontSize: `${subHeadingFontSize}px` }}>
//                                                 linkedin.com/in/therileyjohnson
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div style={{ alignContent: "center", alignItems: "center", display: "grid", gridTemplateColumns: "1fr", fontSize: `${headingFontSize}px`, height: "100%", justifyContent: "", padding: "9px", width: "100%" }}>
//                                 {/* Professional Summary */}
//                                 <div style={{ marginBottom: "1rem" }}>
//                                     To Whom it May Concern,
//                                 </div>
//                                 <div style={{ marginBottom: "1rem" }}>
//                                     I am elated to be given the opportunity to apply for the Embedded Software Engineer position at Raven Industries! I am confident that I will be able to leverage my existing abilities and adapt quickly to learn news skills so that I can effectively contribute towards the efforts of the team that I would be a part of.
//                                 </div>
//                                 <div style={{ marginBottom: "1rem" }}>
//                                     I thoroughly enjoy working in a team because it gives me an opportunity to learn from other people.
//                                     The chance to improve yourself and help your team members solve problems and improve themselves is sadly one of the most underrated parts of software development.
//                                     When working in a team is not possible, I still remain highly motivated by pushing myself to excel through setting goals and aiming to produce the best product I possible can.
//                                 </div>
//                                 <div style={{ marginBottom: "1rem" }}>
//                                     Over the last 5 years I have been meticulously exercising and refining my Front-End and Back-End development skill sets through keeping in touch with the Full-Stack community, working professionally, and developing personal projects in my free time.
//                                     Though I began as a self taught Full-Stack developer, since the start I have been very adamant about adhering to professional standards by striving for the pinnacle of development standards at each workplace and keeping a pulse on a wide variety development conferences and blogs.
//                                     I am extremely lucky and proud to be a Full-Stack developer because it is work I love due to the nature of the work itself and the impact it has for customers and end-users.
//                                 </div>
//                                 <div>
//                                     Thank you for your consideration! Have a great rest of your day!
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </PDFExport>
//             </div>
//             <div style={downloadWrapper}>
//                 <button onClick={exportPDF} style={{ margin: "1rem" }}>
//                     Download
//                 </button>
//             </div>
//         </div>
//     );
// }

export default Resume;
