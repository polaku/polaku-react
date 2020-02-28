import React, { Component } from 'react'

import { Grid } from '@material-ui/core'

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import ModalDetailTAL from '../modal/modalDetailTAL';

export default class cardTAL extends Component {
  state = {
    openModal: false,
    totalPersen: 0,
  }

  componentDidMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.data !== this.props.data){
      this.fetchData()
    }
  }

  fetchData = () => {
    let tempScore = 0
    this.props.data.length > 0 && this.props.data.forEach(tal => {
      tempScore += tal.score_tal
    });

    this.setState({
      totalPersen: tempScore
    })
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

  refresh = () => {
    this.props.refresh()
  }

  render() {
    return (
      this.props.data.length > 0 && <>
        <Grid item xs={2} md={2} style={{ padding: 5 }}>
          <Grid style={{ border: '1px solid black', cursor: 'pointer' }} onClick={this.openModal}>
            <Grid style={{ width: '100%', padding: '10px 15px', backgroundColor: '#d71149', color: 'white' }}>
              TAL week {this.props.data[0].week}
            </Grid>
            <Grid style={{ padding: 20 }}>
              <CircularProgressbar value={this.state.totalPersen} text={`${this.state.totalPersen}%`} />
            </Grid>
          </Grid>
        </Grid>
        {
          this.state.openModal && <ModalDetailTAL status={this.state.openModal} closeModal={this.closeModal} data={this.props.data} refresh={this.refresh} />
        }

      </>
    )
  }
}
