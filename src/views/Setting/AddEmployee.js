import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Button, 
  // Select, MenuItem, FormControl 
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import CardAddEmployee from '../../components/setting/cardAddEmployee';

import swal from 'sweetalert';

import { fetchDataCompanies, fetchDataAddress } from '../../store/action';

import { API } from '../../config/API';

class AddEmployee extends Component {
  state = {
    department: [false],
    statusSubmit: false,
    companyId: '',
    disableCompanyId: false,
    data: [],
    dataForEdit: [],
    tempDataForEdit: [],
    proses: false
  }

  async componentDidMount() {
    if (this.props.location.state) {
      if (this.props.location.state.data) {
        let data = [this.props.location.state.data]
        data.push()
        this.setState({ companyId: this.props.location.state.data.company_id, disableCompanyId: true, dataForEdit: data })
      } else {
        this.setState({ companyId: this.props.location.state.company_id, disableCompanyId: true })
      }
    }

    await this.props.fetchDataCompanies()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  navigateBack = () => {
    this.props.history.push('/setting/setting-perusahaan')
  }

  AddEmployee = () => {
    let listDivisi = this.state.department
    listDivisi.push(false)
    this.setState({ alamat: listDivisi })
  }

  deleteAddress = (index) => {
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
    if (this.state.companyId !== '') {
      if (this.props.location.state && this.props.location.state.data) {
        let newData = this.state.tempDataForEdit
        newData.push(args)
        let token = Cookies.get('POLAGROUP'), promises = []

        if (newData.length === this.state.dataForEdit.length) {
          this.setState({ proses: true })
          newData.forEach((data, index) => {
            if (this.state.indexMainAddress !== null) {
              if (index === this.state.indexMainAddress) {
                data.append('isMainAddress', true)
              } else {
                data.append('isMainAddress', false)
              }
            }
            promises.push(API.put(`/address/${data.get('addressId')}`, data, { headers: { token } }))
          })
          Promise.all(promises)
            .then(async ({ data }) => {
              this.setState({ data: [], proses: false })
              await this.props.fetchDataAddress()
              swal('Ubah alamat sukses', '', 'success')
              this.props.history.goBack()
            })
            .catch(err => {
              this.setState({ proses: false })
              swal('Ubah alamat gagal', '', 'error')
            })
        } else {
          this.setState({ tempDataForEdit: newData })
        }
      } else {
        let newData = this.state.data
        newData.push(args)
        this.setState({ proses: true })
        let token = Cookies.get('POLAGROUP'), promises = []

        if (newData.length === this.state.department.length) {
          newData.forEach((data, index) => {
            if (this.state.indexMainAddress !== null) {
              if (index === this.state.indexMainAddress) {
                data.append('isMainAddress', true)
              } else {
                data.append('isMainAddress', false)
              }
            }
            promises.push(API.post('/address', data, { headers: { token } }))
          })
          Promise.all(promises)
            .then(async ({ data }) => {
              this.setState({ data: [], proses: false })
              await this.props.fetchDataAddress()
              swal('Tambah alamat sukses', '', 'success')
              this.props.history.goBack()
            })
            .catch(err => {
              this.setState({ proses: false })
              swal('Tambah alamat gagal', '', 'error')
            })
        } else {
          this.setState({ data: newData })
        }
      }
    } else {
      swal('Perusahaan belum dipilih', '', 'warning')
    }
  }

  render() {
    return (
      <Grid>
        <Grid style={{ display: 'flex' }}>
          <Grid style={{ backgroundColor: '#d71149', padding: 10, borderRadius: 50, width: 60 }}>
            <img src={process.env.PUBLIC_URL + '/employee.png'} alt="Logo" style={{ width: 35, height: 35, alignSelf: 'center' }} />
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
                    <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, marginRight: 15, cursor: 'pointer' }} onClick={() => this.deleteAddress(index)} />
                  </>
                }
              </Grid>
              <CardAddEmployee statusSubmit={this.state.statusSubmit} companyId={this.state.companyId} sendData={this.sendData} data={this.state.dataForEdit[index]} proses={this.state.proses} />
            </Grid>
          )
        }
        {
          this.state.dataForEdit.length === 0 && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.AddEmployee} disabled={this.state.proses}>+ tambah karyawan baru</p>
        }

        <Button variant="outlined" color="secondary" style={{ width: 150, margin: 10 }} onClick={() => this.props.history.goBack()} disabled={this.state.proses}>batalkan</Button>
        <Button variant="contained" color="secondary" style={{ width: 150, margin: 10 }} onClick={this.submit} disabled={this.state.proses}>simpan</Button>
      </Grid>
    )
  }
}



const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataAddress
}

const mapStateToProps = ({ dataCompanies }) => {
  return {
    dataCompanies
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployee)