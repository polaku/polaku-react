import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid, Button, Divider, Typography, CircularProgress, Paper
} from '@material-ui/core';

import { API } from '../../config/API';

class DetailEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      month: '',
      joinEvent: [],
      statusJoinUser: 'Not Join',
      proses: false,
      creator: {},
      statusApproval: false,
      openModal: false,
      data: {}
    }
  }

  async componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    let temp = []
    let token = localStorage.getItem('token')
    API.get(`/events/${this.props.match.params.id}`, { headers: { token } })
      .then(async ({ data }) => {
        this.setState({
          data: data.data
        })
        await data.data.tbl_users.forEach(element => {
          if (element.tbl_event_responses.response === 'join') {
            temp.push(element)
          }
          if (Number(element.user_id) === Number(this.state.userId) && element.tbl_event_responses.response === 'join') {
            this.setState({
              statusJoinUser: 'Join'
            })
          }

          if (element.tbl_event_responses.creator === 1) {
            this.setState({
              creator: element
            })
          }
        });

      })
      .catch(err =>
        console.log(err)
      )

    this.setState({
      joinEvent: temp,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchData()
    }
  }

  render() {
    function getMonth(args) {
      let months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      let month = months[new Date(args).getMonth()]
      return `${month}`
    }

    return (
      <Paper style={{ width: 600, padding: '30px 100px', margin: '30px auto' }}>
        <Typography variant="subtitle2">{this.state.data.keterangan}</Typography>
        <Typography variant="h4" style={{ marginBottom: 20 }}>{this.state.data.event_name}</Typography>
        <Divider />
        <Grid>
          <Grid container>
            <Grid item xs={3} >
              <p style={{ fontWeight: 'bold', margin: 10 }}>Creator:</p>
            </Grid>
            <Grid item xs={9} >
              {this.state.creator.tbl_account_detail && <p style={{ margin: 10 }}>{this.state.creator.tbl_account_detail.fullname}</p>}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3} >
              <p style={{ fontWeight: 'bold', margin: 10 }}>Tanggal:</p>
            </Grid>
            <Grid item xs={9} >
              {
                new Date(this.state.data.start_date).getDate() === new Date(this.state.data.end_date).getDate()
                  ? <p style={{ margin: 10 }}>{new Date(this.state.data.start_date).getDate()} {getMonth(this.state.data.start_date)} {new Date(this.state.data.start_date).getFullYear()}</p>
                  : <p style={{ margin: 10 }}>{new Date(this.state.data.start_date).getDate()} - {new Date(this.state.data.end_date).getDate()} {getMonth(this.state.data.start_date)} {new Date(this.state.data.start_date).getFullYear()}</p>
              }
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3} >
              <p style={{ fontWeight: 'bold', margin: 10 }}>Lokasi:</p>
            </Grid>
            <Grid item xs={9} >
              <p style={{ margin: 10 }}>{this.state.data.location}</p>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3} >
              <p style={{ fontWeight: 'bold', margin: 10 }}>Partisipan:</p>
            </Grid>
            <Grid item xs={9} >
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <p style={{ margin: 10 }}> {this.state.joinEvent.length} Mengikuti </p>
                {
                  this.state.statusJoinUser !== 'Join'
                    ? new Date(this.state.data.end_date) > new Date() && <Button style={{
                      width: 'auto',
                      backgroundColor: '#A2A2A2',
                      justifyContent: 'center',
                      paddingTop: 3,
                      paddingBottom: 3,
                      paddingLeft: 10,
                      paddingRight: 10,
                      borderRadius: 10
                    }} onClick={this.join}>
                      {
                        this.state.proses
                          ? <CircularProgress />
                          : <p style={{ textAlign: 'center', margin: 0, fontSize: 12, color: 'white' }}> Ikuti </p>
                      }
                    </Button>
                    : new Date(this.state.data.end_date) > new Date() && <Button style={{
                      width: 'auto',
                      backgroundColor: '#A2A2A2',
                      justifyContent: 'center',
                      paddingTop: 3,
                      paddingBottom: 3,
                      paddingLeft: 10,
                      paddingRight: 10,
                      borderRadius: 10
                    }} onClick={this.cancelJoin}>
                      {
                        this.state.proses
                          ? <CircularProgress />
                          :
                          <p style={{ textAlign: 'center', margin: 0, fontSize: 12, color: 'white' }}> Batal Ikuti </p>
                      }
                    </Button>
                }
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Paper >
    )
  }
}

const mapStateToProps = ({ loading, dataEvents, error }) => {
  return {
    loading,
    dataEvents,
    error
  }
}

export default connect(mapStateToProps)(DetailEvent)