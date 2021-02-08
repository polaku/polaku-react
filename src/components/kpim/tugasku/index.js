import {
  AppBar,
  Grid,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { Component } from "react";

import TaskWeek from "./taskWeek";
import Backlog from "./backlog";

export default class tugasku extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }
  render() {
    return (
      <Grid>
        <AppBar position="static" style={{ backgroundColor: "transparent" }}>
          <Toolbar>
            <IconButton edge="start" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6" style={{ color: "black" }}>
              Perusahaan
            </Typography>
            &emsp;&emsp;&emsp;
            <IconButton edge="start" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6" style={{ color: "black" }}>
              Departemen
            </Typography>
          </Toolbar>
        </AppBar>

        <TaskWeek />

        <Backlog />
      </Grid>
    );
  }
}
