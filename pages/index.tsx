import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello RJ's New Site 👋</h1>
    <p>If you're seeing this, I'm sorry.</p>
    <p>
      I'm working on a CD system for the back-end, so for the time being you'll
      have to look at this mess until that's squared away. ~3
    </p>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
