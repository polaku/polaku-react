import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  Paper, Grid, Tooltip, Checkbox, Chip
} from '@material-ui/core';

import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined';
// import DeleteIcon from '@material-ui/icons/Delete';

import { fetchDataAddress } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

class cardEmployee extends Component {
  state = {
    notComplete: false,
    isActive: false,
    department: "-"
  }

  componentDidMount() {
    this.setState({
      isActive: this.props.data.isActive === 1 ? true : false
    })

    let department = []
    this.props.data.position && this.props.data.position.length > 0 && this.props.data.position.forEach(element => {
      if (element.tbl_structure_department.company_id === this.props.data.companyId) {
        department.push(element.tbl_structure_department.department.deptname)
      }
    });

    this.setState({ department: department.length > 0 ? department.join(', ') : '-' })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.nik !== this.props.data.nik) {
      this.setState({
        isActive: this.props.data.isActive
      })
    }
  }

  handleChangeCheck = async (event) => {
    this.setState({
      isActive: event.target.checked
    })

    let token = Cookies.get('POLAGROUP')

    API.put(`/users/editUser/${this.props.data.userId}`, { isActive: event.target.checked }, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(() => {
        this.props.refresh()
      })
      .catch(err => {
        // console.log(err)
        if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
          swal('Gagal', 'Koneksi tidak stabil', 'error')
        } else {
          swal('please try again')
        }
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
  //           await API.delete(`/address/${this.props.data.id}`, { headers: { token,
  //           ip: this.props.ip } })
  //           swal("Hapus alamat sukses", "", "success")
  //           await this.props.fetchDataAddress()
  //           await this.props.fetchData()
  //         } catch (err) {
  //           if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
  //             swal('Gagal', 'Koneksi tidak stabil', 'error')
  //           } else {
  //             swal("Hapus alamat gagal", "", "error")
  //           }
  //         }
  //       }
  //     });
  // }

  render() {
    return (
      <Paper style={{ display: 'flex', padding: '15px 20px', margin: 1, borderRadius: 0, alignItems: 'center' }}>
        <Grid style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: 0, }}>{this.props.data.name}</p>
          <Grid style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {
              this.props.data.position
                ? (this.props.data.position.length > 0
                  ? this.props.data.position.map((position, index) =>
                    <Grid key={this.props.userId + "position" + index} style={{ display: 'flex', alignItems: 'center', marginRight: 5, marginTop: 3 }}>
                      <Chip
                        size="small"
                        color="secondary"
                        label={<p style={{ fontSize: 10 }}>{position.tbl_structure_department.tbl_company.acronym}</p>} style={{ marginRight: 3 }} />
                      <p style={{ margin: 0, color: 'gray', fontSize: 12 }}>{position.tbl_position.position}
                        {this.props.data.position.length > 1 && index !== this.props.data.position.length - 1 ? ', ' : ''} </p>
                    </Grid>
                  )
                  : '-')
                : '-'
            }
          </Grid>
        </Grid>
        <p style={{ margin: 0, width: '20%' }}>{this.state.department}</p>
        <p style={{ margin: 0, width: '15%' }}>{this.props.data.evaluator1}</p>
        <p style={{ margin: 0, width: '15%' }}>{this.props.data.evaluator2}</p>
        <p style={{ margin: 0, width: '10%' }}>{this.props.data.status || '-'}</p>
        <Grid style={{ margin: 0, width: '5%' }}>
          <Tooltip title={this.state.isActive ? "Jadikan non aktif" : "Jadikan aktif"} placement="top-end">
            <Checkbox
              checked={this.state.isActive}
              onChange={this.handleChangeCheck}
              value="secondary"
              color="secondary"
            />
          </Tooltip>
        </Grid>
        {
          this.props.isAdminHR && <Grid style={{ width: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        }
      </Paper>
    )
  }
}

const mapDispatchToProps = {
  fetchDataAddress
}

const mapStateToProps = ({ ip, isAdminHR }) => {
  return {
    ip,
    isAdminHR
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(cardEmployee))