import React from "react";

import { AppProps } from "next/app";
import Head from "next/head";

import CssBaseline from "@material-ui/core/CssBaseline";

import { ThemeContextProvider } from "../components/Theme/ThemeContext";

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
      </Head>
      <ThemeContextProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeContextProvider>
    </>
  );
};

export default app;
