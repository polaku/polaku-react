import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  ListItem, IconButton, ListItemText, ListItemSecondaryAction
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import ModalCreateEditRoom from '../modal/modalCreateEditRoom';

import { fetchDataRooms } from '../../store/action';
import { API } from '../../config/API';

import swal from "sweetalert";

class cardRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false
    }
  }

  delete = async () => {
    let token = Cookies.get('POLAGROUP')
    API.delete(`/bookingRoom/rooms/${this.props.data.room_id}`, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(() => {
        this.props.fetchDataRooms();
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

  fetchData = () => {
    this.props.fetchData()
  }

  render() {
    return (
      <>
        <ListItem key={this.props.index} style={{ padding: 0, width: '100%' }}>
          <div>
            <p></p>
          </div>
          <ListItemText
            primary={this.props.data.room}
            secondary={`Kapasitas : ${this.props.data.max},  Fasilitas: ${this.props.data.facilities}`}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="Edit" onClick={this.openModal}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="Delete" onClick={this.delete}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {
          this.state.openModal && <ModalCreateEditRoom status={this.state.openModal} closeModal={this.closeModal} data={this.props.data} statusCreate={false} fetchData={this.fetchData} />
        }
      </>
    )
  }
}

const mapDispatchToProps = {
  fetchDataRooms
}

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(cardRoom)