import React, { Component } from 'react'

import { Grid } from '@material-ui/core'

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import ModalDetailTAL from '../modal/modalDetailTAL';

export default class cardTAL extends Component {
  state = {
    openModal: false,
  }

  openModal = () => {
    this.setState({
      openModal: true
    })
  }

  closeModal = () => {
    this.setState({
      openModal: false
    })
  }

  render() {
    return (
      <>
        <Grid item xs={2} md={2} style={{ padding: 5 }}>
          <Grid style={{ border: '1px solid black', cursor: 'pointer' }} onClick={this.openModal}>
            <Grid style={{ width: '100%', padding: '10px 15px', backgroundColor: '#d71149', color: 'white' }}>
              TAL week {this.props.data.week}
            </Grid>
            <Grid style={{ padding: 20 }}>
              <CircularProgressbar value={this.props.data.nilai} text={`${this.props.data.nilai}%`} />
            </Grid>
          </Grid>
        </Grid>
        {
          this.state.openModal && <ModalDetailTAL status={this.state.openModal} closeModal={this.closeModal} data={this.props.data} />
        }

      </>
    )
  }
}
