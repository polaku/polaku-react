import 'date-fns';
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import DatePickers from "react-multi-date-picker";
import {
  Modal, Backdrop, Fade, TextField, Typography, Button, CircularProgress, InputLabel, MenuItem, FormControl, Select as SelectOption, FormControlLabel, Checkbox, FormLabel
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

function ModalCreateEditPermintaanHRD(props) {
  const [IsEdit, setIsEdit] = useState(false)

  const [jenisIjin, setJenisIjin] = useState('')
  const [textarea, setTextarea] = useState('')
  const [start_date, setStart_date] = useState(null)
  const [time_in, setTime_in] = useState(null)
  const [time_out, setTime_out] = useState(null)
  const [proses, setProses] = useState(false)
  const [company, setCompany] = useState(null)
  const [suratDokter, setSuratDokter] = useState(null)
  const [lampirkanSuratDokter, setLampirkanSuratDokter] = useState(false)

  const [Value, setValue] = useState([new Date()])

  useEffect(() => {
    if (props.data) {
      setIsEdit(true)

      if (props.data.categori_id === 6) { //cuti
        if (props.data.leave_date_in) {
          setStart_date(new Date(props.data.leave_date))
        } else {
          let leaveDate = props.data.leave_date.split(',')
          setStart_date(new Date(leaveDate[0]))
        }

        setJenisIjin(6)
        setTextarea(props.data.message)
      } else if (props.data.categori_id === 7) { //imp
        setJenisIjin(7)
        setStart_date(new Date(props.data.date_imp))
        setTime_in(new Date().setHours(props.data.start_time_imp.slice(0, 2), props.data.start_time_imp.slice(3, 5)))
        setTime_out(new Date().setHours(props.data.end_time_imp.slice(0, 2), props.data.end_time_imp.slice(3, 5)))
        setTextarea(props.data.message)
      } else if (props.data.categori_id === 8) { //ia
        let ijinAbsenDate = props.data.date_ijin_absen_start.split(',')

        if (props.data.date_ijin_absen_end) {
          setStart_date(new Date(ijinAbsenDate[0]))
        } else {
          setStart_date(new Date(ijinAbsenDate[0]))
        }
        setJenisIjin(8)
        setTextarea(props.data.message)
      }
    } else {
      setStart_date(new Date())
      setTime_in(new Date())
      setTime_out(new Date().setHours(new Date().getHours() + 1, new Date().getMinutes()))
    }

    if (props.listDinas) {
      setCompany(props.listDinas[0].company_id)
    }
  }, [props.data])

  useEffect(() => {
    if (jenisIjin === 6) {
      if (!props.data) {
        setStart_date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7))
      }
    } else {
      setStart_date(new Date())
    }
  }, [jenisIjin, props.data])

  useEffect(() => {
    setCompany(props.listDinas[0].company_id)
  }, [props.listDinas])

  const _cancel = e => {
    e.preventDefault();
    props.handleCloseModal()
  }

  const _createPengajuan = async e => {
    e.preventDefault()

    let valid = true;
    if (company) {
      if (IsEdit) {
        _editPengajuan()
      } else {
        setProses(true)

        let newData = new FormData(), token = Cookies.get('POLAGROUP')

        if (jenisIjin === 7) {
          if (Number(time_in) > Number(time_out)) {
            setProses(false)

            return swal("waktu selesai harus lebih besar dari waktu mulai", "", "error");
          }

          newData.append('date_imp', start_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
          newData.append('start_time_imp', `${new Date(time_in).getHours()}:${new Date(time_in).getMinutes()}`)
          newData.append('end_time_imp', `${new Date(time_out).getHours()}:${new Date(time_out).getMinutes()}`)
          newData.append('message', textarea)
          newData.append('categoriId', 7)
        } else if (jenisIjin === 6) {
          let listDate = '', counter = 0

          if (Value.length > 0) Value.forEach(el => {
            let date = el.day < 10 ? `0${el.day}` : el.day
            let month = el.month < 10 ? `0${el.month}` : el.month
            let year = el.year

            if (listDate !== '') listDate += `,${year}-${month}-${date}`
            else listDate += `${year}-${month}-${date}`
            counter++
          })

          newData.append('leave_date', listDate)
          newData.append('leave_request', counter)
          // newData.append('leave_date_in', end_date)
          newData.append('message', textarea)
          newData.append('categoriId', 6)
        } else if (jenisIjin === 8) {
          let listDate = ''

          if (Value.length > 0) Value.forEach(el => {
            let date = el.day < 10 ? `0${el.day}` : el.day
            let month = el.month < 10 ? `0${el.month}` : el.month
            let year = el.year

            if (listDate !== '') listDate += `,${year}-${month}-${date}`
            else listDate += `${year}-${month}-${date}`
          })

          newData.append('date_ijin_absen_start', listDate)
          // newData.append('date_ijin_absen_end', end_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() + 1}`)
          newData.append('message', textarea)
          newData.append('categoriId', 8)
        }
        newData.append('company_id', company)
        newData.append('type', 'request')
        newData.append('contactCategoriesId', 4)

        if (lampirkanSuratDokter) {
          newData.append("doctor_letter", suratDokter)
        }

        if (valid) {
          API.post('/contactUs', newData, {
            headers: {
              token
            }
          })
            .then(data => {
              swal("Terima kasih. Mohon menunggu untuk direspon", "", "success");

              props.handleCloseModal()
              props.fetchData()
              _reset()

              setProses(false)
            })
            .catch(err => {
              setProses(false)
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

  const _editPengajuan = async () => {
    setProses(true)

    let newData = new FormData(), token = Cookies.get('POLAGROUP')

    if (jenisIjin === 7) {
      if (Number(time_in) > Number(time_out)) {
        setProses(false)

        return swal("waktu selesai harus lebih besar dari waktu mulai", "", "error");
      }

      newData.append('date_imp', start_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
      newData.append('start_time_imp', `${new Date(time_in).getHours()}:${new Date(time_in).getMinutes()}`)
      newData.append('end_time_imp', `${new Date(time_out).getHours()}:${new Date(time_out).getMinutes()}`)
      newData.append('message', textarea)
      newData.append('categoriId', 7)
    } else if (jenisIjin === 6) {
      // newData.append('leave_date', start_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
      // newData.append('leave_request', lamaCuti)
      // newData.append('leave_date_in', end_date)

      let listDate = '', counter = 0

      if (Value.length > 0) Value.forEach(el => {
        let date = el.day < 10 ? `0${el.day}` : el.day
        let month = el.month < 10 ? `0${el.month}` : el.month
        let year = el.year

        if (listDate !== '') listDate += `,${year}-${month}-${date}`
        else listDate += `${year}-${month}-${date}`
        counter++
      })

      newData.append('leave_date', listDate)
      newData.append('leave_request', counter)
      newData.append('message', textarea)
      newData.append('categoriId', 6)
    } else if (jenisIjin === 8) {
      let listDate = ''

      if (Value.length > 0) Value.forEach(el => {
        let date = el.day < 10 ? `0${el.day}` : el.day
        let month = el.month < 10 ? `0${el.month}` : el.month
        let year = el.year

        if (listDate !== '') listDate += `,${year}-${month}-${date}`
        else listDate += `${year}-${month}-${date}`
      })

      newData.append('date_ijin_absen_start', listDate)
      // newData.append('date_ijin_absen_end', end_date || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() + 1}`)
      newData.append('message', textarea)
      newData.append('categoriId', 8)
    }

    newData.append('company_id', company)
    newData.append('type', 'request')
    newData.append('contactCategoriesId', 4)

    if (lampirkanSuratDokter) {
      newData.append("doctor_letter", suratDokter)
    }

    API.patch(`/contactUs/${props.data.contact_id}`, newData, {
      headers: {
        token
      }
    })
      .then(data => {
        swal("Terima kasih. Mohon menunggu untuk direspon", "", "success")
        props.handleCloseModal()
        props.fetchData()
        _reset()

        setIsEdit(false)
        setProses(false)
      })
      .catch(err => {
        setProses(false)

        if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
          swal('Gagal', 'Koneksi tidak stabil', 'error')
        } else {
          swal('please try again')
        }
      })
  }

  const _reset = () => {
    setJenisIjin('')
    setTextarea('')
    setStart_date(new Date())
    setTime_in(null)
    setTime_out(null)
    setProses(false)
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      open={props.status}
      onClose={_cancel}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.status}>
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
            jenisIjin === 6 && <p style={{ fontWeight: 'bold', marginTop: 0, fontSize: 24 }}>Sisa cuti anda {props.sisaCuti} hari</p>
          }
          <img src={require('../../Assets/ijin.jpeg').default} loading="lazy" alt="Logo" width={200} height="100%" />
          <p style={{ fontWeight: 'bold' }}>Ajukan ijin dengan mengisi beberapa detail dibawah ini</p>
          <form noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

            {/* PILIH PERUSHAAN */}
            <FormControl style={{ margin: '10px 0 0px 0' }}>
              <InputLabel htmlFor="room">Ajukan ke perusahaan</InputLabel>
              <SelectOption
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                disabled={proses}
              >
                {
                  props.listDinas.map((el, index) =>
                    el.company_id && el.evaluator && <MenuItem value={el.company_id} index={'pt' + index}>{el.company_name}</MenuItem>
                  )
                }
              </SelectOption>
            </FormControl>

            {/* PIlihan cuti, imp, ia */}
            <FormControl style={{ margin: '10px 0 10px 0' }}>
              <InputLabel htmlFor="room">Jenis</InputLabel>
              <SelectOption
                value={jenisIjin}
                onChange={(event) => setJenisIjin(event.target.value)}
                disabled={proses}
              >
                {
                  props.statusEmployee === 'Tetap' && <MenuItem value={6}>Cuti</MenuItem>
                }
                <MenuItem value={8}>Ijin Absen</MenuItem>
                <MenuItem value={7}>IMP</MenuItem>

              </SelectOption>
            </FormControl>

            {/*  Cuti */}
            {
              jenisIjin === 6 && <>
                {/* <FormControl style={{ margin: '0px 0 10px 0' }}>
                  <TextField
                    id="lama-cuti"
                    type="number"
                    label="Lama Cuti"
                    value={lamaCuti}
                    onChange={(event) => setLamaCuti(event.target.value)}
                    disabled={proses}
                  />
                </FormControl> */}
                <FormControl style={{ margin: '10px 0 10px 0' }}>
                  <FormLabel style={{ fontSize: 13, marginBottom: 10 }}>Tanggal Cuti</FormLabel>
                  <DatePickers
                    value={Value}
                    format="DD-MM-YYYY"
                    onChange={setValue}
                    sort
                    multiple
                    style={{ width: '100%', height: 32 }} />
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="start_date"
                      label="Tanggal Awal Cuti"
                      format="dd/MM/yyyy"
                      style={{ margin: 0 }}
                      value={start_date}
                      onChange={date => setState({ start_date: date })}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7)}
                      disabled={proses}
                    />
                  </MuiPickersUtilsProvider> */}
                </FormControl>
                {/* <FormControl style={{ margin: '10px 0 10px 0' }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="end_date"
                      label="Tanggal Masuk"
                      format="dd/MM/yyyy"
                      style={{ margin: 0 }}
                      value={end_date}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      minDate={start_date}
                      disabled={proses}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl> */}
                <FormControl style={{ margin: '0px 0 10px 0' }}>
                  <TextField
                    id="alasan"
                    label="Alasannya"
                    multiline
                    rows="4"
                    value={textarea}
                    onChange={(event) => setTextarea(event.target.value)}
                    disabled={proses}
                  />
                </FormControl>

              </>
            }

            {/* Ijin Absen */}
            {
              jenisIjin === 8 && <>
                <FormControl style={{ margin: '10px 0 10px 0' }}>
                  <FormLabel style={{ fontSize: 13, marginBottom: 10 }}>Tanggal Ijin Absen</FormLabel>
                  <DatePickers
                    value={Value}
                    format="DD/MM/YYYY"
                    onChange={setValue}
                    sort
                    multiple
                    style={{ width: '100%', height: 32 }} />
                </FormControl>
                {/* <FormControl style={{ margin: '10px 0 10px 0' }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="start_date"
                      label="Tanggal Mulai"
                      format="dd/MM/yyyy"
                      style={{ margin: 0 }}
                      value={start_date}
                      onChange={date => _setStartDate(date)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      disabled={proses}
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
                      value={end_date}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      minDate={start_date}
                      disabled={proses}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl> */}
                <FormControl style={{ margin: '0px 0 10px 0' }}>
                  <TextField
                    id="alasan"
                    label="Alasannya"
                    multiline
                    rows="4"
                    value={textarea}
                    onChange={(event) => setTextarea(event.target.value)}
                    disabled={proses}
                  />
                </FormControl>
                <FormControlLabel
                  control={<Checkbox checked={lampirkanSuratDokter} onChange={(e) => setLampirkanSuratDokter(e.target.checked)} name="kpim" />}
                  label="Lampirkan surat dokter"
                  disabled={proses}
                />
                <Button
                  variant="contained"
                  component="label"
                  style={{ marginBottom: 5 }}
                  disabled={!lampirkanSuratDokter}
                >
                  {
                    suratDokter
                      ? suratDokter.name
                      : "Select File"
                  }
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => setSuratDokter(e.target.files[0])}
                  />
                </Button>
              </>
            }


            {/* IMP */}
            {
              jenisIjin === 7 && <>
                <FormControl style={{ margin: '10px 0 10px 0' }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="start_date"
                      label="Tanggal"
                      format="dd/MM/yyyy"
                      style={{ margin: 0 }}
                      value={start_date}
                      onChange={date => setStart_date(date)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      minDate={new Date()}
                      disabled={proses}
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
                      value={time_in}
                      onChange={(date) => setTime_in(date)}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                      disabled={proses}
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
                      value={time_out}
                      onChange={date => setTime_out(date)}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                      disabled={proses}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl style={{ margin: '0px 0 10px 0' }}>
                  <TextField
                    id="alasan"
                    label="Alasannya"
                    multiline
                    rows="4"
                    value={textarea}
                    onChange={(event) => setTextarea(event.target.value)}
                    disabled={proses}
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
                disabled={proses}
                onClick={_cancel}>
                Cancel
            {proses && <CircularProgress size={24} style={{
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
                disabled={proses}
                onClick={_createPengajuan}>
                SEND
            {proses && <CircularProgress size={24} style={{
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateEditPermintaanHRD)




