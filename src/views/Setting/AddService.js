import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import publicIp from 'public-ip';

import { Grid, Button } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import CardAddService from '../../components/setting/cardAddService';

import swal from 'sweetalert';

import { fetchDataCompanies, fetchDataUsers, fetchDataAddress, fetchDataDinas } from '../../store/action';

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
        let temp = []
        let data = this.props.location.state.data.dinas

        await data.forEach(el => temp.push(true))
        this.setState({ dataForEdit: data, service: temp })
      }
    }

    await this.props.fetchDataCompanies()
    await this.props.fetchDataUsers()
    await this.props.fetchDataAddress()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  navigateBack = () => {
    this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
  }

  addDinas = () => {
    let listDinas = this.state.service
    listDinas.push(false)
    this.setState({ service: listDinas })
  }

  deleteService = (index) => {
    let listDinas = this.state.service;
    listDinas.splice(index, 1);
    this.setState({
      service: listDinas
    });
  }

  submit = () => {
    this.setState({ statusSubmit: true })
  }

  sendData = async (args) => {
    if (this.props.location.state && this.props.location.state.data) {
      let newData = this.state.tempDataForEdit
      newData.push(args)
      let token = Cookies.get('POLAGROUP'), promises = []

      if (newData.length === this.state.service.length) {
        this.setState({ proses: true })

        await this.state.dataForEdit.forEach(async (el) => {
          let check = newData.find(element => element.dinasId === el.id)
          if (!check) await API.delete(`/dinas/${el.id}`, {
            headers: {
              token,
              ip: await publicIp.v4()
            }
          })
        })

        newData.forEach(async (data, index) => {
          promises.push(API.put(`/dinas/${data.dinasId}`, data, {
            headers: {
              token,
              ip: await publicIp.v4()
            }
          }))
        })
        Promise.all(promises)
          .then(async ({ data }) => {
            this.setState({ data: [], proses: false })
            await this.props.fetchDataDinas()
            swal('Ubah dinas sukses', '', 'success')
            this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
          })
          .catch(err => {

            this.setState({ proses: false, statusSubmit: false })
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
        newData.forEach(async (data, index) => {
          promises.push(API.post('/dinas', data, {
            headers: {
              token,
              ip: await publicIp.v4()
            }
          }))
        })
        Promise.all(promises)
          .then(async ({ data }) => {
            this.setState({ data: [], proses: false })
            await this.props.fetchDataDinas()
            swal('Tambah dinas sukses', '', 'success')
            this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
          })
          .catch(err => {
            this.setState({ proses: false, statusSubmit: false })
            swal('Tambah dinas gagal', '', 'error')
          })
      } else {
        this.setState({ data: newData })
      }
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
            <Grid style={{ margin: '10px 0px 20px' }} key={index}>
              <Grid style={{ margin: '10px 0px 0px 10px', display: 'flex', alignItems: 'center' }}>
                {
                  this.state.service.length > 1 && <>
                    <b style={{ margin: 0, fontSize: 16 }}>Dinas {index + 1}</b>
                    <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, marginRight: 15, cursor: 'pointer' }} onClick={() => this.deleteService(index)} />
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

        <Button variant="outlined" color="secondary" style={{ width: 150, margin: 10 }} onClick={() => this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })} disabled={this.state.proses}>batalkan</Button>
        <Button variant="contained" color="secondary" style={{ width: 150, margin: 10 }} onClick={this.submit} disabled={this.state.proses}>simpan</Button>
      </Grid>
    )
  }
}



const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataUsers,
  fetchDataAddress,
  fetchDataDinas
}

const mapStateToProps = ({ dataCompanies, dataAddress }) => {
  return {
    dataCompanies,
    dataAddress
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddService)