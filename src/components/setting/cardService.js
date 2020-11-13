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

class cardService extends Component {
  state = {
    notComplete: false
  }

  // handleChangeCheck = event => {
  //   this.setState({
  //     check: event.target.checked
  //   })
  //   this.props.handleCheck(this.props.data.id)
  // }

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
            await API.delete(`/dinas/user/${this.props.data.userId}`, { headers: { token } })
            swal("Hapus dinas karyawan sukses", "", "success")
            await this.props.refresh()
          } catch (err) {
            swal("Hapus dinas karyawan gagal", "", "error")
          }
        }
      });
  }

  render() {
    return (
      <Paper style={{ display: 'flex', padding: '15px 20px', margin: 1, borderRadius: 0, alignItems: 'center' }}>
        <Grid style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>NIK : {this.props.data.nik}</p>
          <p style={{ margin: 0 }}>{this.props.data.name}</p>
        </Grid>
        <p style={{ margin: 0, width: '25%' }}>{this.props.data.totalDinas} lokasi</p>
        <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid style={{ minWidth: '100px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            {
              this.state.notComplete
              && <Tooltip title="Lengkapi data" aria-label="lengkapi-data">
                <ErrorOutlinedIcon style={{ color: 'red' }} />
              </Tooltip>
            }
            <Tooltip title="Edit dinas karyawan" aria-label="edit-data">
              <img src={process.env.PUBLIC_URL + '/edit.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-service', { data: this.props.data, index: this.props.index })} />
            </Tooltip>
            <Tooltip title="Hapus dinas karyawan" aria-label="delete-data">
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

export default connect(null, mapDispatchToProps)(withRouter(cardService))