import 'date-fns';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Modal, Backdrop, Fade, TextField, Typography, Button, CircularProgress, InputLabel, MenuItem, FormControl, Select as SelectOption
} from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import swal from 'sweetalert';

import { API } from '../../config/API';
import { fetchDataUsers, fetchDataRooms } from '../../store/action';

const animatedComponents = makeAnimated();

class modalCreateEditBookingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room_id: '',
      date_in: new Date(),
      time_in: new Date().setHours(8, 0),
      time_out: new Date().setHours(17, 0),
      subject: '',
      count: '',
      partisipan: [],
      proses: false,
      editableInput: true,
      people: [],
    }
  }

  async componentDidMount() {
    let temp = []
    this.props.room_id && this.setState({ room_id: this.props.room_id })

    try {
      await this.props.fetchDataRooms()
      await this.props.fetchDataUsers()

      this.props.dataUsers.forEach(element => {
        let newData = {
          user_id: element.user_id,
        }
        if (element.tbl_account_detail) newData.fullname = element.tbl_account_detail.fullname
        temp.push(newData)
      });

      this.setState({
        people: temp,
      })

    } catch (err) {
      swal("Error", `${err}`);
    }

    if (this.props.statusCreate === false) {
      let time_in = this.props.data.time_in.split(':')
      let time_out = this.props.data.time_out.split(':')

      this.setState({
        room_id: this.props.data.room_id,
        subject: this.props.data.subject,
        count: this.props.data.count,
        date_in: new Date(this.props.data.date_in),
        time_in: new Date().setHours(time_in[0], time_in[1]),
        time_out: new Date().setHours(time_out[0], time_out[1]),
      })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  send = async e => {
    e.preventDefault();
    this.setState({
      proses: true,
      editableInput: false
    })

    let token = Cookies.get('POLAGROUP')

    if (!this.state.room_id || !this.state.date_in || !this.state.time_in || !this.state.time_out || !this.state.subject) {
      swal("Data incomplete", "", "warning");
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_in).getHours() < 8) {
      swal("Time in must higher than 8", "", "warning");
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_in).getHours() > 17) {
      swal("Time in must smaller than 17", "", "warning");
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_out).getHours() < 8) {
      swal(`Time out must higher than ${new Date(this.state.time_in).getHours()}`, "", "warning");
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_out).getHours() > 17) {
      swal('Limit time out is 17', "", "warning");
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_in).getHours() > new Date(this.state.time_out).getHours()) {
      swal('Time out must be higher than time in', "", "warning");
      this.setState({
        proses: false,
        editableInput: true
      })
    } else {
      let idPartisipan = [], time_in, time_out
      this.state.partisipan.forEach(el => {
        idPartisipan.push(el.user_id)
      })

      time_in = `${new Date(this.state.time_in).getHours()}:${new Date(this.state.time_in).getMinutes()}`
      time_out = `${new Date(this.state.time_out).getHours()}:${new Date(this.state.time_out).getMinutes()}`

      let dateInMonth = new Date(this.state.date_in).getMonth() + 1 < 10 ? `0${new Date(this.state.date_in).getMonth() + 1}` : new Date(this.state.date_in).getMonth() + 1
      let dateInDate = new Date(this.state.date_in).getDate() < 10 ? `0${new Date(this.state.date_in).getDate()}` : new Date(this.state.date_in).getDate()

      let newData = {
        date_in: `${new Date(this.state.date_in).getFullYear()}-${dateInMonth}-${dateInDate}`,
        time_in: time_in,
        time_out: time_out,
        subject: this.state.subject,
        room_id: this.state.room_id,
        count: this.state.count
      }

      if (this.props.statusCreate === true) {
        newData.partisipan = `[${idPartisipan.join()}]`
        newData.count = this.state.count
        API.post('/bookingRoom', newData,
          {
            headers: {
              token,
              ip: this.props.ip
            }
          }
        )
          .then(async () => {
            swal('Create booking room success', "", "success");

            this.setState({
              proses: true,
              editableInput: true
            })
            await this.props.refresh()
            this.props.closeModal()
          })
          .catch((err) => {
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else if (err.message === 'Request failed with status code 400') {
              if (err.response.data.error === 'Total person too much') {
                swal('Total partisipan melebihi kapasitas ruangan', "", "error");
              } else {
                swal('Waktu yang dipesan sudah terpesan oleh orang lain, harap menentukan waktu yang lain', "", "error");
              }
            } else if (err.message === 'Request failed with status code 403') {
              swal('Waktu login telah habis, silahkan login kembali', "", "error");

              Cookies.remove('POLAGROUP');
            } else {
              swal('Error', `${err}`)
            }
            this.setState({
              proses: false,
              editableInput: true
            })
          })
      } else {
        API.put(`/bookingRoom/${this.props.data.room_booking_id}`, newData,
          {
            headers: {
              token,
              ip: this.props.ip
            }
          }
        )
          .then(async (data) => {
            swal('Edit booking room success', "", "success");
            this.setState({
              proses: true,
              editableInput: true
            })

            await this.props.refresh()
          })
          .catch((err) => {
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else if (err.message === 'Request failed with status code 400') {
              swal('Waktu yang dipesan sudah terpesan oleh orang lain, harap menentukan waktu yang lain', "", "error");
            } else if (err.message === 'Request failed with status code 403') {
              swal('Waktu login telah habis, silahkan login kembali', "", "error");
              Cookies.remove('POLAGROUP')
            } else {
              swal('Error', `${err}`)
            }
            this.setState({
              proses: false,
              editableInput: true
            })
          })
      }
    }
  }

  handleChangePartisipan = (newValue, actionMeta) => {
    this.setState({
      partisipan: newValue
    })
  };

  cancel = e => {
    e.preventDefault();
    this.props.closeModal()
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
          }}>
            <Typography style={{ margin: 10, fontSize: 17 }}>Booking Room</Typography>
            <form noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <FormControl>
                <InputLabel htmlFor="room">Room</InputLabel>
                <SelectOption
                  value={this.state.room_id}
                  onChange={this.handleChange('room_id')}
                  disabled={this.state.proses}
                >
                  {
                    this.props.dataRooms && this.props.dataRooms.map(el =>
                      (<MenuItem value={el.room_id} key={el.room_id}>{el.room}</MenuItem>)
                    )
                  }
                </SelectOption>
              </FormControl>
              <FormControl style={{ margin: '10px 0 10px 0' }}>
                <TextField
                  id="subject"
                  label="Subject"
                  value={this.state.subject}
                  onChange={this.handleChange('subject')}
                  disabled={this.state.proses}
                />
              </FormControl>
              <FormControl style={{ margin: '10px 0 10px 0' }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date_in"
                    label="Date in"
                    format="dd/MM/yyyy"
                    style={{ margin: 0 }}
                    value={this.state.date_in}
                    onChange={date => this.setState({ date_in: date })}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    minDate={new Date()}
                    maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 2, 31)}
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
              {
                this.props.statusCreate &&
                <FormControl style={{ marginTop: 10 }}>
                  {
                    this.state.people && <SeCreatableSelect
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={this.state.people}
                      onChange={this.handleChangePartisipan}
                      getOptionLabel={(option) => option.fullname}
                      getOptionValue={(option) => option.user_id}
                      disabled={this.state.proses}
                    />
                  }
                </FormControl>
              }
              <FormControl style={{ margin: '10px 0 10px 0' }}>
                <TextField
                  id="jumlah_orang"
                  label="Total Participant"
                  value={this.state.count}
                  onChange={this.handleChange('count')}
                  disabled={this.state.proses}
                />
              </FormControl>
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
                  onClick={this.send}>
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

const mapStateToProps = ({ loading, dataUsers, dataRooms, userId, ip }) => {
  return {
    loading,
    dataUsers,
    dataRooms,
    userId,
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(modalCreateEditBookingRoom)