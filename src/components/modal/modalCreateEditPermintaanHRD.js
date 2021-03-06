import 'date-fns';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import DatePickers from "react-multi-date-picker";
import {
  Modal, Backdrop, Fade, TextField, Typography, Button, CircularProgress, InputLabel, MenuItem, FormControl, Select as SelectOption, FormControlLabel, Checkbox
} from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import swal from 'sweetalert';

import { API } from '../../config/API';
import { fetchDataUsers, fetchDataRooms } from '../../store/action';

const value = [new Date(), new Date(new Date().setDate(new Date().getDate() + 1))]

class modalCreateEditPermintaanHRD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      jenisIjin: '',
      textarea: '',
      IMP_date: '',
      start_date: null,
      end_date: null,
      limitDate: '',
      limitMonth: '',
      limitYear: '',
      time_in: null,
      time_out: null,
      lamaCuti: '',
      type: 'request',
      proses: false,
      editableInput: true,
      hakCuti: 8,
      company: null,
      suratDokter: null,
      lampirkanSuratDokter: false
    }
  }

  async componentDidMount() {
    if (this.props.data) {
      this.setState({
        isEdit: true
      })
      if (this.props.data.categori_id === 6) { //cuti
        let endDate
        if (this.props.data.leave_date_in) {
          endDate = new Date(this.props.data.leave_date_in)
        } else {
          let leaveDate = this.props.data.leave_date.split(',')
          endDate = new Date(leaveDate[leaveDate.length - 1])
        }

        this.setState({
          jenisIjin: 6,
          start_date: new Date(this.props.data.leave_date.slice(0, 10)),
          end_date: endDate,
          lamaCuti: this.props.data.leave_request,
          textarea: this.props.data.message
        })
      } else if (this.props.data.categori_id === 7) { //imp
        this.setState({
          jenisIjin: 7,
          start_date: new Date(this.props.data.date_imp),
          time_in: new Date().setHours(this.props.data.start_time_imp.slice(0, 2), this.props.data.start_time_imp.slice(3, 5)),
          time_out: new Date().setHours(this.props.data.end_time_imp.slice(0, 2), this.props.data.end_time_imp.slice(3, 5)),
          textarea: this.props.data.message
        })
      } else if (this.props.data.categori_id === 8) { //ia
        let start_date, end_date, ijinAbsenDate = this.props.data.date_ijin_absen_start.split(',')

        if (this.props.data.date_ijin_absen_end) {
          start_date = new Date(ijinAbsenDate[0])
          end_date = new Date(this.props.data.date_ijin_absen_end)
        } else {
          start_date = new Date(ijinAbsenDate[0])
          end_date = new Date(ijinAbsenDate[ijinAbsenDate.length - 1])
        }

        this.setState({
          jenisIjin: 8,
          start_date,
          end_date,
          textarea: this.props.data.message
        })
      }
    } else {
      this.setState({
        start_date: new Date(),
        end_date: new Date(),
        time_in: new Date(),
        time_out: new Date().setHours(new Date().getHours() + 1, new Date().getMinutes()),
      })
    }

    if (this.props.listDinas) {
      this.setState({ company: this.props.listDinas[0].company_id })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.jenisIjin !== this.state.jenisIjin) {
      if (this.state.jenisIjin === 6) {
        if (!this.props.data) {
          this.setState({
            start_date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7),
            end_date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8),
          })
        }
      } else {
        this.setState({
          start_date: new Date(),
          end_date: new Date()
        })
      }
    }

    if (prevProps.listDinas !== this.props.listDinas) {
      this.setState({ company: this.props.listDinas[0].company_id })
    }
  }

  componentWillUnmount() {
    this.setState({
      isEdit: false
    })
    this.reset()
  }

  setStartDate = newDate => {
    this.setState({
      start_date: newDate,
      end_date: newDate,
    });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangePartisipan = (newValue, actionMeta) => {
    this.setState({
      partisipan: newValue
    })
  };

  cancel = e => {
    e.preventDefault();
    this.props.handleCloseModal()
  }

  createPengajuan = async e => {
    e.preventDefault()

    let valid = true;
    if (this.state.company) {
      if (this.state.isEdit) {
        this.editPengajuan()
      } else {
        this.setState({
          proses: true,
          editableInput: false
        })
        let newData = new FormData(), token = Cookies.get('POLAGROUP')

        if (this.state.jenisIjin === 7) {
          if (Number(this.state.startHour) > Number(this.state.endHour)) {
            this.setState({
              proses: false,
              editableInput: true
            })
            return swal("waktu selesai harus lebih besar dari waktu mulai", "", "error");
          }

          newData.append('date_imp', this.state.start_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
          newData.append('start_time_imp', `${new Date(this.state.time_in).getHours()}:${new Date(this.state.time_in).getMinutes()}`)
          newData.append('end_time_imp', `${new Date(this.state.time_out).getHours()}:${new Date(this.state.time_out).getMinutes()}`)
          newData.append('message', this.state.textarea)
          newData.append('categoriId', 7)
        } else if (this.state.jenisIjin === 6) {
          if (!this.state.lamaCuti) {
            valid = false
            swal("Form lama cuti masih kosong !", "", "warning")
            this.setState({ proses: false })
          }
          newData.append('leave_date', this.state.start_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
          newData.append('leave_request', this.state.lamaCuti)
          newData.append('leave_date_in', this.state.end_date)
          newData.append('message', this.state.textarea)
          newData.append('categoriId', 6)
        } else if (this.state.jenisIjin === 8) {
          newData.append('date_ijin_absen_start', this.state.start_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
          newData.append('date_ijin_absen_end', this.state.end_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() + 1}`)
          newData.append('message', this.state.textarea)
          newData.append('categoriId', 8)
        }
        newData.append('company_id', this.state.company)
        newData.append('type', 'request')
        newData.append('contactCategoriesId', 4)

        if (this.state.lampirkanSuratDokter) {
          newData.append("doctor_letter", this.state.suratDokter)
        }

        if (valid) {
          API.post('/contactUs', newData, {
            headers: {
              token,
              ip: this.props.ip
            }
          })
            .then(data => {
              swal("Terima kasih. Mohon menunggu untuk direspon", "", "success");

              this.props.handleCloseModal()
              this.props.fetchData()
              this.reset()

              this.setState({
                proses: false,
                editableInput: true
              })
            })
            .catch(err => {
              this.setState({
                proses: false,
                editableInput: true
              })
              if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
                swal('Gagal', 'Koneksi tidak stabil', 'error')
              } else {
                swal('please try again')
              }
            })
        }
      }
    } else {
      swal('Perusahaan yang dituju kosong', '', 'warning')
    }
  }

  editPengajuan = async () => {
    this.setState({
      proses: true,
      editableInput: false
    })
    let newData = new FormData(), token = Cookies.get('POLAGROUP')

    if (this.state.jenisIjin === 7) {
      if (Number(this.state.startHour) > Number(this.state.endHour)) {
        this.setState({
          proses: false,
          editableInput: true
        })
        return swal("waktu selesai harus lebih besar dari waktu mulai", "", "error");
      }

      newData.append('date_imp', this.state.start_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
      newData.append('start_time_imp', `${new Date(this.state.time_in).getHours()}:${new Date(this.state.time_in).getMinutes()}`)
      newData.append('end_time_imp', `${new Date(this.state.time_out).getHours()}:${new Date(this.state.time_out).getMinutes()}`)
      newData.append('message', this.state.textarea)
      newData.append('categoriId', 7)
    } else if (this.state.jenisIjin === 6) {
      newData.append('leave_date', this.state.start_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
      newData.append('leave_request', this.state.lamaCuti)
      newData.append('leave_date_in', this.state.end_date)
      newData.append('message', this.state.textarea)
      newData.append('categoriId', 6)
    } else if (this.state.jenisIjin === 8) {
      newData.append('date_ijin_absen_start', this.state.start_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
      newData.append('date_ijin_absen_end', this.state.end_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() + 1}`)
      newData.append('message', this.state.textarea)
      newData.append('categoriId', 8)
    }

    newData.append('company_id', this.state.company)
    newData.append('type', 'request')
    newData.append('contactCategoriesId', 4)

    if (this.state.lampirkanSuratDokter) {
      newData.append("doctor_letter", this.state.suratDokter)
    }

    API.patch(`/contactUs/${this.props.data.contact_id}`, newData, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(data => {
        swal("Terima kasih. Mohon menunggu untuk direspon", "", "success")
        this.props.handleCloseModal()
        this.props.fetchData()
        this.reset()
        this.setState({
          isEdit: false,
          proses: false,
          editableInput: true
        })
      })
      .catch(err => {
        this.setState({
          proses: false,
          editableInput: true
        })
        if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
          swal('Gagal', 'Koneksi tidak stabil', 'error')
        } else {
          swal('please try again')
        }
      })
  }

  reset = () => {
    this.setState({
      jenisIjin: '',
      textarea: '',
      IMP_date: '',
      start_date: new Date(),
      end_date: new Date(),
      limitDate: '',
      limitMonth: '',
      limitYear: '',
      startHour: '',
      startMinute: '',
      endHour: '',
      endMinute: '',
      lamaCuti: '',
      type: 'request',
      proses: false,
      editableInput: true
    })
  }

  handleUploadFile = args => (e) => {
    this.setState({ suratDokter: e.target.files[0] })
  }

  handleCheck = (event) => {
    this.setState({ lampirkanSuratDokter: event.target.checked });
  };

  _setDate = (args) => {
    // console.log(args.toUTC())
  }

  render() {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={this.props.status}
        onClose={this.cancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <div style={{
            backgroundColor: 'white',
            boxShadow: 5,
            padding: 30,
            width: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxHeight: '80%',
            overflowX: 'auto'
          }}>
            <Typography style={{ margin: 10, fontSize: 17 }}>Pengajuan ijin</Typography>
            {
              this.state.jenisIjin === 6 && <p style={{ fontWeight: 'bold', marginTop: 0, fontSize: 24 }}>Sisa cuti anda {this.props.sisaCuti} hari</p>
            }
            <img src={require('../../Assets/ijin.jpeg').default} loading="lazy" alt="Logo" width={200} height="100%" />
            <p style={{ fontWeight: 'bold' }}>Ajukan ijin dengan mengisi beberapa detail dibawah ini</p>
            <form noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

              {/* PILIH PERUSHAAN */}
              <FormControl style={{ margin: '10px 0 0px 0' }}>
                <InputLabel htmlFor="room">Ajukan ke perusahaan</InputLabel>
                <SelectOption
                  value={this.state.company}
                  onChange={this.handleChange('company')}
                  disabled={this.state.proses}
                >
                  {
                    this.props.listDinas.map((el, index) =>
                      el.company_id && el.evaluator && <MenuItem value={el.company_id} index={'pt' + index}>{el.company_name}</MenuItem>
                    )
                  }
                </SelectOption>
              </FormControl>

              {/* PIlihan cuti, imp, ia */}
              <FormControl style={{ margin: '10px 0 10px 0' }}>
                <InputLabel htmlFor="room">Jenis</InputLabel>
                <SelectOption
                  value={this.state.jenisIjin}
                  onChange={this.handleChange('jenisIjin')}
                  disabled={this.state.proses}
                >
                  {
                    this.props.statusEmployee === 'Tetap' && <MenuItem value={6}>Cuti</MenuItem>
                  }
                  <MenuItem value={8}>Ijin Absen</MenuItem>
                  <MenuItem value={7}>IMP</MenuItem>

                </SelectOption>
              </FormControl>

              {/*  Cuti */}
              {
                this.state.jenisIjin === 6 && <>
                  <FormControl style={{ margin: '0px 0 10px 0' }}>
                    <TextField
                      id="lama-cuti"
                      type="number"
                      label="Lama Cuti"
                      value={this.state.lamaCuti}
                      onChange={this.handleChange('lamaCuti')}
                      disabled={this.state.proses}
                    />
                  </FormControl>
                  <FormControl style={{ margin: '10px 0 10px 0' }}>
                    <DatePickers
                      value={value}
                      format="MMMM DD YYYY"
                      onChange={this._setDate}
                      sort
                      multiple />
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="start_date"
                        label="Tanggal Awal Cuti"
                        format="dd/MM/yyyy"
                        style={{ margin: 0 }}
                        value={this.state.start_date}
                        onChange={date => this.setState({ start_date: date })}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7)}
                        disabled={this.state.proses}
                      />
                    </MuiPickersUtilsProvider> */}
                  </FormControl>
                  <FormControl style={{ margin: '10px 0 10px 0' }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="end_date"
                        label="Tanggal Masuk"
                        format="dd/MM/yyyy"
                        style={{ margin: 0 }}
                        value={this.state.end_date}
                        onChange={date => this.setState({ end_date: date })}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        minDate={this.state.start_date}
                        disabled={this.state.proses}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                  <FormControl style={{ margin: '0px 0 10px 0' }}>
                    <TextField
                      id="alasan"
                      label="Alasannya"
                      multiline
                      rows="4"
                      value={this.state.textarea}
                      onChange={this.handleChange('textarea')}
                      disabled={this.state.proses}
                    />
                  </FormControl>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.lampirkanSuratDokter} onChange={this.handleCheck} name="kpim" />}
                    label="Lampirkan surat dokter"
                    disabled={this.state.proses}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    style={{ marginBottom: 5 }}
                    disabled={!this.state.lampirkanSuratDokter}
                  >
                    {
                      this.state.suratDokter
                        ? this.state.suratDokter.name
                        : "Select File"
                    }
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={this.handleUploadFile("cuti")}
                    />
                  </Button>
                </>
              }

              {/* Ijin Absen */}
              {
                this.state.jenisIjin === 8 && <>
                  <FormControl style={{ margin: '10px 0 10px 0' }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="start_date"
                        label="Tanggal Mulai"
                        format="dd/MM/yyyy"
                        style={{ margin: 0 }}
                        value={this.state.start_date}
                        onChange={date => this.setStartDate(date)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        disabled={this.state.proses}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                  <FormControl style={{ margin: '10px 0 10px 0' }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="end_date"
                        label="Tanggal Selesai"
                        format="dd/MM/yyyy"
                        style={{ margin: 0 }}
                        value={this.state.end_date}
                        onChange={date => this.setState({ end_date: date })}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        minDate={this.state.start_date}
                        disabled={this.state.proses}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                  <FormControl style={{ margin: '0px 0 10px 0' }}>
                    <TextField
                      id="alasan"
                      label="Alasannya"
                      multiline
                      rows="4"
                      value={this.state.textarea}
                      onChange={this.handleChange('textarea')}
                      disabled={this.state.proses}
                    />
                  </FormControl>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.lampirkanSuratDokter} onChange={this.handleCheck} name="kpim" />}
                    label="Lampirkan surat dokter"
                    disabled={this.state.proses}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    style={{ marginBottom: 5 }}
                    disabled={!this.state.lampirkanSuratDokter}
                  >
                    {
                      this.state.suratDokter
                        ? this.state.suratDokter.name
                        : "Select File"
                    }
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={this.handleUploadFile("cuti")}
                    />
                  </Button>
                </>
              }


              {/* IMP */}
              {
                this.state.jenisIjin === 7 && <>
                  <FormControl style={{ margin: '10px 0 10px 0' }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="start_date"
                        label="Tanggal"
                        format="dd/MM/yyyy"
                        style={{ margin: 0 }}
                        value={this.state.start_date}
                        onChange={date => this.setState({ start_date: date })}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        minDate={new Date()}
                        disabled={this.state.proses}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                  <FormControl style={{ margin: '10px 0 10px 0' }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                      <KeyboardTimePicker
                        margin="normal"
                        id="time_in"
                        label="Time in"
                        ampm={false}
                        style={{ margin: 0 }}
                        value={this.state.time_in}
                        onChange={date => this.setState({ time_in: date })}
                        KeyboardButtonProps={{
                          'aria-label': 'change time',
                        }}
                        disabled={this.state.proses}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                  <FormControl style={{ margin: '10px 0 10px 0' }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                      <KeyboardTimePicker
                        margin="normal"
                        id="time_out"
                        label="Time out"
                        ampm={false}
                        style={{ margin: 0 }}
                        value={this.state.time_out}
                        onChange={date => this.setState({ time_out: date })}
                        KeyboardButtonProps={{
                          'aria-label': 'change time',
                        }}
                        disabled={this.state.proses}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                  <FormControl style={{ margin: '0px 0 10px 0' }}>
                    <TextField
                      id="alasan"
                      label="Alasannya"
                      multiline
                      rows="4"
                      value={this.state.textarea}
                      onChange={this.handleChange('textarea')}
                      disabled={this.state.proses}
                    />
                  </FormControl>
                </>
              }

              <div style={{ position: 'relative' }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  style={{ margin: '20px 0', width: 100, alignSelf: 'center', marginRight: 30 }}
                  data-testid='buttonSignin'
                  disabled={this.state.proses}
                  onClick={this.cancel}>
                  Cancel
              {this.state.proses && <CircularProgress size={24} style={{
                    color: 'blue',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -12,
                    marginLeft: -12,
                  }} />}
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ margin: '20px 0', width: 100, alignSelf: 'center' }}
                  data-testid='buttonSignin'
                  disabled={this.state.proses}
                  onClick={this.createPengajuan}>
                  SEND
              {this.state.proses && <CircularProgress size={24} style={{
                    color: 'blue',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -12,
                    marginLeft: -12,
                  }} />}
                </Button>
              </div>
            </form>

          </div>
        </Fade>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataRooms,
}

const mapStateToProps = ({ loading, dataUsers, dataRooms, sisaCuti, ip, listDinas, statusEmployee }) => {
  return {
    loading,
    dataUsers,
    dataRooms,
    sisaCuti,
    ip,
    listDinas,
    statusEmployee
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(modalCreateEditPermintaanHRD)