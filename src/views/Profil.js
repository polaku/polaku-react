import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie'

import { Paper, Button, Grid, TextField } from '@material-ui/core';

import ModalChangePassword from '../components/modal/modalChangePassword';

import EditIcon from '@material-ui/icons/Edit';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

import { userLogout, fetchDataUserDetail } from '../store/action';

import { API } from '../config/API';

import swal from 'sweetalert';

class Profil extends Component {
  state = {
    changePass: false,
    changeUsername: false,
    username: ''
  }

  async componentDidMount() {
    if (this.props.userId) {
      await this.props.fetchDataUserDetail(this.props.userId)
      this.setState({
        username: this.props.dataUserDetail.username
      })
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      await this.props.fetchDataUserDetail(this.props.userId)
      this.setState({
        username: this.props.dataUserDetail.username
      })
    }
  }

  logout = () => {
    Cookies.remove('POLAGROUP')
    this.props.history.push('/login')
    this.props.userLogout()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangePass = () => {
    this.setState({
      changePass: !this.state.changePass
    })
  }

  handleChangeUsername = () => {
    this.setState({
      changeUsername: !this.state.changeUsername
    })
  }

  submitChangeUsername = () => {
    let token = Cookies.get('POLAGROUP')

    API.put('/users/editProfil', { username: this.state.username }, { headers: { token } })
      .then(async data => {
        swal("Username berhasil diubah")
        await this.props.fetchDataUserDetail(this.props.userId)
        this.handleChangeUsername()
      })
      .catch(err => {
        console.log(err)
      })


  }

  render() {
    return (
      <div>
        {
          this.props.dataUserDetail && <>
            <Paper style={{ padding: '40px 30px 20px 30px', backgroundColor: 'white', borderRadius: 0, width: 400, margin: '50px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {
                this.props.dataUserDetail.tbl_account_detail && <>
                  <img src={this.props.dataUserDetail.tbl_account_detail.avatar} alt="avatar_user" style={{ width: 150, height: 150, borderRadius: 5, marginBottom: 15 }} />
                  <p style={{ fontWeight: 'bold', margin: 0, fontSize: 18 }}>{this.props.dataUserDetail.tbl_account_detail.fullname}</p>
                  <p style={{ margin: 0, fontSize: 14 }}>NIK : {this.props.dataUserDetail.tbl_account_detail.nik ? this.props.dataUserDetail.tbl_account_detail.nik : "-"}</p>
                  {
                    this.props.dataUserDetail.email &&
                    <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>{this.props.dataUserDetail.email}</p>
                  }
                  {
                    this.state.changeUsername
                      ? <Grid style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                        <p style={{ margin: 0, fontSize: 15, marginRight: 10 }}>Username : </p>
                        <TextField
                          value={this.state.username}
                          onChange={this.handleChange('username')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                          style={{ width: '40%', margin: '0px 10px 0px 0px' }}
                        />
                        <Button style={{ borderRadius: 5, minWidth: 40, color: 'green' }} onClick={this.submitChangeUsername}>
                          <SaveOutlinedIcon />
                        </Button>
                        <Button style={{ borderRadius: 5, minWidth: 40, color: 'red' }} onClick={this.handleChangeUsername}>
                          <CancelPresentationOutlinedIcon />
                        </Button>
                      </Grid>
                      : <Grid style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ margin: 0, fontSize: 15, marginRight: 10 }}>Username : {this.state.username}</p>
                        <EditIcon style={{ width: 20 }} onClick={this.handleChangeUsername} />
                      </Grid>
                  }
                  <Button variant="contained" style={{ marginTop: 10 }} onClick={this.handleChangePass}>
                    Change Password
              </Button>
                </>
              }
              <Button color="secondary" style={{ marginTop: 10 }} onClick={this.logout}>
                Logout
              </Button>
            </Paper>

          </>
        }

        {
          this.state.changePass && <ModalChangePassword status={this.state.changePass} closeModal={this.handleChangePass} />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  userLogout,
  fetchDataUserDetail
}

const mapStateToProps = ({ userId, dataUserDetail, loading }) => {
  return {
    loading,
    userId,
    dataUserDetail
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profil)