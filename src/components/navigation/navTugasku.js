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

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

class navTugasku extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      count: 1,
      weekNr: this.getNumberOfWeek(new Date()),
    };
  }

  getNumberOfWeek(date) {
    //yyyy-mm-dd
    let theDay = date;
    var target = new Date(theDay);
    var dayNr = (new Date(theDay).getDay() + 6) % 7;

    target.setDate(target.getDate() - dayNr + 3);

    var reference = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - reference) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

  componentDidMount() {
    this.getNumberOfWeek();
  }

  increment() {
    this.setState({
      weekNr: this.state.weekNr + 1,
    });
  }

  decrement() {
    if (this.state.weekNr > 1) {
      this.setState((prevState) => ({ weekNr: prevState.weekNr - 1 }));
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
              Minggu {this.state.weekNr}
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
