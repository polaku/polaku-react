import React, { Component } from 'react'

import {
  Grid, Button, Paper, Popover, Typography, MenuList, MenuItem, ListItemIcon, TextField
} from '@material-ui/core';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SubdirectoryArrowRightOutlinedIcon from '@material-ui/icons/SubdirectoryArrowRightOutlined';

import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
// import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';

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
    target_monthly: 0,
    capaian_monthly: 0,
    statusEdit: false,
    openModalTargetKPIM: false,
    openModalCopyIndicatorKPIM: false,

    dataForEdit: {},
    indicatorKPIM: '',
    capaian: 0,
    bobot: 0,
    tempScoreKPIM: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.fetchData()
    }
  }

  fetchData = () => {
    // console.log(this.props.data)
    if (this.props.status !== "TAL") {
      let persenTahun = (this.props.data.pencapaian / this.props.data.target) * 100
      let persenBulan = (this.props.data.pencapaian_monthly / this.props.data.target_monthly) * 100

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

  editIndicatorKPIM = () => {
    this.setState({ statusEdit: !this.state.statusEdit, open: false })
  }

  openModalTargetKPIM = () => {
    this.setState({ openModalTargetKPIM: true })
  }

  closeModalTargetKPIM = () => {
    this.setState({ openModalTargetKPIM: false })
  }

  setNewDataKPIM = data => {
    data.indicator_kpim = this.state.indicatorKPIM
    data.user_id = this.props.data.user_id

    let newTarget = [], tempScoreKPIM = data

    this.props.data.kpimScore.forEach((el, index) => {
      let tempNewTarget = {
        kpim_score_id: el.kpim_score_id,
        target_monthly: data.monthly[index]
      }
      newTarget.push(tempNewTarget)
    })

    delete tempScoreKPIM.monthly
    tempScoreKPIM.kpimScore = newTarget

    this.setState({ openModalTargetKPIM: false, dataForEdit: tempScoreKPIM })
  }

  updateKPIM = () => {
    let token = localStorage.getItem("token")

    let newData = { ...this.state.dataForEdit }
    newData.indicator_kpim = this.state.indicatorKPIM
    newData.monthly = newData.kpimScore
    delete newData.kpimScore

    newData.monthly[this.props.data.month - 1].bobot = this.state.bobot
    newData.monthly[this.props.data.month - 1].pencapaian_monthly = this.state.capaian

    API.put(`/kpim/${this.props.data.kpim_id}`, newData, { headers: { token } })
      .then(() => {
        swal("Edit indicator KPIM sukses", "", "success")
        this.setState({
          statusEdit: false
        })
        this.props.refresh()
      })
      .catch(err => {
        console.log(err)
      })
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

  render() {
    function getMonth(args) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months[Number(args) - 1]
    }

    return (
      <>
        {
          this.props.status === "TAL"
            ? <Grid style={{ display: 'flex', alignItems: 'center' }}>
              <SubdirectoryArrowRightOutlinedIcon style={{ color: '#e3e3e3', margin: '0px 5px' }} />
              <Paper style={{ marginBottom: 2, marginTop: 2, padding: '5px 20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Grid style={{ display: 'flex', alignItems: 'center', width:'60%' }}>
                  <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>w{this.props.weekNow}</p>
                  <p style={{ margin: 0 }}>{this.props.data.indicator_tal}</p>
                </Grid>
                <Grid style={{ display: 'flex', alignItems: 'center', width:'40%' }}>
                  <p style={{ margin: '0px 10px 0px 0px', width: '80%' }}>{this.props.data.when_day || `Tanggal ${this.props.data.when_date}`}</p>
                  <Grid style={{ display: 'flex', flexDirection: 'column', width: 50, marginRight: 10 }}>
                    <CircularProgressbarWithChildren value={this.props.data.achievement || 0}>
                      <p style={{ margin: 0, fontSize: 15, color: '#3e98c7' }}>{this.props.data.achievement || 0}%</p>
                    </CircularProgressbarWithChildren>
                  </Grid>
                  <p style={{ margin: '0px 10px 0px 0px' }}>{this.props.data.achievement || 0}</p>
                  <Button style={{ borderRadius: 5, minWidth: 40, padding: 0 }} onClick={this.handleClick}>
                    <MoreHorizIcon />
                  </Button>
                </Grid>
              </Paper>
            </Grid>


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
                      <Button style={{ borderRadius: 5, minWidth: 40, color: 'red' }} onClick={this.editIndicatorKPIM}>
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
                        (this.props.data.bobot === 0 || this.props.data.bobot === null) && <TextField
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
                        <p style={{ margin: '0px 3px 0px 0px' }}>{this.state.capaian_monthly}</p>
                        <p style={{ margin: '0px 10px 4px 0px', fontSize: 10 }}>/ {this.state.target_monthly}</p>
                      </Grid>
                      <Button style={{ borderRadius: 5, minWidth: 40, padding: 0 }} onClick={this.handleClick}>
                        <MoreHorizIcon />
                      </Button>
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
            <MenuItem onClick={this.editIndicatorKPIM}>
              <ListItemIcon style={{ marginLeft: 5, width: 30 }}>
                <CreateRoundedIcon />
              </ListItemIcon>
              <Typography >ubah indicator</Typography>
            </MenuItem>
            <MenuItem onClick={this.openModalCopyIndicatorKPIM}>
              <ListItemIcon style={{ marginLeft: 5 }}>
                <FileCopyOutlinedIcon />
              </ListItemIcon>
              <Typography >duplikat indikator ke user lain</Typography>
            </MenuItem>
            <MenuItem>
              <ListItemIcon style={{ marginLeft: 5 }}>
                <SyncOutlinedIcon />
              </ListItemIcon>
              <Typography >atur pengulangan</Typography>
            </MenuItem>
            {/* <MenuItem>
              <ListItemIcon style={{ marginLeft: 5 }}>
                <ArchiveOutlinedIcon />
              </ListItemIcon>
              <Typography >arsipkan indikator</Typography>
            </MenuItem> */}
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