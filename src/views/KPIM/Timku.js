import {
  Paper,
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
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import CardEmployee from "../../components/kpim/timku/CardEmployee";

const months = ['Januari'
  , 'Februari'
  , 'Maret'
  , 'April'
  , 'Mei'
  , 'Juni'
  , 'Juli'
  , 'Agustus'
  , 'September'
  , 'Oktober'
  , 'November'
  , 'Desember'
]

class Timku extends Component {
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
      monthSelected: new Date().getMonth()
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.monthSelected !== this.state.monthSelected) {
      let newSunDate = new Date(new Date().getFullYear(), this.state.monthSelected, 1)
      let newSatDate = new Date(new Date().getFullYear(), this.state.monthSelected, newSunDate.getDate() + (6 - newSunDate.getDay()))

      this.setState({
        weekNr: this.getNumberOfWeek(newSunDate), sunDate: newSunDate, satDate: newSatDate
      });
    }
  }


  getNumberOfWeek = (date) => {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay();
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  incrementMonth() {
    this.setState((prevState) => ({ monthSelected: prevState.monthSelected + 1 }));
  }

  decrementMonth() {
    this.setState((prevState) => ({ monthSelected: prevState.monthSelected - 1 }));
  }

  incrementWeek() {
    let newSunDate = new Date(this.state.sunDate.getFullYear(), this.state.sunDate.getMonth(), this.state.sunDate.getDate() + 7)
    let newSatDate = new Date(this.state.satDate.getFullYear(), this.state.satDate.getMonth(), this.state.satDate.getDate() + 7)

    if (newSunDate.getFullYear() === new Date().getFullYear()) {
      if (this.state.satDate.getDay() !== 6) {
        newSunDate = new Date(this.state.sunDate.getFullYear(), this.state.sunDate.getMonth() + 1, 1)
        newSatDate = new Date(newSunDate.getFullYear(), newSunDate.getMonth(), newSunDate.getDate() + (6 - newSunDate.getDay()))
      } else if (newSunDate.getMonth() !== newSatDate.getMonth()) {
        newSatDate = new Date(newSunDate.getFullYear(), newSunDate.getMonth() + 1, 0)
      } else if (newSunDate.getDay() !== 0) {
        newSunDate = new Date(newSatDate.getFullYear(), newSatDate.getMonth(), newSatDate.getDate() - newSatDate.getDay())
      }

      if (newSunDate.getMonth() === this.state.monthSelected && newSatDate.getMonth() === this.state.monthSelected) this.setState({
        weekNr: this.getNumberOfWeek(newSunDate), sunDate: newSunDate, satDate: newSatDate
      });
    }
  }

  decrementWeek() {
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

      if (newSunDate.getMonth() === this.state.monthSelected && newSatDate.getMonth() === this.state.monthSelected) this.setState({
        weekNr: newWeek, sunDate: newSunDate, satDate: newSatDate
      });
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
        <Paper position="static" style={{ backgroundColor: "transparent" }}>
          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 0 }}>
            <Grid style={{ display: 'flex' }}>
              <Grid style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={this.decrementMonth.bind(this)} disabled={this.state.monthSelected === 0}>
                  <KeyboardArrowLeft />
                </Button>
                <p style={{ color: "gray", margin: 0 }}>
                  {months[this.state.monthSelected]}
                </p>
                <Button onClick={this.incrementMonth.bind(this)} disabled={this.state.monthSelected === 11}>
                  <KeyboardArrowRight />
                </Button>
              </Grid>
              <Grid style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={this.decrementWeek.bind(this)}>
                  <KeyboardArrowLeft />
                </Button>
                <p style={{ color: "gray", margin: 0 }}>
                  Minggu {this.state.weekNr}:  {this.state.sunDate && getFormatDate(this.state.sunDate)} - {this.state.satDate && getFormatDate(this.state.satDate)}
                </p>
                <Button onClick={this.incrementWeek.bind(this)}>
                  <KeyboardArrowRight />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Grid style={{ margin: "10px 0" }}>
          <Button
            style={{ color: '#47484d' }}
            startIcon={<AccountCircleOutlinedIcon style={{ width: 30, height: 30 }} />}
          >
            Orang
          </Button>
        </Grid>

        <CardEmployee />
      </>
    );
  }
}

Timku.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withTheme(Timku);
