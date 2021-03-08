import React, { Component } from 'react';
import Cookies from 'js-cookie';

import {
  Modal, Fade, Grid, Backdrop, Typography, Button, TextField, CircularProgress
} from '@material-ui/core';

import swal from 'sweetalert';

import { API } from '../../config/API';
import { connect } from 'react-redux';

class modalChangePassword extends Component {
  state = {
    proses: false,
    passOld: '',
    passNew: '',
    passConf: '',
    errorPass: false
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.passConf !== this.state.passConf) {
      if (this.state.passConf !== this.state.passNew) {
        this.setState({
          errorPass: true
        })
      } else {
        this.setState({
          errorPass: false
        })
      }
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submitForm = async () => {
    if (!this.state.errorPass && this.state.passOld && this.state.passNew) {
      let token = Cookies.get('POLAGROUP')
      this.setState({
        proses: true
      })
      let newData = {
        passwordLama: this.state.passOld,
        passwordBaru: this.state.passNew
      }

      API.put('/users/changePassword', newData, {
        headers: {
          token,
          ip: this.props.ip
        }
      })
        .then(async data => {
          swal("Change password success", "", "success")
          this.setState({
            proses: false,
          })
          this.props.closeModal()
        })
        .catch(err => {
          if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
            swal('Gagal', 'Koneksi tidak stabil', 'error')
          } else if (err.message === 'Request failed with status code 400') {
            swal('Password lama yang anda masukan salah')
          } else {
            swal('please try again')
          }
          // console.log(err)
          this.setState({
            proses: false
          })
        })

    }
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
        onClose={this.props.closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <Grid style={{
            backgroundColor: 'white',
            boxShadow: 5,
            width: 500,
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            padding: '50px 40px'
          }}>
            <Typography style={{ alignSelf: 'center', fontSize: 35, fontWeight: 'bold', marginRight: 20, marginBottom: 50 }}>Change Password</Typography>
            <TextField
              id="passOld"
              label="Password Lama"
              type="password"
              value={this.state.passOld}
              onChange={this.handleChange('passOld')}
              style={{ marginBottom: 15 }}
              disabled={this.state.proses}
            />
            <TextField
              id="passNew"
              label="Password Baru"
              type="password"
              value={this.state.passNew}
              onChange={this.handleChange('passNew')}
              style={{ marginBottom: 15 }}
              disabled={this.state.proses}
            />
            <TextField
              id="passConf"
              label="Password Lama"
              type="password"
              value={this.state.passConf}
              onChange={this.handleChange('passConf')}
              style={{ marginBottom: 15 }}
              disabled={this.state.proses}
              error={this.state.errorPass}
            />

            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button color="secondary" onClick={this.props.closeModal} style={{ marginRight: 20, height: 50 }}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" style={{ margin: '20px 0', width: 100, height: 50, alignSelf: 'center' }} onClick={this.submitForm}
                disabled={this.state.proses}>
                {
                  this.state.proses ? <CircularProgress size={24} style={{
                    color: 'blue',
                  }} />
                    : "Simpan"
                }
              </Button>
            </Grid>


          </Grid>
        </Fade>
      </Modal >
    )
  }
}

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps)(modalChangePassword)