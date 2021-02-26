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
      weekNr: this.getNumberOfWeek(new Date()),
      monDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - (new Date().getDay() - 1)),
      sunDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (7 - new Date().getDay()))
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
    let newMonDate = new Date(this.state.monDate.getFullYear(), this.state.monDate.getMonth(), this.state.monDate.getDate() + 7)
    let newSunDate = new Date(this.state.sunDate.getFullYear(), this.state.sunDate.getMonth(), this.state.sunDate.getDate() + 7)

    this.setState({
      weekNr: this.state.weekNr + 1, monDate: newMonDate, sunDate: newSunDate
    });
  }

  decrement() {
    if (this.state.weekNr > 1) {
      // this.fetchDate('decrement')
      let newMonDate = new Date(this.state.monDate.getFullYear(), this.state.monDate.getMonth(), this.state.monDate.getDate() - 7)
      let newSunDate = new Date(this.state.sunDate.getFullYear(), this.state.sunDate.getMonth(), this.state.sunDate.getDate() - 7)

      this.setState((prevState) => ({ weekNr: prevState.weekNr - 1, monDate: newMonDate, sunDate: newSunDate }));
    }
  }

  render() {
    function getFormatDate(args) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

      return `${args.getDate()} ${months[args.getMonth()]}`
    }

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
              Minggu {this.state.weekNr} ( {getFormatDate(this.state.monDate)} - {getFormatDate(this.state.sunDate)} )
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
