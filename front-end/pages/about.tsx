import Link from "next/link";
import Layout from "../components/Layout";

const AboutPage = () => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>About</h1>
    <p>This is the about page for RJ's site</p>
    <p>
      You'll have to wait until I'm feeling awfully self indulgent for this to
      be updated
    </p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default AboutPage;
