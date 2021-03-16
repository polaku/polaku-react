import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  TableRow, TableCell, IconButton
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { fetchDataRoomMaster } from '../../store/action';
import { API } from '../../config/API';

import swal from 'sweetalert';

const ModalRoomMaster = lazy(() => import('../modal/modalRoomMaster'));

class cardRoomMaster extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false
    }
  }

  delete = async () => {
    let token = Cookies.get('POLAGROUP')

    API.delete(`/bookingRoom/roomMaster/${this.props.data.master_room_id}`, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(() => {
        this.props.fetchDataRoomMaster()
      })
      .catch(err => {
        if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
          swal('Gagal', 'Koneksi tidak stabil', 'error')
        } else {
          swal('please try again')
        }
      })
  }

  openModal = () => {
    this.setState({ openModal: true })
  }

  closeModal = () => {
    this.setState({ openModal: false })
  }


  render() {
    return (
      <TableRow>
        <TableCell align="center" >{this.props.index + 1}</TableCell>
        <TableCell>{this.props.data.tbl_user.tbl_account_detail.fullname}</TableCell>
        <TableCell align="center" >
          {
            this.props.data.tbl_companys.length !== 0
              ? this.props.data.tbl_companys.map((el, index) => {
                if (index === 0) {
                  return `${el.company_name}`
                } else {
                  return `, ${el.company_name}`
                }
              })
              : <p>Tidak Ada Perusahaan</p>
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
          this.state.openModal && <ModalRoomMaster status={this.state.openModal} closeModal={this.closeModal} data={this.props.data} />
        }
      </TableRow>
    )
  }
}

const mapDispatchToProps = {
  fetchDataRoomMaster,
}

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(cardRoomMaster)
