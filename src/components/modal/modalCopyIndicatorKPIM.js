import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Modal, Fade, Grid, Backdrop, Typography, Button } from '@material-ui/core';
import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import swal from 'sweetalert';

import { API } from '../../config/API';

const animatedComponents = makeAnimated();

class modalCopyIndicatorKPIM extends Component {
  state = {
    user: {},
    users: []
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

  submitForm = () => {
    let token = localStorage.getItem("token"), tempMonthly = []
    let newData = {
      indicator_kpim: this.props.data.indicator_kpim,
      target: this.props.data.target,
      unit: this.props.data.unit,
      year: this.props.data.year,
      user_id: this.state.user.user_id,
    }

    this.props.data.kpimScore.forEach(el => {
      tempMonthly.push(el.target_monthly)
    })

    newData.monthly = tempMonthly

    API.post('/kpim', newData, { headers: { token } })
      .then(async data => {
        swal("Duplikat indikator KPIM success", "", "success")
        this.props.refresh()
        this.props.closeModal()
      })
      .catch(err => {
        console.log(err)
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
              // isMulti
              components={animatedComponents}
              options={this.state.users}
              onChange={value => this.handleChangeSelect('user', value)}
              getOptionLabel={(option) => option.fullname}
              getOptionValue={(option) => option.user_id}
            />

            {/* <Grid style={{width:'100%'}} > */}
            <Button variant="outlined" color="secondary" style={{ margin: '30px auto 0px auto' }} onClick={this.submitForm} >
              Simpan
              </Button>
            {/* </Grid> */}
          </Grid>
        </Fade>
      </Modal>
    )
  }
}


const mapStateToProps = ({ bawahan }) => {
  return {
    bawahan
  }
}

export default connect(mapStateToProps)(modalCopyIndicatorKPIM)