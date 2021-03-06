import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Modal, Backdrop, Button, CircularProgress, Fade, FormControl, Grid, FormLabel, FormGroup, FormControlLabel, Checkbox
} from '@material-ui/core';

import { fetchDataCompanies, fetchDataUsers, fetchDataRoomMaster } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

class modalRoomMaster extends Component {
  constructor(props) {
    super(props)
    this.state = {
      company: [],
    }
  }

  async componentDidMount() {
    let tempComp = [], company_id = []
    await this.props.fetchDataCompanies()

    tempComp = this.props.dataCompanies
    company_id = this.props.data.company_id.split(',')

    tempComp.forEach(element => {
      element.status = false
      company_id.forEach(el => {
        if (element.company_id === Number(el)) {
          element.status = true
        }
      })
    });

    this.setState({
      company: tempComp
    })
  }

  handleChangeChecked = index => event => {
    let datas = this.state.company

    datas[index].status = event.target.checked

    this.setState({
      company: datas,
    });
  };

  handleChangeAllCheck = () => event => {
    let temp = this.state.company
    this.setState({
      allCheck: event.target.checked
    })
    if (event.target.checked) {
      temp.forEach(element => {
        element.status = true
      });
      this.setState({
        company: temp
      })
    } else {
      temp.forEach(element => {
        element.status = false
      });
      this.setState({
        company: temp
      })
    }
  };

  save = async () => {
    let newData, companyId = [], token = Cookies.get('POLAGROUP')

    this.state.company.forEach(el => {
      if (el.status === true) {
        companyId.push(el.company_id)
      }
    })

    newData = {
      company_id: companyId.join()
    }

    API.put(`/bookingRoom/roomMaster/${this.props.data.master_room_id}`, newData, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(() => {
        this.props.fetchDataRoomMaster()
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

  cancel = () => {
    this.props.closeModal()
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
        onClose={this.cancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <div style={{
            backgroundColor: 'white',
            boxShadow: 5,
            padding: 30,
            width: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h2>Edit Room Master</h2>
            <p>{this.props.data.tbl_user.tbl_account_detail.fullname}</p>
            <FormControl component="fieldset" style={{ margin: '10px 0 10px 0' }}>
              <FormLabel component="legend">Perusahaan</FormLabel>
              <FormGroup style={{ display: 'flex', flexDirection: 'row', textAlign: 'left', paddingLeft: 10 }}>
                <Grid item md={12} xs={12} style={{ marginLeft: -10 }}>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.allCheck} onChange={this.handleChangeAllCheck()} />}
                    label="All"
                  />
                </Grid>
                {
                  this.state.company.map((element, index) => (
                    <Grid item md={3} xs={12} key={index}>
                      <FormControlLabel
                        control={<Checkbox checked={element.status} onChange={this.handleChangeChecked(index)} value={element.company_id} />}
                        label={element.company_name}
                      />
                    </Grid>
                  ))
                }
              </FormGroup>
            </FormControl>
            <div style={{ position: 'relative' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                style={{ margin: '20px 0', width: 100, alignSelf: 'center', marginRight: 30 }}
                data-testid='buttonSignin'
                disabled={this.state.proses}
                onClick={this.cancel}>
                Cancel
              {this.state.proses && <CircularProgress size={24} style={{
                  color: 'blue',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }} />}
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '20px 0', width: 100, alignSelf: 'center' }}
                data-testid='buttonSignin'
                disabled={this.state.proses}
                onClick={this.save}>
                Save
              {this.state.proses && <CircularProgress size={24} style={{
                  color: 'blue',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }} />}
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataCompanies,
  fetchDataRoomMaster
}

const mapStateToProps = ({ loading, dataUsers, dataCompanies, ip }) => {
  return {
    loading,
    dataCompanies,
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(modalRoomMaster)