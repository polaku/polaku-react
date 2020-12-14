import React, { Component } from 'react'
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  Grid, Paper,
  // Tooltip
} from '@material-ui/core';

// import DeleteIcon from '@material-ui/icons/Delete';
import ModalAktifitas from '../modal/modalAktifitas';

import { API } from '../../config/API';
import swal from 'sweetalert';

class cardAktifitas extends Component {
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
            swal("Hapus ruang gagal", "", "error")
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
          <p style={{ margin: 0, width: '15%' }}>karyawan</p>
          <p style={{ margin: 0, width: '15%' }}>update</p>
          <p style={{ margin: 0, width: '20%' }}>17 Desember 2019 20:00</p>
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

export default connect(mapStateToProps)(withRouter(cardAktifitas))