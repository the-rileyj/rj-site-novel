import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import { makeStyles, Theme } from "@material-ui/core";

const routes = [
  { path: "/", text: "Home", footer: true, header: false },
  { path: "/about", text: "About", footer: true, header: true },
  { path: "/posts", text: "Blog", footer: true, header: true },
  { path: "/contact", text: "Contact", footer: true, header: false },
];

type Props = {
  children?: ReactNode;
  contentPadding?: boolean;
  title?: string;
};

const linkStyles = (theme: Theme) => ({
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
});

const useLayoutStyles = makeStyles((theme: Theme) => ({
  overArching: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.secondary.main,
    display: "grid",
    fontFamily: "Roboto",
    gridTemplateRows: "auto 1fr auto",
    minHeight: "100vh",
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
      color: theme.palette.grey[800],
      fontWeight: "normal",
      WebkitTextStrokeWidth: "1px",
      WebkitTextStrokeColor: theme.palette.secondary.dark,
    },
  },

  headerContainer: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    width: "100%",
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
    width: "100%",

    ...linkStyles(theme),
  },

  content: {
    height: "100%",
    width: "100%",
  },

  footer: {
    borderTop: `solid 3px ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.primary.main,
    padding: "3rem 1.5rem 3rem 1.5rem",
    width: "100%",
  },

  footerContainer: {
    display: "grid",
    gridColumnGap: "1rem",
    gridRowGap: "1.5rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(20%, 1fr))",
    width: "100%",

    ...linkStyles(theme),
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
              {routes
                .filter((route) => route.header)
                .map((route) => (
                  <div key={route.text}>
                    <Link href={route.path}>
                      <a>{route.text}</a>
                    </Link>
                  </div>
                ))}
            </div>
          </nav>
        </header>
        <div
          className={styles.content}
          style={{
            ...(contentPadding
              ? {
                  padding: "1rem",
                  paddingBottom: "1rem",
                  paddingTop: "1rem",
                }
              : {}),
          }}
        >
          {children}
        </div>
        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            {routes
              .filter((route) => route.footer)
              .map((route) => (
                <div
                  key={route.text}
                  style={{
                    alignContent: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Link href={route.path}>
                    <a>{route.text}</a>
                  </Link>
                </div>
              ))}
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
