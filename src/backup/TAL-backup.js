import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import {
  Grid, LinearProgress, Select as SelectOption, MenuItem, CircularProgress
} from '@material-ui/core';
// import
import BarChartIcon from '@material-ui/icons/BarChart';
import 'react-circular-progressbar/dist/styles.css';

import { fetchDataAllTAL } from '../store/action';

const CardTAL = lazy(() => import('../components/kpim/cardTAL'));

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
      isEmpty: false,
      proses: false
    }
  }

  async componentDidMount() {
    this._isMounted = true

    if (this._isMounted) {
      let mingguAwalBulan = this.getNumberOfWeek(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
      if (mingguAwalBulan >= 52) mingguAwalBulan = 1
      this.setState({
        mingguAwalBulan,
        mingguAkhirBulan: this.getNumberOfWeek(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)),
        persenanTALMonth: 0,
        monthSelected: new Date().getMonth()
      })

      if (this.props.userId) {
        await this.fetchData(new Date().getMonth() + 1)
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.userId !== prevProps.userId) {
      await this.fetchData(this.state.monthSelected + 1)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchData = async (monthSelected) => {
    this.setState({ proses: true })

    await this.props.fetchDataAllTAL({ "for-dashboard": true, year: new Date().getFullYear(), month: monthSelected, week: null, 'userId': this.props.userId })

    let tempTAL = [], isEmpty = true, tempPersenanTALMonth = 0, pembagi = 0

    for (let week = this.state.mingguAwalBulan; week <= this.state.mingguAkhirBulan; week++) { //fetch tal per minggu
      let tempTALweek = [], persenWeek = 0, newObj;
      await this.props.dataAllTAL.forEach(async tal => {
        let talScore = await tal.tbl_tal_scores.find(tal_score => tal_score.week === week)
        if (talScore) {
          let obj = { ...tal, ...talScore }
          delete obj.tbl_tal_scores
          persenWeek += talScore.score_tal
          tempTALweek.push(obj)
        }
      })
      if (tempTALweek.length > 0) {
        if (isEmpty) {
          isEmpty = false
        }
        pembagi++
      }
      newObj = { week, persenWeek, TALs: tempTALweek }
      tempPersenanTALMonth += persenWeek
      tempTAL.push(newObj)
    }

    let persenanTALMonth = Math.round(tempPersenanTALMonth / pembagi) || 0

    this._isMounted && this.setState({
      isEmpty,
      dataForDisplay: tempTAL,
      persenanTALMonth,
      proses: false
    })
  }

  getNumberOfWeek = date => {
    //date format yyyy-mm-dd
    let theDay = date
    var target = new Date(theDay);
    var dayNr = (new Date(theDay).getDay() + 6) % 7;

    target.setDate(target.getDate() - dayNr + 3);

    var reference = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - reference) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

  // CALENDER GOOGLE

  handleChange = name => async event => {
    let mingguAwalBulan = this.getNumberOfWeek(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    if (mingguAwalBulan >= 52) mingguAwalBulan = 1
    this.setState({
      mingguAwalBulan,
      mingguAkhirBulan: this.getNumberOfWeek(new Date(new Date().getFullYear(), event.target.value + 1, 0)),
      persenanTALMonth: 0,
      [name]: event.target.value,
      dataForDisplay: [],
    })
    await this.fetchData(event.target.value + 1)
  };

  refresh = async () => {
    await this.fetchData(this.state.monthSelected + 1)
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
            disabled={this.state.proses}
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

        {
          this.state.proses
            ? <Grid style={{
              marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'
            }}>
              < CircularProgress color="secondary" />
            </Grid>
            : <Grid container style={{ marginTop: 10 }}>
              {
                this.state.isEmpty
                  ? <Grid style={{ display: 'flex', margin: '50px auto 10px auto', flexDirection: 'column', textAlign: 'center' }}>
                    <img src={require('../Assets/settingKPIM.png').default} loading="lazy" alt="Logo" style={{ width: 500, maxHeight: 500 }} />
                    <p style={{ marginTop: 10, fontFamily: 'Simonetta', fontSize: 20, textShadow: '4px 4px 4px #aaa' }} >BELUM ADA TAL</p>
                  </Grid>
                  : this.state.dataForDisplay.length > 0 && this.state.dataForDisplay.map((el, index) =>
                    <CardTAL data={el} key={index} refresh={this.refresh} />
                  )
              }
            </Grid>
        }


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
