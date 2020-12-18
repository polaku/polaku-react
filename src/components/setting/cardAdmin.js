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
    notComplete: false,
    status: ''
  }

  async componentDidMount() {
    // 1=Berita Pola, 
    // 2=Alamat, 
    // 3=Struktur, 
    // 4=Karyawan, 
    // 5=Admin, 
    // 6=Meeting Room, 
    // 7=KPIM&TAL, 
    // 8=HR

    let status = null

    console.log(this.props.data)

    await this.props.data.tbl_admin_companies.forEach(element => {

      let checkBeritaPola = element.tbl_designation.tbl_user_roles.find(el => el.menu_id === 1)
      let checkAlamat = element.tbl_designation.tbl_user_roles.find(el => el.menu_id === 2)
      let checkStruktur = element.tbl_designation.tbl_user_roles.find(el => el.menu_id === 3)
      let checkKaryawan = element.tbl_designation.tbl_user_roles.find(el => el.menu_id === 4)
      let checkAdmin = element.tbl_designation.tbl_user_roles.find(el => el.menu_id === 5)
      let checkMeetingRoom = element.tbl_designation.tbl_user_roles.find(el => el.menu_id === 6)
      let checkKPIM = element.tbl_designation.tbl_user_roles.find(el => el.menu_id === 7)
      let checkHR = element.tbl_designation.tbl_user_roles.find(el => el.menu_id === 8)
      let statusAdmin = []

      if (checkAlamat && checkStruktur && checkKaryawan && checkAdmin && checkMeetingRoom && checkKPIM && checkHR) {
        statusAdmin.push('Semua')
      } else {
        // if (checkBeritaPola) statusAdmin.push('Berita')
        if (checkAlamat) statusAdmin.push('Alamat')
        if (checkStruktur) statusAdmin.push('Struktur')
        if (checkKaryawan) statusAdmin.push('Karyawan')
        if (checkAdmin) statusAdmin.push('Admin')
        if (checkMeetingRoom) statusAdmin.push('Meeting Room')
        if (checkKPIM) statusAdmin.push('KPIM & TAL')
        if (checkHR) statusAdmin.push('HR')
      }

      let statusTemp = `${element.tbl_company.acronym} (Admin: ${statusAdmin.join(', ')})`

      if (status !== null) status = `${status}, ${statusTemp}`
      else status = statusTemp

    });
    this.setState({ status })
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
            await API.delete(`/designation/user/${this.props.data.user_id}`, {
              headers: {
                token,
                ip: this.props.ip
              }
            })
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
        <Grid style={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>NIK : {this.props.data.tbl_account_detail.nik}</p>
          <p style={{ margin: 0 }}>{this.props.data.tbl_account_detail.fullname}</p>
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
            {/* <Tooltip title="Edit admin" aria-label="edit-data">
              <img src={process.env.PUBLIC_URL + '/edit.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-admin', { data: this.props.data })} />
            </Tooltip> */}
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

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(cardAdmin))