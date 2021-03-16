import React, { Component } from 'react'
// import Cookies from 'js-cookie';

import {
  Modal, Fade, Grid, Backdrop, Chip, Divider
} from '@material-ui/core';

// import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import LaptopMacOutlinedIcon from '@material-ui/icons/LaptopMacOutlined';

// import { API } from '../../config/API';

// import swal from 'sweetalert';

export default class modalAktifitas extends Component {
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
            width: 750,
            minHeight: 450,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 30px 40px 30px'
          }}>
            <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
              <b style={{ margin: 0, fontSize: 23 }}>Aktifitas login</b>
              <CloseIcon style={{ cursor: 'pointer' }} onClick={this.props.close} />
            </Grid>
            <Divider style={{ margin: '5px 0px' }} />

            <Grid style={{ display: 'flex' }}>
              <Grid>
                <LaptopMacOutlinedIcon color="secondary" style={{ width: 90, height: 60 }} />
              </Grid>
              <Grid>
                <p style={{ margin: 0 }}>Chrome di Windows</p>
                <p style={{ margin: 0, color: 'gray' }}>182.123.123.123</p>
                <Chip
                  label="sedang aktif"
                  color="secondary"
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    )
  }
}
