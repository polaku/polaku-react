import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Button } from '@material-ui/core';

import Calendar from '../../components/calendar/calendar.js';

import { fetchDataEvent } from '../../store/action';
import CardEvent from '../../components/event/cardEvent';

import ModalCreateEditEvent from '../../components/modal/modalCreateEditEvent';

class Event extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false
    }
  }

  async componentDidMount() {
    await this.props.fetchDataEvent()
    console.log(this.props.dataEvents)
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
      <Grid container style={{ display: 'flex', flexDirection: 'row' }}>
        <Grid item xs={12} sm={8} style={{ display: 'flex' }}>
          {
            this.props.dataEvents && <Calendar data={this.props.dataEvents} />
          }
        </Grid>
        <Grid item xs={12} sm={4} style={{ padding: 10, paddingTop: 0 }}>
          <Button variant="outlined" color="primary" style={{ marginBottom: 10 }} onClick={this.openModal}>
            Buat Acara
          </Button>
          <Grid style={{ height: '76vh', width: '100%', overflow: 'auto' }}>
            {
              this.props.dataEvents && this.props.dataEvents.map((event, index) => (
                <CardEvent key={index} data={event} />
              ))
            }
          </Grid>
          {
            this.state.openModal && <ModalCreateEditEvent status={this.state.openModal} statusCreate={true} closeModal={this.closeModal} />
          }
        </Grid>
      </Grid >
    )
  }
}

const mapDispatchToProps = {
  fetchDataEvent
}

const mapStateToProps = ({ loading, dataEvents, error }) => {
  return {
    loading,
    dataEvents,
    error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Event)