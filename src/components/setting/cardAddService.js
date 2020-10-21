import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid, OutlinedInput, Select, MenuItem, Paper,
} from '@material-ui/core';

import { fetchDataCompanies, fetchDataAddress } from '../../store/action';

class cardAddService extends Component {
  state = {
    nik: '',
    company: '',
    addressCompany: '',
    listCompany: [],
    listAddressCompany: []
  }

  async componentDidMount() {
    await this.props.fetchDataCompanies()
    await this.props.fetchDataAddress()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.statusSubmit !== prevProps.statusSubmit && this.props.statusSubmit) {
      this.submit()
    }

    if (this.state.company !== prevState.company) {
      let data = await this.props.dataAddress.filter(el => el.company_id === this.state.company)
      this.setState({ listAddressCompany: data })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submit = () => {
    let operationalDay = []

    if (this.state.operationSemua) operationalDay.push('Setiap hari')
    else {
      if (this.state.operationSenin) operationalDay.push('Senin')
      if (this.state.operationSelasa) operationalDay.push('Selasa')
      if (this.state.operationRabu) operationalDay.push('Rabu')
      if (this.state.operationKamis) operationalDay.push('Kamis')
      if (this.state.operationJumat) operationalDay.push('Jumat')
      if (this.state.operationSabtu) operationalDay.push('Sabtu')
      if (this.state.operationMinggu) operationalDay.push('Minggu')
    }

    let newData = new FormData()

    newData.append("addressId", this.state.addressId)
    newData.append("companyId", this.props.companyId)
    newData.append("address", this.state.newAddress)
    newData.append("initial", this.state.initial)
    newData.append("phone", this.state.position.join(','))
    newData.append("fax", this.state.fax.join(','))
    newData.append("operationalDay", operationalDay.join(','))

    if (this.state.files.length > 0) this.state.files.forEach(file => {
      newData.append("files", file)
    })
    this.state.operationHours.forEach(operationHour => {
      newData.append("operationHours", JSON.stringify(operationHour))
    })
    this.state.operationRestHours.forEach(operationRestHour => {
      newData.append("operationRestHours", JSON.stringify(operationRestHour))
    })

    this.props.sendData(newData)
  }

  render() {
    return (
      <Paper style={{ backgroundColor: 'white', padding: '10px 20px', margin: '5px 0px 10px 0px' }}>

        <Grid id="nik" style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }}>
          <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
            <b style={{ fontSize: 12, marginBottom: 5 }}>NIK Karyawan</b>
          </Grid>

          <Grid style={{ width: '50%', height: 40, margin: 5, minWidth: 300 }}>
            <OutlinedInput
              value={this.state.nik}
              onChange={this.handleChange('nik')}
              variant="outlined"
              style={{ width: '50%', height: 40 }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>
        </Grid>

        <Grid id="comapny" style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }}>
          <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
            <b style={{ fontSize: 12, marginBottom: 5 }}>Perusahaan</b>
          </Grid>

          <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
            <Select
              value={this.state.company}
              onChange={this.handleChange('company')}
              style={{ width: '80%', marginRight: 10 }}
              disabled={this.state.proses}
            >
              {
                this.props.dataCompanies.map((el, index) =>
                  <MenuItem value={el.company_id} key={"company" + index}>{el.company_name}</MenuItem>
                )
              }
            </Select>
          </Grid>


          <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
            <b style={{ fontSize: 12, marginBottom: 5 }}>Lokasi Perusahaan</b>
          </Grid>

          <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
            <Select
              displayEmpty
              value={this.state.addressCompany}
              onChange={this.handleChange('addressCompany')}
              style={{ width: '80%', marginRight: 10 }}
              disabled={this.state.proses}
            >
              {
                this.state.listAddressCompany.map((el, index) => (
                  <MenuItem value={el.id} key={"address" + index}>{el.address}</MenuItem>
                ))
              }
            </Select>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataAddress
}

const mapStateToProps = ({ dataAddress, dataCompanies }) => {
  return {
    dataAddress,
    dataCompanies
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(cardAddService)