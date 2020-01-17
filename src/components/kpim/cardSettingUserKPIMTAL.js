import React, { Component } from 'react';

import {
  Grid, Typography, Avatar, Button, Paper, TextField, MenuItem, FormControl, InputLabel
} from '@material-ui/core';
import SelectOption from '@material-ui/core/Select';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AddIcon from '@material-ui/icons/Add';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import StarsIcon from '@material-ui/icons/Stars';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';

import swal from 'sweetalert';

import CardSettingIndicator from './cardSettingIndicator';
import ModalReward from '../modal/modalReward';
import ModalSettingTargetKPIM from '../modal/modalSettingTargetKPIM';

import { API } from '../../config/API';

export default class cardSettingUserKPIMTAL extends Component {
  state = {
    user_id: null,
    openKPIM: false,
    openTAL: false,
    statusCreateKPIM: false,
    statusCreateTAL: false,

    newIndicatorKPIM: '',
    newDataKPIM: {},

    newIndicatorTAL: '',
    isLoopingIndicatorTAL: '',
    newOptionTimeTAL: '',
    newTimeTAL: '',
    newBobotTAL: '',

    optionTimeTAL: [],

    openModalReward: false,
    openModalTargetKPIM: false,

    KPIM: [],
    TAL: [],
    bobotKPIM: 0,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    let tempKPIM = [], user_id, tempBobot = 0
    this.setState({
      KPIM: []
    })

    this.props.data.kpim.forEach(kpim => {
      kpim.score.forEach(element => {
        let newScoreKPIM = {
          kpim_id: kpim.kpim_id,
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
          user_id: kpim.user_id
        }
        tempKPIM.push(newScoreKPIM)
        tempBobot += element.bobot
      });
      user_id = kpim.user_id
    });

    this.setState({
      KPIM: tempKPIM,
      TAL: this.props.data.tal,
      user_id,
      bobotKPIM: tempBobot
    })
  }

  componentDidUpdate(prevProps, prevState) {
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
      this.fetchData()
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
      for (let i = 1; i <= 31; i++) {
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
    let token = localStorage.getItem("token")
    let newData = this.state.newDataKPIM
    newData.user_id = this.state.user_id
    newData.indicator_kpim = this.state.newIndicatorKPIM

    API.post('/kpim', newData, { headers: { token } })
      .then(async data => {
        swal("Tambah indicator KPIM success", "", "success")
        this.setState({
          newIndicatorKPIM: '',
          newDataKPIM: {}
        })
        this.props.refresh()
      })
      .catch(err => {
        console.log(err)
      })
  }

  createNewTAL = () => {
    let token = localStorage.getItem("token")
    let newData = {
      indicator_tal: this.state.newIndicatorTAL,
      isRepeat: this.state.isLoopingIndicatorTAL,
      forDay: this.state.newOptionTimeTAL,
      time: this.state.newTimeTAL,
      weight: this.state.newBobotTAL,
      week: this.props.weekNow,
      month: this.props.month,
      year: new Date().getFullYear(),
      user_id: this.state.user_id,
      firstDateInWeek: this.props.firstDateInWeek
    }

    API.post('/tal', newData, { headers: { token } })
      .then(async data => {
        swal("Tambah indicator TAL success", "", "success")
        this.setState({
          statusCreateTAL: false,
          newIndicatorTAL: '',
          isLoopingIndicatorTAL: '',
          newOptionTimeTAL: '',
          newTimeTAL: '',
          newBobotTAL: '',
        })
        this.props.refresh()
      })
      .catch(err => {
        console.log(err)
      })
  }

  refresh = () => {
    this.props.refresh()
  }

  render() {
    return (
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
          </Grid>

          <Grid style={{ marginLeft: 20 }}>
            {/* KPIM */}
            <Grid style={{ marginBottom: 10, marginTop: 2 }}>

              <Paper id="header" style={{ display: 'flex', padding: '10px 20px', justifyContent: 'space-between', marginBottom: 1 }} >
                <Grid style={{ display: 'flex' }}>
                  <Typography style={{ marginRight: 20 }}>KPIM</Typography>
                  {
                    !this.state.statusCreateKPIM && this.state.KPIM.length < 5 && <Button onClick={this.handleCreateKPIM}
                      style={{ borderRadius: 15, minWidth: 24, backgroundColor: '#e0e0e0', padding: 0 }} >
                      <AddIcon />
                    </Button>
                  }
                  {
                    this.state.KPIM.length === 0 && <>
                      <ErrorOutlineOutlinedIcon style={{ color: 'white', backgroundColor: '#d71149', borderRadius: 15, margin: '0px 0px 0px 20px' }} />
                      <p style={{ margin: '0px 0px 0px 10px', color: '#d71149' }}>KPIM KOSONG</p>
                    </>
                  }
                  {
                    this.state.bobotKPIM < 100 && <>
                      <ErrorOutlineOutlinedIcon style={{ color: 'white', backgroundColor: '#d71149', borderRadius: 15, margin: '0px 0px 0px 20px' }} />
                      <p style={{ margin: '0px 0px 0px 10px', color: '#d71149' }}>Bobot belum 100%</p>
                    </>
                  }

                </Grid>
                {
                  this.state.KPIM.length !== 0 && <>
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
                  <CardSettingIndicator data={el} status="KPIM" key={index} refresh={this.refresh} />
                  // <CardSettingIndicator data={el} status="KPIM" key={index} />
                )
              }


              {/* FROM ADD NEW KPIM */}
              {
                this.state.statusCreateKPIM && <Paper style={{ marginBottom: 2, padding: '5px 10px 5px 20px', display: 'flex', alignItems: 'center' }}>
                  <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <TextField
                      placeholder="indicator KPIM"
                      value={this.state.newIndicatorKPIM}
                      onChange={this.handleChange('newIndicatorKPIM')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, padding: 0 }
                      }}
                      style={{ width: '70%' }}
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

            </Grid>


            {/* TAL */}
            <Grid>

              <Paper id="header" style={{ display: 'flex', padding: '10px 20px', justifyContent: 'space-between' }}>
                <Grid style={{ display: 'flex' }}>
                  <Typography style={{ marginRight: 20 }}>TAL</Typography>
                  {
                    !this.state.statusCreateTAL && <Button onClick={this.handleCreateTAL}
                      style={{ borderRadius: 15, minWidth: 24, backgroundColor: '#e0e0e0', padding: 0 }} >
                      <AddIcon />
                    </Button>
                  }
                </Grid>
                <Button onClick={this.handleOpenCloseTAL}
                  style={{ borderRadius: 15, minWidth: 24, padding: 0 }} >
                  {
                    this.state.openTAL
                      ? <ExpandLessIcon />
                      : <ExpandMoreIcon />
                  }
                </Button>
              </Paper>

              {/* PANEL TAL */}
              {
                this.state.openTAL && this.state.TAL.map((el, index) =>
                  <CardSettingIndicator status="TAL" data={el} refresh={this.refresh} key={index} weekNow={this.props.weekNow} />
                )
              }

              {/* FROM ADD NEW TAL */}
              {
                this.state.statusCreateTAL && <Paper style={{ marginBottom: 2, padding: '5px 10px 5px 20px', display: 'flex', alignItems: 'center', marginLeft: 34, height: 70 }}>
                  <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>w10</p>
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
                        <MenuItem value={0}>Semua</MenuItem>
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

            </Grid>
          </Grid>
        </Grid>

        <ModalReward status={this.state.openModalReward} closeModal={this.closeModalReward} />

        {/* <ModalSettingTargetKPIM status={this.state.openModalTargetKPIM} closeModal={this.closeModalTargetKPIM} indicator={this.state.newIndicatorKPIM} submitForm={this.setNewDataKPIM} data={this.state.dataForEdit} /> */}

        {
          this.state.openModalTargetKPIM && <ModalSettingTargetKPIM status={this.state.openModalTargetKPIM} closeModal={this.closeModalTargetKPIM} indicator={this.state.newIndicatorKPIM} submitForm={this.setNewDataKPIM} />
        }
      </>
    )
  }
}
