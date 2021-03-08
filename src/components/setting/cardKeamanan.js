import React, { Component } from 'react'
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  Grid, Paper, Tooltip
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import ModalAktifitas from '../modal/modalAktifitas';

import { API } from '../../config/API';
import swal from 'sweetalert';

class cardKeamanan extends Component {
  state = {
    openModalAktifitas: false
  }

  handleModalAktifitas = () => {
    this.setState({ openModalAktifitas: !this.state.openModalAktifitas })
  }

  delete = () => {
    swal({
      title: "Apa anda yakin ingin menghapusnya?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (yesAnswer) => {
        if (yesAnswer) {
          try {
            let token = Cookies.get('POLAGROUP')
            await API.delete(`/bookingRoom/rooms/${this.props.data.room_id}`, {
              headers: {
                token,
                ip: this.props.ip
              }
            })
            swal("Hapus ruang sukses", "", "success")
            await this.props.refresh()
          } catch (err) {
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else {
              swal("Hapus ruang gagal", "", "error")
            }
          }
        }
      });
  }

  render() {
    return (
      <>
        <Paper style={{ display: 'flex', padding: '15px 20px', margin: 1, borderRadius: 0, alignItems: 'center' }}>
          <Grid style={{ width: '30%' }}>
            Ardi
        </Grid>
          <p style={{ margin: 0, width: '15%' }}>3 perangkat</p>
          <Grid style={{ width: '15%' }}>
            <p style={{ margin: 0 }}>5 hari yang lalu</p>
            <p style={{ margin: 0, fontSize: 10, textDecoration: 'underline', cursor: 'pointer' }} onClick={this.handleModalAktifitas}>lihat aktifitas</p>
          </Grid>
          <p style={{ margin: 0, width: '20%' }}>-</p>
          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20%' }}>
            <Grid style={{ minWidth: '100px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
              <Tooltip title="Edit ruang" aria-label="edit-data">
                <img src={process.env.PUBLIC_URL + '/edit.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/setting/setting-meeting-room/add-meeting-room', { data: this.props.data })} />
              </Tooltip>
              <Tooltip title="Hapus ruang" aria-label="delete-data">
                <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={this.delete} />
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
        {
          this.state.openModalAktifitas && <ModalAktifitas open={this.state.openModalAktifitas} close={this.handleModalAktifitas} />
        }
      </>
    )
  }
}

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps)(withRouter(cardKeamanan))