import { useEffect } from "react";

import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/dist/client/router";

import { getPosts, getSinglePost } from "../api/ghost/posts";
import Layout from "../../components/Layout";

import { PostOrPage } from "@tryghost/content-api";
import HorizonalResizableContainer from "../../components/HorizontalResizableContainer";
import Prism from "prismjs";
import GlitchText from "../../components/GlitchText";

interface Props {
  post: PostOrPage | null;
  err: string;
}

const Post = ({ err, post }: Props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (post === null) {
    if (err !== "") {
      return <div>Couldn't find post: {err}</div>;
    }

    return <div>Couldn't find post!</div>;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      Prism.highlightAll();
    }
  }, []);

  return (
    <Layout title={`${post.title} | RJ's Site`}>
      <HorizonalResizableContainer defaultWidth={66} minWidth={33}>
        <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
          <h1>
            <GlitchText text={String(post.title)} />
          </h1>
        </div>
        <div
          id="blog-post"
          style={{ width: "100%" }}
          dangerouslySetInnerHTML={{
            __html: String(post.html),
          }}
        />
      </HorizonalResizableContainer>
    </Layout>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await getPosts();

    return {
      paths: posts.map((post) => ({ params: { slug: post.slug } })),
      fallback: true,
    };
  } catch (err) {
    return {
      paths: [],
      fallback: true,
    };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const post = await getSinglePost(String(params?.slug));

    return { props: { err: "", post }, revalidate: 60 };
  } catch (err) {
    return { props: { err: String(err), post: null }, revalidate: 60 };
  }
};
