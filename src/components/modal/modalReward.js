import React, { Component } from 'react'

import { Modal, Fade, Grid, Backdrop, Typography, OutlinedInput, IconButton, InputAdornment, Button } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

export default class modalReward extends Component {
  state = {
    nilaiBawah: '',
    nilaiAtas: '',
    newReward: '',
    statusAddReward: false,
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
            <img src={require('../../assets/reward.png')} alt="Logo" style={{ width: 120, maxHeight: 120, alignSelf: 'center' }} />
            <Typography style={{ alignSelf: 'center', fontSize: 35, fontWeight: 'bold', margin: 10 }}>Reward & Consequences</Typography>

            <Grid style={{ display: 'flex', margin: '10px 0px' }}>
              <p style={{ width: 180, fontSize: 20, margin: 0 }}>nilai  s/d  nilai</p>
              <p style={{ fontSize: 20, margin: 0 }}>reward & consequences didapatkan</p>
            </Grid>

            <Grid style={{ display: 'flex', margin: '5px 0px' }}>
              <p style={{ width: 180, fontSize: 20, margin: 0 }}>80 - 100</p>
              <p style={{ fontSize: 20, margin: 0 }}>excellent</p>
            </Grid>
            <Grid style={{ display: 'flex', margin: '5px 0px' }}>
              <p style={{ width: 180, fontSize: 20, margin: 0 }}>70 - 80</p>
              <p style={{ fontSize: 20, margin: 0 }}>excellent</p>
            </Grid>

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
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                          style={{ width: '40%' }}
                        />
                        <p style={{ margin: '0px 10px' }}>-</p>
                        <OutlinedInput
                          value={this.state.nilaiAtas}
                          onChange={this.handleChange('nilaiAtas')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
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
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
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




            {/* <Grid style={{width:'100%'}} > */}
            <Button variant="outlined" color="secondary" style={{ margin: '30px auto 0px auto' }} >
              Simpan
              </Button>
            {/* </Grid> */}
          </Grid>
        </Fade>
      </Modal>
    )
  }
}
