import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Grid, Badge, Avatar, MenuItem, FormControl, InputLabel, Select as SelectOption
} from '@material-ui/core';

import CardSettingUserKPIM from './cardSettingUserKPIM';

import { fetchDataAllKPIM, fetchDataAllTAL, fetchDataRewardKPIM } from '../../store/action';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

class panelSetting extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      value: 1,
      data: [],
      bulan: new Date().getMonth() + 1,
      minggu: '',
      optionMinggu: [],
      dataForDisplay: [],
      firstDateInWeek: new Date().getDate() - (new Date().getDay() - 1),
      weekCurrent: null,
      needAction: 0
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

      for (batasBawah; batasBawah <= batasAtas; batasBawah++) {
        loopingWeek.push(batasBawah)
      }

      if (batasAtas === 53) {
        loopingWeek[loopingWeek.length - 1] = 1
      }

      this.setState({
        optionMinggu: loopingWeek
      })
      this.fetchData(this.state.bulan)
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.bulan !== this.state.bulan) {

      let batasAtas, batasBawah, loopingWeek = []

      batasAtas = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.bulan, 0))
      batasBawah = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.bulan - 1, 1))

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
      await this.fetchData(this.state.bulan)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchData = async (month) => {
    let temp = [], tempForDisplay = []
    await this.props.fetchDataAllKPIM({ year: new Date().getFullYear() })
    await this.props.fetchDataAllTAL(new Date().getFullYear())
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
      temp.push(newData)
    });

    //filter tal bawahan
    await temp.forEach(async user => {
      user.tal = await this.props.dataAllTAL.filter(element => user.user_id === element.user_id)
    })

    await temp.forEach(async user => {
      user.rewardKPIM = await this.props.dataAllRewardKPIM.filter(element => user.user_id === element.user_id)
    })

    tempForDisplay = temp

    await tempForDisplay.forEach(async user => {
      let tempScoreKPIMBefore = 0, tempPembagi = 0
      await user.kpim.forEach(async kpim => {
        let filteredKPIMScore = await kpim.kpimScore.filter(kpimScore => Number(kpimScore.month) === Number(month))

        let tes = kpim.kpimScore.filter(kpimScore => Number(kpimScore.month) === (Number(month) - 1))

        tes.forEach(kpim => {
          tempScoreKPIMBefore += kpim.score_kpim_monthly
          tempPembagi += 1
        })

        kpim.score = filteredKPIMScore
      })
      if (tempPembagi !== 0) user.scoreKPIMBefore = tempScoreKPIMBefore / tempPembagi
      else user.scoreKPIMBefore = 0

      await user.tal.forEach(async tal => {
        let filteredTALScore = await tal.talScore.filter(talScore => Number(talScore.week) === Number(this.state.minggu))
        tal.score = filteredTALScore
      })
    })

    this._isMounted && this.setState({ data: temp, dataForDisplay: tempForDisplay, needAction: 0 })
  }

  fetchWeek = () => {
    let i = 1, arr = []

    for (; i <= 52; i++) {
      arr.push(i)
    }
    this.setState({ optionMinggu: arr })
  }

  handleChange = name => async event => {
    //     if (name === 'bulan') {
    //       let batasAtas, batasBawah, loopingWeek = []
    //       console.log(event.target.value)
    //       if (event.target.value === "" || event.target.value === 0) {
    //         this.fetchWeek()
    //         this.fetchData(new Date().getMonth() + 1)
    //       } else {
    //         batasAtas = this.getNumberOfWeek(new Date(new Date().getFullYear(), event.target.value, 0))
    //         batasBawah = this.getNumberOfWeek(new Date(new Date().getFullYear(), event.target.value - 1, 1))

    //         // batasAtas = Math.ceil(event.target.value * 4.345)
    //         // batasBawah = batasAtas - 4

    //         for (batasBawah; batasBawah <= batasAtas; batasBawah++) {
    //           loopingWeek.push(batasBawah)
    //         }

    //         if (batasAtas === 53) {
    //           loopingWeek[loopingWeek.length - 1] = 1
    //         }
    // console.log("batasBawah",batasBawah)
    //         this.setState({
    //           optionMinggu: loopingWeek,
    //           minggu: batasBawah,
    //         })
    //         await this.fetchData(event.target.value)
    //       }
    //     }

    this.setState({ [name]: event.target.value });

    if (name === 'minggu') {
      await this.fetchData(this.state.bulan)
    }
  };

  refresh = () => {
    this.fetchData(this.state.bulan)
  }

  getNumberOfWeek = date => {
    let theDay = date
    var target = new Date(theDay);
    var dayNr = (new Date(theDay).getDay() + 6) % 7;

    target.setDate(target.getDate() - dayNr + 3);

    var jan4 = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - jan4) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

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
                    badgeContent={<div style={{ backgroundColor: '#b4b4b4', borderRadius: 15, height: 30, width: 30, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{el.scoreKPIMBefore}</div>}
                  >
                    <Avatar alt="Travis Howard" src="http://api.polagroup.co.id/uploads/icon_user.png" style={{ width: 80, height: 80 }} />
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
                    badgeContent={<div style={{ backgroundColor: '#b4b4b4', borderRadius: 15, height: 30, width: 30, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{el.scoreKPIMBefore}</div>}
                  >
                    <Avatar alt="Travis Howard" src="http://api.polagroup.co.id/uploads/icon_user.png" style={{ width: 80, height: 80 }} />
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
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={0}>
                telah berjalan
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
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={0}>
                telah berjalan
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
            this.state.dataForDisplay.map((el, index) =>
              <CardSettingUserKPIM data={el} key={index} refresh={this.refresh} firstDateInWeek={this.state.firstDateInWeek} week={this.state.minggu} month={this.state.bulan} weekCurrent={this.state.weekCurrent} setNeedAction={this.setNeedAction} status={this.props.status} lastWeekInMonth={this.state.optionMinggu[this.state.optionMinggu.length-1]}/>
            )
          }
          {
            this.state.needAction === 0 && this.props.status !== "all" && <>
              <img src={process.env.PUBLIC_URL + '/settingKPIM.png'} alt="Logo" style={{ width: 500, maxHeight: 500, margin: '50px auto 10px auto' }} />
              <p style={{ marginTop: 10, fontFamily: 'Simonetta', fontSize: 20, textShadow: '4px 4px 4px #aaa' }} >TIDAK ADA YANG BUTUH TINDAKAN</p>
            </>
          }

        </Grid>

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