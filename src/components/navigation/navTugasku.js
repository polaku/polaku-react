import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  withTheme,
} from "@material-ui/core";

import PropTypes from "prop-types";

import React, { Component } from "react";

import MenuIcon from "@material-ui/icons/Menu";
import FilterListIcon from "@material-ui/icons/FilterList";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";

class navTugasku extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      count: 1,
    };
  }

  increment() {
    this.setState({
      count: this.state.count + 1,
    });
  }

  decrement() {
    if (this.state.count > 1) {
      this.setState((prevState) => ({ count: prevState.count - 1 }));
    }
  }
  render(props) {
    return (
      <>
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
            <Button onClick={this.decrement.bind(this)}>
              <KeyboardArrowLeft />
            </Button>
            <Typography style={{ color: "black" }}>
              Minggu {this.state.count}: Jan 01 - Jan 07
            </Typography>
            <Button onClick={this.increment.bind(this)}>
              <KeyboardArrowRight />
            </Button>
            {/* <MobileStepper
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
            /> */}
          </Toolbar>
        </AppBar>

        <Grid style={{ margin: "10px 0" }}>
          <Button
            style={{ backgroundColor: "transparent" }}
            startIcon={<PersonOutlinedIcon />}
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
      </>
    );
  }
}

navTugasku.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withTheme(navTugasku);
