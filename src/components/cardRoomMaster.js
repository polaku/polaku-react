import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ModalRoomMaster from './modal/modalRoomMaster';

import { fetchDataRoomMaster } from '../store/action';
import { API } from '../config/API';

class cardRoomMaster extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false
    }
  }

  delete = () => {
    let token = localStorage.getItem('token')

    API.delete(`/bookingRoom/roomMaster/${this.props.data.master_room_id}`, { headers: { token } })
      .then(() => {
        this.props.fetchDataRoomMaster()
      })
      .catch(err => {
        console.log(err);
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

export default connect(null, mapDispatchToProps)(cardRoomMaster)
