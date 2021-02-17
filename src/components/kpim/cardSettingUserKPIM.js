import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';

import {
  Grid, Typography, Avatar, Button, Paper, TextField, MenuItem, FormControl, InputLabel, Select as SelectOption, Tooltip
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AddIcon from '@material-ui/icons/Add';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import StarsIcon from '@material-ui/icons/Stars';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';

import swal from 'sweetalert';

import CardSettingIndicator from './cardSettingIndicator';
import ModalReward from '../modal/modalReward';
import ModalSettingTargetKPIM from '../modal/modalSettingTargetKPIM';
import ModalSendGrade from "../modal/modalSendGrade";

import { API } from '../../config/API';

class cardSettingUserKPIM extends Component {
  state = {
    proses: false,
    isVisible: true,
    user_id: null,
    openKPIM: false,
    openTAL: false,
    statusCreateKPIM: false,
    statusCreateTAL: false,

    newIndicatorKPIM: '',
    newDataKPIM: {},

    newIndicatorTAL: '',
    isLoopingIndicatorTAL: 0,
    newOptionTimeTAL: 1,
    newTimeTAL: '',
    newBobotTAL: '',

    optionTimeTAL: [],

    openModalReward: false,
    openModalTargetKPIM: false,

    KPIM: [],
    TAL: [],
    TALMonth: null,
    bobotKPIM: 0,
    bobotTAL: 0,
    bobot: 0,
    adaBobotKPIMYangKosong: false,
    adaWeightTALYangKosong: false,

    statusSudahKirimNilai: false,
    statusValid: true,
    openModalSendGrade: false,

    editBobotTAL: false
  }

  async componentDidMount() {
    await this.fetchData()

    let listDate = await this.fetchOptionDateInWeek()
    let thereDate20 = listDate.includes(20)
    let day = []

    listDate.forEach(el => {
      let date = new Date(new Date().getFullYear(), this.props.month - 1, el).getDay()
      let listDay = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

      day.push(listDay[date])
    })
    this.setState({
      optionTimeTAL: day
    })

    if ((this.state.KPIM.length === 0 && this.state.TAL.length === 0) || this.state.bobotKPIM < 100 || this.state.bobotTAL < 100 || this.state.adaBobotKPIMYangKosong || this.state.adaWeightTALYangKosong) {
      this.props.setNeedAction(this.props.data.user_id)
      // this.setState({
      //   statusValid: false
      // })
    }
    else {
      this.setState({
        isVisible: false,
      })
    }
console.log(this.props.month)
    // if ((new Date().getDate() < 27 && (new Date().getMonth() + 1) === Number(this.props.month)) ||
    //   ((new Date().getMonth() + 1) > Number(this.props.month) && this.props.lastWeekInMonth !== this.props.week)
    //  new Date(2021, 2, -2) <= new Date(2021, 2, 8) && new Date(2021, 2, 8) <= new Date(2021, 2, 7)
    // ) {
    if ((new Date().getDate() <= 20 && ((new Date().getMonth() + 1) === Number(this.props.month)) && thereDate20)) {
      this.setState({
        statusValid: false
      })
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.openKPIM !== this.state.openKPIM) {
      if (!this.state.openKPIM) {
        this.setState({
          statusCreateKPIM: false
        })
      }
    }

    if (prevState.openTAL !== this.state.openTAL) {
      if (!this.state.openTAL) {
        this.setState({
          statusCreateTAL: false
        })
      }
    }

    if (prevProps.data !== this.props.data) {
      await this.fetchData()
      let listDate = await this.fetchOptionDateInWeek()
      let thereDate20 = listDate.includes(20)

      if ((this.state.KPIM.length === 0 && this.state.TAL.length === 0) || this.state.bobotKPIM < 100 || this.state.bobotTAL < 100 || this.state.adaBobotKPIMYangKosong || this.state.adaWeightTALYangKosong) {
        this.props.setNeedAction(this.props.data.user_id)
        // this.setState({
        //   statusValid: false
        // })
      } else {
        this.setState({
          isVisible: false,
          statusValid: true
        })
      }

      // if ((new Date().getDate() < 27 && (new Date().getMonth() + 1) === Number(this.props.month)) ||
      //   ((new Date().getMonth() + 1) > Number(this.props.month) && this.props.lastWeekInMonth !== this.props.week)) {
      if (((new Date().getDate() <= 20 || !thereDate20) && ((new Date().getMonth() + 1) === Number(this.props.month))) || ((new Date().getMonth() + 1) > Number(this.props.month) && !thereDate20) || (new Date().getMonth() + 1) < Number(this.props.month)) {
        this.setState({
          statusValid: false
        })
      }
      else {
        this.setState({
          statusValid: true
        })
      }
    }

    if (prevProps.week !== this.props.week || prevProps.month !== this.props.month) {
      let listDate = this.fetchOptionDateInWeek()
      if (this.state.newOptionTimeTAL === 0) {
        this.setState({
          optionTimeTAL: listDate
        })
      } else {
        let day = []

        listDate.forEach(el => {
          let date = new Date(new Date().getFullYear(), this.props.month - 1, el).getDay()
          let listDay = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

          day.push(listDay[date])
        })

        this.setState({
          optionTimeTAL: day
        })
      }
      this.fetchData()
    }
  }

  fetchData = async () => {
    let tempKPIM = [], tempTAL = [], tempBobotKPIM = 0, tempBobotTAL = 0, tempTALMonth = null, statusSudahKirimNilai = false
    this.setState({
      proses: true,
      statusCreateKPIM: false,
      statusCreateTAL: false,
      KPIM: [],
      adaBobotKPIMYangKosong: false,
      adaWeightTALYangKosong: false
    })

    await this.props.data.kpim.forEach(async (kpim) => {
      let kpimCurrentMonth = await kpim.tbl_kpim_scores.find(el => el.month === this.props.month)
      if (kpimCurrentMonth) {
        let newScoreKPIM = {
          kpim_id: kpim.kpim_id,
          kpim_score_id: kpimCurrentMonth.kpim_score_id,
          indicator_kpim: kpim.indicator_kpim,
          target: kpim.target,
          unit: kpim.unit,
          pencapaian: kpim.pencapaian,
          year: kpim.year,
          month: kpimCurrentMonth.month,
          target_monthly: kpimCurrentMonth.target_monthly,
          pencapaian_monthly: kpimCurrentMonth.pencapaian_monthly,
          score_kpim_monthly: kpimCurrentMonth.score_kpim_monthly,
          bobot: kpimCurrentMonth.bobot,
          score: kpimCurrentMonth.score,
          kpimScore: kpim.kpimScore,
          user_id: kpim.user_id,
          hasConfirm: kpimCurrentMonth.hasConfirm,
          targetInverse: kpim.is_inverse
        }
        tempKPIM.push(newScoreKPIM)

        if (kpimCurrentMonth.bobot) tempBobotKPIM += kpimCurrentMonth.bobot
        else this.setState({ adaBobotKPIMYangKosong: true })

        if (kpimCurrentMonth.hasConfirm) statusSudahKirimNilai = true
      }
    });

    let talList = await this.props.data.kpim.find(el => el.indicator_kpim.toLowerCase() === 'tal')

    talList && talList.tbl_kpim_scores[talList.tbl_kpim_scores.length - 1] && talList.tbl_kpim_scores[talList.tbl_kpim_scores.length - 1].tbl_tals &&
      await talList.tbl_kpim_scores[talList.tbl_kpim_scores.length - 1].tbl_tals.forEach(element => {
        let newTAL = {
          indicator_tal: element.indicator_tal,
          kpim_score_id: element.kpim_score_id,
          tal_id: element.tal_id,
          ...element.tbl_tal_scores[0]
        }
        tempTAL.push(newTAL)

        if (element.tbl_tal_scores[0].weight) tempBobotTAL += Number(element.tbl_tal_scores[0].weight)
        else this.setState({ adaWeightTALYangKosong: true })
      });

    tempTALMonth = await tempKPIM.find(kpim => kpim.indicator_kpim === 'TAL')

    tempKPIM = await tempKPIM.filter(kpim => kpim.indicator_kpim !== 'TAL')

    this.setState({
      KPIM: tempKPIM,
      TALMonth: tempTALMonth,
      TAL: tempTAL,
      user_id: this.props.data.user_id,
      bobotKPIM: tempBobotKPIM,
      bobotTAL: tempBobotTAL,
      statusSudahKirimNilai,
      proses: false
    })

    if (tempTALMonth) {
      this.setState({
        bobot: tempTALMonth.bobot
      })
    }
  }

  handleOpenCloseKPIM = () => {
    this.setState({ openKPIM: !this.state.openKPIM })
  }

  handleOpenCloseTAL = () => {
    this.setState({ openTAL: !this.state.openTAL })
  }

  handleCreateKPIM = () => {
    this.setState({ openKPIM: true, statusCreateKPIM: !this.state.statusCreateKPIM })
  }

  handleCreateTAL = () => {
    this.setState({ openTAL: true, statusCreateTAL: !this.state.statusCreateTAL })
  }

  handleChange = name => event => {
    if (name === "newOptionTimeTAL") {
      let day = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

      if (event.target.value === 1) {
        this.setState({
          optionTimeTAL: day,
          [name]: event.target.value
        })
      } else if (event.target.value === 0) {
        this.setState({
          [name]: event.target.value,
          optionTimeTAL: this.fetchOptionDateInWeek()
        })
      }
    } else {
      this.setState({ [name]: event.target.value });
    }
  };

  fetchOptionDateInWeek = () => {
    let date = []

    let awalMingguSekarang = new Date().getDate() - new Date().getDay() + 1
    let selisihMinggu = this.props.week - this.getNumberOfWeek(new Date())
    for (let i = 1; i <= 7; i++) {
      let newDate = new Date(new Date().getFullYear(), new Date().getMonth(), (awalMingguSekarang + (selisihMinggu * 7)))

      if (this.props.month === newDate.getMonth() + 1) {
        date.push(newDate.getDate())
      }
      awalMingguSekarang++
    }

    return date
  }

  openModalReward = () => {
    this.setState({
      openModalReward: true
    })
  }

  closeModalReward = () => {
    this.setState({
      openModalReward: false
    })
  }

  openModalTargetKPIM = () => {
    this.setState({
      openModalTargetKPIM: true
    })
  }

  closeModalTargetKPIM = () => {
    this.setState({
      openModalTargetKPIM: false
    })
  }

  setNewDataKPIM = data => {
    this.setState({ newDataKPIM: data, openModalTargetKPIM: false })
  }

  createNewKPIM = async () => {
    let token = Cookies.get('POLAGROUP')
    this.setState({ proses: true })
    let newData = this.state.newDataKPIM

    if (!newData.year) newData.year = new Date().getFullYear()

    if ((newData.target && newData.unit && newData.monthly) || this.state.newIndicatorKPIM.toLowerCase() === "tal") {
      newData.user_id = this.state.user_id
      newData.indicator_kpim = this.state.newIndicatorKPIM
      newData.month = this.props.month
      API.post('/kpim', newData, {
        headers: {
          token,
          ip: this.props.ip
        }
      })
        .then(async data => {
          swal("Tambah indicator KPIM success", "", "success")
          this.setState({
            newIndicatorKPIM: '',
            newDataKPIM: {},
            statusCreateKPIM: false
          })
          this.props.refresh()
        })
        .catch(err => {
          if (err.message === "Request failed with status code 400") {
            swal('Indicator TAL sudah ada')
          } else {
            swal('please try again')
          }
        })
    } else {
      swal("Setting target terlebih dahulu")
    }
    this.setState({ proses: false })
  }

  createNewTAL = async () => {
    let statusOverBobot = false
    this.setState({ proses: true })

    let newWeight = Number(this.state.bobotTAL) + Number(this.state.newBobotTAL)
    let listDate = await this.fetchOptionDateInWeek()
    let thereDate20 = listDate.includes(20)

    if (newWeight > 100 && !thereDate20) {
      statusOverBobot = true
    }

    if (!statusOverBobot) {
      let token = Cookies.get('POLAGROUP')
      let weekNow = this.getNumberOfWeek(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
      let firstDateInWeekNow = this.props.firstDateInWeek

      if (this.props.week !== weekNow) {
        let bedaMinggu = this.props.week - weekNow
        let newFirstDateInWeek = new Date(new Date().getFullYear(), new Date().getMonth(), (firstDateInWeekNow + (bedaMinggu * 7)))

        firstDateInWeekNow = newFirstDateInWeek.getDate()
      }
      let newData = {
        indicator_tal: this.state.newIndicatorTAL,
        isRepeat: this.state.isLoopingIndicatorTAL,
        forDay: this.state.newOptionTimeTAL,
        time: this.state.newTimeTAL,
        weight: this.state.newBobotTAL,
        week: this.props.week,
        month: this.props.month,
        year: new Date().getFullYear(),
        user_id: this.state.user_id,
        firstDateInWeek: firstDateInWeekNow,
        kpim_score_id: this.state.TALMonth.kpim_score_id
      }

      API.post('/tal', newData, {
        headers: {
          token,
          ip: this.props.ip
        }
      })
        .then(async data => {
          swal("Tambah indicator TAL success", "", "success")
          this.setState({
            statusCreateTAL: false,
            newIndicatorTAL: '',
            isLoopingIndicatorTAL: 0,
            newOptionTimeTAL: 1,
            newTimeTAL: '',
            newBobotTAL: '',
          })
          this.props.refresh()
        })
        .catch(err => {
          swal('please try again')
        })
    } else {
      swal("Bobot TAL lebih dari 100", "", "warning")
    }
    this.setState({ proses: false })
  }

  refresh = () => {
    this.props.refresh()
  }

  updateKPIMMonthly = async (event) => {
    event.preventDefault()
    let token = Cookies.get('POLAGROUP')
    this.setState({ proses: true })

    let newData = {
      bobot: this.state.bobot,
    }

    API.put(`/kpim/${this.state.TALMonth.kpim_score_id}?update=month`, newData, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(data => {
        this.setState({
          editBobotTAL: false,
          proses: false
        })

        this.props.refresh()
      })
      .catch(err => {
        swal('please try again')
      })
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

  kirimNilai = () => {
    swal({
      title: "Apa anda yakin ingin mengirim nilainya?",
      text: "Jika nilai sudah dikirim, nilai tidak dapat diubah kembali",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (yesAnswer) => {
        if (yesAnswer) {
          this.setState({ proses: true })
          let arrayKPIMScoreId = []
          let token = Cookies.get("POLAGROUP")

          this.props.data.kpim.forEach(kpim => {
            kpim.tbl_kpim_scores.forEach(kpimScore => {
              arrayKPIMScoreId.push(kpimScore.kpim_score_id)
            })
          })

          API.put('/kpim/sendGrade', { arrayKPIMScoreId }, {
            headers: {
              token,
              ip: this.props.ip
            }
          })
            .then(({ data }) => {
              this.setState({
                openModalSendGrade: false
              })
              swal("Kirim nilai sukses!", "", "success")
              this.props.refresh()
            })
            .catch(err => {
              swal("Please try again")
            })
          this.setState({ proses: false })
        }
      });
  }

  openModalSendGrade = () => {
    this.setState({
      openModalSendGrade: true
    })
  }

  closeModalSendGrade = () => {
    this.setState({
      openModalSendGrade: false
    })
  }

  handleEditIndicatorTAL = () => {
    this.setState({
      editBobotTAL: !this.state.editBobotTAL
    })
  }

  render() {
    function getMonth(args) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months[Number(args) - 1]
    }

    return (this.props.status || this.state.isVisible) && (
      <>
        <Grid style={{ marginTop: 30, position: 'relative' }}>
          <div style={{ width: 300, height: 80, backgroundColor: '#d71149', zIndex: -1, position: 'absolute', marginTop: 20, display: 'flex', justifyContent: 'flex-end' }} />
          <Grid style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 10 }}>
            <Avatar alt="Travis Howard" src="http://api.polagroup.co.id/uploads/icon_user.png" style={{ marginBottom: 5, marginLeft: 10, width: 50, height: 50 }} />
            <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 220, marginTop: 15 }}>
              <p style={{ color: 'white', margin: '0px 0px 0px 10px', zIndex: 1 }}>{this.props.data.fullname}</p>
              <Button onClick={this.openModalReward} style={{ padding: 0, minWidth: 24, borderRadius: 10 }}>
                <StarsIcon style={{ color: 'white' }} />
              </Button>
            </Grid>
            {/* {
              !this.state.statusSudahKirimNilai && this.state.statusValid &&  */}
              <Button style={{ margin: '0px 0px 0px 30px' }} variant="contained" color="secondary" onClick={this.kirimNilai} disabled={this.state.proses}>
                Kirim Nilai
            </Button>
            {/* } */}
          </Grid>

          <Grid style={{ marginLeft: 20 }}>
            {/* KPIM */}
            <Grid style={{ marginBottom: 10, marginTop: 2 }}>

              <Paper id="header" style={{ display: 'flex', padding: '10px 20px', justifyContent: 'space-between', marginBottom: 5 }} >
                <Grid style={{ display: 'flex' }}>
                  <Typography style={{ marginRight: 20 }}>KPIM</Typography>
                  {/* {
                    (
                      ((this.state.KPIM.length === 0 && !this.state.TALMonth) && !this.state.statusSudahKirimNilai) ||
                      ((!this.state.statusCreateKPIM && this.state.KPIM.length < 4 && this.props.weekCurrent <= (this.getNumberOfWeek(new Date(new Date().getFullYear(), this.props.month - 1, 1)) + 1)) && !this.state.statusSudahKirimNilai)

                    ) &&  */}
                  {
                    this.state.KPIM.length < 6 && <Button onClick={this.handleCreateKPIM}
                      style={{ borderRadius: 15, minWidth: 24, backgroundColor: '#e0e0e0', padding: 0 }} disabled={this.state.proses}>
                      <AddIcon />
                    </Button>
                  }

                  {/* } */}
                  {
                    this.state.KPIM.length === 0 && !this.state.TALMonth && <>
                      <ErrorOutlineOutlinedIcon style={{ color: 'white', backgroundColor: '#d71149', borderRadius: 15, margin: '0px 0px 0px 20px' }} />
                      <p style={{ margin: '0px 0px 0px 10px', color: '#d71149' }}>KPIM KOSONG</p>
                    </>
                  }
                  {
                    ((this.state.bobotKPIM < 100 && this.state.KPIM.length !== 0) || (this.state.bobotKPIM < 100 && this.state.KPIM.length === 0 && this.state.TALMonth)) && <>
                      <ErrorOutlineOutlinedIcon style={{ color: 'white', backgroundColor: '#d71149', borderRadius: 15, margin: '0px 0px 0px 20px' }} />
                      <p style={{ margin: '0px 0px 0px 10px', color: '#d71149' }}>Bobot KPIM belum 100%</p>
                    </>
                  }
                  {
                    this.state.bobotKPIM >= 100 && this.state.adaBobotKPIMYangKosong && <>
                      <ErrorOutlineOutlinedIcon style={{ color: 'white', backgroundColor: '#d71149', borderRadius: 15, margin: '0px 0px 0px 20px' }} />
                      <p style={{ margin: '0px 0px 0px 10px', color: '#d71149' }}>Bobot KPIM ada yang masih 0</p>
                    </>
                  }
                  {
                    this.state.TAL.length === 0 && <>
                      <ErrorOutlineOutlinedIcon style={{ color: 'white', backgroundColor: '#d71149', borderRadius: 15, margin: '0px 0px 0px 20px' }} />
                      <p style={{ margin: '0px 0px 0px 10px', color: '#d71149' }}>TAL KOSONG</p>
                    </>
                  }
                  {
                    this.state.TAL.length > 0 && this.state.bobotTAL < 100 && <>
                      <ErrorOutlineOutlinedIcon style={{ color: 'white', backgroundColor: '#d71149', borderRadius: 15, margin: '0px 0px 0px 20px' }} />
                      <p style={{ margin: '0px 0px 0px 10px', color: '#d71149' }}>Bobot TAL belum 100%</p>
                    </>
                  }
                  {
                    this.state.bobotTAL >= 100 && this.state.adaWeightTALYangKosong && <>
                      <ErrorOutlineOutlinedIcon style={{ color: 'white', backgroundColor: '#d71149', borderRadius: 15, margin: '0px 0px 0px 20px' }} />
                      <p style={{ margin: '0px 0px 0px 10px', color: '#d71149' }}>Bobot TAL ada yang masih 0</p>
                    </>
                  }
                </Grid>
                {
                  (this.state.KPIM.length !== 0 || this.state.TALMonth) && <>
                    <Button onClick={this.handleOpenCloseKPIM}
                      style={{ borderRadius: 15, minWidth: 24, padding: 0 }} disabled={this.state.proses} >
                      {
                        this.state.openKPIM
                          ? <ExpandLessIcon />
                          : <ExpandMoreIcon />
                      }
                    </Button>
                  </>
                }
              </Paper>

              {/* PANEL KPIM */}
              {
                this.state.openKPIM && this.state.KPIM.map((el, index) =>
                  <CardSettingIndicator data={el} status="KPIM" key={index} refresh={this.refresh} bobotKPIM={this.state.bobotKPIM} bobotTAL={this.state.bobotTAL} />
                )
              }


              {/* FROM ADD NEW KPIM */}
              {
                this.state.statusCreateKPIM && <Paper style={{ marginBottom: 2, padding: '5px 10px 5px 20px', display: 'flex', alignItems: 'center' }}>
                  <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <TextField
                      placeholder="indicator KPIM. (e.g. TAL)"
                      value={this.state.newIndicatorKPIM}
                      onChange={this.handleChange('newIndicatorKPIM')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, padding: 0 }
                      }}
                      style={{ width: '70%' }}
                      autoFocus={true}
                      disabled={this.state.proses}
                    />
                    <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.openModalTargetKPIM} disabled={this.state.proses}>
                      setting target
                    </Button>
                    <Grid>
                      <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.createNewKPIM} disabled={this.state.proses}>
                        <SaveOutlinedIcon />
                      </Button>
                      <Button style={{ borderRadius: 5, minWidth: 40, color: 'red' }} onClick={this.handleCreateKPIM} disabled={this.state.proses}>
                        <CancelPresentationOutlinedIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              }


              {/* TAL */}
              {
                this.state.openKPIM && this.state.TALMonth && <>

                  <Paper id="header" style={{ display: 'flex', padding: '10px 20px', justifyContent: 'space-between', marignTop: 10 }}>
                    <Grid style={{ display: 'flex', alignItems: 'center' }}>
                      {
                        this.state.TALMonth && <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>{getMonth(this.state.TALMonth.month)}</p>
                      }
                      <Typography style={{ marginRight: 20 }}>TAL</Typography>
                      {/* { */}
                      {/* (this.state.TAL.length === 0 || (!this.state.statusCreateTAL && this.props.weekCurrent <= this.props.week)) && <Button onClick={this.handleCreateTAL} */}

                      {/* (!this.state.statusCreateTAL && this.props.weekCurrent <= this.props.week && !this.state.statusSudahKirimNilai) &&  */}
                      <Button onClick={this.handleCreateTAL}
                        style={{ borderRadius: 15, minWidth: 24, backgroundColor: '#e0e0e0', padding: 0 }} disabled={this.state.proses}>
                        <AddIcon />
                      </Button>
                      {/* } */}
                      <p style={{ margin: '0px 0px 0px 20px' }}>Total bobot TAL saat ini : {this.state.bobotTAL}</p>
                    </Grid>

                    <Grid style={{ display: 'flex' }}>
                      {
                        ((this.state.TALMonth && this.state.TALMonth.bobot > 0) && !this.state.editBobotTAL) && <Grid style={{ display: 'flex', margin: '0px 20px 0px 0px', alignItems: 'center' }}>
                          <p style={{ margin: '0px 5px 0px 0px' }}>bobot: {this.state.TALMonth.bobot}</p>
                          <Tooltip title="Edit" aria-label="edit">
                            <Button style={{ borderRadius: 3, minWidth: 24, padding: 3 }} onClick={this.handleEditIndicatorTAL} disabled={this.state.proses}>
                              <EditIcon />
                            </Button>
                          </Tooltip>
                        </Grid>
                      }
                      {
                        ((this.state.TALMonth && (this.state.TALMonth.bobot === 0 || this.state.TALMonth.bobot === null)) || this.state.editBobotTAL) && <form onSubmit={this.updateKPIMMonthly}>
                          <TextField
                            type="number"
                            label="Bobot"
                            value={this.state.bobot}
                            onChange={this.handleChange('bobot')}
                            variant="outlined"
                            InputProps={{
                              style: { height: 35, padding: 0 }
                            }}
                            style={{ width: 85, margin: '0px 5px 0px 0px' }}
                            disabled={this.state.proses}
                          />
                          <Button style={{ borderRadius: 5, minWidth: 40, color: 'green', marginRight: 5 }} onClick={this.updateKPIMMonthly} disabled={this.state.proses}>
                            <SaveOutlinedIcon />
                          </Button>
                          {
                            this.state.editBobotTAL && <Button style={{ borderRadius: 5, minWidth: 40, color: 'red', marginRight: 10 }} onClick={this.handleEditIndicatorTAL} disabled={this.state.proses}>
                              <CancelPresentationOutlinedIcon />
                            </Button>
                          }

                        </form>
                      }
                      {
                        this.state.TAL.length !== 0 &&
                        <Button onClick={this.handleOpenCloseTAL}
                          style={{ borderRadius: 15, minWidth: 24, padding: 0 }} disabled={this.state.proses} >
                          {
                            this.state.openTAL
                              ? <ExpandLessIcon />
                              : <ExpandMoreIcon />
                          }
                        </Button>
                      }
                    </Grid>

                  </Paper>

                  {/* PANEL TAL */}
                  {
                    this.state.openTAL && this.state.TAL.map((el, index) =>
                      <CardSettingIndicator status="TAL" data={el} refresh={this.refresh} key={index} week={this.props.week} bobotKPIM={this.state.bobotKPIM} bobotTAL={this.state.bobotTAL} month={this.props.month}
                      />
                    )
                  }


                  {/* FROM ADD NEW TAL */}
                  {
                    this.state.statusCreateTAL && <Paper style={{ marginBottom: 2, padding: '5px 10px 5px 20px', display: 'flex', alignItems: 'center', marginLeft: 34, height: 70, marginTop: 5 }}>
                      <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>w{this.props.week}</p>
                      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <TextField
                          placeholder="item TAL"
                          value={this.state.newIndicatorTAL}
                          onChange={this.handleChange('newIndicatorTAL')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                          style={{ width: '35%' }}
                          autoFocus={true}
                          disabled={this.state.proses}
                        />

                        <FormControl variant="outlined" style={{ width: '15%' }}>
                          <InputLabel>Perulangan</InputLabel>
                          <SelectOption
                            value={this.state.isLoopingIndicatorTAL}
                            onChange={this.handleChange('isLoopingIndicatorTAL')}
                            disabled={this.state.proses}
                          >
                            <MenuItem value={0}>1x</MenuItem>
                            <MenuItem value={1}>Setiap</MenuItem>
                          </SelectOption>
                        </FormControl>

                        <FormControl variant="outlined" style={{ width: '15%' }}>
                          <InputLabel>Ket Waktu</InputLabel>
                          <SelectOption
                            value={this.state.newOptionTimeTAL}
                            onChange={this.handleChange('newOptionTimeTAL')}
                            disabled={this.state.proses}
                          >
                            <MenuItem value={0}>Tanggal</MenuItem>
                            <MenuItem value={1}>Hari</MenuItem>
                          </SelectOption>
                        </FormControl>

                        <FormControl variant="outlined" style={{ width: '10%' }}>
                          <InputLabel>Waktu</InputLabel>
                          <SelectOption
                            value={this.state.newTimeTAL}
                            onChange={this.handleChange('newTimeTAL')}
                            disabled={this.state.proses}
                          >
                            {
                              this.state.optionTimeTAL.map((el, index) =>
                                <MenuItem value={el} key={index}>{el}</MenuItem>
                              )
                            }
                          </SelectOption>
                        </FormControl>

                        <TextField
                          placeholder="bobot"
                          value={this.state.newBobotTAL}
                          onChange={this.handleChange('newBobotTAL')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                          style={{ width: '10%' }}
                          disabled={this.state.proses}
                        />
                        <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.createNewTAL} disabled={this.state.proses}>
                          <SaveOutlinedIcon />
                        </Button>
                        <Button style={{ borderRadius: 5, minWidth: 40, color: 'red' }} onClick={this.handleCreateTAL} disabled={this.state.proses}>
                          <CancelPresentationOutlinedIcon />
                        </Button>
                      </Grid>
                    </Paper>
                  }

                </>
              }
            </Grid>
          </Grid>
        </Grid>

        {
          this.state.openModalReward && <ModalReward status={this.state.openModalReward} closeModal={this.closeModalReward} data={this.props.data.rewardKPIM} refresh={this.props.refresh} userId={this.props.data.user_id} />
        }

        {
          this.state.openModalTargetKPIM && <ModalSettingTargetKPIM status={this.state.openModalTargetKPIM} closeModal={this.closeModalTargetKPIM} indicator={this.state.newIndicatorKPIM} submitForm={this.setNewDataKPIM} month={this.props.month} KPIMLength={this.state.KPIM.length} TALLength={this.state.TAL.length} />
        }

        {
          this.state.openModalSendGrade && <ModalSendGrade status={this.state.openModalSendGrade} kirimNilai={this.kirimNilai} closeModalSendGrade={this.closeModalSendGrade} />
        }
      </>
    )
  }
}

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps)(cardSettingUserKPIM)