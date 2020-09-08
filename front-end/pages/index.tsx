import Link from "next/link";
import Layout from "../components/Layout";
import { Theme, makeStyles, Paper } from "@material-ui/core";

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
    width: "100%",
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
  },
}));

const IndexPage = () => {
  const styles = useIndexStyles();

  return (
    <Layout contentPadding={false}>
      <div className={styles.headerContainer}>
        <Paper className={styles.header} elevation={12}>
          <div>Welcome to</div>
          <div>RJ's Site</div>
        </Paper>
      </div>
    </Layout>
  );
};

export default IndexPage;
