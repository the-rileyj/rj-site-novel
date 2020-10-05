import { makeStyles, Theme, StyleRules } from "@material-ui/core";

// Thank you to https://codemyui.com/pure-css-text-glitch-and-twerk/

const glitchStyling = (theme: Theme) => ({
  color: "#FFFFFF",
  position: "relative",
  animation: "$glitch 5s 5s infinite",
  overflow: "hidden",
  "&::before": {
    content: "attr(data-text)",
    position: "absolute",
    left: "-2px",
    "text-shadow": `-5px 0 ${theme.palette.primary.light}`,
    overflow: "hidden",
    top: 0,
    animation:
      "$noise-1 6s linear infinite alternate-reverse, $glitch 10s 10.05s infinite",
  },
  "&::after": {
    content: "attr(data-text)",
    position: "absolute",
    left: "2px",
    textShadow: `-5px 0 ${theme.palette.primary.main}`,
    overflow: "hidden",
    top: 0,
    animation:
      "$noise-2 6s linear infinite alternate-reverse, $glitch 10s 10s infinite",
  },
});

const useGlitchTextStyles = makeStyles((theme: Theme) => ({
  "@keyframes glitch": {
    "1%": {
      transform: "rotateX(10deg) skewX(90deg)",
    },
    "2%": {
      transform: "rotateX(0deg) skewX(0deg)",
    },
  },
  "@keyframes noise-1": {
    "3.33%": {
      "clip-path": "inset(77px 0 21px 0)",
    },
    "6.67%": {
      "clip-path": "inset(28px 0 31px 0)",
    },
    "10.00%": {
      "clip-path": "inset(100px 0 1px 0)",
    },
    "13.33%": {
      "clip-path": "inset(10px 0 40px 0)",
    },
    "16.67%": {
      "clip-path": "inset(37px 0 48px 0)",
    },
    "20.00%": {
      "clip-path": "inset(5px 0 86px 0)",
    },
    "23.33%": {
      "clip-path": "inset(81px 0 13px 0)",
    },
    "26.67%": {
      "clip-path": "inset(94px 0 7px 0)",
    },
    "30.00%": {
      "clip-path": "inset(91px 0 9px 0)",
    },
    "33.33%": {
      "clip-path": "inset(54px 0 1px 0)",
    },
    "36.67%": {
      "clip-path": "inset(4px 0 2px 0)",
    },
    "40.00%": {
      "clip-path": "inset(72px 0 16px 0)",
    },
    "43.33%": {
      "clip-path": "inset(63px 0 9px 0)",
    },
    "46.67%": {
      "clip-path": "inset(2px 0 94px 0)",
    },
    "50.00%": {
      "clip-path": "inset(23px 0 60px 0)",
    },
    "53.33%": {
      "clip-path": "inset(21px 0 13px 0)",
    },
    "56.67%": {
      "clip-path": "inset(15px 0 58px 0)",
    },
    "60.00%": {
      "clip-path": "inset(24px 0 3px 0)",
    },
    "63.33%": {
      "clip-path": "inset(91px 0 10px 0)",
    },
    "66.67%": {
      "clip-path": "inset(44px 0 14px 0)",
    },
    "70.00%": {
      "clip-path": "inset(19px 0 16px 0)",
    },
    "73.33%": {
      "clip-path": "inset(74px 0 12px 0)",
    },
    "76.67%": {
      "clip-path": "inset(17px 0 35px 0)",
    },
    "80.00%": {
      "clip-path": "inset(5px 0 23px 0)",
    },
    "83.33%": {
      "clip-path": "inset(15px 0 8px 0)",
    },
    "86.67%": {
      "clip-path": "inset(27px 0 10px 0)",
    },
    "90.00%": {
      "clip-path": "inset(96px 0 2px 0)",
    },
    "93.33%": {
      "clip-path": "inset(13px 0 31px 0)",
    },
    "96.67%": {
      "clip-path": "inset(5px 0 66px 0)",
    },
    "100.00%": {
      "clip-path": "inset(53px 0 1px 0)",
    },
  },
  "@keyframes noise-2": {
    "3.33%": {
      "clip-path": "inset(41px 0 12px 0)",
    },
    "6.67%": {
      "clip-path": "inset(95px 0 5px 0)",
    },
    "10.00%": {
      "clip-path": "inset(30px 0 49px 0)",
    },
    "13.33%": {
      "clip-path": "inset(74px 0 22px 0)",
    },
    "16.67%": {
      "clip-path": "inset(40px 0 39px 0)",
    },
    "20.00%": {
      "clip-path": "inset(61px 0 27px 0)",
    },
    "23.33%": {
      "clip-path": "inset(2px 0 66px 0)",
    },
    "26.67%": {
      "clip-path": "inset(16px 0 13px 0)",
    },
    "30.00%": {
      "clip-path": "inset(51px 0 12px 0)",
    },
    "33.33%": {
      "clip-path": "inset(50px 0 17px 0)",
    },
    "36.67%": {
      "clip-path": "inset(77px 0 2px 0)",
    },
    "40.00%": {
      "clip-path": "inset(57px 0 20px 0)",
    },
    "43.33%": {
      "clip-path": "inset(19px 0 51px 0)",
    },
    "46.67%": {
      "clip-path": "inset(33px 0 64px 0)",
    },
    "50.00%": {
      "clip-path": "inset(73px 0 6px 0)",
    },
    "53.33%": {
      "clip-path": "inset(85px 0 7px 0)",
    },
    "56.67%": {
      "clip-path": "inset(2px 0 81px 0)",
    },
    "60.00%": {
      "clip-path": "inset(79px 0 1px 0)",
    },
    "63.33%": {
      "clip-path": "inset(13px 0 64px 0)",
    },
    "66.67%": {
      "clip-path": "inset(7px 0 84px 0)",
    },
    "70.00%": {
      "clip-path": "inset(50px 0 10px 0)",
    },
    "73.33%": {
      "clip-path": "inset(46px 0 38px 0)",
    },
    "76.67%": {
      "clip-path": "inset(46px 0 9px 0)",
    },
    "80.00%": {
      "clip-path": "inset(98px 0 1px 0)",
    },
    "83.33%": {
      "clip-path": "inset(81px 0 15px 0)",
    },
    "86.67%": {
      "clip-path": "inset(76px 0 16px 0)",
    },
    "90.00%": {
      "clip-path": "inset(21px 0 5px 0)",
    },
    "93.33%": {
      "clip-path": "inset(52px 0 49px 0)",
    },
    "96.67%": {
      "clip-path": "inset(53px 0 26px 0)",
    },
    "100.00%": {
      "clip-path": "inset(90px 0 6px 0)",
    },
  },
  //   scanlines: {
  //     overflow: "hidden",
  //     "mix-blend-mode": "difference",
  //     "&::before": {
  //       content: '""',
  //       position: "absolute",
  //       width: "100%",
  //       height: "100%",
  //       top: "0",
  //       left: "0",

  //       background: `repeating-linear-gradient(
  //           to bottom,
  //           transparent 0%,
  //           rgba(255, 255, 255, 0.05) .5%,
  //           transparent 1%
  //       )`,
  //       animation: "$fudge 7s ease-in-out alternate infinite",
  //     },
  //   },
  //   "@keyframes fudge": {
  //     from: {
  //       transform: "translate(0px, 0px)",
  //     },
  //     to: {
  //       transform: "translate(0px, 2%)",
  //     },
  //   },
  glow: {
    ...glitchStyling(theme),
    textShadow: "0 0 1000px rgb(223, 191, 191)",
    color: "transparent",
    position: "absolute",
    top: 0,
  },
  container: {
    overflow: "hidden",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  glitch: { ...(glitchStyling(theme) as any) },
  //   subtitle: {
  //     "font-family": "Arial, Helvetica, sans-serif",
  //     "font-weight": "100",
  //     "font-size": ".8vw",
  //     color: "rgba(165, 141, 141, .4)",
  //     "text-transform": "uppercase",
  //     "letter-spacing": "1em",
  //     "text-align": "center",
  //     position: "absolute",
  //     left: "17%",
  //     animation: "$glitch-2 5s 5.02s infinite",
  //   },
  //   "@keyframes glitch-2": {
  //     "1%": {
  //       transform: "rotateX(10deg) skewX(70deg)",
  //     },
  //     "2%": {
  //       transform: "rotateX(0deg) skewX(0deg)",
  //     },
  //   },
}));

interface IGlitchTextProps {
  text: string;
}

const GlitchText: React.FC<IGlitchTextProps> = (props: IGlitchTextProps) => {
  const styles = useGlitchTextStyles();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.glitch} data-text={props.text}>
          {props.text}
        </div>
        {/* <div className={styles.glow}>{props.title}</div> */}
        {/* <p className={styles.subtitle}>Engineer﹒Gamer﹒Shenaniganizer</p> */}
      </div>
      {/* <div className={styles.scanlines}></div> */}
    </>
  );
};

export default GlitchText;
