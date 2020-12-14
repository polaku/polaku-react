import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Modal, Backdrop, Button, CircularProgress, Fade, FormControl, TextField, Divider, Radio, RadioGroup, FormControlLabel, FormLabel
} from '@material-ui/core';

import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { fetchDataEvent, fetchDataDepartment, fetchDataCompanies, fetchDataUsers } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

const animatedComponents = makeAnimated();

class modalCreateEditRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proses: false,
      eventName: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      location: '',
      users: [],
      inviteOption: 'default',
      user: [],
      department: [],
      company: [],
    }
  }

  async componentDidMount() {
    let temp = []
    await this.props.fetchDataDepartment()
    await this.props.fetchDataCompanies()

    await this.props.fetchDataUsers()
    this.props.dataUsers.forEach(element => {
      let newData = {
        user_id: element.user_id,
      }
      if (element.tbl_account_detail) newData.fullname = element.tbl_account_detail.fullname
      temp.push(newData)
    });

    this.setState({
      users: temp,
    })
  }

  save = async () => {
    this.setState({
      proses: true
    })
    let token = Cookies.get('POLAGROUP'), newArray = []

    var formData = new FormData();

    formData.append("event_name", this.state.eventName)
    formData.append("description", this.state.description)
    formData.append("start_date", this.state.startDate)
    formData.append("end_date", this.state.endDate)
    formData.append("location", this.state.location)
    formData.append("option", this.state.inviteOption)

    if (this.state.inviteOption === 'company') {
      this.state.company.forEach(company => { newArray.push(company.company_id) })
      formData.append("invited", JSON.stringify(newArray))
    } else if (this.state.inviteOption === 'department') {
      this.state.department.forEach(department => { newArray.push(department.departments_id) })
      formData.append("invited", JSON.stringify(newArray))
    } else if (this.state.inviteOption === 'user') {
      this.state.user.forEach(user => { newArray.push(user.user_id) })
      formData.append("invited", JSON.stringify(newArray))
    }

    API.post('/events', formData, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(() => {
        this.props.fetchDataEvent()
        this.props.closeModal()
        this.setState({
          proses: false,
          eventName: '',
          description: '',
          startDate: new Date(),
          endDate: new Date(),
          location: '',
          inviteOption: 'default',
        })
      })
      .catch(err => {
        swal('please try again')
        this.setState({
          proses: false
        })
      })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeRadio = event => {
    this.setState({ inviteOption: event.target.value });
  };

  handleChangeSelect = (name, newValue, actionMeta) => {
    this.setState({
      [name]: newValue
    })
  };

  cancel = () => {
    this.props.closeModal()
  }


  render() {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={this.props.status}
        onClose={this.cancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <div style={{
            backgroundColor: 'white',
            boxShadow: 5,
            padding: 30,
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'scroll',
            maxHeight: '90%',
          }}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '100%' }}>
                {
                  this.props.statusCreate
                    ? <h2>Membuat Acara</h2>
                    : <h2>Edit</h2>
                }
                <FormControl component="fieldset" style={{ margin: 5, width: '90%' }}>
                  <TextField
                    id="eventName"
                    label="Nama Acara"
                    value={this.state.eventName}
                    onChange={this.handleChange('eventName')}
                    disabled={this.state.proses}
                  />
                </FormControl>
                <FormControl component="fieldset" style={{ margin: 5, width: '90%' }}>
                  <TextField
                    id="description"
                    label="Keterangan"
                    value={this.state.description}
                    onChange={this.handleChange('description')}
                    disabled={this.state.proses}
                  />
                </FormControl>
                <FormControl component="fieldset" style={{ margin: 5, width: '90%' }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                    <KeyboardDatePicker
                      id="startDate"
                      label="Tanggal Mulai"
                      format="dd/MM/yyyy"
                      style={{ margin: 0 }}
                      value={this.state.startDate}
                      onChange={date => this.setState({ startDate: date })}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      minDate={new Date()}
                      maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 2, 31)}
                      disabled={this.state.proses}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl component="fieldset" style={{ margin: 5, width: '90%' }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                    <KeyboardDatePicker
                      id="endDate"
                      label="Tanggal Selesai"
                      format="dd/MM/yyyy"
                      style={{ margin: 0 }}
                      value={this.state.endDate}
                      onChange={date => this.setState({ endDate: date })}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      minDate={this.state.startDate}
                      maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 2, 31)}
                      disabled={this.state.proses}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl component="fieldset" style={{ margin: 5, width: '90%' }}>
                  <TextField
                    id="location"
                    label="Lokasi"
                    value={this.state.location}
                    onChange={this.handleChange('location')}
                    disabled={this.state.proses}
                  />
                </FormControl>

              </div>
              <Divider />
              <FormControl component="fieldset" style={{ marginTop: 30, width: '70%' }}>
                <FormLabel component="legend">Pilihan mengundang</FormLabel>
                <RadioGroup aria-label="undangan" name="undangan2" value={this.state.inviteOption} onChange={this.handleChangeRadio}>
                  <FormControlLabel
                    value="all"
                    control={<Radio color="primary" />}
                    label="All" />
                  <FormControlLabel
                    value="company"
                    control={<Radio color="primary" />}
                    label="Perusahaan" />
                  <div style={{ marginLeft: 25 }}>
                    <SeCreatableSelect
                      isMulti
                      components={animatedComponents}
                      options={this.props.dataCompanies}
                      onChange={value => this.handleChangeSelect('company', value)}
                      getOptionLabel={(option) => option.company_name}
                      getOptionValue={(option) => option.company_id}
                      disabled={this.state.proses}
                      isDisabled={this.state.inviteOption !== 'company'}
                    />
                  </div>
                  <FormControlLabel
                    value="department"
                    control={<Radio color="primary" />}
                    label="Department"
                  />
                  <div style={{ marginLeft: 25 }}>
                    <SeCreatableSelect
                      isMulti
                      components={animatedComponents}
                      options={this.props.dataDepartments}
                      onChange={value => this.handleChangeSelect('department', value)}
                      getOptionLabel={(option) => option.deptname}
                      getOptionValue={(option) => option.departments_id}
                      disabled={this.state.proses}
                      isDisabled={this.state.inviteOption !== 'department'}
                    />
                  </div>
                  <FormControlLabel
                    value="user"
                    control={<Radio color="primary" />}
                    label="User"
                  />
                  <div style={{ marginLeft: 25 }}>
                    <SeCreatableSelect
                      isMulti
                      components={animatedComponents}
                      options={this.state.users}
                      onChange={value => this.handleChangeSelect('user', value)}
                      getOptionLabel={(option) => option.fullname}
                      getOptionValue={(option) => option.user_id}
                      disabled={this.state.proses}
                      isDisabled={this.state.inviteOption !== 'user'}
                    />
                  </div>
                  <FormControlLabel
                    value="default"
                    control={<Radio color="primary" />}
                    label="Default (PT kamu)"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div style={{ position: 'relative' }}>
              <Button
                type="submit"
                color="secondary"
                style={{ margin: '20px 0', width: 100, alignSelf: 'center', marginRight: 30 }}
                data-testid='buttonSignin'
                disabled={this.state.proses}
                onClick={this.cancel}>
                Cancel
              {this.state.proses && <CircularProgress size={24} style={{
                  color: 'blue',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }} />}
              </Button>
              <Button
                type="submit"
                color="primary"
                style={{ margin: '20px 0', width: 100, alignSelf: 'center' }}
                data-testid='buttonSignin'
                disabled={this.state.proses}
                onClick={this.save}>
                Save
              {this.state.proses && <CircularProgress size={24} style={{
                  color: 'blue',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }} />}
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  fetchDataEvent,
  fetchDataDepartment,
  fetchDataCompanies,
  fetchDataUsers
}

const mapStateToProps = ({ loading, dataUsers, dataDepartments, dataCompanies, ip }) => {
  return {
    loading,
    dataUsers,
    dataCompanies,
    dataDepartments,
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(modalCreateEditRoom)