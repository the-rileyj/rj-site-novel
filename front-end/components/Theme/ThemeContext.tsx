import React, { createContext, useContext } from "react";
import Cookies from "js-cookie";

import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeOptions, Theme } from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider } from "@material-ui/styles";

interface IContextProps {
  theme: Theme;
  dispatch: React.Dispatch<string>;
}

// const savedTheme = Cookies.get("theme");

// let realTheme = "light";

// if (savedTheme !== undefined && savedTheme !== "light") realTheme = "dark";

// const realTheme = "dark";

export const AppTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#902020",
      light: "#c65148",
      dark: "#5c0000",
    },
    secondary: {
      main: "#fafafa",
      light: "#ffffff",
      dark: "#c7c7c7",
    },
    // grey: "#484848",
    background: {
      default: "#212121",
      paper: "#5c0000",
    },
    // type: theme === "light" ? "light" : "dark",
    type: "dark",
  },
} as ThemeOptions);

const ThemeContext = createContext({} as IContextProps);

const getTheme = () => responsiveFontSizes(AppTheme);

const ThemeContextReducer = (_: Theme, action: string): Theme => {
  Cookies.set("theme", action);

  //   return getTheme(action);
  return getTheme();
};

const ThemeContextProvider: React.FC = (props: any) => {
  const [theme, dispatch] = React.useReducer(ThemeContextReducer, getTheme());

  return (
    <ThemeContext.Provider value={{ theme, dispatch }}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

const ThemeContextConsumer = ThemeContext.Consumer;

const useThemeContext = () => useContext(ThemeContext);

export { useThemeContext, ThemeContextProvider, ThemeContextConsumer };
