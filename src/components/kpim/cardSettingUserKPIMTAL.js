import React, { Component } from 'react'

import {
  Grid, Typography, Avatar, Button, Paper, TextField, MenuItem
} from '@material-ui/core';
import SelectOption from '@material-ui/core/Select';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AddIcon from '@material-ui/icons/Add';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import StarsIcon from '@material-ui/icons/Stars';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';

import CardSettingIndicator from './cardSettingIndicator';
import ModalReward from '../modal/modalReward';
import ModalSettingTargetKPIM from '../modal/modalSettingTargetKPIM';

export default class cardSettingUserKPIMTAL extends Component {
  state = {
    openKPIM: false,
    openTAL: false,
    statusCreateKPIM: false,
    statusCreateTAL: false,

    newIndicatorKPIM: '',
    newUnitKPIM: '',
    newTargetKPIM: '',
    newBobotKPIM: '',

    newItemTAL: '',
    isLoopingItemTAL: '',
    newOptionTimeTAL: '',
    newTimeTAL: '',
    newBobotTAL: '',

    optionTimeTAL: [],

    openModalReward: false,
    openModalTargetKPIM: false,

    KPIM: ["", "", "", ""]
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

      if (event.target.value === 0) {
        this.setState({
          optionTimeTAL: day,
          [name]: event.target.value
        })
      } else if (event.target.value === 1) {
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

  render() {
    return (
      <>
        <Grid style={{ marginTop: 30, position: 'relative' }}>
          <div style={{ width: 300, height: 80, backgroundColor: '#d71149', zIndex: -1, position: 'absolute', marginTop: 20, display: 'flex', justifyContent: 'flex-end' }} />
          <Grid style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 10 }}>
            <Avatar alt="Travis Howard" src="http://api.polagroup.co.id/uploads/icon_user.png" style={{ marginBottom: 5, marginLeft: 10, width: 50, height: 50 }} />
            <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 220, marginTop: 15 }}>
              <p style={{ color: 'white', margin: '0px 0px 0px 10px', zIndex: 1 }}>User a</p>
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

                  <ErrorOutlineOutlinedIcon style={{ color: 'white', backgroundColor: '#d71149', borderRadius: 15, margin: '0px 0px 0px 20px' }} />
                  <p style={{ margin: '0px 0px 0px 10px', color: '#d71149' }}>KPIM KOSONG</p>
                </Grid>
                <Button onClick={this.handleOpenCloseKPIM}
                  style={{ borderRadius: 15, minWidth: 24, padding: 0 }} >
                  {
                    this.state.openKPIM
                      ? <ExpandLessIcon />
                      : <ExpandMoreIcon />
                  }
                </Button>
              </Paper>

              {/* PANEL KPIM */}
              {
                this.state.openKPIM && <CardSettingIndicator status="KPIM" />
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
                      style={{ width: '50%' }}
                    />
                    {/*<TextField
                      placeholder="unit"
                      value={this.state.newUnitKPIM}
                      onChange={this.handleChange('newUnitKPIM')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, padding: 0, }
                      }}
                      style={{ width: '10%' }}
                    />
                     <TextField
                      placeholder="target"
                      value={this.state.newTargetKPIM}
                      onChange={this.handleChange('newTargetKPIM')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, padding: 0 }
                      }}
                      style={{ width: '20%' }}
                    />
                    <TextField
                      placeholder="bobot"
                      value={this.state.newBobotKPIM}
                      onChange={this.handleChange('newBobotKPIM')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, padding: 0 }
                      }}
                      style={{ width: '10%' }}
                    /> */}
                    <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.openModalTargetKPIM}>
                      setting target
                    </Button>
                    <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }}>
                      <SaveOutlinedIcon />
                    </Button>
                    <Button style={{ borderRadius: 5, minWidth: 40, color: 'red' }} onClick={this.handleCreateKPIM}>
                      <CancelPresentationOutlinedIcon />
                    </Button>
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
                this.state.openTAL && <CardSettingIndicator status="TAL" />
              }

              {/* FROM ADD NEW TAL */}
              {
                this.state.statusCreateTAL && <Paper style={{ marginBottom: 2, padding: '5px 10px 5px 20px', display: 'flex', alignItems: 'center', marginLeft: 34 }}>
                  <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>w10</p>
                  <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <TextField
                      placeholder="item TAL"
                      value={this.state.newItemTAL}
                      onChange={this.handleChange('newItemTAL')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, padding: 0 }
                      }}
                      style={{ width: '40%' }}
                    />

                    <SelectOption
                      value={this.state.isLoopingItemTAL}
                      onChange={this.handleChange('isLoopingItemTAL')}
                      style={{ width: '15%' }}
                    >
                      <MenuItem value={0}>1x</MenuItem>
                      <MenuItem value={1}>Setiap</MenuItem>
                    </SelectOption>

                    <SelectOption
                      value={this.state.newOptionTimeTAL}
                      onChange={this.handleChange('newOptionTimeTAL')}
                      style={{ width: '15%' }}
                    >
                      <MenuItem value={0}>Hari</MenuItem>
                      <MenuItem value={1}>Tanggal</MenuItem>
                    </SelectOption>

                    <SelectOption
                      value={this.state.newTimeTAL}
                      onChange={this.handleChange('newTimeTAL')}
                      style={{ width: '10%' }}
                    >
                      <MenuItem value={0}>Semua</MenuItem>
                      {
                        this.state.optionTimeTAL.map((el, index) =>
                          <MenuItem value={el} key={index}>{el}</MenuItem>
                        )
                      }
                    </SelectOption>

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
                    <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }}>
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

        <ModalSettingTargetKPIM status={this.state.openModalTargetKPIM} closeModal={this.closeModalTargetKPIM}/>
      </>
    )
  }
}
