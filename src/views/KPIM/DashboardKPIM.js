import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';

import {
  Grid, LinearProgress, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, MenuItem, Select as SelectOption, CircularProgress
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
      months: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      statusAddNewTal: false,
      chooseWhen: [],
      firstDateInWeek: new Date().getDate() - (new Date().getDay() - 1),

      indicator_tal: '',
      weight: '',
      when: '',
      load: '',
      achievement: '',
      link: '',

      weekSelected: null,
      monthSelected: null,

      allKPIM: [],
      kpimSelected: [],
      persenKPIM: 0,
      kpimTAL: null,
      kpimTeam: [],

      talSelected: [],
      persenTAL: 0,
      totalWeight: 0,

      lastUpdate: null,
      currentReward: '',

      validateCreateTAL: false,

      idBawahanSelected: 0,
      talTeam: [],
      prosesTAL: true,
      prosesKPIM: true,
      listBawahan: this.props.bawahan
    }
  }

  async componentDidMount() {
    this._isMounted = true

    if (this._isMounted) {
      if (this.props.location.state) {
        this.setState({
          idBawahanSelected: this.props.location.state.userId,
          weekSelected: this.getNumberOfWeek(new Date()),
          monthSelected: new Date().getMonth() + 1
        })

        let token = Cookies.get('POLAGROUP')
        let dataUser = await API.get(`/users/${this.props.location.state.userId}`, {
          headers: {
            token,
            ip: this.props.ip
          }
        })

        this.setState({ listBawahan: dataUser.data.bawahan })
        await this.fetchData(new Date().getMonth() + 1, this.getNumberOfWeek(new Date()), this.props.location.state.userId)

        await this.props.fetchDataRewardKPIM(this.props.location.state.userId)

        await this.props.myRewardKPIM.sort(this.sortingReward)

      } else if (this.props.userId) {
        this.setState({
          weekSelected: this.getNumberOfWeek(new Date()),
          monthSelected: new Date().getMonth() + 1
        })
        await this.fetchData(new Date().getMonth() + 1, this.getNumberOfWeek(new Date()), this.props.userId)

        await this.props.fetchDataRewardKPIM(this.props.userId)

        await this.props.myRewardKPIM.sort(this.sortingReward)
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    //assign tal selected for display
    if (prevState.weekSelected !== this.state.weekSelected) {
      if (prevState.weekSelected !== null) {
        await this.fetchData(this.state.monthSelected, this.state.weekSelected, this.props.location.state ? this.props.location.state.userId : this.props.userId)
      }
    }

    //assign kpim selected for display
    if (prevState.monthSelected !== this.state.monthSelected) {
      if (prevState.monthSelected !== null) {
        if (this.state.monthSelected === new Date().getMonth() + 1) {
          this.setState({
            weekSelected: this.getNumberOfWeek(new Date()),
          })
        } else {
          let mingguAwalBulan = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.monthSelected, 1))

          this.setState({
            weekSelected: mingguAwalBulan,
          })
        }
      }
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
      if (!this.props.location.state) {
        this.setState({ listBawahan: this.props.bawahan })
        await this.fetchData(new Date().getMonth() + 1, this.getNumberOfWeek(new Date()), this.props.userId)

        await this.props.fetchDataRewardKPIM(this.props.userId)

        await this.props.myRewardKPIM.sort(this.sortingReward)

        this.setState({
          weekSelected: this.getNumberOfWeek(new Date()),
          monthSelected: new Date().getMonth() + 1
        })
      }
    }

    if (prevProps.location.state !== this.props.location.state) {
      if (!this.props.location.state && prevProps.userId !== null) {
        this.setState({ listBawahan: this.props.bawahan, prosesKPIM: true, prosesTAL: true })
        await this.fetchData(new Date().getMonth() + 1, this.getNumberOfWeek(new Date()), this.props.userId)

        await this.props.fetchDataRewardKPIM(this.props.userId)

        await this.props.myRewardKPIM.sort(this.sortingReward)

        this.setState({
          weekSelected: this.getNumberOfWeek(new Date()),
          monthSelected: new Date().getMonth() + 1
        })
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchData = async (monthSelected, weekSelected, userId) => {
    let tempTAL = [], talTeam;
    await this.props.fetchDataAllKPIM({ "for-dashboard": true, year: new Date().getFullYear(), month: monthSelected, week: weekSelected, userId })

    // ===== HANDLE TAL ===== //
    let dataTAL = await this.props.dataAllKPIM.find(kpim => kpim.user_id === userId && kpim.indicator_kpim.toLowerCase() === "tal")

    dataTAL && dataTAL.tbl_kpim_scores[dataTAL.tbl_kpim_scores.length - 1].tbl_tals && await dataTAL.tbl_kpim_scores[dataTAL.tbl_kpim_scores.length - 1].tbl_tals.forEach(tal => {
      let newTAL = { ...tal, ...tal.tbl_tal_scores[0] }
      delete newTAL.tbl_tal_scores
      tempTAL.push(newTAL)
    })

    await this.fetchTALSelected(tempTAL, monthSelected, weekSelected)
    this.setState({ prosesTAL: false })
    // ===== HANDLE TAL ===== //


    // ===== HANDLE TAL TEAM ===== //
    if (this.state.listBawahan.length > 0) {
      await this.props.fetchDataAllTAL({ "for-tal-team": true, year: new Date().getFullYear(), month: monthSelected, week: weekSelected, userId: this.props.location.state ? this.props.location.state.userId : this.props.userId })

      talTeam = await this.fetchDataTALTeam(monthSelected, weekSelected)
    }
    // ==== HANDLE TAL TEAM ===== //


    // ===== HANDLE KPIM ===== //
    let allKPIM = []
    let KPIM = await this.props.dataAllKPIM.filter(kpim => kpim.user_id === userId && kpim.indicator_kpim.toLowerCase() !== "tal" && kpim.indicator_kpim.toLowerCase() !== "kpim team")
    let KPIMTeam = await this.props.dataAllKPIM.find(kpim => kpim.user_id === userId && kpim.indicator_kpim.toLowerCase() !== "tal" && kpim.indicator_kpim.toLowerCase() === "kpim team")
    let TAL = await this.props.dataAllKPIM.find(kpim => kpim.user_id === userId && kpim.indicator_kpim.toLowerCase() === "tal")
    if (KPIMTeam) allKPIM.push(KPIMTeam)

    this.setState({
      kpimSelected: []
    })

    let kpimSelected = []

    if (talTeam) kpimSelected.push(talTeam)
    if (allKPIM.length > 0) kpimSelected = [...kpimSelected, ...allKPIM]
    if (KPIM.length > 0) kpimSelected = [...kpimSelected, ...KPIM]
    if (TAL) kpimSelected.push(TAL)

    await this.fetchKPIMSelected(kpimSelected, monthSelected)
    this.setState({ prosesKPIM: false })
    // ===== HANDLE KPIM ===== //

  }

  //Untuk table tal yang bawah
  fetchTALSelected = async (data, monthSelected, weekSelected) => {
    let talSelected = data, tempPersenTAL = 0, tempTotalWeight = 0, validateCreateTAL = false
    talSelected.forEach(talWeek => {
      tempPersenTAL += (Number(talWeek.achievement) * (Number(talWeek.weight) / 100))
      tempTotalWeight += Number(talWeek.weight)
    })

    if (weekSelected >= this.getNumberOfWeek(new Date())) {
      validateCreateTAL = true
    }

    await this.fetchOptionDateInWeek(monthSelected, weekSelected)

    this._isMounted && this.setState({
      validateCreateTAL,
      talSelected,
      persenTAL: tempPersenTAL,
      totalWeight: tempTotalWeight
    })
  }

  fetchKPIMSelected = async (data, monthSelected) => {
    let kpimSelected = data, persenKPIM = 0, kpimTAL = null

    kpimSelected.length > 0 && await kpimSelected.forEach(async (kpim) => {
      if (kpim.indicator_kpim.toLowerCase() !== "tal team") {
        let kpimNow = await kpim.tbl_kpim_scores.find(kpim_score => kpim_score.month === monthSelected)
        persenKPIM += Number(kpimNow.score_kpim_monthly) * (Number(kpimNow.bobot) / 100)

        if (kpim.indicator_kpim.toLowerCase() === "tal") {
          kpimTAL = kpimNow
        }
      }
    })

    // DELETE KPIM TAL
    // kpimSelected = await kpimSelected.filter(kpim => kpim.indicator_kpim.toLowerCase() !== "tal")

    this._isMounted && this.setState({
      kpimSelected,
      persenKPIM: Math.round(persenKPIM),
      kpimTAL
    })
  }

  fetchDataTALTeam = async (monthSelected, weekSelected) => {
    let persenWeek = 0;

    // ===== FETCH TAL WEEK (START) ===== // 
    let talBawahanThisWeek = []
    this.state.listBawahan && await this.state.listBawahan.forEach(async element => { //fetch kpim per user
      let newTAL = [], tempTALScore = 0
      newTAL = await this.props.dataAllTAL.filter(el => el.user_id === element.user_id)

      await newTAL.forEach(async el => {
        let talScore = await el.tbl_tal_scores.find(tal_score => tal_score.week === weekSelected)
        if (talScore) tempTALScore += talScore.score_tal
      })
      let talBawahan = {
        fullname: element.fullname,
        score_tal: tempTALScore
      }
      talBawahanThisWeek.push(talBawahan)
      persenWeek += tempTALScore
    });
    // =====  FETCH TAL WEEK (END)  ===== // 


    // ===== FETCH TAL MONTH (START) ===== // 
    let pembagiTALTEAM = 0, tempTALScore = 0, tempWeekBawahan = [], userIdProcessing = this.props.dataAllTAL[0] ? this.props.dataAllTAL[0].user_id : null;
    await this.props.dataAllTAL.forEach(async (tal) => {
      await tal.tbl_tal_scores.forEach(tal_score => {
        tempTALScore += tal_score.score_tal
        if (tempWeekBawahan.indexOf(tal_score.week) < 0) tempWeekBawahan.push(tal_score.week)
        if (userIdProcessing !== tal.user_id) {
          userIdProcessing = tal.user_id
          pembagiTALTEAM += tempWeekBawahan.length
          tempWeekBawahan = []
        }
      })
    })
    pembagiTALTEAM += tempWeekBawahan.length

    let objTAL = {
      indicator_kpim: "TAL TEAM",
      persenMonth: Math.round(tempTALScore / pembagiTALTEAM),
      persenWeek: Math.round(persenWeek / this.state.listBawahan.length),
      month: monthSelected,
      year: "" + new Date().getFullYear(),
      talBawahanThisWeek
    }

    return objTAL
    // =====  FETCH TAL MONTH (END)  ===== // 
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

  saveNewTal = async () => {
    if ((Number(this.state.totalWeight) + Number(this.state.weight)) <= 100) {
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
      API.post("/tal", newData, {
        headers: {
          token,
          ip: this.props.ip
        }
      })
        .then(async ({ data }) => {
          await this.fetchData(this.state.monthSelected, this.state.weekSelected, this.props.location.state ? this.props.location.state.userId : this.props.userId)
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
          // console.log(err)
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

    var reference = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - reference) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

  refresh = async () => {
    await this.fetchData(this.state.monthSelected, this.state.weekSelected, this.props.location.state ? this.props.location.state.userId : this.props.userId)
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

  fetchOptionDateInWeek = (monthSelected, weekSelected) => {
    let date = []

    let awalMingguSekarang = new Date().getDate() - new Date().getDay() + 1
    let selisihMinggu = weekSelected - this.getNumberOfWeek(new Date())

    for (let i = 1; i <= 7; i++) {
      let newDate = new Date(new Date().getFullYear(), new Date().getMonth(), (awalMingguSekarang + (selisihMinggu * 7)))

      if (monthSelected === newDate.getMonth() + 1) {
        date.push(newDate.getDate())
      }
      awalMingguSekarang++
    }

    let day = ['Setiap hari']
    date.forEach(el => {
      let date = new Date(new Date().getFullYear(), monthSelected - 1, el).getDay()
      let listDay = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

      day.push(listDay[date])
    })

    this.setState({
      chooseWhen: day
    })
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
                  this.state.listBawahan.map(user =>
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
            this.state.prosesKPIM ? (
              <Grid style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', height: 128, width: '100%'
              }}>
                < CircularProgress color="secondary" />
              </Grid>
            ) : (
                this.state.kpimSelected.map((element, index) =>
                  <CardIndicator data={element} key={index} refresh={this.refresh} weekSelected={this.state.weekSelected} monthSelected={this.state.monthSelected} lastUpdate={this.state.lastUpdate} />)
              )
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
            <Grid style={{ width: '18%', padding: 15, paddingTop: 10, borderRight: '1px solid black' }}>
              {/* <p style={{ margin: 0, marginBottom: 10, textAlign: 'center' }}>Bobot: {this.state.kpimTAL ? this.state.kpimTAL.bobot : 0}</p> */}
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
                      Jam
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
                {
                  !this.state.prosesTAL && (
                    <TableBody>
                      {
                        this.state.talSelected.map((el, index) => (
                          <CardItemTAL data={el} key={index} refresh={this.refresh} weekCurrent={this.state.weekSelected} />
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
                              value={this.state.load}
                              onChange={this.handleChange('load')}
                              variant="outlined"
                              InputProps={{
                                style: { height: 35, padding: 0 }
                              }}
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
                  )
                }
              </Table>
              {
                this.state.prosesTAL && <Grid style={{ width: '100%', textAlign: 'center' }}>
                  <CircularProgress color="secondary" style={{ marginTop: 10 }} />
                </Grid>
              }
              {
                !this.state.prosesTAL && this.state.talSelected.length === 0 && <Grid style={{ width: '100%', textAlign: 'center' }}>
                  <p>harap komunikasi ke atasan untuk membuat TAL</p>
                </Grid>
              }
              {
                this.state.kpimTAL && this.state.validateCreateTAL && !this.state.statusAddNewTal && <p style={{ margin: '10px 0px 30px 10px', fontWeight: 'bold', cursor: 'pointer', width: 70 }} onClick={this.addNewTal}>+ tal baru</p>
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

const mapStateToProps = ({ loading, error, dataAllKPIM, dataAllTAL, userId, bawahan, myRewardKPIM, ip }) => {
  return {
    loading,
    error,
    dataAllKPIM,
    dataAllTAL,
    userId,
    bawahan,
    myRewardKPIM,
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardKPIM));
