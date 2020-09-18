import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  Paper, Grid, Tooltip
  // Checkbox, 
} from '@material-ui/core';

import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined';
import DeleteIcon from '@material-ui/icons/Delete';

import { fetchDataAddress } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

class cardEmployee extends Component {
  state = {
    notComplete: false
  }

  componentDidMount() {
    // if (!this.props.data.acronym ||
    //   !this.props.data.address ||
    //   !this.props.data.fax ||
    //   !this.props.data.phone ||
    //   !this.props.data.operationDay ||
    //   this.props.data.tbl_operation_hours.length === 0 ||
    //   this.props.data.tbl_photo_addresses.length === 0 ||
    //   this.props.data.tbl_recesses.length === 0
    // ) {
    //   this.setState({ notComplete: true })
    // }
  }

  handleChangeCheck = event => {
    this.setState({
      check: event.target.checked
    })
    this.props.handleCheck(this.props.data.id)
  }

  delete = () => {
    swal({
      title: "Apa anda yakin ingin menyetujuinya?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (yesAnswer) => {
        if (yesAnswer) {
          try {
            let token = Cookies.get('POLAGROUP')
            await API.delete(`/address/${this.props.data.id}`, { headers: { token } })
            swal("Hapus alamat sukses", "", "success")
            await this.props.fetchDataAddress()
            await this.props.fetchData()
          } catch (err) {
            swal("Hapus alamat gagal", "", "error")
          }
        }
      });

  }

  render() {
    return (
      <Paper style={{ display: 'flex', padding: '15px 20px', margin: 1, borderRadius: 0, alignItems: 'center' }}>
        <Grid style={{ width: '25%', display:'flex' }}>
        <img src={process.env.PUBLIC_URL + '/add-much-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />

          <p style={{ margin: 0, }}>Ardi</p>
        </Grid>
        <b style={{ margin: 0, width: '10%' }}>Business Development</b>
        <p style={{ margin: 0, width: '15%' }}>HI</p>
        <p style={{ margin: 0, width: '10%' }}>ADH</p>
        <p style={{ margin: 0, width: '10%' }}>Aktif</p>
        <Grid style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid style={{ width: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            {
              this.state.notComplete
                ? <Tooltip title="Lengkapi data" aria-label="lengkapi-data">
                  <ErrorOutlinedIcon style={{ color: 'red' }} />
                </Tooltip>
                : <Grid style={{ width: 24 }} />
            }
            <Tooltip title="Edit alamat" aria-label="edit-data">
              <img src={process.env.PUBLIC_URL + '/edit.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-address', { data: this.props.data })} />
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

export default connect(null, mapDispatchToProps)(withRouter(cardEmployee))