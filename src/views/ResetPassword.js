import React, { Component } from 'react'
import { Grid, Typography, TextField, Button, CircularProgress, InputAdornment } from '@material-ui/core';

import LockIcon from '@material-ui/icons/Lock';

import swal from 'sweetalert';

import { API } from '../config/API';

export default class ResetPassword extends Component {
  state = {
    password: null,
    repassword: null,
    errorRepassword: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.repassword !== prevState.repassword) {
      if (this.state.repassword !== this.state.password) {
        this.setState({ errorRepassword: true })
      } else {
        this.setState({ errorRepassword: false })
      }
    }
  }


  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submit = async () => {
    if (this.state.repassword) {
      try {
        let newData = {
          password: this.state.password,
          repassword: this.state.repassword
        }
        let getToken = await API.put(`/users/reset-password/${this.props.match.params.token}`, newData)
        // swal('Berhasil', 'Silahkan check email anda', 'success')

        console.log(getToken)

        console.log('sukses')
      } catch (err) {
        console.log('gagal')
        // console.log(err.response)
        // console.log(err)
      }
    }
  }

  render() {
    return (
      <Grid style={{ display: 'flex', justifyContent: 'center', margin: '5% 0 0 auto' }}>
        <Grid style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
          <Typography style={{ margin: 10, fontSize: 15, fontWeight: 'bold', marginBottom: 15 }}>RESET PASSWORD</Typography>
          <TextField
            id="password"
            label="Password Baru"
            type="password"
            variant="outlined"
            value={this.state.password}
            onChange={this.handleChange('password')}
            InputProps={{
              endAdornment: <InputAdornment position="end"><LockIcon /></InputAdornment>,
            }}
            style={{ width: 320, marginBottom: 15 }}
            disabled={this.state.proses}
          />
          <TextField
            id="password"
            label="Ulangi Password"
            type="password"
            variant="outlined"
            value={this.state.repassword}
            onChange={this.handleChange('repassword')}
            InputProps={{
              endAdornment: <InputAdornment position="end"><LockIcon /></InputAdornment>,
            }}
            style={{ width: 320, marginBottom: 10 }}
            disabled={this.state.proses}
            error={this.state.errorRepassword}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div style={{ position: 'relative', }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '10px 0', width: 100, alignSelf: 'center' }}
                data-testid='buttonSignin'
                disabled={this.state.proses || this.state.errorRepassword}
                onClick={this.submit}>
                Send </Button>
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

        </Grid>
      </Grid>
    )
  }
}
