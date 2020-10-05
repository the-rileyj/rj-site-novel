import { makeStyles, Theme, Paper } from "@material-ui/core";
import { ReactNode } from "react";

const useContactCardStyles = makeStyles((theme: Theme) => ({
  contactCardContainer: {
    alignItems: "center",
    border: `3px solid ${theme.palette.secondary.main}`,
    display: "grid",
    fontSize: "5rem",
    justifyContent: "space-between",
    padding: "1rem",
    gridTemplateColumns: "15% auto",

    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

interface IContactCardProps {
  imgSrc: string;
  href: string;
  children: ReactNode;
}

const ContactCard: React.FC<IContactCardProps> = (props: IContactCardProps) => {
  const styles = useContactCardStyles();

  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      <Paper className={styles.contactCardContainer} elevation={6}>
        <img
          src={props.imgSrc}
          style={{ color: "#FFFFFF", height: "auto", width: "100%" }}
        />
        <div>{props.children}</div>
      </Paper>
    </a>
  );
};

export default ContactCard;
