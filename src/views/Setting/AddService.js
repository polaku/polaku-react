import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Button } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import CardAddService from '../../components/setting/cardAddService';

import swal from 'sweetalert';

import { fetchDataCompanies, fetchDataAddress } from '../../store/action';

import { API } from '../../config/API';

class AddService extends Component {
  state = {
    service: [false],
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

  addDinas = () => {
    let listDinas = this.state.service
    listDinas.push(false)
    this.setState({ service: listDinas })
  }

  deleteServise = (index) => {
    let listDinas = this.state.service;
    listDinas.splice(index, 1);
    this.setState({
      service: listDinas
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
              swal('Ubah dinas sukses', '', 'success')
              this.props.history.goBack()
            })
            .catch(err => {
              this.setState({ proses: false })
              swal('Ubah dinas gagal', '', 'error')
            })
        } else {
          this.setState({ tempDataForEdit: newData })
        }
      } else {
        let newData = this.state.data
        newData.push(args)
        this.setState({ proses: true })
        let token = Cookies.get('POLAGROUP'), promises = []

        if (newData.length === this.state.service.length) {
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
              swal('Tambah dinas sukses', '', 'success')
              this.props.history.goBack()
            })
            .catch(err => {
              this.setState({ proses: false })
              swal('Tambah dinas gagal', '', 'error')
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
          <Grid style={{ display: 'flex', flexDirection: 'column' }}>
            <b style={{ fontSize: 20 }}>Dinas</b>
            <p style={{ margin: 0, fontSize: 12, color: '#d71149', cursor: 'pointer' }} onClick={this.navigateBack}>{'<'} kembali ke pengaturan</p>
          </Grid>
        </Grid>

        {
          this.state.service.map((dinas, index) =>
            <Grid style={{ margin: '10px 0px' }} key={index}>
              <Grid style={{ margin: '10px 0px 0px 10px', display: 'flex', alignItems: 'center' }}>
                {
                  this.state.service.length > 1 && <>
                    <b style={{ margin: 0, fontSize: 16 }}>Dinas {index + 1}</b>
                    <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, marginRight: 15, cursor: 'pointer' }} onClick={() => this.deleteServise(index)} />
                  </>
                }
              </Grid>
              <CardAddService statusSubmit={this.state.statusSubmit} companyId={this.state.companyId} sendData={this.sendData} data={this.state.dataForEdit[index]} proses={this.state.proses} />
            </Grid>
          )
        }
        {
          this.state.dataForEdit.length === 0 && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.addDinas} disabled={this.state.proses}>+ tambah dinas baru</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddService)