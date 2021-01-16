import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Tooltip, IconButton } from '@material-ui/core';

import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import ModalCreateEditBookingRoom from '../modal/modalCreateEditBookingRoom';
import { API } from '../../config/API';

import swal from 'sweetalert';

class cardBookingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: false,
      proses: false,
      openModal: false,
      admin: false
    }
  }

  componentDidMount() {
    if (this.props.data.user_id === Number(this.props.userId)) {
      this.setState({
        owner: true
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.userId !== prevProps.userId) {
      this.setState({
        owner: true
      })
    }
  }

  delete = async () => {
    swal({
      title: "Apa anda yakin ingin menghapus pesanan ruangan ini?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (yesAnswer) => {
        if (yesAnswer) {
          this.setState({
            proses: true
          })
          let token = Cookies.get('POLAGROUP')

          API.delete(`/bookingRoom/${this.props.data.room_booking_id}`,
            {
              headers: {
                token,
                ip: this.props.ip
              }
            })
            .then(async () => {
              swal("Pesanan berhasil dihapus !", "", "success")
              await this.props.refresh()
              this.setState({
                proses: false
              })
            })
            .catch(err => {
              swal("Pesanan gagal dihapus !", "", "error")
              this.setState({
                proses: false
              })
            })
        }
      });

  }

  openModal = () => {
    this.setState({ openModal: true })
  }

  refresh = async () => {
    await this.props.refresh()
    this.setState({ openModal: false })
  }

  closeModal = () => {
    this.setState({ openModal: false })
  }

  render() {
    function getMonth(args) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let month = months[new Date(args).getMonth()]
      return `${month}`
    }

    return (
      <Grid style={{ width: '100%', backgroundColor: '#D2D2D2', marginBottom: 10, borderRadius: 5, padding: 15, display: 'flex' }}>
        <Grid style={{ backgroundColor: 'white', width: 60, height: 60 }}>
          <Grid style={{ backgroundColor: 'green', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
            {getMonth(this.props.data.date_in)}
          </Grid>
          <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            {new Date(this.props.data.date_in).getDate()}
          </Grid>
        </Grid>
        <Grid style={{ display: 'flex', flexDirection: 'column', paddingLeft: 10, width: '100%' }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 'bold' }}>{this.props.data.subject}</p>
          <p style={{ margin: 0 }}>{this.props.data.time_in.slice(0, 5)} - {this.props.data.time_out.slice(0, 5)}</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon />
            <p style={{ margin: 0, marginLeft: 5 }}>{this.props.data.count}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon />
            <p style={{ margin: 0, marginLeft: 5 }}>{this.props.data.tbl_user ? this.props.data.tbl_user.tbl_account_detail.fullname : '-'}</p>
          </div>
          {
            (this.state.owner || this.props.isAdminRoom || this.props.isAdminsuper) &&
            <div style={{ alignSelf: 'end' }}>
              <IconButton aria-label="delete" onClick={this.delete}>
                <Tooltip title="Hapus Pesanan" placement="top-end">
                  <DeleteIcon fontSize="small" />
                </Tooltip>
              </IconButton>
              <IconButton aria-label="edit" onClick={this.openModal}>
                <Tooltip title="Edit Pesanan" placement="top-end">
                  <EditIcon fontSize="small" />
                </Tooltip>
              </IconButton>
            </div>
          }
          {
            this.state.openModal && <ModalCreateEditBookingRoom status={this.state.openModal} closeModal={this.closeModal} refresh={this.refresh} data={this.props.data} statusCreate={false} />
          }
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = ({ loading, userId, error, isAdminsuper, ip, isAdminRoom }) => {
  return {
    loading,
    userId,
    error,
    isAdminsuper,
    ip,
    isAdminRoom
  }
}
export default connect(mapStateToProps)(cardBookingRoom)