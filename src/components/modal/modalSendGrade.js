import React, { Component } from 'react'

import {
  Modal, Fade, Grid, Backdrop, Typography, Button
} from '@material-ui/core';

export default class modalRememberSendGrade extends Component {
  componentDidMount(){
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
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 30px'
          }}>
            <img src={process.env.PUBLIC_URL + '/warning.png'} alt="Logo" style={{ width: 120, maxHeight: 120, alignSelf: 'center', marginBottom: 20 }} />
            <Typography style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>Pastikan Anda sudah memeriksa nilai yang diberikan!</Typography>
            <Typography style={{ alignSelf: 'center', fontSize: 25, fontWeight: 'bold' }}>Karena tidak dapat diubah!</Typography>

            <Button color="secondary" style={{ margin: '30px auto 0px auto' }} onClick={this.props.closeModalSendGrade}>
              Batal
            </Button>
            <Button variant="contained" color="secondary" style={{ margin: '10px auto 0px auto' }} onClick={this.props.kirimNilai}>
              Kirim nilai
            </Button>
          </Grid>
        </Fade>
      </Modal>
    )
  }
}
