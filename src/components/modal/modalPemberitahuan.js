import React, { Component } from 'react'

import {
  Modal, Fade, Grid, Backdrop, Divider
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

export default class modalPromoPL extends Component {
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

  navigate = (args) => {
    this.props.close()
    this.props.history.push(args)
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
        open={this.props.open}
        onClose={this.props.close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.open}>

          <Grid style={{
            backgroundColor: 'white',
            boxShadow: 5,
            maxWidth: '90%',
            width: '400px',
            display: 'flex',
            maxHeight: '90%',
            flexDirection: 'column',
            padding: '10px',
            position: 'relative'
          }}>
            <h2 style={{ margin: ' 10px 20px 10px 20px' }}>Pemberitahuan</h2>
            <Divider />
            <CloseIcon style={{ cursor: 'pointer', position: 'absolute', top: 25, right: 20, width: 30, height: 30 }} onClick={this.props.close} />
            <div style={{ padding: 20 }}>
              <p style={{ textAlign: 'center', margin: 0 }}>Ada update pengisian kpim dan tal.</p>
              <p style={{ textAlign: 'center', margin: 0 }} >Harap periksa <b onClick={() => this.navigate('/helpdesk/detail/6/sub-topics/14/question/26')}>helpdesk KPIM</b> dan <b onClick={() => this.navigate('/helpdesk/detail/6/sub-topics/17/question/43')}>helpdesk TAL</b></p>
            </div>

          </Grid>
        </Fade>
      </Modal>
    )
  }
}
