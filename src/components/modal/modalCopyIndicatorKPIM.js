import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Modal, Fade, Grid, Backdrop, Typography, Button
} from '@material-ui/core';

import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import swal from 'sweetalert';

import { API } from '../../config/API';

const animatedComponents = makeAnimated();

class modalCopyIndicatorKPIM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      users: []
    }
  }

  async componentDidMount() {
    let listUser = this.props.bawahan.filter(el => el.user_id !== this.props.userId)

    this.setState({
      users: listUser
    })
  }

  closeModal = () => {
    this.props.closeModal()
  }

  handleChangeSelect = (name, newValue, actionMeta) => {
    this.setState({
      [name]: newValue
    })
  };

  submitForm = async () => {
    let token = Cookies.get('POLAGROUP'), tempMonthly = []
    let newData = {
      indicator_kpim: this.props.data.indicator_kpim,
      target: this.props.data.target,
      unit: this.props.data.unit,
      year: this.props.data.year,
      user_id: this.state.user.user_id,
    }

    for (let i = 0; i < 12; i++) {
      tempMonthly.push(0)
    }

    this.props.data.kpimScore.forEach(el => {
      tempMonthly[el.month - 1] = +el.target_monthly
    })

    newData.monthly = tempMonthly

    API.post('/kpim', newData, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(async data => {
        swal("Duplikat indikator KPIM success", "", "success")
        this.props.refresh()
        this.props.closeModal()
      })
      .catch(err => {
        if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
          swal('Gagal', 'Koneksi tidak stabil', 'error')
        } else {
          swal('please try again')
        }
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
            width: 500,
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            padding: '50px 40px'
          }}>
            <Typography style={{ alignSelf: 'center', fontSize: 35, fontWeight: 'bold', marginRight: 20, marginBottom: 50 }}>Duplikat indicator</Typography>
            <SeCreatableSelect
              components={animatedComponents}
              options={this.state.users}
              onChange={value => this.handleChangeSelect('user', value)}
              getOptionLabel={(option) => option.fullname}
              getOptionValue={(option) => option.user_id}
            />

            <Button variant="outlined" color="secondary" style={{ margin: '30px auto 0px auto' }} onClick={this.submitForm} >
              Simpan
              </Button>
          </Grid>
        </Fade>
      </Modal>
    )
  }
}


const mapStateToProps = ({ bawahan, ip }) => {
  return {
    bawahan,
    ip
  }
}

export default connect(mapStateToProps)(modalCopyIndicatorKPIM)