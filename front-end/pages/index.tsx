import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello RJ's New Site 👋</h1>
    <p>If you're seeing this, I'm sorry.</p>
    <p>Done working out server-side kinks for the most part :)</p>
    <p>
      All my time has been spent upgrading the server-side, and it looks like it
      might be that way for a little bit.
    </p>
    <p>
      What I'm trying to say is that this won't look pretty for a little bit.
    </p>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
