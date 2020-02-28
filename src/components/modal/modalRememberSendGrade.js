import React, { Component } from 'react'

import {
  Modal, Fade, Grid, Backdrop, Typography, Button
} from '@material-ui/core';

export default class modalRememberSendGrade extends Component {
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
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 30px'
          }}>
            <img src={require('../../assets/bell.png')} alt="Logo" style={{ width: 120, maxHeight: 120, alignSelf: 'center', marginBottom: 20 }} />
            <Typography style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>Sudah waktunya untuk mengirim laporan nilai!</Typography>
            <Typography style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>Sudahkah Anda memeriksa nilai setiap orang?</Typography>

            <Button variant="contained" color="secondary" style={{ margin: '30px auto 0px auto' }} onClick={this.props.closeModalSendGrade}>
              OK
            </Button>
          </Grid>
        </Fade>
      </Modal>
    )
  }
}
