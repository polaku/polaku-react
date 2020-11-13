import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  Paper, Grid, Tooltip, Checkbox
} from '@material-ui/core';

import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined';
import DeleteIcon from '@material-ui/icons/Delete';

import { fetchDataAddress } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

class cardEmployee extends Component {
  state = {
    notComplete: false,
    isActive: false
  }

  componentDidMount() {
    this.setState({
      isActive: this.props.data.isActive === 1 ? true : false
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.nik !== this.props.data.nik) {
      this.setState({
        isActive: this.props.data.isActive
      })
    }
  }

  handleChangeCheck = event => {
    this.setState({
      isActive: event.target.checked
    })

    let token = Cookies.get('POLAGROUP')

    API.put(`/users/editUser/${this.props.data.userId}`, { isActive: event.target.checked }, { headers: { token } })
      .then(() => {
        this.props.refresh()
      })
      .catch(err => {
        console.log(err)
        swal('please try again')
      })
  }

  // handleChangeCheck = event => {
  //   this.setState({
  //     check: event.target.checked
  //   })
  //   this.props.handleCheck(this.props.data.id)
  // }

  // delete = () => {
  //   swal({
  //     title: "Apa anda yakin ingin menyetujuinya?",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   })
  //     .then(async (yesAnswer) => {
  //       if (yesAnswer) {
  //         try {
  //           let token = Cookies.get('POLAGROUP')
  //           await API.delete(`/address/${this.props.data.id}`, { headers: { token } })
  //           swal("Hapus alamat sukses", "", "success")
  //           await this.props.fetchDataAddress()
  //           await this.props.fetchData()
  //         } catch (err) {
  //           swal("Hapus alamat gagal", "", "error")
  //         }
  //       }
  //     });
  // }

  render() {
    return (
      <Paper style={{ display: 'flex', padding: '15px 20px', margin: 1, borderRadius: 0, alignItems: 'center' }}>
        <Grid style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: 0, }}>{this.props.data.name}</p>
          <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>{this.props.data.position}</p>
        </Grid>
        <p style={{ margin: 0, width: '25%' }}>{this.props.data.department}</p>
        <p style={{ margin: 0, width: '15%' }}>{this.props.data.evaluator1}</p>
        <p style={{ margin: 0, width: '15%' }}>{this.props.data.evaluator2}</p>
        <p style={{ margin: 0, width: '10%' }}>
          <Tooltip title={this.state.isActive ? "Jadikan non aktif" : "Jadikan aktif"} placement="top-end">
            <Checkbox
              checked={this.state.isActive}
              onChange={this.handleChangeCheck}
              value="secondary"
              color="secondary"
            />
          </Tooltip>
        </p>
        <Grid style={{ width: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid style={{ minWidth: '100px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
            {
              this.state.notComplete
              && <Tooltip title="Lengkapi data" aria-label="lengkapi-data">
                <ErrorOutlinedIcon style={{ color: 'red' }} />
              </Tooltip>
            }
            <Tooltip title="Edit karyawan" aria-label="edit-data">
              <img src={process.env.PUBLIC_URL + '/edit.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-employee', { data: this.props.data, index: this.props.index })} />
            </Tooltip>
            {/* <Tooltip title="Hapus karyawan" aria-label="delete-data">
              <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={this.delete} />
            </Tooltip> */}
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