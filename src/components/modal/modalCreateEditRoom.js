import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Modal, Backdrop, Button, CircularProgress, Fade, FormControl, TextField
} from '@material-ui/core';

import { fetchDataRooms } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

class modalCreateEditRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proses: false,
      roomName: '',
      max: '',
      facility: ''
    }
  }

  componentDidMount() {
    if (!this.props.statusCreate) {
      this.setState({
        roomName: this.props.data.room,
        max: this.props.data.max,
        facility: this.props.data.facilities
      })
    }
  }

  save = async () => {
    this.setState({
      proses: true
    })
    let token = Cookies.get('POLAGROUP')

    if (this.props.statusCreate) {
      let newData = {
        room: this.state.roomName,
        max: this.state.max,
        facilities: this.state.facility,
        building_id: this.props.data.building_id
      }

      API.post(`/bookingRoom/rooms`, newData, {
        headers: {
          token,
          ip: this.props.ip
        }
      })
        .then(() => {
          this.props.fetchData()
          this.props.fetchDataRooms()
          this.props.closeModal()
          this.setState({
            proses: false,
            roomName: '',
            max: '',
            facility: '',
          })
        })
        .catch(err => {
          swal('please try again')
          this.setState({
            proses: false
          })
        })
    } else {
      let newData = {
        room: this.state.roomName,
        max: this.state.max,
        facilities: this.state.facility,
      }

      API.put(`/bookingRoom/rooms/${this.props.data.room_id}`, newData, {
        headers: {
          token,
          ip: this.props.ip
        }
      })
        .then(() => {
          this.props.fetchData()
          this.props.fetchDataRooms()
          this.props.closeModal()
          this.setState({
            proses: false,
            roomName: '',
            max: '',
            facility: '',
          })
        })
        .catch(err => {
          swal('please try again')
          this.setState({
            proses: false
          })
        })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  cancel = () => {
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
            {
              this.props.statusCreate
                ? <h2>Membuat ruangan di gedung {this.props.data.building}</h2>
                : <h2>Edit</h2>
            }
            <FormControl component="fieldset">
              <TextField
                id="roomName"
                label="Room Name"
                value={this.state.roomName}
                onChange={this.handleChange('roomName')}
                margin="normal"
                variant="outlined"
                disabled={this.state.proses}
              />
            </FormControl>
            <FormControl component="fieldset">
              <TextField
                id="max"
                label="Kapasitas"
                value={this.state.max}
                onChange={this.handleChange('max')}
                margin="normal"
                variant="outlined"
                disabled={this.state.proses}
              />
            </FormControl>
            <FormControl component="fieldset">
              <TextField
                id="facility"
                label="Fasilitas"
                value={this.state.facility}
                onChange={this.handleChange('facility')}
                margin="normal"
                variant="outlined"
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
                onClick={this.save}>
                Save
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
          </div>
        </Fade>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  fetchDataRooms
}

const mapStateToProps = ({ loading, dataUsers, dataCompanies, ip }) => {
  return {
    loading,
    dataCompanies,
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(modalCreateEditRoom)