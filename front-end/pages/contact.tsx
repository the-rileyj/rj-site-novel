import Layout from "../components/Layout";

import ThumbnailCard from "../components/ThumbnailCard";

import GlitchText from "../components/GlitchText";

interface IContactInfo {
  text: string;
  link: string;
  img: string;
}

const contactInfo: Array<IContactInfo> = [
  {
    text: "LinkedIn",
    link: "https://www.linkedin.com/in/therileyjohnson/",
    img: "/linkedin.svg",
  },
];

const ContactIndex = () => (
  <Layout title="Contact | RJ's Site">
    <div style={{ fontSize: "28px" }}>
      <GlitchText text="Contact" />
    </div>
    <h3>
      If you know how to contact me, you are always welcome to reach me via
      phone, email, etc. If you don't, there might be a reason why. However, if
      you feel this is a mistake, please reach out through the following
      communication channel:
    </h3>
    <div>
      {contactInfo.map((contact) => (
        <ThumbnailCard
          key={contact.text}
          href={contact.img}
          imgSrc={contact.img}
        >
          {contact.text}
        </ThumbnailCard>
      ))}
    </div>
  </Layout>
);

export default ContactIndex;
