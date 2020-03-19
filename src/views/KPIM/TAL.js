import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import {
  Grid, LinearProgress, Select as SelectOption, MenuItem
} from '@material-ui/core';

import BarChartIcon from '@material-ui/icons/BarChart';

import 'react-circular-progressbar/dist/styles.css';

import CardTAL from '../../components/kpim/cardTAL';

import { fetchDataAllTAL } from '../../store/action';

class TAL extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],

      dataForDisplay: [],
      mingguAwalBulan: 0,
      mingguAkhirBulan: 0,
      persenanTALMonth: 0,
      monthSelected: 0,
      isEmpty: false
    }
  }

  async componentDidMount() {
    this._isMounted = true

    if (this._isMounted) {
      this.setState({
        mingguAwalBulan: this.getNumberOfWeek(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
        mingguAkhirBulan: this.getNumberOfWeek(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
        persenanTALMonth: 0,
        monthSelected: new Date().getMonth()
      })

      await this.fetchData()
      await this.fetchDataForDisplay()
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      this.setState({
        mingguAwalBulan: this.getNumberOfWeek(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
        mingguAkhirBulan: this.getNumberOfWeek(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
        persenanTALMonth: 0,
        monthSelected: new Date().getMonth()
      })

      await this.fetchData()
      await this.fetchDataForDisplay()
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }


  fetchData = async () => {
    await this.props.fetchDataAllTAL(new Date().getFullYear())
    let allTAL = this.props.dataAllTAL, tempTAL = []

    for (let i = 1; i <= 53; i++) { //fetch tal per minggu
      let tempTALweek = []
      await allTAL.forEach(async tal => {
        let temp = await tal.talScore.find(talWeek => Number(talWeek.week) === i && Number(tal.user_id) === Number(this.props.userId))
        let newTAL = { ...tal, ...temp }
        delete newTAL.talScore
        temp && tempTALweek.push(newTAL)
      })
      tempTAL.push(tempTALweek)
    }

    this._isMounted && this.setState({
      dataTAL: tempTAL
    })
  }

  fetchDataForDisplay = () => {
    let isEmpty = true
    let allData = []

    if (this.state.dataTAL && this.state.dataTAL.length > 0) allData = this.state.dataTAL.slice(this.state.mingguAwalBulan - 1, this.state.mingguAkhirBulan)


    let counterWeek = 0, tempTotalScore = 0, tempScore = 0

    allData.forEach(tal => {
      if (tal.length > 0) {
        isEmpty = false
      }
      if (tal.length > 0) counterWeek++
      tal.forEach(talScore => {
        tempTotalScore += talScore.score_tal
      })
    })

    tempScore = Math.floor(tempTotalScore / counterWeek)

    if (isNaN(tempScore)) tempScore = 0

    this._isMounted && this.setState({
      dataForDisplay: allData,
      persenanTALMonth: tempScore,
      isEmpty
    })
  }

  getNumberOfWeek = date => {
    //date format yyyy-mm-dd
    let theDay = date
    var target = new Date(theDay);
    var dayNr = (new Date(theDay).getDay() + 6) % 7;

    target.setDate(target.getDate() - dayNr + 3);

    var jan4 = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - jan4) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

  handleChange = name => async event => {
    this.setState({
      mingguAwalBulan: this.getNumberOfWeek(new Date(new Date().getFullYear(), event.target.value, 1)),
      mingguAkhirBulan: this.getNumberOfWeek(new Date(new Date().getFullYear(), event.target.value + 1, 0)),
      persenanTALMonth: 0,
      [name]: event.target.value,
      dataForDisplay: [],
    })

    await this.fetchData()
    await this.fetchDataForDisplay()
  };

  refresh = async () => {
    await this.fetchData()
    await this.fetchDataForDisplay()
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid>
        <Grid container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
            <BarChartIcon />
            <p style={{ margin: 0, fontSize: 20 }}>TO ACHIEVE LIST</p>
          </Grid>
          <SelectOption
            value={this.state.monthSelected}
            onChange={this.handleChange('monthSelected')}
          >
            {
              this.state.months.map((month, index) =>
                <MenuItem value={index} key={index}>{month} {new Date().getFullYear()}</MenuItem>
              )
            }
          </SelectOption>
        </Grid>
        <Grid style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: 10, borderRadius: 5 }}>
          <p style={{ margin: '0px 0px 5px 0px', fontSize: 12 }}>Performa TAL</p>
          <p style={{ margin: 0, fontSize: 12 }}>performa periode</p>
          <LinearProgress variant="determinate" value={this.state.persenanTALMonth}
            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
          />
          <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ margin: 0, fontSize: 12 }}>statistik periode</p>
            <p style={{ margin: 0, fontSize: 15 }}>{this.state.persenanTALMonth}/100</p>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: 10 }}>
          {
            this.state.dataForDisplay.length > 0 && this.state.dataForDisplay.map((el, index) =>
              <CardTAL data={el} key={index} refresh={this.refresh} />
            )
          }

          {
            this.state.isEmpty && <Grid style={{ display: 'flex', margin: '50px auto 10px auto', flexDirection: 'column', textAlign: 'center' }}>
              <img src={process.env.PUBLIC_URL + '/settingKPIM.png'} alt="Logo" style={{ width: 500, maxHeight: 500 }} />
              <p style={{ marginTop: 10, fontFamily: 'Simonetta', fontSize: 20, textShadow: '4px 4px 4px #aaa' }} >BELUM ADA TAL</p>
            </Grid>
          }
        </Grid>

      </Grid >
    )
  }
}

const styles = () => ({
  colorPrimary: {
    backgroundColor: '#d6d6d6',
  },
  barColorPrimary: {
    backgroundColor: '#3e98c7',
  }
});

const mapDispatchToProps = {
  fetchDataAllTAL
}

const mapStateToProps = ({ loading, error, dataAllTAL, userId }) => {
  return {
    loading, error, dataAllTAL, userId
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TAL));
