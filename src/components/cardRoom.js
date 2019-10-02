import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import ModalCreateEditRoom from './modal/modalCreateEditRoom';

import { fetchDataRooms } from '../store/action';
import { API } from '../config/API';

class cardRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false
    }
  }

  delete = () => {
    let token = localStorage.getItem('token')
    API.delete(`/bookingRoom/rooms/${this.props.data.room_id}`, { headers: { token } })
      .then(() => {
        this.props.fetchDataRooms();
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
          this.state.openModal && <ModalCreateEditRoom status={this.state.openModal} closeModal={this.closeModal} data={this.props.data} statusCreate={false} />
        }
      </>
    )
  }
}

const mapDispatchToProps = {
  fetchDataRooms
}

export default connect(null, mapDispatchToProps)(cardRoom)