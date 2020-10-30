import { GetStaticProps } from "next";

import Layout from "../../components/Layout";

import { getPosts } from "../api/ghost/posts";
import { PostsOrPages } from "@tryghost/content-api";
import Link from "next/link";
import GlitchText from "../../components/GlitchText";
import { Theme, makeStyles, styled } from "@material-ui/core/styles";
import { ReactNode, useRef } from "react";


const useCollapsingCardStyles = (minWidth: number) => makeStyles((theme: Theme) => ({
  container: {
    border: `3px solid ${theme.palette.secondary.main}`,
    display: "flex",
    // 2 * (minWidth + 1rem * 3)
    [theme.breakpoints.down(2 * (minWidth + 16 * 3))]: {
      flexDirection: "row",
      height: `${minWidth / (16 / 9) + 6}px`,
      width: "100%",
    },
    [theme.breakpoints.up(2 * (minWidth + 16 * 3))]: {
      flexDirection: "column",
      height: "100%",
      width: `${minWidth + 6}px`,
    },
  },
  imageContainer: {
    height: `${minWidth / (16 / 9)}px`,
    width: `${minWidth}px`,
  },
  contentContainer: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  contentWrapper: {
    height: "100%",
    width: "100%",
  },
}));

interface ICollapsingCardProps {
  children: ReactNode;
  minWidth: number;
  imgSrc?: string | null;
}

const CollapsingCard: React.FC<ICollapsingCardProps> = ({ children, imgSrc, minWidth }) => {
  const styles = useCollapsingCardStyles(minWidth)()

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer} style={{ background: `url(${imgSrc}) no-repeat`, backgroundSize: `${minWidth}px 100%` }} />
      <div className={styles.contentContainer}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  )
}

const useBlogIndexStyles = (minWidth: number) => makeStyles((theme: Theme) => ({
  postContentContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: ".5rem",
    width: "100%",
    textAlign: "left",
    [theme.breakpoints.down(2 * (minWidth + 16 * 3))]: {
      justifyContent: "space-between",
    },
    [theme.breakpoints.up(2 * (minWidth + 16 * 3))]: {
      gap: "1rem 1rem",
    },
  },
  postTitleContainer: {
    fontSize: "16px",
    width: "100%",
    [theme.breakpoints.down(2 * (minWidth + 16 * 3))]: {
      display: "-webkit-box",
      lineClamp: 3,
      overflow: "hidden",
      WebkitBoxOrient: "vertical",
    },
  },
  postExcerptContainer: {
    width: "100%",
    [theme.breakpoints.down(2 * (minWidth + 16 * 3))]: {
      display: "-webkit-box",
      lineClamp: 3,
      overflow: "hidden",
      WebkitBoxOrient: "vertical",
    },
  },
}));

type Props = {
  posts: PostsOrPages | null;
  err: string;
};

const BlogIndex = (props: Props) => {
  const styles = useBlogIndexStyles(300)()

  return (
    <Layout title="Blog Home | RJ's Site">
      <div style={{ fontSize: "28px" }}>
        <GlitchText text="Posts:" />
      </div>
      <div style={{ display: "grid", gap: "1rem 1rem", gridTemplateColumns: "repeat(auto-fit, minmax(calc(300px + 2rem), 1fr))", justifyItems: "center" }}>
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
                  <a style={{ height: "100%"}}>
                    <CollapsingCard imgSrc={post.feature_image} minWidth={300}>
                      <div className={styles.postContentContainer}>
                        <span className={styles.postTitleContainer}>
                          {post.title}
                        </span>
                        <span className={styles.postExcerptContainer}>
                          {post.excerpt}
                        </span>
                      </div>
                    </CollapsingCard>
                  </a>
                </Link>
              );
            })
          )}
      </div>
    </Layout>
  );
};

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
