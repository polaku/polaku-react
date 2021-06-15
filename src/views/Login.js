import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  TextField, InputAdornment, Typography, Button, CircularProgress
} from '@material-ui/core';

import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';

import swal from 'sweetalert';

import { setUser, fetchDataNotification } from '../store/action';

import { API } from '../config/API';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      proses: false,
      editableInput: true
    }
  }

  componentDidMount() {
    if (Cookies.get("POLAGROUP")) {
      this.props.history.push("/polanews")
    }
  }


  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  signin = async e => {
    e.preventDefault();

    this.setState({
      proses: true,
      editableInput: false
    })

    let user, data, newData
    user = {
      username: this.state.username,
      password: this.state.password
    }

    try {
      data = await API.post('/users/signin', user)
      Cookies.set('POLAGROUP', data.data.token, { expires: 365 });

      if (data) {
        this.setState({
          proses: false,
          editableInput: true,
          username: '',
          password: ''
        })
        newData = {
          user_id: data.data.user_id,
          isRoomMaster: data.data.isRoomMaster,
          isCreatorMaster: data.data.isCreatorMaster,
          isCreatorAssistant: data.data.isCreatorAssistant,
          sisaCuti: data.data.sisaCuti,
          evaluator1: data.data.evaluator1,
          evaluator2: data.data.evaluator2,
          bawahan: data.data.bawahan,
          admin: data.data.admin,
          nickname: data.data.nickname,
          fullname: data.data.fullname,
          firstHierarchy: data.data.firstHierarchy,
          dinas: data.data.dinas,
          statusEmployee: data.data.status_employee
        }

        let checkPIC = data.data.admin.find(el => el.PIC)
        let PIC = checkPIC ? true : false
        newData.isPIC = PIC

        let isAdminNews = false, isAdminAddress = false, isAdminStructure = false, isAdminEmployee = false, isAdminAdmin = false, isAdminRoom = false, isAdminKPIM = false, isAdminHR = false, isAdminHelpdesk = false, isAdminNotification = false

        await data.data.admin.forEach(admin => {
          let checkNews = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 1) : null
          if (checkNews) isAdminNews = true

          let checkAddress = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 2) : null
          if (checkAddress) isAdminAddress = true

          let checkStructure = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 3) : null
          if (checkStructure) isAdminStructure = true

          let checkEmployee = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 4) : null
          if (checkEmployee) isAdminEmployee = true

          let checkAdmin = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 5) : null
          if (checkAdmin) isAdminAdmin = true

          let checkRoom = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 6) : null
          if (checkRoom) isAdminRoom = true

          let checkKPIM = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 7) : null
          if (checkKPIM) isAdminKPIM = true

          let checkHR = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 8) : null
          if (checkHR) isAdminHR = true

          let checkHelpdesk = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 9) : null
          if (checkHelpdesk) isAdminHelpdesk = true

          let checkNotification = admin.tbl_designation ? admin.tbl_designation.tbl_user_roles.find(menu => menu.menu_id === 10) : null
          if (checkNotification) isAdminNotification = true;
        })

        newData.isAdminNews = isAdminNews
        newData.isAdminAddress = isAdminAddress
        newData.isAdminStructure = isAdminStructure
        newData.isAdminEmployee = isAdminEmployee
        newData.isAdminAdmin = isAdminAdmin
        newData.isAdminRoom = isAdminRoom
        newData.isAdminKPIM = isAdminKPIM
        newData.isAdminHR = isAdminHR
        newData.isAdminHelpdesk = isAdminHelpdesk
        newData.isAdminNotification = isAdminNotification

        if (data.data.role_id === 1) {
          newData.isAdminsuper = true
        } else {
          newData.isAdminsuper = false
        }

        if (data.data.adminContactCategori) {
          newData.adminContactCategori = data.data.adminContactCategori
        }

        this.props.history.push("/polanews")
        await this.props.setUser(newData)
        await this.props.fetchDataNotification()
      }
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      } else {
        swal('Username atau Password Salah!', 'Username atau Password yang anda masukan tidak sesuai', 'error')
      }

      this.setState({
        proses: false,
        editableInput: true
      })
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '5% 0 0 auto' }}>
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          <img src={require('../Assets/logo.png').default} loading="lazy" alt="Logo" />
          <Typography style={{ margin: 10, fontSize: 13 }}>SIGN IN TO CONTINUE.</Typography>
          <form noValidate autoComplete="off" onSubmit={this.signin} style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              id="username"
              label="Username"
              value={this.state.username}
              onChange={this.handleChange('username')}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end"><MailIcon /></InputAdornment>,
              }}
              style={{ marginBottom: 15 }}
              disabled={this.state.proses}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              value={this.state.password}
              onChange={this.handleChange('password')}
              InputProps={{
                endAdornment: <InputAdornment position="end"><LockIcon /></InputAdornment>,
              }}
              disabled={this.state.proses}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography style={{ fontSize: 12 }}><Link to='/forget-password'>Forgot password?</Link></Typography>
              <div style={{ position: 'relative', }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ margin: '20px 0', width: 100, alignSelf: 'center' }}
                  data-testid='buttonSignin'
                  disabled={this.state.proses}>
                  Sign In </Button>
                {this.state.proses && <CircularProgress size={24} style={{
                  color: 'blue',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }} />}
              </div>
            </div>
          </form>

          <Typography style={{ marginTop: 20, fontSize: 12 }}>©<Link to='/login'> polagroup</Link></Typography>
          <Typography style={{ fontSize: 12 }}>2020 - Version 2.0.0</Typography>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setUser,
  fetchDataNotification
}

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)