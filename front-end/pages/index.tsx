import Layout from "../components/Layout";
import GlitchText from "../components/GlitchText";

import { Theme, makeStyles, Paper } from "@material-ui/core";

import classNames from "classnames";
import { useState, useEffect, ReactNode, useRef, memo, createRef } from "react";
import { GetStaticProps } from "next";

import consumeApi from "../util/api/ApiInteractions";
import { SoundCloudPlaylist, Track } from "../util/api/ApiTypes";
import { AppTheme } from "../components/Theme/ThemeContext";

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
      height: "100%",
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

const useHeaderChyronsStyles = makeStyles((theme: Theme) => ({
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
  chyronWrapper: {
    height: "100%",

    "&:hover": {
      cursor: "pointer",
    },
  },
}));

interface IHeaderChyronsProps {
  chyronItems: string[];
  onChyronClick: (index: number) => void;
}

const HeaderChyrons: React.FC<IHeaderChyronsProps> = ({
  chyronItems,
  onChyronClick,
}: IHeaderChyronsProps) => {
  const styles = useHeaderChyronsStyles();
  return (
    <div className={styles.headerContainer}>
      <Paper className={styles.header} elevation={12}>
        <div>Welcome to</div>
        <GlitchText text="RJ's Site" />
      </Paper>
      <div className={styles.animationContainer}>
        {chyronItems.map((chyronString, index) => (
          <div
            className={styles.chyronWrapper}
            key={index}
            onClick={() => onChyronClick(index)}
          >
            <Chyron
              leftToRight={index % 2 === 0}
              percentageOffset={(index >= 5 ? Math.abs(index - 9) : index) * 10}
            >
              {chyronString}
            </Chyron>
          </div>
        ))}
      </div>
    </div>
  );
};

const useTracksModalStyles = makeStyles((theme: Theme) => ({
  soundcloudTrackLinkNormal: {
    backgroundColor: theme.palette.primary.main,

    "& a:link": {
      fontWeight: "bolder",
    },
    "& a:visited": {
      fontWeight: "bold",
    },
  },

  soundcloudTrackLinkSelected: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.grey[800],

    "& a:link": {
      fontWeight: "bolder",
      color: theme.palette.grey[800],
    },
    "& a:visited": {
      fontWeight: "bold",
      color: theme.palette.grey[800],
    },
  },

  soundcloudTrackLinkWrapper: {
    border: `3px solid ${theme.palette.secondary.main}`,
    color: theme.palette.secondary.light,
    transition: "background-color .5s, color 1s",

    "&:hover": {
      backgroundColor: theme.palette.secondary.light,

      "& a": {
        color: theme.palette.grey[800],
        fontWeight: "normal",
      },
    },
  },
}));

interface ITracksModalProps {
  shownTrack: Track | null;
  soundcloudTracks: Track[];
  handleCloseModal: () => void;
}

const TracksModal: React.FC<ITracksModalProps> = ({
  handleCloseModal,
  shownTrack,
  soundcloudTracks,
}: ITracksModalProps) => {
  const styles = useTracksModalStyles();

  const trackContainerRef = useRef<HTMLDivElement>(null);

  const trackRefMap = useRef<{
    [trackID: string]: React.MutableRefObject<any>;
  }>(
    (() => {
      const tmpTrackRefMap: {
        [trackID: string]: React.MutableRefObject<any>;
      } = {};

      soundcloudTracks.forEach(
        (track) => (tmpTrackRefMap[track.id] = createRef<any>())
      );

      return tmpTrackRefMap;
    })()
  );

  useEffect(() => {
    if (!shownTrack) {
      return;
    }

    const trackRef = trackRefMap.current[shownTrack.id];

    if (!trackContainerRef.current || !trackRef.current) {
      return;
    }

    trackContainerRef.current.scrollTo(-1, trackRef.current.offsetTop);
  }, [shownTrack]);

  return (
    <div
      style={{
        alignItems: "center",
        display: shownTrack ? "flex" : "none",
        height: "100vh",
        justifyContent: "center",
        left: 0,
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={12}
        style={{
          border: `3px solid ${AppTheme.palette.secondary.main}`,
          height: "96vh",
          overflowY: "auto",
          position: "relative",
          width: "96%",
        }}
        ref={trackContainerRef}
      >
        <div
          style={{
            backgroundColor: AppTheme.palette.background.default,
            border: `3px solid ${AppTheme.palette.secondary.main}`,
            position: "fixed",
            right: ".25rem",
            top: ".25rem",
            zIndex: 1001,
          }}
          onClick={handleCloseModal}
        >
          X
        </div>
        <div
          style={{
            backgroundColor: AppTheme.palette.background.default,
            fontSize: "20px",
            padding: "1.5rem",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridColumnGap: "1rem",
              gridRowGap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(600px, 1fr))",
            }}
          >
            {soundcloudTracks.map((track, index) => {
              return (
                <Paper
                  key={index}
                  className={`${styles.soundcloudTrackLinkWrapper} ${
                    track.id === shownTrack?.id
                      ? styles.soundcloudTrackLinkSelected
                      : styles.soundcloudTrackLinkNormal
                  }`}
                  elevation={12}
                  ref={trackRefMap.current[track.id]}
                >
                  <a
                    href={`${track.permalink_url}?in=riley-johnson-734562913/sets/lovethemgunsounds`}
                    style={{
                      display: "flex",
                      columnGap: "1rem",
                      height: "calc(2rem + 100px)",
                      padding: "1rem",
                      width: "100%",
                    }}
                  >
                    <div style={{ height: "100px", width: "100px" }}>
                      {track.artwork_url ? (
                        <img
                          style={{ height: "100px", width: "100px" }}
                          src={track.artwork_url}
                        />
                      ) : null}
                    </div>
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          alignItems: "flex-end",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          justifyContent: "space-around",
                        }}
                      >
                        <div>{track.title}</div>
                        <div>{track.user.username}</div>
                      </div>
                    </div>
                  </a>
                </Paper>
              );
            })}
          </div>
        </div>
      </Paper>
    </div>
  );
};

// const useAppLandingStyles = makeStyles((theme: Theme) => ({}));

interface IAppLandingProps {
  soundcloudPlaylist: SoundCloudPlaylist | null;
}

const MemoHeaderChyrons = memo<IHeaderChyronsProps>(
  (props) => <HeaderChyrons {...props} />,
  () => true
);

const AppLanding: React.FC<IAppLandingProps> = ({
  soundcloudPlaylist,
}: IAppLandingProps) => {
  // const styles = useAppLandingStyles();

  const [shownTrack, setShownTrack] = useState<Track | null>(null);

  const soundcloudTracks = soundcloudPlaylist?.tracks ?? [];

  const randomIndexes = useRef(
    (() => {
      const usedIndexes: { [key: number]: boolean } = {};

      // eslint-disable-next-line prefer-spread
      return Array.apply(null, Array(10)).map(() => {
        let randomIndex = Math.floor(
          Math.random() * (soundcloudTracks.length - 1)
        );

        while (usedIndexes[randomIndex]) {
          randomIndex = Math.floor(
            Math.random() * (soundcloudTracks.length - 1)
          );
        }

        usedIndexes[randomIndex] = true;

        return randomIndex;
      });
    })()
  );

  const randomSongs = useRef(
    randomIndexes.current.map(
      (randomIndex) =>
        `${soundcloudTracks[randomIndex].title} - ${soundcloudTracks[randomIndex].user.username}`
    )
  );

  return (
    <>
      <MemoHeaderChyrons
        chyronItems={randomSongs.current}
        onChyronClick={(index: number) =>
          setShownTrack(soundcloudTracks[randomIndexes.current[index]])
        }
      />
      <TracksModal
        handleCloseModal={() => setShownTrack(null)}
        shownTrack={shownTrack}
        soundcloudTracks={soundcloudTracks}
      />
    </>
  );
};

// const useIndexStyles = makeStyles(() => ({
//   offeringsWrapper: {
//     margin: "3rem 1rem 3rem 1rem",
//   },
//   offeringsContainer: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(25%, 1fr))",
//     gridColumnGap: "1rem",
//     gridRowGap: "1.5rem",
//     justifyContent: "center",
//     width: "100%",
//   },
// }));

interface Props {
  soundcloudPlaylist: SoundCloudPlaylist | null;
}

const IndexPage = ({ soundcloudPlaylist }: Props) => {
  // const styles = useIndexStyles();

  return (
    <Layout contentPadding={false}>
      <AppLanding soundcloudPlaylist={soundcloudPlaylist} />
      {/* ) : null} */}
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
