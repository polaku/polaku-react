import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';

import {
  Grid, LinearProgress, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, MenuItem, Select as SelectOption
} from '@material-ui/core';

import BarChartIcon from '@material-ui/icons/BarChart';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import CardIndicator from '../../components/kpim/cardIndicatorKPIM';
import CardItemTAL from '../../components/kpim/cardItemTAL';

import { fetchDataAllKPIM, fetchDataAllTAL, fetchDataRewardKPIM } from '../../store/action';
import { API } from '../../config/API';

import swal from 'sweetalert';

class DashboardKPIM extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      proses: false,
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      statusAddNewTal: false,
      chooseWhen: ['Setiap hari', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
      firstDateInWeek: new Date().getDate() - (new Date().getDay() - 1),

      indicator_tal: '',
      weight: '',
      when: '',
      load: '',
      achievement: '',
      link: '',

      weekNow: 0,
      weekSelected: 0,
      monthSelected: null,

      allKPIM: [],
      kpimSelected: [],
      persenKPIM: 0,
      kpimTAL: null,
      kpimTeam: [],

      allTAL: [],
      talSelected: [],
      persenTAL: 0,
      totalWeight: 0,

      lastUpdate: null,
      currentReward: '',

      validateCreateTAL: false,

      idBawahanSelected: 0,
      talTeam: []
    }
  }

  async componentDidMount() {
    this._isMounted = true

    if (this._isMounted) {
      if (this.props.location.state) {
        await this.fetchData(new Date().getMonth(), this.props.location.state.userId)

        await this.props.fetchDataRewardKPIM(this.props.location.state.userId)

        await this.props.myRewardKPIM.sort(this.sortingReward)

        this._isMounted && this.setState({
          idBawahanSelected: this.props.location.state.userId,
          weekNow: this.getNumberOfWeek(new Date()),
          weekSelected: this.getNumberOfWeek(new Date()),
          monthSelected: new Date().getMonth()
        })
      } else if (this.props.userId) {
        await this.fetchData(new Date().getMonth(), this.props.userId)

        await this.props.fetchDataRewardKPIM(this.props.userId)

        await this.props.myRewardKPIM.sort(this.sortingReward)

        this._isMounted && this.setState({
          weekNow: this.getNumberOfWeek(new Date()),
          weekSelected: this.getNumberOfWeek(new Date()),
          monthSelected: new Date().getMonth()
        })
      }
    }

  }

  async componentDidUpdate(prevProps, prevState) {
    //assign tal selected for display
    if (prevState.weekSelected !== this.state.weekSelected) {
      await this.fetchTALSelected()

      if (this.state.weekSelected >= this.getNumberOfWeek(new Date())) {
        this.setState({
          validateCreateTAL: true
        })
      } else {
        this.setState({
          validateCreateTAL: false
        })
      }
    }

    //assign kpim selected for display
    if (prevState.monthSelected !== this.state.monthSelected) {

      if (this.state.monthSelected === new Date().getMonth()) {
        this.setState({
          weekSelected: this.getNumberOfWeek(new Date()),
        })
      } else {
        let mingguAwalBulan = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.monthSelected, 1))

        this.setState({
          weekSelected: mingguAwalBulan,
        })
      }

      await this.fetchKPIMSelected()

    }

    //update when add pencapaian_monthly
    if (prevState.lastUpdate !== this.state.lastUpdate) {
      if (this.props.location.state) {
        await this.fetchData(new Date().getMonth(), this.props.location.state.userId)
      } else {
        await this.fetchData(new Date().getMonth(), this.props.userId)
      }
      await this.fetchKPIMSelected()
      await this.fetchTALSelected()
    }

    //fetch myreward kpim 
    if (prevState.persenKPIM !== this.state.persenKPIM) {
      this.setState({
        currentReward: ""
      })
      this.props.myRewardKPIM.forEach(el => {
        if (this.state.persenKPIM >= el.nilai_bawah) {
          this.setState({
            currentReward: el.reward
          })
        }
      })
    }

    if (prevProps.userId !== this.props.userId) {
      await this.fetchData(new Date().getMonth(), this.props.userId)

      await this.props.fetchDataRewardKPIM(this.props.userId)

      await this.props.myRewardKPIM.sort(this.sortingReward)

      this.setState({
        weekNow: this.getNumberOfWeek(new Date()),
        weekSelected: this.getNumberOfWeek(new Date()),
        monthSelected: new Date().getMonth()
      })
    }

    // if (prevProps.location.state !== this.props.location.state) {
    //   if (!this.props.location.state) {
    //     console.log("MASUK")

    //     this.setState({
    //       idBawahanSelected: this.props.location.state.userId
    //     })
    //     await this.fetchData(new Date().getMonth(), this.props.userId)
    //     await this.fetchKPIMSelected()
    //     await this.fetchTALSelected()
    //   }
    // }

    // if (prevProps.bawahan !== this.props.bawahan) {
    //   console.log("MASUK bawahan update")
    //   await this.fetchData(new Date().getMonth(), this.props.bawahan)
    //   await this.fetchKPIMSelected()
    //   await this.fetchTALSelected()
    // }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchData = async (monthSelected, userId) => {
    let allTAL = [], tempTAL = [], allKPIM = [], tempKPIM = []

    await this.props.fetchDataAllKPIM({ year: new Date().getFullYear() })
    await this.props.fetchDataAllTAL(new Date().getFullYear())

    allTAL = await this.props.dataAllTAL.filter(tal => tal.user_id === userId)
    allKPIM = await this.props.dataAllKPIM.filter(kpim => kpim.user_id === userId)

    for (let i = 1; i <= 53; i++) { //fetch tal per minggu
      let tempTALweek = []
      await allTAL.forEach(async tal => {
        let temp = await tal.talScore.find(talWeek => Number(talWeek.week) === i)
        let newTAL = { ...tal, ...temp }
        delete newTAL.talScore
        temp && tempTALweek.push(newTAL)
      })
      tempTAL.push(tempTALweek)
    }

    if (this.props.bawahan.length > 0 && !this.props.location.state) {
      await this.fetchDataKPIMTALBawahan(monthSelected)
    }

    for (let i = 1; i <= 12; i++) { //fetch kpim per bulan (before&now month)
      let tempKPIMmonth = []

      if (this.props.bawahan.length > 0 && !this.props.location.state) {
        //kpim tal TEAM
        let tempKPIMTALTeambefore
        if (this.state.talTeam[i - 2]) tempKPIMTALTeambefore = this.state.talTeam[i - 2]
        else tempKPIMTALTeambefore = []
        let tempKPIMTALTeamnow = this.state.talTeam[i - 1]
        tempKPIMmonth.push([tempKPIMTALTeambefore, tempKPIMTALTeamnow])

        // //kpim TEAM
        // let tempKPIMTeambefore = this.state.kpimTeam[i - 2] || []
        // let tempKPIMTeamnow = this.state.kpimTeam[i - 1]
        // tempKPIMmonth.push([tempKPIMTeambefore, tempKPIMTeamnow])
      }
      let KPIMTEAM = await allKPIM.filter(kpim => kpim.indicator_kpim.toLowerCase() === "kpim team")

      KPIMTEAM && await KPIMTEAM.forEach(async kpim => {
        let tempKPIMbefore = await kpim.kpimScore.find(kpimMonth => Number(kpimMonth.month) === i - 1)
        let tempKPIMnow = await kpim.kpimScore.find(kpimMonth => Number(kpimMonth.month) === i)

        let newKPIMbefore = tempKPIMbefore ? { ...kpim, ...tempKPIMbefore } : []
        let newKPIMnow = { ...kpim, ...tempKPIMnow }
        delete newKPIMbefore.kpimScore
        delete newKPIMnow.kpimScore

        tempKPIMnow && tempKPIMmonth.push([newKPIMbefore, newKPIMnow])
      })

      let onlyTAL = await allKPIM.filter(kpim => kpim.indicator_kpim.toLowerCase() === "tal")

      onlyTAL && await onlyTAL.forEach(async kpim => {
        let tempKPIMbefore = await kpim.kpimScore.find(kpimMonth => Number(kpimMonth.month) === i - 1)
        let tempKPIMnow = await kpim.kpimScore.find(kpimMonth => Number(kpimMonth.month) === i)

        let newKPIMbefore = tempKPIMbefore ? { ...kpim, ...tempKPIMbefore } : []
        let newKPIMnow = { ...kpim, ...tempKPIMnow }
        delete newKPIMbefore.kpimScore
        delete newKPIMnow.kpimScore

        tempKPIMnow && tempKPIMmonth.push([newKPIMbefore, newKPIMnow])
      })

      let onlyKPIM = await allKPIM.filter(kpim => kpim.indicator_kpim.toLowerCase() !== "tal" && kpim.indicator_kpim.toLowerCase() !== "kpim team")

      await onlyKPIM.forEach(async kpim => {

        let tempKPIMbefore = await kpim.kpimScore.find(kpimMonth => Number(kpimMonth.month) === i - 1)
        let tempKPIMnow = await kpim.kpimScore.find(kpimMonth => Number(kpimMonth.month) === i)

        let newKPIMbefore = tempKPIMbefore ? { ...kpim, ...tempKPIMbefore } : []
        let newKPIMnow = { ...kpim, ...tempKPIMnow }
        delete newKPIMbefore.kpimScore
        delete newKPIMnow.kpimScore

        tempKPIMnow && tempKPIMmonth.push([newKPIMbefore, newKPIMnow])
      })
      tempKPIM.push(tempKPIMmonth)
    }

    this._isMounted && this.setState({
      allTAL: tempTAL,
      allKPIM: tempKPIM,
      kpimSelected: []
    })

  }

  //Untuk table tal yang bawah
  fetchTALSelected = () => {
    let talSelected = this.state.allTAL[this.state.weekSelected - 1], tempPersenTAL = 0, tempTotalWeight = 0
    talSelected.forEach(talWeek => {
      tempPersenTAL += (Number(talWeek.achievement) * (Number(talWeek.weight) / 100))
      tempTotalWeight += Number(talWeek.weight)
    })

    this._isMounted && this.setState({
      talSelected,
      persenTAL: tempPersenTAL,
      totalWeight: tempTotalWeight
    })
  }

  fetchKPIMSelected = () => {
    // console.log(this.state.weekSelected)
    let kpimSelected = this.state.allKPIM[this.state.monthSelected], persenKPIM = 0, kpimTAL = null

    kpimSelected.forEach(kpim => {
      if (Number(kpim[1].target_monthly) > 0 && kpim[1].indicator_kpim.toLowerCase() !== "tal" && kpim[1].indicator_kpim.toLowerCase() !== "tal team") {
        persenKPIM += Math.floor(((Number(kpim[1].pencapaian_monthly) / Number(kpim[1].target_monthly)) * 100) * (Number(kpim[1].bobot) / 100))
      }
      else if (kpim[1].indicator_kpim.toLowerCase() !== "tal team") {
        persenKPIM += Math.round(Number(kpim[1].score_kpim_monthly) * (Number(kpim[1].bobot) / 100) * 100) / 100 || 0
      }
      if (kpim[1].indicator_kpim.toLowerCase() === "tal") {
        kpimTAL = kpim[1]
      }
    })

    this._isMounted && this.setState({
      kpimSelected,
      persenKPIM,
      kpimTAL
    })
  }

  fetchDataKPIMTALBawahan = async (monthSelected) => {
    // let tempKPIM = [], tempTAL = [],  kpimMonthly = [], talMonthly = []
    let tempTAL = [], talMonthly = []

    this.props.bawahan && await this.props.bawahan.forEach(async element => { //fetch kpim per user
      let newTAL = []

      // newKPIM = this.props.dataAllKPIM.filter(el => el.user_id === element.user_id)
      // tempKPIM = [...tempKPIM, ...newKPIM]
      // if (newKPIM.length > 0) counterUserKPIM++

      newTAL = this.props.dataAllTAL.filter(el => el.user_id === element.user_id)

      newTAL.forEach(el => {
        el.fullname = element.fullname
      })

      tempTAL = [...tempTAL, ...newTAL]
    });

    // console.log(tempTAL)

    for (let i = 0; i < 12; i++) { //fetch kpim dan tal user per bulan
      let talBawahanPerbulan = []

      // tempKPIM.forEach(async kpim => {
      //   let userKPIMScore = kpim.kpimScore.find(kpimScore => Number(kpimScore.month) === i + 1)
      //   if (userKPIMScore) kpimBawahanPerbulan.push(userKPIMScore)
      // })

      // let objKPIM = {
      //   indicator_kpim: "KPIM TEAM",
      //   score_kpim_monthly: 0,
      //   month: i + 1,
      //   year: "" + new Date().getFullYear()
      // }
      // let tempScoreKPIM = 0

      // kpimBawahanPerbulan.forEach(kpimMonth => {
      //   tempScoreKPIM += kpimMonth.score_kpim_monthly * (Number(kpimMonth.bobot) / 100)
      // })

      // objKPIM.score_kpim_monthly = tempScoreKPIM / counterUserKPIM
      // kpimMonthly.push(objKPIM)

      //filter tal perbulan
      tempTAL.forEach(async tal => {
        let userTALScore = []
        tal.talScore.forEach(talScore => {
          if (Number(talScore.month) === i + 1) {
            talScore.user_id = tal.user_id
            talScore.fullname = tal.fullname
            userTALScore.push(talScore)
          }
        })

        if (userTALScore.length > 0) talBawahanPerbulan = [...talBawahanPerbulan, ...userTALScore]
      })

      await talBawahanPerbulan.sort(this.compare)

      // console.log(talBawahanPerbulan)
      let objTAL = {
        indicator_kpim: "TAL TEAM",
        score_kpim_monthly: 0,
        month: i + 1,
        year: "" + new Date().getFullYear()
      }

      let weekProcessing = 0, tempScoreTAL = 0, counterPembagiTALSebulan = 0, userIdSelected = null
      let talUserPerminggu = [], talAllUserPerminggu = [], talAllUserPerBulan = []

      await talBawahanPerbulan.forEach((talScore, index) => {
        if ((userIdSelected === null && weekProcessing === 0) || (userIdSelected === talScore.user_id && weekProcessing === talScore.week)) {
          talUserPerminggu.push(talScore)
          if (index === talBawahanPerbulan.length - 1) {
            talAllUserPerminggu.push({ user_id: userIdSelected, indicator_kpim: "TAL TEAM", tal: talUserPerminggu })
            talAllUserPerBulan.push({ week: weekProcessing, tal: talAllUserPerminggu })
            talAllUserPerminggu = []
          }

        } else {
          talAllUserPerminggu.push({ user_id: userIdSelected, indicator_kpim: "TAL TEAM", tal: talUserPerminggu })
          if ((weekProcessing !== 0 && weekProcessing !== talScore.week) || (index === talBawahanPerbulan.length - 1)) {
            talAllUserPerBulan.push({ week: weekProcessing, tal: talAllUserPerminggu })
            talAllUserPerminggu = []
          }
          talUserPerminggu = []
          talUserPerminggu.push(talScore)
        }

        if ((userIdSelected === talScore.user_id && weekProcessing !== talScore.week) ||
          (userIdSelected !== talScore.user_id && weekProcessing === talScore.week) ||
          (userIdSelected !== talScore.user_id && weekProcessing !== talScore.week)) {
          counterPembagiTALSebulan++
        }

        if (userIdSelected !== talScore.user_id) {
          userIdSelected = talScore.user_id
        }

        if (weekProcessing !== talScore.week) {
          weekProcessing = talScore.week
        }

        tempScoreTAL += Number(talScore.score_tal)
      })


      talAllUserPerBulan.length > 0 && talAllUserPerBulan.forEach(el => {
        let tempTALScoreAllUserPerMinggu = 0
        // let tempObj = {}, temTALUser = 0

        el.tal.forEach(element => {
          let tempTALScorePerUserPerMinggu = 0

          element.tal.forEach(tal_score => {
            tempTALScorePerUserPerMinggu += tal_score.score_tal
          })
          tempTALScoreAllUserPerMinggu += tempTALScorePerUserPerMinggu

          // tempObj = {
          //   score: tempTALScorePerUserPerMinggu,
          //   talScore: element
          // }
        })

        el.scoreTALTeam = tempTALScoreAllUserPerMinggu / el.tal.length || 0
      })

      if (i !== 0) {
        let weekBeforeMonth = talMonthly[talMonthly.length - 1].talPerMinggu[talMonthly[talMonthly.length - 1].talPerMinggu.length - 1]
        weekBeforeMonth && talAllUserPerBulan.unshift(weekBeforeMonth)
      }

      objTAL.score_kpim_monthly = tempScoreTAL / counterPembagiTALSebulan
      objTAL.talPerMinggu = talAllUserPerBulan
      talMonthly.push(objTAL)
    }

    this._isMounted && this.setState({
      // kpimTeam: kpimMonthly,
      talTeam: talMonthly
    })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  addNewTal = () => {
    this.setState({
      statusAddNewTal: !this.state.statusAddNewTal,
      indicator_tal: '',
      weight: '',
      when: '',
      load: '',
      achievement: '',
      link: '',
    })
  }

  saveNewTal = () => {
    if ((Number(this.state.totalWeight) + Number(this.state.weight)) <= 100 && Number(this.state.load) <= 10) {
      this.setState({
        proses: true
      })
      let newData = {
        indicator_tal: this.state.indicator_tal,
        weight: this.state.weight,
        time: this.state.when,
        load: this.state.load,
        kpim_score_id: this.state.kpimTAL.kpim_score_id,

        isRepeat: 0,
        forDay: 1,
        week: this.state.weekSelected,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        user_id: this.props.userId
      }

      if (this.props.location.state) {
        newData.user_id = this.props.location.state.userId
      } else {
        newData.user_id = this.props.userId
      }

      let token = Cookies.get('POLAGROUP')
      API.post("/tal", newData, { headers: { token } })
        .then(async ({ data }) => {
          await this.fetchData(this.state.monthSelected)
          this.setState({
            indicator_tal: '',
            weight: '',
            when: '',
            load: '',
            achievement: '',
            link: '',
            statusAddNewTal: false,
            lastUpdate: new Date(),
            proses: false
          })
        })
        .catch(err => {
          this.setState({
            proses: false
          })
          swal('please try again')
        })
    } else {
      swal("Weight tal lebih dari 100", "", "warning")
    }
  }

  reset = () => {
    this.setState({
      indicator_tal: '',
      weight: '',
      when: '',
      load: '',
      achievement: '',
      link: '',
    })
  }

  getNumberOfWeek = date => {
    //yyyy-mm-dd (first date in week)
    let theDay = date
    var target = new Date(theDay);
    var dayNr = (new Date(theDay).getDay() + 6) % 7;

    target.setDate(target.getDate() - dayNr + 3);

    var jan4 = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - jan4) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

  refresh = async () => {
    await this.fetchData(this.state.monthSelected)
    this.setState({
      lastUpdate: new Date()
    })
  }

  compare = (a, b) => {
    if (Number(a.week) < Number(b.week)) {
      return -1;
    }
    if (Number(a.week) > Number(b.week)) {
      return 1;
    }
    return 0;
  }

  sortingReward = (a, b) => {
    if (Number(a.nilai_atas) < Number(b.nilai_atas)) {
      return -1;
    }
    if (Number(a.nilai_atas) > Number(b.nilai_atas)) {
      return 1;
    }
    return 0;
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid>
        <Grid container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
            <BarChartIcon />
            <p style={{ margin: 0, fontSize: 20 }}>KEY PERFORMANCE INDICATOR MATRIX {this.props.location.state && `(${this.props.location.state.fullname})`}</p>
            {/* {
              this.props.location.state && <SelectOption
                value={this.state.idBawahanSelected}
                onChange={this.handleChange('idBawahanSelected')}
                style={{ marginLeft: 10 }}
              >
                {
                  this.props.bawahan.map(user =>
                    <MenuItem value={user.user_id} key={user.user_id}>{user.fullname}</MenuItem>
                  )
                }
              </SelectOption>
            } */}
          </Grid>
          {
            this.state.monthSelected !== null && <SelectOption
              value={this.state.monthSelected}
              onChange={this.handleChange('monthSelected')}
            >
              {
                this.state.months.map((month, index) =>
                  <MenuItem value={index} key={index}>{month} {new Date().getFullYear()}</MenuItem>
                )
              }
            </SelectOption>
          }
        </Grid>
        <Grid container style={{ display: 'flex', marginBottom: 10, border: '1px solid black', borderRadius: 5 }}>
          <Grid item xs={12} md={8} style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid black', padding: 10 }}>
            <p style={{ margin: '0px 0px 5px 0px', fontSize: 18 }}>Performa KPIM</p>
            <p style={{ margin: 0, fontSize: 12 }}>performa bulan ini</p>
            <LinearProgress variant="determinate" value={this.state.persenKPIM}
              classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
            />
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: 12 }}>statistik bulan ini</p>
              <p style={{ margin: 0, fontSize: 15 }}>{`${this.state.persenKPIM}/100`}</p>
            </Grid>
          </Grid>
          <Grid item style={{ padding: 10 }}>
            <p style={{ margin: 0, fontSize: 18 }}>Reward & Cosequences :</p>
            <p style={{ margin: '5px 0px 0px 10px', fontSize: 15 }}>{this.state.currentReward}</p>
          </Grid>
        </Grid>
        <Grid container style={{ display: 'flex' }}>
          {
            this.state.kpimSelected.map((element, index) =>
              <CardIndicator data={element} key={index} refresh={this.refresh} weekSelected={this.state.weekSelected} />)
          }
        </Grid>

        {/* TAL */}
        <Grid style={{ marginTop: 10, border: '1px solid black' }}>
          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#d71149', padding: 10 }}>
            <p style={{ margin: 0, color: 'white' }}>TAL week {this.state.weekSelected}</p>
            {
              !this.props.location.state && <Button style={{ backgroundColor: 'white', color: '#d71149', height: 30, padding: '0px 10px' }} onClick={() => this.props.history.push('/kpim/tal')}>
                lihat minggu lainnya
            </Button>
            }

          </Grid>
          <Grid style={{ display: 'flex' }}>
            <Grid style={{ width: '18%', padding: 15, borderRight: '1px solid black' }}>
              <CircularProgressbar value={this.state.persenTAL} text={`${this.state.persenTAL}%`} />
            </Grid>
            <Grid style={{ width: '90%' }}>
              <Table style={{ padding: '14px 16px 14px 16px' }}>
                <TableHead style={{ backgroundColor: '#f8f8f8' }}>
                  <TableRow>
                    <TableCell style={{ width: '30%', padding: '14px 16px 14px 16px' }}>
                      Item
                    </TableCell>
                    <TableCell style={{ width: '10%', padding: '14px 16px 14px 16px' }} align="center">
                      Load
                    </TableCell>
                    <TableCell style={{ width: '15%', padding: '14px 16px 14px 16px' }} align="center">
                      When
                    </TableCell>
                    <TableCell align="center" style={{ width: '10%', padding: '14px 16px 14px 16px' }}>
                      Weight
                    </TableCell>
                    <TableCell align="center" style={{ width: '15%', padding: '14px 16px 14px 16px' }} >
                      Pencapaian
                    </TableCell>
                    <TableCell align="center" style={{ width: '20%', padding: '14px 16px 14px 16px' }}>
                      Link
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    this.state.talSelected.map((el, index) => (
                      <CardItemTAL data={el} key={index} refresh={this.refresh} weekCurrent={this.state.weekNow} />
                    ))
                  }
                  {
                    this.state.statusAddNewTal && <TableRow style={{ height: 50, marginBottom: 30 }}>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <TextField
                          value={this.state.indicator_tal}
                          onChange={this.handleChange('indicator_tal')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                          style={{ width: '100%' }}
                        />
                      </TableCell>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <TextField
                          type="number"
                          value={this.state.load}
                          onChange={this.handleChange('load')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                          error={this.state.load > 10}
                        />
                      </TableCell>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <SelectOption
                          value={this.state.when}
                          onChange={this.handleChange('when')}
                          disabled={this.state.proses}
                          style={{ width: '100%' }}
                        >
                          {
                            this.state.chooseWhen.map((el, index) =>
                              (<MenuItem value={el} key={index}>{el}</MenuItem>)
                            )
                          }
                        </SelectOption>
                      </TableCell>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <TextField
                          type="number"
                          value={this.state.weight}
                          onChange={this.handleChange('weight')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" style={{ padding: '0px 10px' }} />
                      {/* <TextField
                          value={this.state.achievement}
                          onChange={this.handleChange('achievement')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                        /> */}
                      {/* </TableCell> */}
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        {/* <TextField
                          value={this.state.link}
                          onChange={this.handleChange('link')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                        /> */}
                        <Grid style={{ display: 'flex', justifyContent: 'flex-end', margin: '15px' }}>
                          <Button color="secondary" onClick={this.addNewTal} style={{ height: 40, marginRight: 15 }} disabled={this.state.proses}>batal</Button>
                          <Button color="primary" onClick={this.saveNewTal} style={{ height: 40 }} disabled={this.state.proses}>simpan</Button>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  }


                </TableBody>
              </Table>
              {
                this.state.kpimTAL && !this.state.statusAddNewTal && this.state.validateCreateTAL && <p style={{ margin: '10px 0px 30px 10px', fontWeight: 'bold', cursor: 'pointer', width: 70 }} onClick={this.addNewTal}>+ tal baru</p>
              }

            </Grid>
          </Grid>
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
  fetchDataAllKPIM,
  fetchDataAllTAL,
  fetchDataRewardKPIM
}

const mapStateToProps = ({ loading, error, dataAllKPIM, dataAllTAL, userId, bawahan, myRewardKPIM }) => {
  return {
    loading,
    error,
    dataAllKPIM,
    dataAllTAL,
    userId,
    bawahan,
    myRewardKPIM
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardKPIM));
