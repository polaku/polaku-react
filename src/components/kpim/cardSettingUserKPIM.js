import React, { Component } from 'react';
import Cookies from 'js-cookie';

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

export default class cardSettingUserKPIM extends Component {
  state = {
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

    optionTimeTAL: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],

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

    if ((this.state.KPIM.length === 0 && this.state.TAL.length === 0) || this.state.bobotKPIM < 100 || this.state.bobotTAL < 100 || this.state.adaBobotKPIMYangKosong || this.state.adaWeightTALYangKosong) {
      this.props.setNeedAction(this.props.data.user_id)
      this.setState({
        statusValid: false
      })
    } else {
      this.setState({
        isVisible: false,
      })
    }

    if (new Date().getDate() < 27) {
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
      if ((this.state.KPIM.length === 0 && this.state.TAL.length === 0) || this.state.bobotKPIM < 100 || this.state.bobotTAL < 100 || this.state.adaBobotKPIMYangKosong || this.state.adaWeightTALYangKosong) {

        this.props.setNeedAction(this.props.data.user_id)
        this.setState({
          statusValid: false
        })

      } else {
        this.setState({
          isVisible: false
        })
      }

      if (new Date().getDate() < 27) {
        this.setState({
          statusValid: false
        })
      }
    }
  }

  fetchData = async () => {
    let tempKPIM = [], tempTAL = [], user_id, tempBobotKPIM = 0, tempBobotTAL = 0, tempTALMonth = null, statusSudahKirimNilai = false
    this.setState({
      statusCreateKPIM: false,
      statusCreateTAL: false,
      KPIM: [],
      adaBobotKPIMYangKosong: false,
      adaWeightTALYangKosong: false
    })

    await this.props.data.kpim.forEach(kpim => {
      kpim.score.forEach(element => {
        let newScoreKPIM = {
          kpim_id: kpim.kpim_id,
          kpim_score_id: element.kpim_score_id,
          indicator_kpim: kpim.indicator_kpim,
          target: kpim.target,
          unit: kpim.unit,
          pencapaian: kpim.pencapaian,
          year: kpim.year,
          month: element.month,
          target_monthly: element.target_monthly,
          pencapaian_monthly: element.pencapaian_monthly,
          bobot: element.bobot,
          score: element.score,
          kpimScore: kpim.kpimScore,
          user_id: kpim.user_id,
          hasConfirm: element.hasConfirm
        }
        tempKPIM.push(newScoreKPIM)

        if (element.bobot) tempBobotKPIM += element.bobot
        else this.setState({ adaBobotKPIMYangKosong: true })

        if (element.hasConfirm) statusSudahKirimNilai = true
      });
    });
    user_id = this.props.data.user_id
    await this.props.data.tal.forEach(tal => {
      tal.score.forEach(element => {
        element.indicator_tal = tal.indicator_tal
        tempTAL.push(element)
        if (element.weight) tempBobotTAL += Number(element.weight)
        else this.setState({ adaWeightTALYangKosong: true })
      });
    });

    tempTALMonth = await tempKPIM.find(kpim => kpim.indicator_kpim === 'TAL')
    tempTALMonth && delete tempTALMonth.kpimScore

    tempKPIM = await tempKPIM.filter(kpim => kpim.indicator_kpim !== 'TAL')
    this.setState({
      KPIM: tempKPIM,
      TALMonth: tempTALMonth,
      TAL: tempTAL,
      user_id,
      bobotKPIM: tempBobotKPIM,
      bobotTAL: tempBobotTAL,
      statusSudahKirimNilai
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
      let date = []
      let awalMinggu = new Date().getDate() - new Date().getDay() + 1
      let akhirMinggu = awalMinggu + 6

      for (let i = awalMinggu; i <= akhirMinggu; i++) {
        date.push(i)
      }

      if (event.target.value === 1) {
        this.setState({
          optionTimeTAL: day,
          [name]: event.target.value
        })
      } else if (event.target.value === 0) {
        this.setState({
          optionTimeTAL: date,
          [name]: event.target.value
        })
      }
    } else {
      this.setState({ [name]: event.target.value });
    }
  };

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

  createNewKPIM = () => {
    let token = Cookies.get('POLAGROUP')
    let newData = this.state.newDataKPIM

    if (!newData.year) newData.year = new Date().getFullYear()

    if ((newData.target && newData.unit && newData.monthly) || this.state.newIndicatorKPIM.toLowerCase() === "tal") {
      newData.user_id = this.state.user_id
      newData.indicator_kpim = this.state.newIndicatorKPIM
      newData.month = this.props.month

      API.post('/kpim', newData, { headers: { token } })
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

  }

  createNewTAL = () => {
    let statusOverBobot = false

    let newWeight = Number(this.state.bobotTAL) + Number(this.state.newBobotTAL)

    if (newWeight > 100) {
      statusOverBobot = true
    }

    if (!statusOverBobot) {
      let token = Cookies.get('POLAGROUP')
      let weekNow = this.getNumberOfWeek(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
      let firstDateInWeekNow = this.props.firstDateInWeek

      if (this.props.week !== weekNow) {
        let bedaMinggu = this.props.week - weekNow
        let newFirstDateInWeek = new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDate() + (bedaMinggu * 7)))

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

      API.post('/tal', newData, { headers: { token } })
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
  }

  refresh = () => {
    this.props.refresh()
  }

  updateKPIMMonthly = event => {
    event.preventDefault()
    let token = Cookies.get('POLAGROUP')

    let newData = {
      bobot: this.state.bobot,
    }
    
    API.put(`/kpim/${this.state.TALMonth.kpim_score_id}?update=month`, newData, { headers: { token } })
      .then(data => {
        this.setState({
          editBobotTAL: false
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

    var jan4 = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - jan4) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

  kirimNilai = () => {
    let arrayKPIMScoreId = []
    let token = Cookies.get("POLAGROUP")

    this.props.data.kpim.forEach(kpim => {
      kpim.score.forEach(kpimScore => {
        arrayKPIMScoreId.push(kpimScore.kpim_score_id)
      })
    })

    API.put('/kpim/sendGrade', { arrayKPIMScoreId }, { headers: { token } })
      .then(data => {
        this.setState({
          openModalSendGrade: false
        })
        swal("Kirim nilai sukses!", "", "success")
        this.props.refresh()
      })
      .catch(err => {
        swal("Please try again")
      })

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
            {
              !this.state.statusSudahKirimNilai && this.state.statusValid && <Button style={{ margin: '0px 0px 0px 30px' }} variant="contained" color="secondary" onClick={this.kirimNilai}>
                Kirim Nilai
            </Button>
            }
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
                    <Button onClick={this.handleCreateKPIM}
                      style={{ borderRadius: 15, minWidth: 24, backgroundColor: '#e0e0e0', padding: 0 }} >
                      <AddIcon />
                    </Button>
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
                      style={{ borderRadius: 15, minWidth: 24, padding: 0 }} >
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
                    />
                    <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.openModalTargetKPIM}>
                      setting target
                    </Button>
                    <Grid>
                      <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.createNewKPIM}>
                        <SaveOutlinedIcon />
                      </Button>
                      <Button style={{ borderRadius: 5, minWidth: 40, color: 'red' }} onClick={this.handleCreateKPIM}>
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
                          style={{ borderRadius: 15, minWidth: 24, backgroundColor: '#e0e0e0', padding: 0 }} >
                          <AddIcon />
                        </Button>
                      {/* } */}
                    </Grid>

                    <Grid style={{ display: 'flex' }}>
                      {
                        ((this.state.TALMonth && this.state.TALMonth.bobot > 0) && !this.state.editBobotTAL) && <Grid style={{ display: 'flex', margin: '0px 20px 0px 0px', alignItems: 'center' }}>
                          <p style={{ margin: '0px 5px 0px 0px' }}>bobot: {this.state.TALMonth.bobot}</p>
                          <Tooltip title="Edit" aria-label="edit">
                            <Button style={{ borderRadius: 3, minWidth: 24, padding: 3 }} onClick={this.handleEditIndicatorTAL}>
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
                          />
                          <Button style={{ borderRadius: 5, minWidth: 40, color: 'green', marginRight: 5 }} onClick={this.updateKPIMMonthly}>
                            <SaveOutlinedIcon />
                          </Button>
                          {
                            this.state.editBobotTAL && <Button style={{ borderRadius: 5, minWidth: 40, color: 'red', marginRight: 10 }} onClick={this.handleEditIndicatorTAL}>
                              <CancelPresentationOutlinedIcon />
                            </Button>
                          }

                        </form>
                      }
                      {
                        this.state.TAL.length !== 0 &&
                        <Button onClick={this.handleOpenCloseTAL}
                          style={{ borderRadius: 15, minWidth: 24, padding: 0 }} >
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
                      <CardSettingIndicator status="TAL" data={el} refresh={this.refresh} key={index} week={this.props.week} bobotKPIM={this.state.bobotKPIM} bobotTAL={this.state.bobotTAL} />
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
                        />

                        <FormControl variant="outlined" style={{ width: '15%' }}>
                          <InputLabel>Perulangan</InputLabel>
                          <SelectOption
                            value={this.state.isLoopingIndicatorTAL}
                            onChange={this.handleChange('isLoopingIndicatorTAL')}
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
                        />
                        <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.createNewTAL}>
                          <SaveOutlinedIcon />
                        </Button>
                        <Button style={{ borderRadius: 5, minWidth: 40, color: 'red' }} onClick={this.handleCreateTAL}>
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
