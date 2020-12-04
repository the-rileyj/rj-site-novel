import React from "react";

import "./styling/global.scss";
import "./styling/blog.scss";

import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";

import CssBaseline from "@material-ui/core/CssBaseline";

import {
  AppTheme,
  ThemeContextProvider,
} from "../components/Theme/ThemeContext";

import "./styling/fonts.css";

import googleAnalytics from "../util/googleAnalytics";

// Track pageview when route is changed
Router.events.on("routeChangeComplete", (url) => googleAnalytics.pageview(url));

const app = ({ Component, pageProps }: AppProps) => {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <style>
          {`:root {
            --color-primary-main: ${AppTheme.palette.primary.main};
            --color-primary-dark: ${AppTheme.palette.primary.dark};
            --color-primary-light: ${AppTheme.palette.primary.light};
            --color-secondary-main: ${AppTheme.palette.secondary.main};
            --color-secondary-dark: ${AppTheme.palette.secondary.dark};
            --color-secondary-light: ${AppTheme.palette.secondary.light};
            --color-background-default: ${AppTheme.palette.background.default};
            --color-background-paper: ${AppTheme.palette.background.paper};
            --color-grey: ${AppTheme.palette.grey[800]};
          `}
        </style>
      </Head>
      <ThemeContextProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeContextProvider>
    </>
  );
};

export default app;
