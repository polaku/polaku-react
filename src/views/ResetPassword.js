import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Grid, Typography, TextField, Button, CircularProgress, InputAdornment } from '@material-ui/core';

import LockIcon from '@material-ui/icons/Lock';

import swal from 'sweetalert';

import { API } from '../config/API';
import { setUser, fetchDataNotification } from '../store/action';

class ResetPassword extends Component {
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
        Cookies.set('POLAGROUP', getToken.data.token, { expires: 365 });

        await this.checkToken()
        swal('Berhasil', 'Email anda berhasil diubah', 'success')
        this.props.history.push("/polanews")

      } catch (err) {
        console.log('gagal')
        console.log(err.response)
        // console.log(err)
      }
    }
  }

  checkToken = async () => {
    let token = Cookies.get("POLAGROUP");
    if (token) {
      API.get("/users/check-token", {
        headers: {
          token,
          // ip: ip || null
        },
      })
        .then(async ({ data }) => {
          // console.log(data)
          let newData = {
            user_id: data.user_id,
            isRoomMaster: data.isRoomMaster,
            isCreatorMaster: data.isCreatorMaster,
            isCreatorAssistant: data.isCreatorAssistant,
            sisaCuti: data.sisaCuti,
            evaluator1: data.evaluator1,
            evaluator2: data.evaluator2,
            bawahan: data.bawahan,
            admin: data.admin,
            // ip: props.ip
          };

          let checkPIC = data.admin.find((el) => el.PIC);
          let PIC = checkPIC ? true : false;
          newData.isPIC = PIC;
          let isAdminNews = false,
            isAdminAddress = false,
            isAdminStructure = false,
            isAdminEmployee = false,
            isAdminAdmin = false,
            isAdminRoom = false,
            isAdminKPIM = false,
            isAdminHR = false,
            isAdminHelpdesk = false;

          await data.admin.forEach((admin) => {
            if (admin.tbl_designation) {
              let checkNews = admin.tbl_designation.tbl_user_roles.find(
                (menu) => menu.menu_id === 1
              );
              if (checkNews) isAdminNews = true;

              let checkAddress = admin.tbl_designation.tbl_user_roles.find(
                (menu) => menu.menu_id === 2
              );
              if (checkAddress) isAdminAddress = true;

              let checkStructure = admin.tbl_designation.tbl_user_roles.find(
                (menu) => menu.menu_id === 3
              );
              if (checkStructure) isAdminStructure = true;

              let checkEmployee = admin.tbl_designation.tbl_user_roles.find(
                (menu) => menu.menu_id === 4
              );
              if (checkEmployee) isAdminEmployee = true;

              let checkAdmin = admin.tbl_designation.tbl_user_roles.find(
                (menu) => menu.menu_id === 5
              );
              if (checkAdmin) isAdminAdmin = true;

              let checkRoom = admin.tbl_designation.tbl_user_roles.find(
                (menu) => menu.menu_id === 6
              );
              if (checkRoom) isAdminRoom = true;

              let checkKPIM = admin.tbl_designation.tbl_user_roles.find(
                (menu) => menu.menu_id === 7
              );
              if (checkKPIM) isAdminKPIM = true;

              let checkHR = admin.tbl_designation.tbl_user_roles.find(
                (menu) => menu.menu_id === 8
              );
              if (checkHR) isAdminHR = true;

              let checkHelpdesk = admin.tbl_designation.tbl_user_roles.find(
                (menu) => menu.menu_id === 9
              );
              if (checkHelpdesk) isAdminHelpdesk = true;
            }
          });

          newData.isAdminNews = isAdminNews;
          newData.isAdminAddress = isAdminAddress;
          newData.isAdminStructure = isAdminStructure;
          newData.isAdminEmployee = isAdminEmployee;
          newData.isAdminAdmin = isAdminAdmin;
          newData.isAdminRoom = isAdminRoom;
          newData.isAdminKPIM = isAdminKPIM;
          newData.isAdminHR = isAdminHR;
          newData.isAdminHelpdesk = isAdminHelpdesk;

          if (data.role_id === 1) {
            newData.isAdminsuper = true;
          } else {
            newData.isAdminsuper = false;
          }

          if (data.adminContactCategori) {
            newData.adminContactCategori = data.adminContactCategori;
          }
          await this.props.setUser(newData);
          await this.props.fetchDataNotification();
        })
        .catch((err) => {
          // console.log(err)
          Cookies.remove("POLAGROUP");
          // props.userLogout()
          this.props.history.push("/login");
        });
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


const mapDispatchToProps = {
  setUser,
  fetchDataNotification
}

export default connect(null, mapDispatchToProps)(ResetPassword)
