import React, { Component } from 'react'
import { Grid, Typography, TextField, Button, CircularProgress, InputAdornment } from '@material-ui/core';

import MailIcon from '@material-ui/icons/Mail';

import swal from 'sweetalert';

import { API } from '../config/API';

export default class ForgetPassword extends Component {
  state = {
    email: null
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submit = async () => {
    try {
      await API.get(`/users/forget-password?email=${this.state.email}`)
      swal('Berhasil', 'Silahkan check email anda', 'success')
      this.setState({ email: null })
      this.props.history.push('/login')
    } catch (err) {
      if (err.message) {
        if (err.response.data.message === "failed") {
          swal('Error', 'Email tidak ditemukan', 'error')
        }
      } else {
        swal('Error', 'Silahkan coba lagi', 'error')
      }
    }
  }

  render() {
    return (
      <Grid style={{ display: 'flex', justifyContent: 'center', margin: '5% 0 0 auto' }}>
        <Grid style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
          <Typography style={{ margin: 10, fontSize: 15, fontWeight: 'bold', marginBottom: 0 }}>LUPA PASSWORD</Typography>
          <TextField
            id="username"
            label="Email"
            value={this.state.email}
            onChange={this.handleChange('email')}
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end"><MailIcon /></InputAdornment>,
            }}
            style={{ width: 320 }}
            disabled={this.state.proses}
          />
          <p style={{ margin: 0, width: 350, fontStyle: 'italic' }}>* masukan email pribadi yang telah didaftarkan. email reset password akan dikirimkan ke email tersebut</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="secondary"
              style={{ margin: '20px 0', width: 100, alignSelf: 'center', marginRight: 20 }}
              disabled={this.state.proses}
              onClick={() => this.props.history.goBack()}>
              Batal </Button>
            <div style={{ position: 'relative', }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '20px 0', width: 100, alignSelf: 'center' }}
                data-testid='buttonSignin'
                disabled={this.state.proses}
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
