import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Grid, Badge, Avatar, MenuItem, FormControl, InputLabel, Select as SelectOption, CircularProgress
} from '@material-ui/core';

import CardSettingUserKPIM from './cardSettingUserKPIM';

import { fetchDataAllKPIM, fetchDataAllTAL, fetchDataRewardKPIM } from '../../store/action';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

class panelSetting extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      proses: true,
      value: 1,
      data: [],
      bulan: new Date().getMonth() + 1,
      minggu: '',
      optionMinggu: [],
      dataForDisplay: [],
      firstDateInWeek: new Date().getDate() - (new Date().getDay() - 1),
      weekCurrent: null,
      needAction: 0,
      loading: true
    }
  }

  async componentDidMount() {
    this._isMounted = true

    if (this._isMounted) {
      this.fetchWeek()
      this.setState({
        minggu: this.getNumberOfWeek(new Date()),
        weekCurrent: this.getNumberOfWeek(new Date())
      })

      let batasAtas, batasBawah, loopingWeek = []
      // batasAtas = Math.ceil(this.state.bulan * 4.345)
      batasAtas = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.bulan, 0))
      batasBawah = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.bulan - 1, 1))

      if (batasBawah >= 52) batasBawah = 1

      for (batasBawah; batasBawah <= batasAtas; batasBawah++) {
        loopingWeek.push(batasBawah)
      }

      if (batasAtas === 53) {
        loopingWeek[loopingWeek.length - 1] = 1
      }

      this.setState({
        optionMinggu: loopingWeek,
      })
      await this.fetchData(this.state.bulan, this.getNumberOfWeek(new Date()))
      this.setState({
        proses: false,
        loading: false
      })

    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.bulan !== this.state.bulan) {

      let batasAtas, batasBawah, loopingWeek = []

      batasAtas = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.bulan, 0))
      batasBawah = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.bulan - 1, 1))

      if (batasBawah >= 52) batasBawah = 1

      for (let i = batasBawah; i <= batasAtas; i++) {
        loopingWeek.push(i)
      }

      if (batasAtas === 53) {
        loopingWeek[loopingWeek.length - 1] = 1
      }

      this.setState({
        optionMinggu: loopingWeek,
        minggu: batasBawah,
      })
      await this.fetchData(this.state.bulan, batasBawah)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchData = async (month, week) => {
    let temp = [], tempForDisplay = []

    await this.props.fetchDataAllKPIM({ "for-setting": true, year: new Date().getFullYear(), month, week })
    await this.props.fetchDataRewardKPIM(this.props.userId)

    //filter kpim per-user bawahan
    this.props.bawahan && await this.props.bawahan.forEach(async element => {
      let newData = {
        user_id: element.user_id,
        fullname: element.fullname,
        avatar: element.avatar,
        scoreKPIMBefore: 0
      }

      newData.kpim = await this.props.dataAllKPIM.filter(el => el.user_id === element.user_id)
      tempForDisplay.push(newData)
    });

    await tempForDisplay.forEach(async user => {
      user.rewardKPIM = await this.props.dataAllRewardKPIM.filter(element => user.user_id === element.user_id)
    })

    await tempForDisplay.forEach(async user => {
      let tempScoreKPIMBefore = 0, tempPembagi = 0
      await user.kpim.forEach(async kpim => {
        tempScoreKPIMBefore += kpim.tbl_kpim_scores[0].score_kpim_monthly
        tempPembagi += 1
      })
      if (tempPembagi !== 0) user.scoreKPIMBefore = tempScoreKPIMBefore / tempPembagi
      else user.scoreKPIMBefore = 0
    })

    this._isMounted && this.setState({ data: temp, dataForDisplay: tempForDisplay, needAction: 0, proses: false })
  }

  fetchWeek = () => {
    let i = 1, arr = []

    for (; i <= 52; i++) {
      arr.push(i)
    }
    this.setState({ optionMinggu: arr })
  }

  handleChange = name => async event => {
    this.setState({ [name]: event.target.value });

    if (name === 'minggu') {
      await this.fetchData(this.state.bulan, event.target.value)
    }
  };

  refresh = () => {
    this.fetchData(this.state.bulan, this.state.minggu)
  }

  getNumberOfWeek = date => {
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
  // getNumberOfWeek = date => {
  //   //yyyy-mm-dd (first date in week)
  //   var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  //   var dayNum = d.getUTCDay() || 7;
  //   d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  //   var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  //   return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  // }

  setNeedAction = args => {
    let temp = this.state.needAction + 1

    let dataUser = [...this.state.data]

    dataUser.forEach(user => {
      if (user.user_id === args) user.statusNeedAction = 1
    })
    this.setState({ needAction: temp, data: dataUser })
    this.props.setBanyakButuhTindakan && this.props.setBanyakButuhTindakan(temp)
  }

  navigateDashboardBawahan = (userId, fullname) => {
    this.props.history.push('/kpim', { userId, fullname })
  }

  render() {
    return (
      <div>
        {
          this.state.loading
            ? <Grid style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 30 }}>
              <CircularProgress color="secondary" size={60} />
            </Grid>
            : <>
              <Grid id="user" container style={{ marginLeft: 20, display: 'flex', alignItems: 'flex-start' }}>
                {
                  this.state.dataForDisplay.map((el, index) =>
                    this.props.status === "all"
                      ? <Grid style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'cener', width: 80, marginRight: 30, cursor: 'pointer' }} key={index} onClick={() => this.navigateDashboardBawahan(el.user_id, el.fullname)}>
                        <Badge
                          overlap="circle"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          badgeContent={<div style={{ backgroundColor: '#b4b4b4', borderRadius: 15, height: 30, width: 30, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{Math.round(el.scoreKPIMBefore)}</div>}
                        >
                          <Avatar alt={`${el.fullname}'s avatar`} src={el.avatar || "http://api.polagroup.co.id/uploads/icon_user.png"} style={{ width: 80, height: 80 }} />
                        </Badge>
                        <p style={{ margin: 0, textAlign: 'center' }}>{el.fullname}</p>
                      </Grid>
                      : el.statusNeedAction && <Grid style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'cener', width: 80, marginRight: 30, cursor: 'pointer' }} key={index} onClick={() => this.navigateDashboardBawahan(el.user_id, el.fullname)}>
                        <Badge
                          overlap="circle"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          badgeContent={<div style={{ backgroundColor: '#b4b4b4', borderRadius: 15, height: 30, width: 30, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{Math.round(el.scoreKPIMBefore)}</div>}
                        >
                          <Avatar alt={`${el.fullname}'s avatar`} src={el.avatar || "http://api.polagroup.co.id/uploads/icon_user.png"} style={{ width: 80, height: 80 }} />
                        </Badge>
                        <p style={{ margin: 0, marginTop: 10, textAlign: 'center' }}>{el.fullname}</p>
                      </Grid>
                  )
                }
              </Grid>
              <Grid id="filter" style={{ marginTop: 10, marginBottom: 30, display: 'flex', alignItems: 'flex-end' }}>
                <p style={{ margin: '0px 10px 5px 0px' }}>filter</p>
                <FormControl >
                  <InputLabel>
                    Bulan
                </InputLabel>
                  <SelectOption
                    value={this.state.bulan}
                    onChange={this.handleChange('bulan')}
                    style={{ width: 150, marginRight: 10 }}
                    disabled={this.state.proses}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {
                      months.map((el, index) =>
                        <MenuItem value={index + 1} key={index}>{el}</MenuItem>
                      )
                    }
                  </SelectOption>
                </FormControl>
                <FormControl >
                  <InputLabel>
                    Minggu
                </InputLabel>
                  <SelectOption
                    value={this.state.minggu}
                    onChange={this.handleChange('minggu')}
                    style={{ width: 150, marginRight: 10 }}
                    disabled={this.state.proses}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {
                      this.state.optionMinggu.map((el, index) =>
                        <MenuItem value={el} key={index}>{el}</MenuItem>
                      )
                    }
                  </SelectOption>
                </FormControl>
              </Grid>

              <Grid id="main" style={{ marginTop: 20, textAlign: 'center' }}>
                {/* CARD */}
                {
                  this.state.proses
                    ? <CircularProgress color="secondary" />
                    : this.state.dataForDisplay.map((el, index) =>
                      <CardSettingUserKPIM data={el} key={index} refresh={this.refresh} firstDateInWeek={this.state.firstDateInWeek} week={this.state.minggu} month={this.state.bulan} weekCurrent={this.state.weekCurrent} setNeedAction={this.setNeedAction} status={this.props.status} lastWeekInMonth={this.state.optionMinggu[this.state.optionMinggu.length - 1]} />
                    )
                }
                {
                  this.state.needAction === 0 && this.props.status !== "all" && <>
                    <img src={process.env.PUBLIC_URL + '/settingKPIM.png'} alt="Logo" style={{ width: 500, maxHeight: 500, margin: '50px auto 10px auto' }} />
                    <p style={{ marginTop: 10, fontFamily: 'Simonetta', fontSize: 20, textShadow: '4px 4px 4px #aaa' }} >TIDAK ADA YANG BUTUH TINDAKAN</p>
                  </>
                }
              </Grid>
            </>
        }
        {/* <p>TESTING</p> */}
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataAllKPIM,
  fetchDataAllTAL,
  fetchDataRewardKPIM
}

const mapStateToProps = ({ loading, error, dataAllKPIM, bawahan, dataAllTAL, dataAllRewardKPIM, userId }) => {
  return {
    loading,
    error,
    dataAllKPIM,
    bawahan,
    dataAllTAL,
    dataAllRewardKPIM,
    userId
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(panelSetting))