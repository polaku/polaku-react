import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Button, Select, MenuItem, FormControl } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import Loading from '../../components/Loading';
import swal from 'sweetalert';

import { fetchDataCompanies, fetchDataDepartment, fetchDataPosition, fetchDataStructure } from '../../store/action';

import { API } from '../../config/API';

const CardAddDepartment = lazy(() => import('../../components/setting/cardAddDepartment'));

class AddDepartment extends Component {
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
      loading: false,
      optionCompany: []
    }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    if (this.props.location.state) {
      if (this.props.location.state.data) {
        let data = [this.props.location.state.data]
        data.push()
        this.setState({ companyId: this.props.location.state.data.company_id, disableCompanyId: true, dataForEdit: data })
      } else {
        this.setState({ disableCompanyId: false })

      }
    }

    await this.props.fetchDataCompanies()
    await this.props.fetchDataDepartment()
    await this.props.fetchDataPosition()
    this.setState({ loading: false })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.dataCompanies !== prevProps.dataCompanies || this.props.admin !== prevProps.admin) {
      let optionCompany = []
      if (this.props.isAdminsuper) {
        this.setState({ optionCompany: [...optionCompany, ...this.props.dataCompanies] })
      } else {
        let idCompany = []
        await this.props.admin.forEach(el => {
          if (idCompany.indexOf(el.company_id) === -1) {
            let check = this.props.dataCompanies.find(element => el.company_id === element.company_id)
            if (check) {
              idCompany.push(el.company_id)
              optionCompany.push(check)
            }
          }
        })

        this.setState({ optionCompany })
      }
      if (optionCompany.length === 1) {
        this.setState({ companyId: optionCompany[0].company_id })
      }
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  navigateBack = () => {
    this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
  }

  addDivisi = () => {
    let listDivisi = this.state.department
    listDivisi.push(false)
    this.setState({ department: listDivisi })
  }

  deleteDepartment = (index) => {
    let listDivisi = this.state.department;

    listDivisi.splice(index, 1);
    this.setState({
      department: listDivisi
    });
  }

  submit = () => {
    if (this.state.companyId !== '') {
      this.setState({ statusSubmit: true })
    } else {
      this.setState({ statusSubmit: false })
      swal('Perusahaan belum dipilih', '', 'warning')
    }
  }

  sendData = (args) => {
    if (this.props.location.state && this.props.location.state.data) {
      let newData = this.state.tempDataForEdit
      newData.push(args)
      let token = Cookies.get('POLAGROUP'), promises = []

      if (newData.length === this.state.dataForEdit.length) {
        this.setState({ proses: true })
        newData.forEach(async (data, index) => {
          data.companyId = this.state.companyId
          promises.push(API.put(`/structure/${data.id}`, data, {
            headers: {
              token,
              ip: this.props.ip
            }
          }))
        })
        Promise.all(promises)
          .then(async ({ data }) => {
            this.setState({ data: [], proses: false })
            await this.props.fetchDataStructure()
            swal('Ubah department sukses', '', 'success')
            this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
          })
          .catch(err => {
            this.setState({ proses: false, statusSubmit: false })
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else {
              swal('Ubah department gagal', '', 'error')
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

      if (newData.length === this.state.department.length) {
        newData.forEach(async (data, index) => {
          data.companyId = this.state.companyId
          promises.push(API.post('/structure', data, {
            headers: {
              token,
              ip: this.props.ip
            }
          }))
        })
        Promise.all(promises)
          .then(async ({ data }) => {
            this.setState({ data: [], proses: false })
            swal('Tambah department sukses', '', 'success')
            this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
          })
          .catch(err => {
            this.setState({ proses: false, statusSubmit: false })
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else {
              swal('Tambah department gagal', '', 'error')
            }
          })
      } else {
        this.setState({ data: newData })
      }
    }
  }

  cancelSubmit = () => {
    this.setState({ statusSubmit: false, proses: false })
  }

  render() {
    if (this.state.loading) return <Loading loading={this.state.loading} />;
    return (
      <Grid>
        <Grid style={{ display: 'flex' }}>
          <Grid style={{ backgroundColor: '#d71149', padding: 10, borderRadius: 50 }}>
            <img src={require('../../Assets/structure.png').default} loading="lazy" alt="Logo" style={{ width: 60, height: 50, alignSelf: 'center' }} />
          </Grid>
          <Grid style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px' }}>
            {
              (this.props.location.state && this.props.location.state.data)
                ? <b style={{ fontSize: 20 }}>Ubah Department</b>
                : <b style={{ fontSize: 20 }}>Tambah Department</b>
            }

            <p style={{ margin: '5px 0px' }}>Pastikan yang diisi sesuai dengan surat keputusan SO</p>
            <p style={{ margin: 0, fontSize: 12, color: '#d71149', cursor: 'pointer' }} onClick={this.navigateBack}>{'<'} kembali ke pengaturan</p>
          </Grid>
        </Grid>

        <Grid style={{ display: 'flex', alignItems: 'center' }}>
          <b style={{ fontSize: 17, marginRight: 20, marginLeft: 10 }}>Perusahaan</b>
          <FormControl variant="outlined" size="small" style={{ margin: '10px 0 5px 0' }}>
            <Select
              value={this.state.companyId}
              onChange={this.handleChange('companyId')}
              disabled={(this.state.proses && this.state.statusSubmit) || this.state.disableCompanyId}
              style={{ width: 130 }}
            >
              {
                this.state.optionCompany.map((company, index) =>
                  <MenuItem value={company.company_id} key={index}>{company.acronym}</MenuItem>
                )
              }
            </Select>
          </FormControl>
        </Grid>
        {
          this.state.department.map((department, index) =>
            <Grid style={{ margin: '10px 0px' }} key={index}>
              <Grid style={{ margin: '10px 0px 0px 10px', display: 'flex', alignItems: 'center' }}>
                {
                  this.state.department.length > 1 && <>
                    <b style={{ margin: 0, fontSize: 16 }}>Departemen {index + 1}</b>
                    <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, marginRight: 15, cursor: 'pointer' }} onClick={() => this.deleteDepartment(index)} />
                  </>
                }
              </Grid>
              <CardAddDepartment statusSubmit={this.state.statusSubmit} companyId={this.state.companyId} sendData={this.sendData} data={this.state.dataForEdit[index]} proses={this.state.proses && this.state.statusSubmit} cancelSubmit={this.cancelSubmit} />
            </Grid>
          )
        }
        {
          this.state.dataForEdit.length === 0 && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.addDivisi} disabled={this.state.proses && this.state.statusSubmit}>+ tambah department baru</p>
        }

        <Button variant="outlined" color="secondary" style={{ width: 150, margin: 10 }} onClick={() => this.props.history.goBack()} disabled={this.state.proses && this.state.statusSubmit}>batalkan</Button>
        <Button variant="contained" color="secondary" style={{ width: 150, margin: 10 }} onClick={this.submit} disabled={this.state.proses && this.state.statusSubmit}>simpan</Button>
      </Grid>
    )
  }
}



const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataDepartment,
  fetchDataPosition,
  fetchDataStructure
}

const mapStateToProps = ({ dataCompanies, isAdminsuper, ip, admin }) => {
  return {
    dataCompanies,
    isAdminsuper,
    ip,
    admin
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDepartment)