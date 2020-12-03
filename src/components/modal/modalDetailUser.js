import React, { Component } from 'react'
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import publicIp from 'public-ip';

import {
  Modal, Fade, Grid, Backdrop, Select, Button, TextField, MenuItem,
} from '@material-ui/core';

import { API } from '../../config/API';

import swal from 'sweetalert';

class modalDetailUser extends Component {
  state = {
    companyId: '',
    companyName: '',
    fullname: '',
    username: '',
    confirPassword: '',
    password: '',
    initial: '',
    nik: '',
    idEvaluator1: 0,
    evaluator1: '',
    idEvaluator2: 0,
    evaluator2: '',
    isActive: false,
    dataUser: [],

    isEdit: false,
    isError: false,
  }

  async componentDidMount() {
    // let filterUser = await this.props.dataUsers.filter(user => user.tbl_account_detail.company_id === this.props.data.rawData.tbl_account_detail.company_id)

    this.setState({
      companyId: this.props.data.rawData.tbl_account_detail.company_id,
      companyName: this.props.data.company,
      fullname: this.props.data.name,
      username: this.props.data.username,
      initial: this.props.data.initial,
      nik: this.props.data.nik,
      evaluator1: this.props.data.evaluator1,
      idEvaluator1: this.props.data.rawData.tbl_account_detail.name_evaluator_1,
      evaluator2: this.props.data.evaluator2,
      idEvaluator2: this.props.data.rawData.tbl_account_detail.name_evaluator_2,
      isActive: this.props.data.isActive,
      // dataUser: filterUser
      dataUser: this.props.dataUsers
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.confirPassword !== this.state.confirPassword) {
      if (this.state.confirPassword !== this.state.password && !this.state.isError) {
        this.setState({
          isError: true
        })
      } else if (this.state.confirPassword === this.state.password && this.state.isError) {
        this.setState({
          isError: false
        })
      }
    }
  }

  closeModal = () => {
    this.props.closeModal()
  }

  handleChange = name => async event => {
    if (name === 'companyId') {
      let company = this.props.dataCompanies.find(company => company.company_id === event.target.value)
      // let filterUser = await this.props.dataUsers.filter(user => user.tbl_account_detail.company_id === event.target.value)

      // this.setState({ [name]: event.target.value, companyName: company.company_name, dataUser: filterUser });
      this.setState({ [name]: event.target.value, companyName: company.company_name });
    } else if (name === 'idEvaluator1') {
      if (event.target.value !== "") {
        let userSelected = this.state.dataUser.find(user => user.user_id === event.target.value)
        this.setState({ [name]: event.target.value, evaluator1: userSelected.tbl_account_detail.fullname });
      } else {
        this.setState({ [name]: event.target.value, evaluator1: "-" });
      }
    } else if (name === 'idEvaluator2') {
      if (event.target.value !== "") {
        let userSelected = this.state.dataUser.find(user => user.user_id === event.target.value)
        this.setState({ [name]: event.target.value, evaluator2: userSelected.tbl_account_detail.fullname });
      } else {
        this.setState({ [name]: event.target.value, evaluator2: "-" });
      }
    } else {
      this.setState({ [name]: event.target.value });
    }
  };

  handleEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit
    })

    if (this.state.isEdit) {
      this.saveDataUser()
    }
  }

  saveDataUser = async () => {
    if (this.state.password === '' || (this.state.confirPassword && !this.state.isError)) {
      let token = Cookies.get('POLAGROUP')

      let newData = {
        fullname: this.state.fullname,
        company_id: this.state.companyId,
        username: this.state.username,
        initial: this.state.initial,
        nik: this.state.nik,
        evaluator1: this.state.idEvaluator1,
        evaluator2: this.state.idEvaluator2,
      }

      if (this.state.password !== '') newData.password = this.state.password

      API.put(`/users/editUser/${this.props.data.userId}`, newData, {
        headers: {
          token,
          ip: await publicIp.v4()
        }
      })
        .then(data => {
          this.setState({ isEdit: false })
          swal('Edit data user success', '', 'success')
          this.props.refresh()
          this.closeModal()
        })
        .catch(err => {
          swal('please try again')
        })
    } else if (this.state.isError) {
      swal("konfirmasi password salah")
    }
  }

  cancelEdit = () => {
    this.setState({
      companyId: this.props.data.rawData.tbl_account_detail.company_id,
      companyName: this.props.data.company,
      fullname: this.props.data.name,
      username: this.props.data.username,
      initial: this.props.data.initial,
      nik: this.props.data.nik,
      evaluator1: this.props.data.evaluator1,
      evaluator2: this.props.data.evaluator2,
      isActive: this.props.data.isActive,
      isEdit: false
    })
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
        onClose={this.closeModal}
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
            width: 850,
            minHeight: 450,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 30px',
            borderRadius: 5
          }}>
            <img src={this.props.data.rawData.tbl_account_detail.avatar} alt="avatar" style={{ width: 120, maxHeight: 120, alignSelf: 'center', borderRadius: 60 }} />


            {
              this.state.isEdit
                ? <Grid style={{ display: 'flex', width: '100%', marginTop: 20, border: '1px solid gray', borderRadius: 10, padding: 20 }}>
                  <Grid id="kiri" style={{ display: 'flex', width: '50%', paddingRight: 15, flexDirection: 'column' }}>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>NIK</p>
                      <TextField
                        value={this.state.nik}
                        onChange={this.handleChange('nik')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 35, padding: 0 }
                        }}
                        style={{ width: 250 }}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Fullname</p>
                      <TextField
                        value={this.state.fullname}
                        onChange={this.handleChange('fullname')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 35, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Initial</p>
                      <TextField
                        value={this.state.initial}
                        onChange={this.handleChange('initial')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 35, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Username</p>
                      <TextField
                        value={this.state.username}
                        onChange={this.handleChange('username')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 35, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Password</p>
                      <TextField
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        variant="outlined"
                        type="password"
                        InputProps={{
                          style: { height: 35, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Confirmation Password</p>
                      <TextField
                        value={this.state.confirPassword}
                        onChange={this.handleChange('confirPassword')}
                        variant="outlined"
                        type="password"
                        InputProps={{
                          style: { height: 35, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                        error={this.state.isError}
                      />
                    </Grid>
                  </Grid>
                  <Grid id="kanan" style={{ display: 'flex', width: '50%', paddingLeft: 15, flexDirection: 'column' }}>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Company</p>
                      <Select
                        value={this.state.companyId}
                        onChange={this.handleChange('companyId')}
                      >
                        {
                          this.props.dataCompanies && this.props.dataCompanies.map((company, index) =>
                            <MenuItem value={company.company_id} key={index}>{company.company_name}</MenuItem>
                          )
                        }
                      </Select>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Evaluator 1</p>
                      <Select
                        value={this.state.idEvaluator1}
                        onChange={this.handleChange('idEvaluator1')}
                        style={{ width: 250 }}
                      >
                        {
                          this.state.dataUser.map((user, index) =>
                            <MenuItem value={user.user_id} key={index}>{user.tbl_account_detail.fullname}</MenuItem>
                          )
                        }
                        <MenuItem value="">-</MenuItem>
                      </Select>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Evaluator 2</p>
                      <Select
                        value={this.state.idEvaluator2}
                        onChange={this.handleChange('idEvaluator2')}
                        style={{ width: 250 }}
                      >
                        {
                          this.state.dataUser.map((user, index) =>
                            <MenuItem value={user.user_id} key={index}>{user.tbl_account_detail.fullname}</MenuItem>
                          )
                        }
                        <MenuItem value="">-</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
                : <Grid style={{ display: 'flex', width: '100%', marginTop: 20, border: '1px solid gray', borderRadius: 10, padding: 20 }}>
                  <Grid id="kiri" style={{ display: 'flex', width: '50%', paddingRight: 15, flexDirection: 'column' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>NIK</p>
                      <p style={{ margin: 0 }}>: {this.state.nik}</p>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Fullname</p>
                      <p style={{ margin: 0 }}>: {this.state.fullname}</p>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Initial</p>
                      <p style={{ margin: 0 }}>: {this.state.initial}</p>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Username</p>
                      <p style={{ margin: 0 }}>: {this.state.username}</p>
                    </Grid>
                  </Grid>
                  <Grid id="kanan" style={{ display: 'flex', width: '50%', paddingLeft: 15, flexDirection: 'column' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Company</p>
                      <p style={{ margin: 0 }}>: {this.state.companyName}</p>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Evaluator 1</p>
                      <p style={{ margin: 0 }}>: {this.state.evaluator1}</p>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                      <p style={{ margin: 0, width: 90 }}>Evaluator 2</p>
                      <p style={{ margin: 0 }}>: {this.state.evaluator2}</p>
                    </Grid>
                  </Grid>
                </Grid>
            }

            {
              this.state.isEdit
                ? <Grid style={{ margin: '30px auto 0px auto' }}>
                  <Button onClick={this.cancelEdit} style={{ marginRight: 20 }}>
                    cancel
                </Button>
                  <Button variant="outlined" color="secondary" onClick={this.handleEdit}>
                    Simpan
                  </Button>
                </Grid>
                : <Grid style={{ margin: '30px auto 0px auto' }}>
                  <Button onClick={this.props.closeModal} style={{ marginRight: 20 }}>
                    cancel
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={this.handleEdit}>
                    Edit
                  </Button>
                </Grid>
            }

          </Grid>
        </Fade>
      </Modal >
    )
  }
}

const mapStateToProps = ({ loading, error, dataCompanies, dataUsers }) => {
  return {
    loading,
    error,
    dataCompanies,
    dataUsers
  }
}

export default connect(mapStateToProps)(modalDetailUser)