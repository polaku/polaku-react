import React, { Component, lazy } from 'react';

import {
  Card, Divider, Typography, CardContent, Button
} from '@material-ui/core';

const ModalCreateEditBookingRoom = lazy(() => import('../modal/modalCreateEditBookingRoom'));
const CardBookingRoom = lazy(() => import('./cardBookingRoom'));

export default class cardRoomInBookingRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false
    }
  }

  openModal = () => {
    this.setState({ openModal: true })
  }

  closeModal = async () => {
    await this.props.refresh()
    this.setState({ openModal: false })
  }

  render() {
    return (
      <Card style={{ margin: 10 }} >
        <Typography gutterBottom variant="h6" style={{ margin: 10, marginLeft: 20 }}>
          {this.props.data.room}
        </Typography>
        <Divider />
        <CardContent style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          {
            this.props.data && this.props.data.tbl_booking_rooms.length > 0 && this.props.data.tbl_booking_rooms.map((el, index) => (
              <CardBookingRoom data={el} key={index} refresh={this.props.refresh} />
            ))
          }
          <Button size="small" variant="contained" color="primary" onClick={this.openModal}>
            Pesan Ruangan
            </Button>
          {
            this.state.openModal && <ModalCreateEditBookingRoom status={this.state.openModal} closeModal={this.closeModal} refresh={this.props.refresh} room_id={this.props.data.room_id} statusCreate={true} />
          }
        </CardContent>
      </Card>
    )
  }
}
