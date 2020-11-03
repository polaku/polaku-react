import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid, OutlinedInput, Select, MenuItem, Paper,
} from '@material-ui/core';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { fetchDataCompanies, fetchDataAddress } from '../../store/action';

const animatedComponents = makeAnimated();

class cardAddService extends Component {
  state = {
    dinasId: '',
    evaluator: '',
    employee: '',
    evaluatorSelected: '',
    employeeSelected: '',
    company: '',
    addressCompany: '',
    listCompany: [],
    listAddressCompany: [],
    listUser: []
  }

  componentDidMount() {
    if (this.props.data) {
      this.setState({
        dinasId: this.props.data.id,
        company: this.props.data.company_id,
        addressCompany: this.props.data.building_id,
        evaluator: this.props.data.evaluator_id,
        employee: this.props.data.user_id,
      })
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.statusSubmit !== prevProps.statusSubmit && this.props.statusSubmit) {
      console.log("MASUK SUBMIT")
      this.submit()
    }

    if (this.state.company !== prevState.company) {
      let listAddressCompany = [], idBuilding = []

      await this.props.dataAddress.forEach(address => {
        if (address.company_id === this.state.company) {
          if (idBuilding.indexOf(address.building_id) < 0) {
            idBuilding.push(address.building_id)
            listAddressCompany.push(address.tbl_building)
          }
        }
      });
      console.log(listAddressCompany)
      this.setState({ listAddressCompany })
    }

    if (this.state.nik !== prevState.nik && this.state.nik !== '') {
      let check = await this.props.dataUsers.find(user => +user.tbl_account_detail.nik === +this.state.nik)
      if (check) {
        this.setState({ name: check.tbl_account_detail.fullname, nikSelected: check.tbl_account_detail.nik })
      } else {
        this.setState({ name: 'Tidak ada NIK yang sesuai' })
      }
    }

    if (this.props.dataUsers !== prevProps.dataUsers) {
      if (this.props.data) {
        let evaluatorSelected, employeeSelected

        if (this.props.data.evaluator_id) evaluatorSelected = this.props.dataUsers.find(user => user.user_id === this.props.data.evaluator_id)
        if (this.props.data.user_id) employeeSelected = this.props.dataUsers.find(user => user.user_id === this.props.data.user_id)

        this.setState({ evaluatorSelected, employeeSelected })
      }
    }

    if (this.props.data !== prevProps.data) {
      this.setState({
        dinasId: this.props.data.id,
        company: this.props.data.company_id,
        addressCompany: this.props.data.building_id,
        evaluator: this.props.data.evaluator_id,
        employee: this.props.data.user_id,
      })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeSelect = (name, newValue, actionMeta) => {
    if (newValue) {
      this.setState({
        [name]: newValue.user_id
      })
    } else {
      this.setState({
        [name]: null
      })
    }
  };

  submit = () => {
    let newData = {
      dinasId: this.state.dinasId,
      evaluatorId: this.state.evaluator,
      userId: this.state.employee,
      companyId: this.state.company,
      buildingId: this.state.addressCompany,
    }
    this.props.sendData(newData)
  }

  render() {
    return (
      <Paper style={{ backgroundColor: 'white', padding: '10px 20px', margin: '5px 0px 10px 0px' }}>

        <Grid id="employee" style={{ margin: '20px 0px', display: 'flex', alignItems: 'center' }}>
          <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
            <b style={{ fontSize: 12, marginBottom: 5 }}>Karyawan</b>
          </Grid>

          <Grid style={{ width: '50%', height: 40, maxWidth: 500 }}>
            <ReactSelect
              isClearable
              value={this.props.data && this.state.employeeSelected}
              components={animatedComponents}
              options={this.props.dataUsers}
              onChange={value => this.handleChangeSelect('employee', value)}
              getOptionLabel={(option) => `${option.tbl_account_detail.nik} - ${option.tbl_account_detail.fullname}`}
              getOptionValue={(option) => option.user_id}
              disabled={this.state.proses}
            />
          </Grid>
        </Grid>

        <Grid id="company" style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }}>
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
                  <MenuItem value={el.building_id} key={"address" + index}>{el.building}</MenuItem>
                ))
              }
            </Select>
          </Grid>
        </Grid>

        <Grid id="evaluator" style={{ margin: '20px 0px', display: 'flex', alignItems: 'center' }}>
          <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
            <b style={{ fontSize: 12, marginBottom: 5 }}>Evaluator</b>
          </Grid>

          <Grid style={{ width: '50%', height: 40, maxWidth: 500 }}>
            <ReactSelect
              isClearable
              value={this.props.data && this.state.evaluatorSelected}
              components={animatedComponents}
              options={this.props.dataUsers}
              onChange={value => this.handleChangeSelect('evaluator', value)}
              getOptionLabel={(option) => `${option.tbl_account_detail.nik} - ${option.tbl_account_detail.fullname}`}
              getOptionValue={(option) => option.user_id}
              disabled={this.state.proses}
            />
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

const mapStateToProps = ({ dataAddress, dataCompanies, dataUsers }) => {
  return {
    dataAddress,
    dataCompanies,
    dataUsers
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(cardAddService)