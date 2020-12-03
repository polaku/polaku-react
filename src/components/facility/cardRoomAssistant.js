import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import publicIp from 'public-ip';

import {
  TableRow, TableCell, IconButton
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import ModalCreateEditRoomAssistant from '../modal/modalCreateEditRoomAssistant';

import { fetchDataRoomMaster } from '../../store/action';
import { API } from '../../config/API';

import swal from 'sweetalert';

class CardRoomAssistant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
    }
  }

  delete = async () => {

    let token = Cookies.get('POLAGROUP')

    API.delete(`/bookingRoom/roomMaster/${this.props.data.master_room_id}`, {
      headers: {
        token,
        ip: await publicIp.v4()
      }
    })
      .then(() => {
        this.props.fetchDataRoomMaster()
        this.props.refresh()
      })
      .catch(err => {
        swal('please try again')
      })
  }

  openModal = () => {
    this.setState({ openModal: true })
  }

  closeModal = () => {
    this.setState({ openModal: false })
  }

  refresh = () => {
    this.props.refresh()
    this.setState({ openModal: false })
  }

  render() {
    return (
      <TableRow>
        <TableCell>{this.props.data.tbl_user.tbl_account_detail.fullname}</TableCell>
        <TableCell align="center" >
          {
            this.props.data.tbl_rooms.length !== 0
              ? this.props.data.tbl_rooms.map((el, index) => {
                if (index === 0) {
                  return `${el.room}`
                } else {
                  return `, ${el.room}`
                }
              })
              : <p>Belum ada Ruangan</p>
          }</TableCell>
        <TableCell align="center">
          <IconButton aria-label="Edit" onClick={this.openModal}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={this.delete}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
        {
          this.state.openModal && <ModalCreateEditRoomAssistant status={this.state.openModal} closeModal={this.closeModal} data={this.props.data} statusCreate={false} refresh={this.refresh} />
        }
      </TableRow>
    )
  }
}

const mapDispatchToProps = {
  fetchDataRoomMaster,
}

export default connect(null, mapDispatchToProps)(CardRoomAssistant)
