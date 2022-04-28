import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  withTheme,
  Tab,
  Tabs,
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
      sunDate: null,
      satDate: null,
      startDateWeek: null,
      endDateWeek: null,
      valueTab: 0,
    };
  }

  componentDidMount() {
    let sunDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - (new Date().getDay()))
    let satDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (6 - new Date().getDay()))

    if (sunDate.getMonth() !== satDate.getMonth()) {
      if (new Date().getMonth() === sunDate.getMonth()) {
        satDate = new Date(sunDate.getFullYear(), sunDate.getMonth() + 1, 0)
      } else if (new Date().getMonth() === satDate.getMonth()) {
        sunDate = new Date(satDate.getFullYear(), satDate.getMonth(), 1)
      }
    }
    this.setState({ sunDate, satDate })
  }

  getNumberOfWeek = (date) => {
    //yyyy-mm-dd (first date in week)
    if (new Date().getFullYear() === 2021) {
      let theDay = date;
      var target = new Date(theDay);
      var dayNr = (new Date(theDay).getDay() + 6) % 7;

      target.setDate(target.getDate() - dayNr + 3);

      var reference = new Date(target.getFullYear(), 0, 4);
      var dayDiff = (target - reference) / 86400000;
      var weekNr = 1 + Math.ceil(dayDiff / 7);

      return weekNr;
    } else {
      var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      var dayNum = d.getUTCDay();
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    }
  }

  increment() {

    let newWeek = this.state.weekNr + 1
    let newSunDate = new Date(this.state.sunDate.getFullYear(), this.state.sunDate.getMonth(), this.state.sunDate.getDate() + 7)
    let newSatDate = new Date(this.state.satDate.getFullYear(), this.state.satDate.getMonth(), this.state.satDate.getDate() + 7)

    if (newSunDate.getFullYear() === new Date().getFullYear()) {
      if (this.state.satDate.getDay() !== 6) {
        newSunDate = new Date(this.state.sunDate.getFullYear(), this.state.sunDate.getMonth() + 1, 1)
        newSatDate = new Date(newSunDate.getFullYear(), newSunDate.getMonth(), newSunDate.getDate() + (6 - newSunDate.getDay()))
        newWeek = this.state.weekNr
      } else if (newSunDate.getMonth() !== newSatDate.getMonth()) {
        newSatDate = new Date(newSunDate.getFullYear(), newSunDate.getMonth() + 1, 0)
      } else if (newSunDate.getDay() !== 0) {
        newSunDate = new Date(newSatDate.getFullYear(), newSatDate.getMonth(), newSatDate.getDate() - newSatDate.getDay())
      }

      this.setState({
        weekNr: newWeek, sunDate: newSunDate, satDate: newSatDate
      });
    }
  }

  decrement() {
    if (this.state.weekNr > 1) {
      let newWeek = this.state.weekNr - 1

      let newSunDate = new Date(this.state.sunDate.getFullYear(), this.state.sunDate.getMonth(), this.state.sunDate.getDate() - 7)
      let newSatDate = new Date(this.state.satDate.getFullYear(), this.state.satDate.getMonth(), this.state.satDate.getDate() - 7)

      if (this.state.sunDate.getDay() !== 0) {
        newSunDate = new Date(this.state.sunDate.getFullYear(), this.state.sunDate.getMonth(), this.state.sunDate.getDate() - this.state.sunDate.getDay())
        newSatDate = new Date(this.state.satDate.getFullYear(), this.state.satDate.getMonth(), 0)
        newWeek = this.state.weekNr
      } else if (newSunDate.getMonth() !== newSatDate.getMonth()) {
        newSunDate = new Date(this.state.satDate.getFullYear(), this.state.satDate.getMonth(), 1)
      } else if (newSatDate.getDay() !== 6) {
        newSatDate = new Date(newSunDate.getFullYear(), newSunDate.getMonth(), newSunDate.getDate() + 6)
      }

      this.setState((prevState) => ({ weekNr: newWeek, sunDate: newSunDate, satDate: newSatDate }));
    }
  }

  handleChangeTabs = (event, newValue) => {
    this.setState({ valueTab: newValue });
  };

  render() {
    function getFormatDate(args) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

      return `${months[args.getMonth()]} ${args.getDate()}`
    }

    return (
      <>
        <AppBar position="static" style={{ backgroundColor: "transparent" }}>
          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
            <Tabs
              value={this.state.valueTab}
              indicatorColor="secondary"
              textColor="secondary"
              onChange={this.handleChangeTabs}
            >
              <Tab label="Semua" style={{ minWidth: 120, marginRight: 10 }} />
              <Tab label="TAL" style={{ minWidth: 80, marginRight: 10 }} />
              <Tab label="Meeting" style={{ minWidth: 120, marginRight: 10 }} />
              <Tab label="Permintaan" style={{ minWidth: 120 }} />
            </Tabs>

            {/* <IconButton edge="start" aria-label="menu">
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
            </Typography> */}
            <Grid style={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={this.decrement.bind(this)}>
                <KeyboardArrowLeft />
              </Button>
              <p style={{ color: "gray", margin: 0 }}>
                Minggu {this.state.weekNr}:  {this.state.sunDate && getFormatDate(this.state.sunDate)} - {this.state.satDate && getFormatDate(this.state.satDate)}
              </p>
              <Button onClick={this.increment.bind(this)}>
                <KeyboardArrowRight />
              </Button>
            </Grid>

          </Grid>
        </AppBar>

        <Grid style={{ margin: "10px 0" }}>
          {/* <Button
            style={{ backgroundColor: "transparent" }}
            startIcon={<PersonOutlinedIcon />}
          >
            Orang
          </Button> */}
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
