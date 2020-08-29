import { GetStaticProps } from "next";

// import { User } from "../../interfaces";
import Layout from "../../components/Layout";
// import List from "../../components/List";

import { getPosts } from "../api/ghost/posts";
import { PostsOrPages } from "@tryghost/content-api";
import Link from "next/link";

type Props = {
  posts: PostsOrPages | null;
  err: string;
};

const BlogIndex = (props: Props) => (
  <Layout title="Blog Home">
    <h1>Posts:</h1>
    <ul>
      {props.posts === null ? (
        <div>Website is updating with posts!</div>
      ) : (
        props.posts.map((post) => {
          return (
            <Link
              key={post.slug}
              href="/posts/[slug]"
              as={`/posts/${post.slug}`}
            >
              <a>
                <li>
                  {post.title} - {post.slug}
                </li>
              </a>
            </Link>
          );
        })
      )}
    </ul>
  </Layout>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    return {
      props: {
        err: "",
        posts: await getPosts(),
      },
      revalidate: 60,
    };
  } catch (err) {
    return {
      props: {
        err: String(err),
        posts: null,
      },
      revalidate: 1,
    };
  }
};

export default BlogIndex;
