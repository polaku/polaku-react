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
              Minggu {this.state.count}: &nbsp;
              {this.state.count === 1
                ? "Jan 01 - Jan 07"
                : this.state.count === 2
                ? "Jan 08 - Jan 15"
                : this.state.count === 3
                ? "Jan 16 - Jan 23"
                : this.state.count === 4
                ? "Jan 24 - Jan 31"
                : this.state.count === 5
                ? "Feb 01 - Feb 08"
                : this.state.count === 6
                ? "Feb 09 - Feb 16"
                : this.state.count === 7
                ? "Feb 17 - Feb 24"
                : this.state.count === 8
                ? "Feb 25 - Mar 1"
                : this.state.count === 9
                ? "Mar 2 - Mar 9"
                : this.state.count === 10
                ? "Mar 10 - Mar 17"
                : this.state.count === 11
                ? "Mar 18 - Mar 25"
                : this.state.count === 12
                ? "Mar 26 - Apr 1"
                : this.state.count === 13
                ? "Apr 2 - Apr 9"
                : this.state.count === 14
                ? "Apr 10 - Apr 17"
                : this.state.count === 15
                ? "Apr 18 - Apr 25"
                : this.state.count === 16
                ? "Mar 26 - Mei 1"
                : this.state.count === 17
                ? "Mei 2 - Mei 9"
                : this.state.count === 18
                ? "Mei 10 - Mei 17"
                : this.state.count === 19
                ? "Mei 18 - Mei 25"
                : this.state.count === 20
                ? "Mei 26 - Jun 1"
                : this.state.count === 21
                ? "Jun 2 - Jun 9"
                : this.state.count === 22
                ? "Jun 10 - Jun 17"
                : this.state.count === 23
                ? "Jun 18 - Jun 25"
                : this.state.count === 24
                ? "Jun 26 - Jun 31"
                : this.state.count === 25
                ? "Jul 1 - Jul 18"
                : this.state.count === 26
                ? "Jul 19 - Jun 17"
                : this.state.count === 27
                ? "Jun 10 - Jun 17"
                : this.state.count === 28
                ? "Jun 10 - Jun 17"
                : this.state.count === 29
                ? "Jun 10 - Jun 17"
                : this.state.count === 30
                ? "Jun 10 - Jun 17"
                : this.state.count === 31
                ? "Jun 10 - Jun 17"
                : this.state.count === 32
                ? "Jun 10 - Jun 17"
                : this.state.count === 33
                ? "Jun 10 - Jun 17"
                : this.state.count === 34
                ? "Jun 10 - Jun 17"
                : this.state.count === 35
                ? "Jun 10 - Jun 17"
                : this.state.count === 36
                ? "Jun 10 - Jun 17"
                : this.state.count === 37
                ? "Jun 10 - Jun 17"
                : this.state.count === 38
                ? "Jun 10 - Jun 17"
                : this.state.count === 39
                ? "Jun 10 - Jun 17"
                : this.state.count === 40
                ? "Jun 10 - Jun 17"
                : this.state.count === 41
                ? "Jun 10 - Jun 17"
                : this.state.count === 42
                ? "Jun 10 - Jun 17"
                : this.state.count === 43
                ? "Jun 10 - Jun 17"
                : this.state.count === 44
                ? "Jun 10 - Jun 17"
                : this.state.count === 45
                ? "Jun 10 - Jun 17"
                : this.state.count === 46
                ? "Jun 10 - Jun 17"
                : this.state.count === 47
                ? "Jun 10 - Jun 17"
                : this.state.count === 48
                ? "Jun 10 - Jun 17"
                : this.state.count === 49
                ? "Jun 10 - Jun 17"
                : this.state.count === 50
                ? "Jun 10 - Jun 17"
                : this.state.count === 51
                ? "Jun 10 - Jun 17"
                : this.state.count === 52
                ? "Jun 10 - Jun 17"
                : "99999"}
            </Typography>
            <Button onClick={this.increment.bind(this)}>
              <KeyboardArrowRight />
            </Button>
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
