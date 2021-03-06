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

class cardAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notComplete: false
    }
  }

  componentDidMount() {
    if (!this.props.data.acronym ||
      !this.props.data.address ||
      !this.props.data.fax ||
      !this.props.data.phone ||
      !this.props.data.operationDay ||
      this.props.data.tbl_operation_hours.length === 0 ||
      this.props.data.tbl_photo_addresses.length === 0 ||
      this.props.data.tbl_recesses.length === 0
    ) {
      this.setState({ notComplete: true })
    }
  }

  handleChangeCheck = event => {
    this.setState({
      check: event.target.checked
    })
    this.props.handleCheck(this.props.data.id)
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
            await API.delete(`/address/${this.props.data.id}`, {
              headers: {
                token,
                ip: this.props.ip
              }
            })
            swal("Hapus alamat sukses", "", "success")
            await this.props.refresh()
          } catch (err) {
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else {
              swal("Hapus alamat gagal", "", "error")
            }
          }
        }
      });
  }

  render() {
    return (
      <Paper style={{ display: 'flex', padding: '15px 20px', margin: 1, borderRadius: 0, alignItems: 'center' }}>
        <Grid style={{ width: '40%' }}>
          <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <b style={{ margin: 0, fontSize: 15 }}>{this.props.data.tbl_building && this.props.data.tbl_building.building}</b>
            {
              this.props.data.is_main_address && <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d71149', color: 'white', borderRadius: 15, width: 50, height: 20, marginLeft: 8 }}>
                <b style={{ fontSize: 10 }}>utama</b>
              </Grid>
            }
          </Grid>
          <p style={{ margin: 0, fontSize: 13 }}>{this.props.data.tbl_building && this.props.data.tbl_building.address}</p>
        </Grid>
        <b style={{ margin: 0, width: '20%' }}>{this.props.data.tbl_company.acronym}</b>
        <p style={{ margin: 0, width: '20%' }}>{
          this.props.data.totalEmployee
        }</p>
        <Grid style={{ width: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid style={{ width: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            {
              this.state.notComplete
                ? <Tooltip title="Lengkapi data" aria-label="lengkapi-data">
                  <ErrorOutlinedIcon style={{ color: 'red' }} />
                </Tooltip>
                : <Grid style={{ width: 24 }} />
            }
            <Tooltip title="Edit alamat" aria-label="edit-data">
              <img src={require('../../Assets/edit.png').default} loading="lazy" alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-address', { data: this.props.data, index: this.props.index })} />
            </Tooltip>
            <Tooltip title="Hapus alamat" aria-label="delete-data">
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(cardAddress))