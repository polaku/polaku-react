import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Modal, Fade, Grid, Backdrop, Typography, OutlinedInput, FormControl,
  //  InputAdornment, 
  Button, Divider
} from '@material-ui/core';

import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import CloseIcon from '@material-ui/icons/Close';

import { fetchDataUsers, fetchDataCompanies, fetchDataPIC } from '../../store/action';
import { API } from '../../config/API';

import swal from 'sweetalert';

const animatedComponents = makeAnimated();

class modalOnBoarding extends Component {
  state = {
    companyName: '',
    akronim: '',
    pic: [],
    people: [],
    proses: false,
    listCompanies: [],
    disabledAkronim: false
  }

  async componentDidMount() {
    let temp = [];
    try {
      await this.props.fetchDataCompanies()
      await this.props.fetchDataUsers()

      await this.props.dataUsers.forEach(element => {
        let newData = {
          user_id: element.user_id,
          nik: element.tbl_account_detail.nik
        }
        if (element.tbl_account_detail) newData.fullname = element.tbl_account_detail.fullname
        temp.push(newData)
      });

      let listCompanies = []
      await this.props.dataCompanies.forEach(el => {
        listCompanies.push({ value: el.company_name, label: el.company_name, acronym: el.acronym })
      })

      this.setState({
        people: temp,
        listCompanies
      })

    } catch (err) {
      swal("Error", `${err}`);
    }
  }

  closeModal = () => {
    this.props.close()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangePartisipan = (newValue, actionMeta) => {
    this.setState({
      pic: newValue
    })
  };

  saveOnboarding = async () => {
    this.setState({ proses: true })
    let token = Cookies.get('POLAGROUP')

    let newData = {
      companyName: this.state.companyName,
      akronim: this.state.akronim,
      pic: this.state.pic,
    }

    API.post('/pic', newData, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(async ({ data }) => {
        await this.props.fetchDataPIC()
        swal("Tambah PIC sukses", "", "success")
        // this.props.history.push('/setting/setting-perusahaan/stepper-onboarding', { company_id: data.data.company_id })
        this.setState({ proses: false })
        this.props.close()
        // this.props.history.push('/setting/setting-perusahaan/add-address', { company_id: data.data.company_id })
      })
      .catch(err => {
        // console.log(err)
        this.setState({ proses: false })
        swal('please try again')
      })
  }

  handleChangeAddress = (newValue, actionMeta) => {
    if (newValue !== null) {
      if (newValue.acronym) {
        this.setState({
          companyName: newValue.value,
          akronim: newValue.acronym,
          disabledAkronim: true
        })
      } else {
        this.setState({
          companyName: newValue.value,
          akronim: "",
          disabledAkronim: false
        })
      }
    } else {
      this.setState({
        companyName: '',
        akronim: '',
        disabledAkronim: false
      })
    }
  };

  handleInputChange = (inputValue, actionMeta) => {
    if (inputValue) {
      this.setState({
        companyName: inputValue,
        akronim: '',
        disabledAkronim: false
      })
    }
  };

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
            width: '90%',
            maxWidth: 500,
            maxHeight: '90%',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            overflowY: 'auto',
            paddingBottom: '30px'
          }}>
            <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography style={{ fontSize: 20, fontWeight: 'bold', margin: 10 }}>onboarding perusahaan</Typography>
              <CloseIcon onClick={this.props.close} style={{ cursor: 'pointer' }} />
            </Grid>
            <Divider />


            <Grid style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              <b style={{ width: '35%' }}>Nama perusahaan</b>
              <FormControl style={{ width: '65%' }}>
                <SeCreatableSelect
                  isClearable
                  components={animatedComponents}
                  options={this.state.listCompanies}
                  onChange={this.handleChangeAddress}
                  onInputChange={this.handleInputChange}
                  disabled={this.state.proses}
                />
              </FormControl>
              {/* <OutlinedInput
                value={this.state.companyName}
                onChange={this.handleChange('companyName')}
                variant="outlined"
                style={{ width: '65%' }}
                inputProps={{
                  style: {
                    padding: '10px 15px'
                  }
                }}
              /> */}
            </Grid>
            <Grid style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              <b style={{ width: '35%' }}>Akronim</b>
              <OutlinedInput
                value={this.state.akronim}
                onChange={this.handleChange('akronim')}
                variant="outlined"
                style={{ width: '65%' }}
                inputProps={{
                  style: {
                    padding: '10px 15px'
                  }
                }}
                disabled={this.state.disabledAkronim}
              />
            </Grid>
            <Grid style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              <b style={{ width: '35%' }}>PIC onboarding</b>
              <FormControl style={{ width: '65%' }}>
                {
                  this.state.people && <SeCreatableSelect
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={this.state.people}
                    onChange={this.handleChangePartisipan}
                    getOptionLabel={(option) => option.nik + ' - ' + option.fullname}
                    getOptionValue={(option) => option.user_id}
                    disabled={this.state.proses}
                  />
                }
              </FormControl>
              {/* <OutlinedInput
                value={this.state.pic}
                onChange={this.handleChange('pic')}
                variant="outlined"
                
                inputProps={{
                  style: {
                    padding: '10px 15px'
                  }
                }}
              /> */}
            </Grid>


            {/* <Grid style={{width:'100%'}} > */}
            <Button variant="outlined" color="secondary" style={{ margin: '30px auto 0px auto' }} onClick={this.saveOnboarding} disabled={this.state.proses}>
              Simpan
              </Button>
            {/* </Grid> */}
          </Grid>
        </Fade>
      </Modal>
    )
  }
}

const dispatchToProps = {
  fetchDataUsers,
  fetchDataCompanies,
  fetchDataPIC
}

const mapStateToProps = ({ dataUsers, dataCompanies, ip }) => {
  return {
    dataUsers,
    dataCompanies,
    ip
  }
}

export default connect(mapStateToProps, dispatchToProps)(withRouter(modalOnBoarding))   