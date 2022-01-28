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
      monDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - (new Date().getDay() - 1)),
      sunDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (7 - new Date().getDay())),
      valueTab: 0,
    };
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
                Minggu {this.state.weekNr}:  {getFormatDate(this.state.monDate)} - {getFormatDate(this.state.sunDate)}
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
