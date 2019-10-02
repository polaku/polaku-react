import 'date-fns';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SelectOption from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import { API } from '../../config/API';
import { fetchDataUsers, fetchDataRooms } from '../../store/action';

const animatedComponents = makeAnimated();

class CreateBookingRoom extends Component {
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
      password: '',
      proses: false,
      editableInput: true,
      people: [],
    }
  }

  async componentDidMount() {
    let temp = []
    this.props.location.state.room_id && this.setState({room_id: this.props.location.state.room_id})

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
      console.log(err);

      alert(err)
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

    let token = localStorage.getItem('token');

    if (!this.state.room_id || !this.state.date_in || !this.state.time_in || !this.state.time_out || !this.state.subject) {
      alert('Data incomplete!')
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_in).getHours() < 8) {
      alert('Time in must higher than 8')
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_in).getHours() > 17) {
      alert('Time in must smaller than 17')
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_out).getHours() < 8) {
      alert(`Time out must higher than ${new Date(this.state.time_in).getHours()}`)
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_out).getHours() > 17) {
      alert('Limit time out is 17')
      this.setState({
        proses: false,
        editableInput: true
      })
    } else if (new Date(this.state.time_in).getHours() > new Date(this.state.time_out).getHours()) {
      alert('Time out must be higher than time in')
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

      let newData = {
        room_id: this.state.room_id,
        date_in: this.state.date_in,
        time_in: time_in,
        time_out: time_out,
        subject: this.state.subject,
        count: this.state.partisipan.length,
        partisipan: idPartisipan.join()
      }

      API.post('/bookingRoom', newData,
        {
          headers: {
            token
          }
        }
      )
        .then(() => {
          alert(`Create booking room success`)
          this.setState({
            proses: true,
            editableInput: true
          })
          this.props.history.push('/bookingRoom');
        })
        .catch((err) => {
          if (err === 'Error: Request failed with status code 400') {
            alert("Waktu yang dipesan sudah terpesan oleh orang lain, harap menentukan waktu yang lain")
          } else if (err.message === 'Request failed with status code 403') {
            alert('Waktu login telah habis, silahkan login kembali')
            // this.props.navigation.navigate('Login')
            localStorage.clear()
          } else {
            alert(err)
          }
          this.setState({
            proses: false,
            editableInput: true
          })
        })
    }
  }

  handleChangePartisipan = (newValue, actionMeta) => {
    this.setState({
      partisipan: newValue
    })
  };

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '5% 0 0 auto' }}>
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', width: 500 }}>
          <Typography style={{ margin: 10, fontSize: 17 }}>Booking Room</Typography>
          <form noValidate autoComplete="off" onSubmit={this.send} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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

            <div style={{ position: 'relative' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '20px 0', width: 100, alignSelf: 'center' }}
                data-testid='buttonSignin'
                disabled={this.state.proses}>
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
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataRooms,
}

const mapStateToProps = ({ loading, dataUsers, dataRooms }) => {
  return {
    loading,
    dataUsers,
    dataRooms,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBookingRoom)