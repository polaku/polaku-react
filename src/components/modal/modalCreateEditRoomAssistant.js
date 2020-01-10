import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { fetchDataRooms, fetchDataUsers, fetchDataRoomMaster } from '../../store/action';

import { API } from '../../config/API';
import swal from 'sweetalert';

const animatedComponents = makeAnimated();

class modalCreateEditRoomAssistant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      room: [],
      users: [],
      userSelected: {},
      roomSelected: [],
    }
  }

  async componentDidMount() {
    let temp = []
    if (this.props.statusCreate) {
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
        users: temp,
      })
    } else {
      this.setState({ roomSelected: this.props.data.tbl_rooms })
    }
  }

  save = () => {
    let newData, roomId = [], token = localStorage.getItem('token')

    if (this.props.statusCreate) {
      this.state.roomSelected.forEach(el => {
        roomId.push(el.room_id)
      })

      newData = {
        user_id: this.state.userSelected.user_id,
        room_id: roomId.join()
      }

      API.post(`/bookingRoom/roomMaster`, newData, { headers: { token } })
        .then(() => {
          this.props.closeModal()
        })
        .catch(err => {
          if (err.message === 'Request failed with status code 400') {
            swal("Sudah menjadi room master", "", "warning")
          }
        })
    } else {
      this.state.roomSelected.forEach(el => {
        roomId.push(el.room_id)
      })

      newData = {
        room_id: roomId.join()
      }

      API.put(`/bookingRoom/roomMaster/${this.props.data.master_room_id}`, newData, { headers: { token } })
        .then(() => {
          this.props.refresh()
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  cancel = () => {
    this.props.closeModal()
  }

  handleChangeUser = (newValue, actionMeta) => {
    this.setState({
      userSelected: newValue
    })
  };

  handleChangeRoom = (newValue, actionMeta) => {
    this.setState({
      roomSelected: newValue
    })
  };

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
            width: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {
              this.props.statusCreate
                ? <h2> Menambahkan asisten baru anda </h2>
                : <h2> Mengubah asisten anda </h2>
            }
            <div style={{ marginLeft: 50, marginRight: 50 }}>
              <FormControl style={{ marginTop: 10, width: 300 }}>
                <FormLabel style={{ marginBottom: 10 }} component="legend">Nama asisten</FormLabel>
                {
                  this.props.statusCreate
                    ? this.state.users && <SeCreatableSelect
                      components={animatedComponents}
                      options={this.state.users}
                      onChange={this.handleChangeUser}
                      getOptionLabel={(option) => option.fullname}
                      getOptionValue={(option) => option.user_id}
                      disabled={this.state.proses}
                    />
                    : <div style={{ marginBottom: 10, fontSize: 15 }}>{this.props.data.tbl_user.tbl_account_detail.fullname}</div>
                }
              </FormControl>
              <FormControl style={{ marginTop: 10, width: 500 }}>
                <FormLabel style={{ marginBottom: 10 }} component="legend">Ruangan</FormLabel>
                {
                  this.props.dataRooms && <SeCreatableSelect
                    closeMenuOnSelect={false}
                    isMulti
                    components={animatedComponents}
                    options={this.props.dataRooms}
                    onChange={this.handleChangeRoom}
                    getOptionLabel={(option) => option.room}
                    getOptionValue={(option) => option.room_id}
                    disabled={this.state.proses}
                    defaultValue={this.state.roomSelected}
                  />
                }
              </FormControl>
            </div>
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
  fetchDataUsers,
  fetchDataRooms,
  fetchDataRoomMaster
}

const mapStateToProps = ({ loading, dataUsers, dataRooms, error }) => {
  return {
    loading,
    dataRooms,
    dataUsers,
    error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(modalCreateEditRoomAssistant)