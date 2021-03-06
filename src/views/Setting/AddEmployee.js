import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Grid, Button
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import swal from 'sweetalert';

import { fetchDataCompanies, fetchDataUsers, fetchDataAddress } from '../../store/action';

import { API } from '../../config/API';

const CardAddEmployee = lazy(() => import('../../components/setting/cardAddEmployee'));

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: [false],
      statusSubmit: false,
      companyId: '',
      disableCompanyId: false,
      data: [],
      dataForEdit: [],
      tempDataForEdit: [],
      proses: false,

      optionUser: [],
    }
  }

  async componentDidMount() {
    await this.fetchOptionUser()
    if (this.props.location.state) {
      if (this.props.location.state.data) {
        let data = [this.props.location.state.data]
        this.setState({ dataForEdit: data })
      } else {
        this.setState({ companyId: this.props.location.state.company_id, disableCompanyId: true })
      }
    }

    await this.props.fetchDataCompanies()
  }

  fetchOptionUser = async () => {
    try {
      let token = Cookies.get('POLAGROUP')

      let getData = await API.get(`/users/for-option`, { headers: { token } })

      let listUser = []
      await getData.data.data.forEach(user => {
        listUser.push({ value: user.user_id, label: user.tbl_account_detail.fullname })
      })
      this.setState({ optionUser: listUser })
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      }
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  navigateBack = () => {
    this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
  }

  AddEmployee = () => {
    let listDivisi = this.state.department
    listDivisi.push(false)
    this.setState({ alamat: listDivisi })
  }

  deleteEmployee = (index) => {
    let listDivisi = this.state.department;

    listDivisi.splice(index, 1);
    this.setState({
      alamat: listDivisi
    });
  }

  submit = () => {
    this.setState({ statusSubmit: true })
  }

  sendData = (args) => {
    // console.log("MASUK 1")
    if (this.props.location.state && this.props.location.state.data) {
      let newData = this.state.tempDataForEdit
      newData.push(args)
      this.setState({ proses: true })
      let token = Cookies.get('POLAGROUP'), promises = []

      if (newData.length === this.state.dataForEdit.length) {
        this.setState({ proses: true })
        newData.forEach(async (data, index) => {
          promises.push(API.put(`/users/${data.get('userId')}`, data, {
            headers: {
              token,
              ip: this.props.ip
            }
          }))
        })
        Promise.all(promises)
          .then(async ({ data }) => {
            this.setState({ data: [], proses: false, statusSubmit: false })
            await this.props.fetchDataUsers({ limit: 10, page: 0 })
            swal('Ubah karyawan sukses', '', 'success')
            this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
          })
          .catch(err => {
            this.setState({ proses: false, statusSubmit: false })
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else {
              swal('Ubah karyawan gagal', '', 'error')
            }
          })
      } else {
        this.setState({ tempDataForEdit: newData })
      }
    } else {
      let newData = this.state.data
      newData.push(args)
      this.setState({ proses: true })
      let token = Cookies.get('POLAGROUP'), promises = []
      // console.log("MASUK 2")

      // console.log(newData.length, this.state.department.length)
      if (newData.length === this.state.department.length) {
        // console.log("MASUK 3")
        newData.forEach(async (data, index) => {
          promises.push(API.post(`/users/register`, data, {
            headers: {
              token,
              ip: this.props.ip
            }
          }))
        })
        Promise.all(promises)
          .then(async ({ data }) => {
            // console.log("OKEE")
            this.setState({ data: [], proses: false, statusSubmit: false })
            await this.props.fetchDataUsers({ limit: 10, page: 0 })
            swal('Tambah karyawan sukses', '', 'success')
            this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
          })
          .catch(err => {
            // console.log("ERROR 1", err)
            this.setState({ proses: false, statusSubmit: false, department: [false], data: [] })
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else {
              swal('Tambah karyawan gagal', '', 'error')
            }
          })
      } else {
        this.setState({ data: newData })
      }
    }
  }

  cancelSubmit = () => {
    this.setState({ proses: false, statusSubmit: false, department: [false], data: [] })
  }

  render() {
    return (
      <Grid>
        <Grid style={{ display: 'flex' }}>
          <Grid style={{ backgroundColor: '#d71149', padding: 10, borderRadius: 50, width: 60 }}>
            <img src={require('../../Assets/employee.png').default} loading="lazy" alt="Logo" style={{ width: 35, height: 35, alignSelf: 'center' }} />
          </Grid>
          <Grid style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px' }}>
            <b style={{ fontSize: 20 }}>Tambah Karyawan</b>
            <p style={{ margin: 0, fontSize: 12, color: '#d71149', cursor: 'pointer' }} onClick={this.navigateBack}>{'<'} kembali ke pengaturan</p>
          </Grid>
        </Grid>


        {
          this.state.department.map((alamat, index) =>
            <Grid style={{ margin: '10px 0px 20px' }} key={index}>
              <Grid style={{ margin: '10px 0px 0px 10px', display: 'flex', alignItems: 'center' }}>
                {
                  this.state.department.length > 1 && <>
                    <b style={{ margin: 0, fontSize: 16 }}>Karyawan {index + 1}</b>
                    <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, marginRight: 15, cursor: 'pointer' }} onClick={() => this.deleteEmployee(index)} />
                  </>
                }
              </Grid>
              <CardAddEmployee statusSubmit={this.state.statusSubmit} companyId={this.state.companyId} sendData={this.sendData} data={this.state.dataForEdit[index]} proses={this.state.proses} optionUser={this.state.optionUser} cancelSubmit={this.cancelSubmit} />
            </Grid>
          )
        }
        {
          this.state.dataForEdit.length === 0 && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.AddEmployee} disabled={this.state.proses}>+ tambah karyawan baru</p>
        }

        <Grid style={{ flexDirection: 'column' }}>
          <i>Password adalah tanggal lahir (DDMMYYYY)</i>
          <Grid style={{ marginTop: 5 }}>
            <Button variant="outlined" color="secondary" style={{ width: 150, margin: 10 }} onClick={() => this.props.history.goBack()} disabled={this.state.proses}>batalkan</Button>
            <Button variant="contained" color="secondary" style={{ width: 150, margin: 10 }} onClick={this.submit} disabled={this.state.proses}>simpan</Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}



const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataAddress,
  fetchDataUsers
}

const mapStateToProps = ({ dataCompanies, ip }) => {
  return {
    dataCompanies,
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee)