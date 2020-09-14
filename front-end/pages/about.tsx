import Link from "next/link";
import Layout from "../components/Layout";

const AboutPage = () => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>About</h1>
    <p>This is the about page for RJ's site</p>
    <p>
      For now you can take a look at{" "}
      <a
        href="https://www.linkedin.com/in/therileyjohnson/"
        target="_blank"
        rel="noreferrer"
      >
        my linkedin
      </a>
      .
    </p>
    <p>
      I'm still working on the site actively, don't have a good mold yet. This
      page will be updated last. It will be updated as I need to force pushes
      for my CD system to update. This number "2" will be incremented to that
      end.
    </p>
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default AboutPage;
