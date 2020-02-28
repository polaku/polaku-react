import React, { Component } from 'react'
import Cookies from 'js-cookie';

import {
  Grid, Button, Paper, Popover, Typography, MenuList, MenuItem, ListItemIcon, TextField
} from '@material-ui/core';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SubdirectoryArrowRightOutlinedIcon from '@material-ui/icons/SubdirectoryArrowRightOutlined';

import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
// import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import ModalSettingTargetKPIM from '../modal/modalSettingTargetKPIM';
import ModalCopyIndicatorKPIM from '../modal/modalCopyIndicatorKPIM';

import swal from 'sweetalert';

import { API } from '../../config/API';

export default class cardSettingIndicator extends Component {
  state = {
    open: false,
    anchorEl: null,
    persenTahun: 0,
    persenBulan: 0,
    target_monthly: null,
    capaian_monthly: null,
    statusEdit: false,
    openModalTargetKPIM: false,
    openModalCopyIndicatorKPIM: false,

    dataForEdit: {},
    indicatorKPIM: '',
    capaian: 0,
    bobot: 0,
    tempScoreKPIM: [],
    achievement: 0,
    weight: 0,
  }

  async componentDidMount() {
    await this.fetchData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.fetchData()
    }
  }

  fetchData = () => {
    if (this.props.status !== "TAL") {
      this.setState({
        persenTahun: 0
      })
      let persenTahun = Math.floor((this.props.data.pencapaian / this.props.data.target) * 100)
      let persenBulan = Math.floor((this.props.data.pencapaian_monthly / this.props.data.target_monthly) * 100)

      if (isNaN(persenBulan)) persenBulan = 0
      if (isNaN(persenTahun)) persenTahun = 0

      if (this.props.data.unit === 'Rp') {
        this.setState({
          target_monthly: `Rp. ${this.formatRupiah(this.props.data.target_monthly)}`,
          capaian_monthly: `Rp. ${this.formatRupiah(this.props.data.pencapaian_monthly)}`
        })
      } else {
        this.setState({
          target_monthly: `${this.props.data.target_monthly} ${this.props.data.unit}`,
          capaian_monthly: `${this.props.data.pencapaian_monthly} ${this.props.data.unit}`
        })
      }
      this.setState({
        indicatorKPIM: this.props.data.indicator_kpim,
        capaian: this.props.data.pencapaian_monthly,
        bobot: this.props.data.bobot,
        dataForEdit: {
          target: this.props.data.target,
          unit: this.props.data.unit,
          year: this.props.data.year,
          kpimScore: this.props.data.kpimScore
        },
        persenTahun,
        persenBulan
      })
    } else {
      this.setState({
        weight: this.props.data.weight || 0,
        achievement: this.props.data.achievement || 0
      })
    }
  }

  formatRupiah = args => {
    let number_string = args.toString(),
      sisa = number_string.length % 3,
      rupiah = number_string.substr(0, sisa),
      ribuan = number_string.substr(sisa).match(/\d{3}/g), separator

    if (ribuan) {
      separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    return rupiah
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget, open: true })
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false,
    })
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  editIndicator = () => {
    this.setState({ statusEdit: !this.state.statusEdit, open: false })
  }

  openModalTargetKPIM = () => {
    this.setState({ openModalTargetKPIM: true })
  }

  closeModalTargetKPIM = () => {
    this.setState({ openModalTargetKPIM: false })
  }

  setNewDataKPIM = async data => {
    data.indicator_kpim = this.state.indicatorKPIM
    data.user_id = this.props.data.user_id

    let newTarget = [], tempScoreKPIM = data

    this.props.data.kpimScore.forEach((el, index) => {
      let tempNewTarget = {
        kpim_score_id: el.kpim_score_id,
        target_monthly: data.monthly[el.month - 1]
      }
      newTarget.push(tempNewTarget)
    })

    delete tempScoreKPIM.monthly
    tempScoreKPIM.kpimScore = newTarget
    this.setState({ openModalTargetKPIM: false, dataForEdit: tempScoreKPIM })
  }

  updateKPIM = () => {
    let statusOverBobot = false
    if (!this.props.data.bobot || this.props.data.bobot === 0 || this.props.data.bobot === null) {
      if ((Number(this.props.bobotKPIM) + Number(this.state.bobot)) > 100) {
        statusOverBobot = true
      }
    } else {
      let newWeight = Number(this.props.bobotKPIM) - Number(this.props.data.bobot) + Number(this.state.bobot)

      if (newWeight > 100) {
        statusOverBobot = true
      }
    }

    if (!statusOverBobot) {
      let token = Cookies.get('POLAGROUP')

      let newData = { ...this.state.dataForEdit }
      newData.indicator_kpim = this.state.indicatorKPIM
      newData.monthly = newData.kpimScore
      delete newData.kpimScore

      newData.monthly.forEach(el => {
        if (Number(el.month) === Number(this.props.data.month)) {
          el.bobot = this.state.bobot
          el.pencapaian_monthly = this.state.capaian
        }
      })

      API.put(`/kpim/${this.props.data.kpim_id}`, newData, { headers: { token } })
        .then((data) => {
          swal("Edit indicator KPIM sukses", "", "success")
          this.setState({
            statusEdit: false
          })
          this.props.refresh()
        })
        .catch(err => {
          swal('please try again')
        })
    } else {
      swal("Bobot kpim lebih dari 100", "", "warning")
    }
  }

  openModalCopyIndicatorKPIM = () => {
    this.setState({ openModalCopyIndicatorKPIM: true, open: false })
  }

  closeModalCopyIndicatorKPIM = () => {
    this.setState({ openModalCopyIndicatorKPIM: false })
  }

  refresh = () => {
    this.props.refresh()
  }

  updateKPIMMonthly = event => {
    event.preventDefault()
    let statusOverBobot = false
    if (!this.props.data.bobot || this.props.data.bobot === 0 || this.props.data.bobot === null) {
      if ((Number(this.props.bobotKPIM) + Number(this.state.bobot)) > 100) {
        statusOverBobot = true
      }
    } else {
      let newWeight = Number(this.props.bobotKPIM) - Number(this.props.data.bobot) + Number(this.state.bobot)

      if (newWeight > 100) {
        statusOverBobot = true
      }
    }

    if (!statusOverBobot) {
      let token = Cookies.get('POLAGROUP')

      let newData = {
        bobot: this.state.bobot,
        pencapaian_monthly: this.state.capaian
      }
      API.put(`/kpim/${this.props.data.kpim_score_id}?update=month`, newData, { headers: { token } })
        .then(data => {
          this.props.refresh()
        })
        .catch(err => {
          swal('please try again')
        })
    } else {
      swal("Bobot kpim lebih dari 100", "", "warning")
    }
  }

  updateTAL = event => {
    event.preventDefault()
    let statusOverWeight = false
    if (!this.props.data.weight || Number(this.props.data.weight) === 0) {
      if ((Number(this.props.bobotTAL) + Number(this.state.weight)) > 100) {
        statusOverWeight = true
      }
    } else {
      let newWeight = Number(this.props.bobotTAL) - Number(this.props.data.weight) + Number(this.state.weight)

      if (newWeight > 100) {
        statusOverWeight = true
      }
    }

    if (!statusOverWeight) {
      let newData = {
        weight: this.state.weight,
        achievement: this.state.achievement
      }
      let token = Cookies.get('POLAGROUP')

      API.put(`/tal/${this.props.data.tal_score_id}`, newData, { headers: { token } })
        .then(data => {
          this.props.refresh()
          this.setState({
            statusEdit: false
          })
        })
        .catch(err => {
          swal('please try again')
        })
    } else {
      swal("Weight tal lebih dari 100", "", "warning")
    }
  }

  deleteIndicator = () => {
    let token = Cookies.get('POLAGROUP')

    if (this.props.status === "TAL") {
      API.delete(`/tal/${this.props.data.tal_score_id}?delete=week`, { headers: { token } })
        .then(data => {
          this.props.refresh()
        })
        .catch(err => {
          swal('please try again')
        })
    } else {

      API.delete(`/kpim/${this.props.data.kpim_score_id}?delete=month`, { headers: { token } })
        .then(data => {
          this.props.refresh()
        })
        .catch(err => {
          swal('please try again')
        })
    }
  }

  render() {
    function getMonth(args) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months[Number(args) - 1]
    }

    return (
      <>
        {
          this.props.status === "TAL"
            ? (this.state.statusEdit
              ?
              <Grid style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                <SubdirectoryArrowRightOutlinedIcon style={{ color: '#e3e3e3', margin: '0px 5px' }} />
                <Paper style={{ marginBottom: 2, marginTop: 3, padding: '5px 20px', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', height: 50 }}>
                  <Grid style={{ display: 'flex', alignItems: 'center', width: '40%' }}>
                    <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>w{this.props.week}</p>
                    <p style={{ margin: 0 }}>{this.props.data.indicator_tal}</p>
                  </Grid>
                  <p style={{ margin: '0px 10px 0px 0px' }}>{this.props.data.when_day || `Tanggal ${this.props.data.when_date}`}</p>

                  <TextField
                    label="Weight"
                    value={this.state.weight}
                    onChange={this.handleChange('weight')}
                    variant="outlined"
                    InputProps={{
                      style: { height: 35, padding: 0 }
                    }}
                    style={{ width: '15%', margin: '0px 10px 0px 0px' }}
                  />
                  <TextField
                    label="Achievement"
                    value={this.state.achievement}
                    onChange={this.handleChange('achievement')}
                    variant="outlined"
                    InputProps={{
                      style: { height: 35, padding: 0 }
                    }}
                    style={{ width: '18%', margin: '0px 10px 0px 0px' }}
                  />
                  <Grid>
                    <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.updateTAL}>
                      <SaveOutlinedIcon />
                    </Button>
                    <Button style={{ borderRadius: 5, minWidth: 40, color: 'red' }} onClick={this.editIndicator}>
                      <CancelPresentationOutlinedIcon />
                    </Button>
                  </Grid>
                </Paper>
              </Grid>
              : <Grid style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                <SubdirectoryArrowRightOutlinedIcon style={{ color: '#e3e3e3', margin: '0px 15' }} />
                <Paper style={{ marginBottom: 2, marginTop: 2, padding: '5px 20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Grid style={{ display: 'flex', alignItems: 'center', width: '60%' }}>
                    <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>w{this.props.week}</p>
                    <p style={{ margin: 0 }}>{this.props.data.indicator_tal}</p>
                  </Grid>
                  <Grid style={{ display: 'flex', alignItems: 'center', width: '40%', justifyContent: 'space-between' }}>
                    <p style={{ margin: '0px 10px 0px 0px', width: '30%' }}>{this.props.data.when_day || `Tanggal ${this.props.data.when_date}`}</p>
                    <Grid style={{ width: '70%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {
                        (this.props.data.weight === 0 || this.props.data.weight === null || !this.props.data.weight)
                          ? <form onSubmit={this.updateTAL} style={{ display: 'flex' }}>
                            <TextField
                              label="Weight"
                              value={this.state.weight}
                              onChange={this.handleChange('weight')}
                              variant="outlined"
                              InputProps={{
                                style: { height: 35, padding: 0 }
                              }}
                              style={{ width: '100%', margin: '0px 10px 0px 0px' }}
                            />
                            <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.updateTAL}>
                              <SaveOutlinedIcon />
                            </Button>
                          </form>
                          : <Grid style={{ display: 'flex', flexDirection: 'column', width: 50, marginRight: 10 }}>
                            <CircularProgressbarWithChildren value={Number(this.props.data.weight) || 0} >
                              <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>Bobot</p>
                              <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>{Number(this.props.data.weight) || 0}%</p>
                            </CircularProgressbarWithChildren>
                          </Grid>
                      }

                      {
                        (this.props.data.weight !== 0 && this.props.data.weight !== null && this.props.data.weight) &&
                        <>
                          {
                            (this.props.data.achievement === 0 || this.props.data.achievement === null || !this.props.data.achievement)
                              ? <form onSubmit={this.updateTAL} style={{ display: 'flex' }}>
                                <TextField
                                  label="Achievement"
                                  value={this.state.achievement}
                                  onChange={this.handleChange('achievement')}
                                  variant="outlined"
                                  InputProps={{
                                    style: { height: 35, padding: 0 }
                                  }}
                                  style={{ width: '100%', margin: '0px 10px 0px 0px' }}
                                />
                                <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.updateTAL}>
                                  <SaveOutlinedIcon />
                                </Button>
                              </form>
                              : <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <p style={{ margin: '0px 10px 0px 0px', fontSize: 13 }}>Achiev: </p>
                                <p style={{ margin: '0px 10px 0px 0px' }}>{this.props.data.achievement}</p>
                              </Grid>
                          }
                        </>
                      }
                      {
                        !this.props.data.hasConfirm && <Button style={{ borderRadius: 5, minWidth: 40, padding: 0 }} onClick={this.handleClick}>
                          <MoreHorizIcon />
                        </Button>
                      }
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

            )

            //KPIM
            : <Paper style={{ marginBottom: 2, marginTop: 2, padding: '5px 20px', display: 'flex', justifyContent: 'space-between' }}>
              {
                this.state.statusEdit
                  ? <>
                    <Grid style={{ display: 'flex', alignItems: 'center', width: '45%', }}>
                      <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>{getMonth(this.props.data.month)}</p>
                      <TextField
                        placeholder="Indicator KPIM"
                        value={this.state.indicatorKPIM}
                        onChange={this.handleChange('indicatorKPIM')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 35, padding: 0 }
                        }}
                        style={{ width: '100%', margin: '0px 10px 0px 0px' }}
                      />
                    </Grid>

                    <TextField
                      type="number"
                      label="Bobot"
                      value={this.state.bobot}
                      onChange={this.handleChange('bobot')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, padding: 0 }
                      }}
                      style={{ width: 85, margin: '0px 10px 0px 0px' }}
                    />
                    <TextField
                      type="number"
                      label="Capaian"
                      value={this.state.capaian}
                      onChange={this.handleChange('capaian')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, padding: 0 }
                      }}
                      style={{ width: 85, margin: '0px 10px 0px 0px' }}
                    />
                    <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.openModalTargetKPIM}>
                      setting target
                    </Button>
                    <Grid>
                      <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.updateKPIM}>
                        <SaveOutlinedIcon />
                      </Button>
                      <Button style={{ borderRadius: 5, minWidth: 40, color: 'red' }} onClick={this.editIndicator}>
                        <CancelPresentationOutlinedIcon />
                      </Button>
                    </Grid>
                  </>
                  : <>
                    <Grid style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>{getMonth(this.props.data.month)}</p>
                      <p style={{ margin: 0 }}>{this.props.data.indicator_kpim}</p>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center' }}>
                      {
                        this.props.data.bobot > 0 && <p style={{ margin: '0px 10px 0px 0px' }}>bobot: {this.props.data.bobot}</p>
                      }
                      {
                        (this.props.data.bobot === 0 || this.props.data.bobot === null) && <form onSubmit={this.updateKPIMMonthly} style={{ display: 'flex' }}>
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
                        </form>
                      }
                      <Grid style={{ display: 'flex', flexDirection: 'column', width: 50, marginRight: 10 }}>
                        <CircularProgressbarWithChildren value={this.state.persenBulan}>
                          <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>{this.state.persenBulan}%</p>
                          <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>bulan</p>
                        </CircularProgressbarWithChildren>
                      </Grid>
                      <Grid style={{ display: 'flex', flexDirection: 'column', width: 50, marginRight: 10 }}>
                        <CircularProgressbarWithChildren value={this.state.persenTahun}>
                          <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>{this.state.persenTahun}%</p>
                          <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>tahun</p>
                        </CircularProgressbarWithChildren>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                        {
                          (this.props.data.bobot !== 0 && this.props.data.bobot !== null)
                          && (
                            (this.props.data.pencapaian_monthly === 0 || this.props.data.pencapaian_monthly === null)
                              ? <form onSubmit={this.updateKPIMMonthly} style={{ display: 'flex' }}>
                                <TextField
                                  type="number"
                                  label="capaian"
                                  value={this.state.capaian}
                                  onChange={this.handleChange('capaian')}
                                  variant="outlined"
                                  InputProps={{
                                    style: { height: 35, padding: 0 }
                                  }}
                                  style={{ width: 85, margin: '0px 3px 0px 0px' }}
                                />
                                <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.updateKPIMMonthly}>
                                  <SaveOutlinedIcon />
                                </Button>
                              </form>
                              : <p style={{ margin: '0px 3px 0px 0px' }}>{this.state.capaian_monthly}</p>
                          )
                        }
                        {
                          (this.props.data.bobot !== 0 && this.props.data.bobot !== null) &&
                          <p style={{ margin: '0px 10px 4px 0px', fontSize: 10 }}>/ {this.state.target_monthly}</p>
                        }
                      </Grid>
                      {
                        !this.props.data.hasConfirm && <Button style={{ borderRadius: 5, minWidth: 40, padding: 0 }} onClick={this.handleClick}>
                          <MoreHorizIcon />
                        </Button>
                      }
                    </Grid>
                  </>
              }

            </Paper>
        }
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >

          <MenuList style={{ width: 330 }} >
            <MenuItem onClick={this.editIndicator}>
              <ListItemIcon style={{ marginLeft: 5, width: 30 }}>
                <CreateRoundedIcon />
              </ListItemIcon>
              <Typography >ubah indicator</Typography>
            </MenuItem>
            {
              this.props.status !== "TAL" && <MenuItem onClick={this.openModalCopyIndicatorKPIM}>
                <ListItemIcon style={{ marginLeft: 5 }}>
                  <FileCopyOutlinedIcon />
                </ListItemIcon>
                <Typography >duplikat indikator ke user lain</Typography>
              </MenuItem>
            }

            {/* <MenuItem>
              <ListItemIcon style={{ marginLeft: 5 }}>
                <SyncOutlinedIcon />
              </ListItemIcon>
              <Typography >atur pengulangan</Typography>
            </MenuItem> */}
            <MenuItem onClick={this.deleteIndicator}>
              <ListItemIcon style={{ marginLeft: 5 }}>
                <ArchiveOutlinedIcon />
              </ListItemIcon>
              <Typography >hapus indikator</Typography>
            </MenuItem>
          </MenuList>
        </Popover>

        {
          this.state.openModalTargetKPIM && <ModalSettingTargetKPIM
            status={this.state.openModalTargetKPIM}
            closeModal={this.closeModalTargetKPIM}
            indicator={this.state.newIndicatorKPIM}
            submitForm={this.setNewDataKPIM}
            data={this.state.dataForEdit} />
        }

        {
          this.state.openModalCopyIndicatorKPIM && <ModalCopyIndicatorKPIM
            status={this.state.openModalCopyIndicatorKPIM}
            closeModal={this.closeModalCopyIndicatorKPIM}
            data={this.props.data}
            userId={this.props.data.user_id}
            refresh={this.refresh} />
        }

      </>
    )
  }
}