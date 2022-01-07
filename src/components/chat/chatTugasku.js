import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import {
  Avatar,
  Grid,
  IconButton,
  ListItemAvatar,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";

import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import { PlayArrow } from "@material-ui/icons";

import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";

const useStyles = makeStyles({
  list: {
    width: 450,
  },
  fullList: {
    width: "auto",
  },
});

export default function Index() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, true)}
    >
      <List>
        <ListItem>
          <ListItemText primary="Judul Desain Order Form" />
        </ListItem>
        <ListItem>
          <small>Diskusi</small>&nbsp;
          <Avatar>HI</Avatar>
          <IconButton style={{ color: "green" }}>
            <AddCircleRoundedIcon />
          </IconButton>
        </ListItem>
      </List>
      <List>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/1.jpg" />
          </ListItemAvatar>

          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs>
              <TextField
                id="input-with-icon-grid"
                label="Tulis komentar"
                fullWidth
              />
            </Grid>
            <Grid item>
              <PlayArrow />
            </Grid>
          </Grid>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/1.jpg" />
          </ListItemAvatar>

          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  style={{ display: "inline" }}
                  color="textPrimary"
                >
                  Ardi
                </Typography>
                <small>{" 28 Juni 2020 17:05"}</small>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Grid>
                  <Paper style={{ padding: 12 }}>
                    Tralalallalaladasdsadjadnajdna
                  </Paper>
                </Grid>
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            aria-label="testimoni"
            onClick={toggleDrawer(anchor, true)}
            style={{padding:0}}
          >
            <QuestionAnswerOutlinedIcon style={{ color: "#d71149" }} />
          </IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
