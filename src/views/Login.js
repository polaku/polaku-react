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
        }
        
        if (data.data.role_id === 1) {
          newData.isAdmin = true
        } else {
          newData.isAdmin = false
        }

        if (data.data.adminContactCategori) {
          newData.adminContactCategori = data.data.adminContactCategori
        }

        await this.props.setUser(newData)
        await this.props.fetchDataNotification()
      }
      this.props.history.push("/polanews")
    } catch (err) {
      swal('Error', `${err}`)
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
          {/* <img src="https://polaku.polagroup.co.id/uploads/logo.png" alt="Logo" /> */}
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" /> 
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
              <Typography style={{ fontSize: 12 }}>Forgot password?</Typography>
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

export default connect(null, mapDispatchToProps)(Login)