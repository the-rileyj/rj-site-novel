import Layout from "../components/Layout";
import GlitchText from "../components/GlitchText";

import axios from "axios";

import { Theme, makeStyles, Paper } from "@material-ui/core";

import classNames from "classnames";
import { useState, useEffect, ReactNode } from "react";
import { GetStaticProps } from "next";

import consumeApi from "../util/api/ApiInteractions";
import { SoundCloudPlaylist } from "../util/api/ApiTypes";

const useMarqueeStyles = (offset: number) =>
  makeStyles((theme: Theme) => ({
    "@keyframes marqueeForward": {
      "0%": {
        transform: `translateX(${100 + offset}vw)`,
      },
      "100%": {
        transform: "translateX(-100%)",
      },
    },
    "@keyframes marqueeBackward": {
      "0%": {
        transform: `translateX(calc(-100% + -${offset}vw))`,
      },
      "100%": {
        transform: "translateX(100vw)",
      },
    },

    chyronContainer: {
      backgroundColor: theme.palette.grey[800],
      borderBottom: `3px solid ${theme.palette.secondary.main}`,
      overflow: "hidden",
      position: "relative",
      width: "100%",
    },
    chyronItem: {
      animationDuration: "120s",
      animationIterationCount: "infinite",
      animationTimingFunction: "linear",
      whiteSpace: "nowrap",
      width: "fit-content",
      willChange: "auto",

      "&:hover": {
        animationPlayState: "paused",
      },
    },
    chyronItemLtr: {
      animationName: "$marqueeForward",
    },
    chyronItemRtl: {
      animationName: "$marqueeBackward",
    },
  }));

interface IChyronProps {
  children?: ReactNode;
  leftToRight?: boolean;
  percentageOffset?: number;
}

const Chyron: React.FC<IChyronProps> = ({
  children,
  leftToRight,
  percentageOffset,
}: IChyronProps) => {
  if (leftToRight === undefined) {
    leftToRight = true;
  }

  if (percentageOffset === undefined) {
    percentageOffset = 0;
  }

  const styles = useMarqueeStyles(percentageOffset)();

  return (
    <div className={styles.chyronContainer}>
      <div
        className={classNames(
          styles.chyronItem,
          leftToRight ? styles.chyronItemLtr : styles.chyronItemRtl
        )}
      >
        {children}
      </div>
    </div>
  );
};

// const useOfferingsContainerStyles = makeStyles((theme: Theme) => ({
//   cardContainer: {
//     border: `3px solid ${theme.palette.secondary.main}`,
//   },
//   titleContainer: {
//     backgroundColor: theme.palette.primary.light,
//     borderBottom: `1px solid ${theme.palette.secondary.main}`,
//     padding: "1rem",
//   },
//   contentContainer: {
//     padding: "1rem",
//   },
// }));

// interface IOfferingsContainerProps {
//   children: React.ReactNode;
//   title: string;
// }

// const OfferingsCard: React.FC<IOfferingsContainerProps> = (
//   props: IOfferingsContainerProps
// ) => {
//   const styles = useOfferingsContainerStyles();

//   return (
//     <Card className={styles.cardContainer}>
//       <div className={styles.titleContainer}>{props.title}</div>
//       <div className={styles.contentContainer}>{props.children}</div>
//     </Card>
//   );
// };

const useIndexStyles = makeStyles((theme: Theme) => ({
  headerContainer: {
    alignItems: "center",
    backgroundColor: theme.palette.grey[800],
    borderBottom: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    display: "flex",
    flexDirection: "column",
    fontSize: "5rem",
    height: "calc(100vh - 5rem)",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: "100%",
    zIndex: 0,
  },
  header: {
    alignItems: "center",
    border: `3px solid ${theme.palette.secondary.main}`,
    color: theme.palette.secondary.main,
    display: "flex",
    flexDirection: "column",
    fontSize: "5rem",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 2,
  },
  animationContainer: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "repeat(10, 1fr)",
    fontSize: "calc(calc(100vh - 5rem) / 15)",
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  offeringsWrapper: {
    margin: "3rem 1rem 3rem 1rem",
  },
  offeringsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(25%, 1fr))",
    gridColumnGap: "1rem",
    gridRowGap: "1.5rem",
    justifyContent: "center",
    width: "100%",
  },
}));

interface Props {
  soundcloudPlaylist: SoundCloudPlaylist | null;
}

const IndexPage = ({ soundcloudPlaylist }: Props) => {
  const styles = useIndexStyles();

  return (
    <Layout contentPadding={false}>
      <div className={styles.headerContainer}>
        <Paper className={styles.header} elevation={12}>
          <div>Welcome to</div>
          <GlitchText text="RJ's Site" />
        </Paper>
        <div className={styles.animationContainer}>
          {/* eslint-disable-next-line prefer-spread */}
          {Array.apply(null, Array(10)).map((_, index) => (
            <Chyron
              key={index}
              leftToRight={index % 2 === 0}
              percentageOffset={(index >= 5 ? Math.abs(index - 9) : index) * 10}
            >
              {index} Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Aliquid quis, officiis praesentium optio labore possimus, nisi
              quo, odit aspernatur
            </Chyron>
          ))}
        </div>
      </div>
      {/* <div>{JSON.stringify(soundcloudPlaylist)}</div> */}
      {/* <div
        style={{
          backgroundColor: "black",
          height: "100vh",
          left: 0,
          opacity: 0.5,
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1000,
        }}
      >
        {soundcloudPlaylist?.tracks.map((track, index) => {
          return <div key={index}>{track.title}</div>;
        })}
      </div> */}
      {/* <div className={styles.offeringsWrapper}>
        <div className={styles.offeringsContainer}>
          {/ eslint-disable-next-line prefer-spread /}
          {Array.apply(null, Array(10)).map((_, index) => (
            <OfferingsCard key={index} title={`Test${index}`}>
              <div>
                {/ eslint-disable-next-line prefer-spread /}
                {Array.apply(null, Array(10)).map((_, index) => (
                  <div key={index}>test {index}</div>
                ))}
              </div>
            </OfferingsCard>
          ))}
        </div>
      </div> */}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    // const resp = await axios.get<string>("http://rj-site-back-end/api/songs");

    const [responsePromise] = consumeApi.get<SoundCloudPlaylist>("/songs");

    const response = await responsePromise;

    return { props: { soundcloudPlaylist: response.data }, revalidate: 60 };
  } catch (err) {
    return { props: { soundcloudPlaylist: null }, revalidate: 60 };
  }
};

export default IndexPage;
