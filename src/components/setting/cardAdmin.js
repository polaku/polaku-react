import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  Paper, Grid, Tooltip
} from '@material-ui/core';

import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined';
import DeleteIcon from '@material-ui/icons/Delete';

import { fetchDataAddress } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

class cardAdmin extends Component {
  state = {
    notComplete: false
  }

  componentDidMount() {
    console.log(this.props.data)
    // 1=Berita Pola, 
    // 2=Alamat, 
    // 3=Struktur, 
    // 4=Karyawan, 
    // 5=Admin, 
    // 6=Meeting Room, 
    // 7=KPIM&TAL, 
    // 8=HR
    let checkBeritaPola = this.props.data.tbl_designation.tbl_user_roles.find(el => el.menu_id === 1)
    let checkAlamat = this.props.data.tbl_designation.tbl_user_roles.find(el => el.menu_id === 2)
    let checkStruktur = this.props.data.tbl_designation.tbl_user_roles.find(el => el.menu_id === 3)
    let checkKaryawan = this.props.data.tbl_designation.tbl_user_roles.find(el => el.menu_id === 4)
    let checkAdmin = this.props.data.tbl_designation.tbl_user_roles.find(el => el.menu_id === 5)
    let checkMeetingRoom = this.props.data.tbl_designation.tbl_user_roles.find(el => el.menu_id === 6)
    let checkKPIM = this.props.data.tbl_designation.tbl_user_roles.find(el => el.menu_id === 7)
    let checkHR = this.props.data.tbl_designation.tbl_user_roles.find(el => el.menu_id === 8)
    let statusAdmin = []

    if (checkBeritaPola && checkAlamat && checkStruktur && checkKaryawan && checkAdmin && checkMeetingRoom && checkKPIM && checkHR) {
      statusAdmin.push('Semua')
    } else {
      if (checkBeritaPola) statusAdmin.push('Berita')
      if (checkAlamat) statusAdmin.push('Alamat')
      if (checkStruktur) statusAdmin.push('Struktur')
      if (checkKaryawan) statusAdmin.push('Karyawan')
      if (checkAdmin) statusAdmin.push('Admin')
      if (checkMeetingRoom) statusAdmin.push('Meeting Room')
      if (checkKPIM) statusAdmin.push('KPIM & TAL')
      if (checkHR) statusAdmin.push('HR')
    }

    this.setState({ status: statusAdmin.join(', ') })
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
            await API.delete(`/designation/user/${this.props.data.user_id}`, { headers: { token } })
            swal("Hapus admin sukses", "", "success")
            await this.props.refresh()
          } catch (err) {
            swal("Hapus admin gagal", "", "error")
          }
        }
      });
  }

  render() {
    return (
      <Paper style={{ display: 'flex', padding: '15px 20px', margin: 1, borderRadius: 0, alignItems: 'center' }}>
        <Grid style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>NIK : {this.props.data.nik}</p>
          <p style={{ margin: 0 }}>{this.props.data.fullname}</p>
        </Grid>
        <p style={{ margin: 0, width: '50%' }}>{this.state.status}</p>
        <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20%' }}>
          <Grid style={{ minWidth: '100px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            {
              this.state.notComplete
              && <Tooltip title="Lengkapi data" aria-label="lengkapi-data">
                <ErrorOutlinedIcon style={{ color: 'red' }} />
              </Tooltip>
            }
            <Tooltip title="Edit admin" aria-label="edit-data">
              <img src={process.env.PUBLIC_URL + '/edit.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-admin', { data: this.props.data })} />
            </Tooltip>
            <Tooltip title="Hapus admin" aria-label="delete-data">
              <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={this.delete} />
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

const mapDispatchToProps = {
  fetchDataAddress
}

export default connect(null, mapDispatchToProps)(withRouter(cardAdmin))