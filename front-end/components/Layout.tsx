import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { makeStyles, Theme } from "@material-ui/core";

type Props = {
  children?: ReactNode;
  contentPadding?: boolean;
  title?: string;
};

const useLayoutStyles = makeStyles((theme: Theme) => ({
  overArching: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.secondary.main,
    display: "grid",
    fontFamily: "Roboto",
    gridTemplateRows: "auto 1fr auto",
    height: "100vh",
    overflowY: "auto",
    width: "100%",

    "& a": {
      textDecoration: "none",
    },
    "& a:link": {
      color: theme.palette.secondary.light,
      fontWeight: "bolder",
    },
    "& a:visited": {
      color: theme.palette.secondary.dark,
      fontWeight: "bold",
    },
    "& a:hover": {
      color: theme.palette.grey,
      fontWeight: "normal",
      WebkitTextStrokeWidth: "1px",
      WebkitTextStrokeColor: theme.palette.secondary.dark,
    },
  },

  headerContainer: {
    position: "sticky",
    top: 0,
    zIndex: 999,
  },

  header: {
    alignItems: "center",
    borderBottom: `solid 3px ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    height: "5rem",
    justifyContent: "space-between",
    padding: ".75rem",
    paddingBottom: "1rem",
    paddingTop: "1rem",

    "& a": {
      textDecoration: "none",
      fontSize: "1.25rem",
    },
    "& a:link, & a:visited": {
      color: theme.palette.secondary.light,
      fontWeight: "bolder",
    },
    "& a:hover": {
      color: theme.palette.secondary.dark,
      fontWeight: "bolder",
      WebkitTextStrokeWidth: "1px",
      WebkitTextStrokeColor: theme.palette.primary.main,
    },
  },

  content: {
    height: "100%",
  },

  footer: {
    borderTop: `solid 3px ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.primary.main,
    padding: ".75rem",
    paddingBottom: "1rem",
    paddingTop: "1rem",
  },
}));

const Layout = ({
  children,
  title = "RJ's Site",
  contentPadding = true,
}: Props) => {
  const styles = useLayoutStyles();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.overArching}>
        <header className={styles.headerContainer}>
          <nav className={styles.header}>
            <Link href="/">
              <a style={{ fontSize: "2.25rem" }}>RJ</a>
            </Link>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: "1rem",
              }}
            >
              <div>
                <Link href="/about">
                  <a>About</a>
                </Link>
              </div>
              <div>
                <Link href="/posts">
                  <a>Blog</a>
                </Link>
              </div>
            </div>
            {/* <Link href="/">
            <a>Home</a>
          </Link>{" "}
          |{" "}
          <Link href="/about">
            <a>About</a>
          </Link>{" "}
          |{" "}
          <Link href="/posts">
            <a>Blog</a>
          </Link>{" "} */}
          </nav>
        </header>
        <div
          className={styles.content}
          style={{
            ...(contentPadding
              ? {
                  paddingBottom: "1rem",
                  paddingTop: "1rem",
                }
              : {}),
          }}
        >
          {children}
        </div>
        <footer className={styles.footer}>
          <span>Im here to stay (Footer)</span>
        </footer>
      </div>
    </>
  );
};

export default Layout;
