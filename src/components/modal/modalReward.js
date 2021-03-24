import React, { Component } from 'react'
import Cookies from 'js-cookie';
import { connect } from 'react-redux';

import {
  Modal, Fade, Grid, Backdrop, Typography, OutlinedInput, IconButton, InputAdornment, Button
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { API } from '../../config/API';

import swal from 'sweetalert';

class modalReward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listReward: [],
      nilaiBawah: '',
      nilaiAtas: '',
      newReward: '',
      statusAddReward: false,
    }
  }

  componentDidMount() {
    let listReward = this.props.data.sort(this.compare)

    this.setState({
      listReward
    })
  }

  closeModal = () => {
    this.props.closeModal()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  addIndicator = () => {
    this.setState({ statusAddReward: !this.state.statusAddReward })
  }

  saveIndicator = async () => {
    let token = Cookies.get('POLAGROUP')

    let newReward = {
      nilai_bawah: this.state.nilaiBawah,
      nilai_atas: this.state.nilaiAtas,
      reward: this.state.newReward,
      user_id: this.props.userId
    }

    let newListReward = this.state.listReward
    newListReward.push(newReward)
    newListReward.sort(this.compare)

    API.post('/rewardKPIM', newReward, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(data => {
        this.setState({ listReward: newListReward, statusAddReward: !this.state.statusAddReward })
        this.props.refresh()
      })
      .catch(err => {
        if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
          swal('Gagal', 'Koneksi tidak stabil', 'error')
        } else {
          swal('please try again')
        }
      })
  }

  compare = (a, b) => {
    if (Number(a.nilai_atas) < Number(b.nilai_atas)) {
      return 1;
    }
    if (Number(a.nilai_atas) > Number(b.nilai_atas)) {
      return -1;
    }
    return 0;
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
            width: 750,
            minHeight: 450,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 30px'
          }}>
            <img src={require('../../Assets/reward.png').default} alt="Logo" style={{ width: 120, maxHeight: 120, alignSelf: 'center' }} />
            <Typography style={{ alignSelf: 'center', fontSize: 35, fontWeight: 'bold', margin: 10 }}>Reward & Consequences</Typography>

            <Grid style={{ display: 'flex', margin: '10px 0px' }}>
              <p style={{ width: 180, fontSize: 20, margin: 0 }}>nilai  s/d  nilai</p>
              <p style={{ fontSize: 20, margin: 0 }}>reward & consequences didapatkan</p>
            </Grid>
            {
              this.state.listReward.map((reward, index) => (
                <Grid style={{ display: 'flex', margin: '5px 0px' }} key={index}>
                  <p style={{ width: 180, fontSize: 20, margin: 0 }}>{reward.nilai_bawah} - {reward.nilai_atas}</p>
                  <p style={{ fontSize: 20, margin: 0 }}>{reward.reward}</p>
                </Grid>
              ))
            }

            {
              this.state.statusAddReward
                ? <>
                  <Grid style={{ display: 'flex', marginTop: 10 }}>
                    <Grid style={{ width: 180 }}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }}>
                        <OutlinedInput
                          value={this.state.nilaiBawah}
                          onChange={this.handleChange('nilaiBawah')}
                          variant="outlined"
                          style={{ width: '40%' }}
                        />
                        <p style={{ margin: '0px 10px' }}>-</p>
                        <OutlinedInput
                          value={this.state.nilaiAtas}
                          onChange={this.handleChange('nilaiAtas')}
                          variant="outlined"
                          style={{ width: '40%' }}
                        />
                      </Grid>
                    </Grid>
                    <Grid style={{ width: '100%', display: 'flex', alignItems: 'center', marginLeft: 20 }}>
                      <Grid style={{ display: 'flex', width: '100%', marginRight: 10 }}>
                        <OutlinedInput
                          value={this.state.newReward}
                          onChange={this.handleChange('newReward')}
                          variant="outlined"
                          style={{ width: '100%' }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={this.addIndicator}
                                style={{ backgroundColor: '#cecece', width: 30, height: 30, padding: 0 }}
                              >
                                <AddIcon style={{ color: 'white' }} />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </Grid>
                      <IconButton
                        onClick={this.addIndicator}
                        style={{ backgroundColor: 'red', width: 30, height: 30, padding: 0 }}
                      >
                        <CloseIcon style={{ color: 'white' }} />
                      </IconButton>
                    </Grid>

                  </Grid>
                </>
                : <Grid style={{ width: 'auto', display: 'flex', alignItems: 'center', marginTop: 20 }}>
                  <IconButton
                    onClick={this.addIndicator}
                    style={{ backgroundColor: '#cecece', width: 30, height: 30, padding: 0, marginRight: 15 }}
                  >
                    <AddIcon style={{ color: 'white' }} />
                  </IconButton>
                  <Typography>tambah reward & consequences lain</Typography>
                </Grid>
            }

            <Button variant="outlined" color="secondary" style={{ margin: '30px auto 0px auto' }} onClick={this.saveIndicator}>
              Simpan
            </Button>
          </Grid>
        </Fade>
      </Modal>
    )
  }
}


const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps)(modalReward)