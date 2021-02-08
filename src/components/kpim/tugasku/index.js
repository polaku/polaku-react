import {
  AppBar,
  Button,
  Grid,
  IconButton,
  MobileStepper,
  Toolbar,
  Typography,
  withTheme,
} from "@material-ui/core";

import PropTypes from "prop-types";

import React, { Component } from "react";

import TaskWeek from "./taskWeek";
import Backlog from "./backlog";

import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import FilterListIcon from "@material-ui/icons/FilterList";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

const theme = () => ({
  direction: "rtl",
});

class tugasku extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      activeStep: 0,
    };
  }
  render(props) {
    return (
      <Grid>
        <AppBar position="static" style={{ backgroundColor: "transparent" }}>
          <Toolbar>
            <IconButton edge="start" aria-label="menu">
              <MenuIcon style={{ color: "black" }} />
            </IconButton>
            <Typography variant="h6" style={{ color: "black" }}>
              Perusahaan
            </Typography>
            &emsp;&emsp;&emsp;
            <IconButton edge="start" aria-label="menu">
              <MenuIcon style={{ color: "black" }} />
            </IconButton>
            <Typography variant="h6" style={{ color: "black", flexGrow: 1 }}>
              Departemen
            </Typography>
            <MobileStepper
              variant="text"
              steps={6}
              position="static"
              activeStep={this.state.activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={(prevActiveStep) =>
                    this.setState({ activeStep: prevActiveStep + 1 })
                  }
                  disabled={this.state.activeStep === 5}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={(prevActiveStep) =>
                    this.setState({ activeStep: prevActiveStep - 1 })
                  }
                  disabled={this.state.activeStep === 0}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                </Button>
              }
            />
          </Toolbar>
        </AppBar>

        <Grid style={{ margin: "10px 0" }}>
          <Button
            style={{ backgroundColor: "transparent" }}
            startIcon={<AccountCircleRoundedIcon />}
          >
            Orang
          </Button>
          <Button
            style={{ backgroundColor: "transparent" }}
            startIcon={<FilterListIcon />}
          >
            Filter
          </Button>
        </Grid>

        <TaskWeek />

        <Backlog />
      </Grid>
    );
  }
}

tugasku.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withTheme(tugasku);
