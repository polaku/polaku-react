import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Cookies from 'js-cookie';

import {
  Grid, Button, FormControl, Select, MenuItem
} from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import CardRoomInBookingRoom from '../../components/facility/cardRoomInBookingRoom';

import { fetchDataBookingRooms, fetchDataMyBookingRooms, fetchDataRooms } from '../../store/action';

// import { API } from '../../config/API';

class BookingRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      dataForDisplay: [],
      searchDate: null,
      building: 'semua',
      listBuilding: []
    }
  }

  async componentDidMount() {
    await this.props.fetchDataBookingRooms()
    await this.props.fetchDataRooms()

    await this.fetchData()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.building !== prevState.building) {

      if (this.state.building === 'semua') {
        this.setState({ dataForDisplay: this.state.data })
      } else {
        let data = await this.state.data.filter(room => room.building_id === this.state.building)
        this.setState({ dataForDisplay: data })
      }
    }

    if (this.props.dataBookingRooms !== prevProps.dataBookingRooms) {
      this.fetchData()
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  fetchData = async () => {
    // console.log("KEPANGGIL fetchData")
    this.setState({
      data: [],
      dataForDisplay: []
    })

    let datas = this.props.dataRooms

    let idBuilding = [], building = []
    await datas.forEach(async room => {
      let temp = await this.props.dataBookingRooms.filter(el => el.room_id === room.room_id)
      room.tbl_booking_rooms = temp

      if (idBuilding.indexOf(room.building_id) === -1) {
        idBuilding.push(room.building_id)
        building.push(room.tbl_building)
      }
    });

    this.setState({
      listBuilding: building,
      data: datas,
      dataForDisplay: datas
    })
  }

  refresh = async () => {
    // console.log("MASUK REFRESH in BookingRoom")
    await this.props.fetchDataBookingRooms()
    await this.props.fetchDataRooms()
    await this.fetchData()
  }

  search = async () => {
    let newData = this.props.dataRooms

    await newData.forEach(async room => {
      let temp = await this.props.dataBookingRooms.filter(el =>
        el.room_id === room.room_id &&
        new Date(el.date_in).getDate() === new Date(this.state.searchDate).getDate() &&
        new Date(el.date_in).getMonth() === new Date(this.state.searchDate).getMonth() &&
        new Date(el.date_in).getFullYear() === new Date(this.state.searchDate).getFullYear())
      room.tbl_booking_rooms = temp
    });

    this.setState({
      dataForDisplay: newData
    })
  }

  allBookingRoom = async () => {
    await this.props.fetchDataBookingRooms()
    await this.props.fetchDataRooms()
    await this.fetchData()
  }

  allMyBookingRoom = async () => {
    await this.props.fetchDataMyBookingRooms()
    await this.props.fetchDataRooms()

    let datas = this.props.dataRooms

    await datas.forEach(async room => {
      let temp = await this.props.dataMyBookingRooms.filter(el => el.room_id === room.room_id)
      room.tbl_booking_rooms = temp
    });

    this.setState({
      data: datas,
      dataForDisplay: datas
    })
  }

  handleDateChange = (name, date) => {
    this.setState({ [name]: date })
  }

  render() {
    return (
      <Grid>
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid id="top-left" style={{ display: 'flex', alignItems: 'center' }}>
            <p>Cari berdasarkan Tanggal :</p>
            <FormControl style={{ margin: 0, marginBottom: 5 }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date"
                  format="dd/MM/yyyy"
                  inputVariant="outlined"
                  style={{ width: 300, margin: 0, minWidth: 150, marginLeft: 10, marginRight: 10 }}
                  value={this.state.searchDate}
                  onChange={(date) => this.handleDateChange('searchDate', date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  inputProps={{
                    style: {
                      height: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }
                  }}
                  disabled={this.state.proses}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
            <Button variant="contained" size="small" color="primary" onClick={this.search}>
              Cari
            </Button>
          </Grid>
          <Grid id="top-right" style={{ marginRight: 20 }}>
            <Button variant="contained" size="small" color="primary" onClick={this.allMyBookingRoom}>
              Pesanan Saya
            </Button><Button variant="contained" size="small" color="primary" onClick={this.allBookingRoom}>
              Semua
            </Button>
          </Grid>
        </Grid>
        <Grid style={{ display: 'flex', alignItems: 'center' }}>
          <b style={{ margin: 0, marginRight: 30, fontSize: 18 }}>Gedung </b>
          <FormControl variant="outlined" size="small" style={{ width: '100%', maxWidth: 400, height: 40, margin: '5px 0px' }}>
            <Select
              value={this.state.building}
              onChange={this.handleChange('building')}
              disabled={this.props.proses}
              style={{ width: '100%' }}
            >
              <MenuItem value="semua">Semua</MenuItem>
              {
                this.state.listBuilding.map((building, index) =>
                  <MenuItem value={building.building_id} key={"department" + index}>{building.building}</MenuItem>
                )
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid container style={{ display: 'flex', padding: 10 }}>
          {
            this.state.dataForDisplay.map((room, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <CardRoomInBookingRoom data={room} refresh={this.refresh} />
              </Grid>
            ))
          }
        </Grid>
      </Grid>
    )
  }
}

const mapDispatchToProps = {
  fetchDataBookingRooms,
  fetchDataMyBookingRooms,
  fetchDataRooms
}

const mapStateToProps = ({ loading, dataBookingRooms, dataMyBookingRooms, dataRooms, error, userId }) => {
  return {
    loading,
    dataBookingRooms,
    dataMyBookingRooms,
    dataRooms,
    error,
    userId
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BookingRoom)