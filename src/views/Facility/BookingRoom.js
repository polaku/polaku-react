import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid, TextField, Button
} from '@material-ui/core';

import CardRoomInBookingRoom from '../../components/facility/cardRoomInBookingRoom';

import { fetchDataBookingRooms, fetchDataMyBookingRooms, fetchDataRooms } from '../../store/action';

class BookingRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      dataForDisplay: [],
      searchDate: '',
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  async fetchData() {
    this.setState({
      data: [],
      dataForDisplay: []
    })
    console.log("MASUK 2")

    await this.props.fetchDataBookingRooms()
    await this.props.fetchDataRooms()

    let datas = this.props.dataRooms
    console.log("MASUK 3")
    console.log(this.props.dataBookingRooms)
    await datas.forEach(async room => {
      let temp = await this.props.dataBookingRooms.filter(el => el.room_id === room.room_id)
      room.tbl_booking_rooms = temp
    });

    this.setState({
      data: datas,
      dataForDisplay: datas
    })
  }

  refresh = () => {
    console.log("MASUK 1")
    this.fetchData()
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

  allBookingRoom = () => {
    this.fetchData()
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

  render() {
    return (
      <Grid>
        <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid id="top-left" style={{ display: 'flex', alignItems: 'center' }}>
            <p>Cari berdasarkan Tanggal :</p>
            <TextField
              id="searchDate"
              type="date"
              value={this.state.searchDate}
              onChange={this.handleChange('searchDate')}
              disabled={this.state.proses}
              style={{ marginLeft: 10, marginRight: 10 }}
            />
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