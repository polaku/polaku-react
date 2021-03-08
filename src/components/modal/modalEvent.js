import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Modal, Fade, Backdrop, Paper, Grid, Divider, Typography, Button, CircularProgress
} from '@material-ui/core';

import swal from 'sweetalert';

import { fetchDataEvent } from '../../store/action';
import { API } from '../../config/API';

class modalEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      month: '',
      joinEvent: [],
      statusJoinUser: 'Not Join',
      proses: false,
      creator: {},
      statusApproval: false
    }
  }

  async componentDidMount() {
    let temp = []
    await this.props.data.tbl_users.forEach(element => {
      if (element.tbl_event_responses.response === 'join') {
        temp.push(element)
      }
      if (Number(element.user_id) === Number(this.props.userId) && element.tbl_event_responses.response === 'join') {
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
    this.setState({
      joinEvent: temp,
    })
  }

  cancel = () => {
    this.props.closeModal()
  }

  joinEvent = async (args) => {
    this.setState({
      proses: true
    })

    let token = Cookies.get('POLAGROUP'), getData

    try {
      getData = await API.post(`/events/follow`,
        {
          event_id: this.props.data.event_id, response: args.toLowerCase(),
        },
        {
          headers: {
            token,
            ip: this.props.ip
          }
        })

      if (args === "Join") {
        let newPerson = this.state.joinEvent
        newPerson.push('newPerson')

        this.setState({
          statusJoinUser: args,
          joinEvent: newPerson
        })
      } else {
        let newPerson = this.state.joinEvent
        newPerson.shift()
        this.setState({
          statusJoinUser: args,
          joinEvent: newPerson
        })
      }
      if (getData) {        // this.props.fetchDataMyEvent()
        swal(`${args} Success`, "", "success")
        this.setState({
          proses: false
        })
      }

    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      } else if (err.message === 'Request failed with status code 403') {
        swal('Waktu login telah habis, silahkan login kembali', "", "error");
      } else {
        swal('Error', `${err}`)
      }
      this.setState({
        proses: false
      })
    }
  }

  join = () => {
    this.joinEvent("Join")
  }

  cancelJoin = () => {
    this.joinEvent("Cancel Join")
  }

  deleteEvent = async () => {
    try {
      let token = Cookies.get('POLAGROUP')

      await API.delete(`/events/${this.props.data.event_id}`,
        {
          headers: {
            token
          }
        })

      await this.props.closeModal()
      await this.props.fetchDataEvent()
      swal('Hapus acara berhasil', '', 'success')
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      } else {
        swal('Hapus acara gagal', '', 'error')
      }
    }
  }

  render() {
    function getMonth(args) {
      let months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      let month = months[new Date(args).getMonth()]
      return `${month}`
    }

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
        onClose={this.cancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <Paper style={{ width: 600, padding: '30px 100px' }}>
            <Typography variant="subtitle2">{this.props.data.keterangan}</Typography>
            <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Typography variant="h4">{this.props.data.event_name}</Typography>
              {
                (this.props.userId === this.props.data.user_id || this.props.isAdminsuper) && <Button style={{ textDecoration: 'none' }} variant="contained" color="secondary" onClick={this.deleteEvent}>Hapus Acara</Button>
              }

            </Grid>
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
                    new Date(this.props.data.start_date).getDate() === new Date(this.props.data.end_date).getDate()
                      ? <p style={{ margin: 10 }}>{new Date(this.props.data.start_date).getDate()} {getMonth(this.props.data.start_date)} {new Date(this.props.data.start_date).getFullYear()}</p>
                      : <p style={{ margin: 10 }}>{new Date(this.props.data.start_date).getDate()} - {new Date(this.props.data.end_date).getDate()} {getMonth(this.props.data.start_date)} {new Date(this.props.data.start_date).getFullYear()}</p>
                  }
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3} >
                  <p style={{ fontWeight: 'bold', margin: 10 }}>Lokasi:</p>
                </Grid>
                <Grid item xs={9} >
                  <p style={{ margin: 10 }}>{this.props.data.location}</p>
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
                      this.props.data.end_date >= new Date() &&
                      (this.state.statusJoinUser !== 'Join'
                        ? <Button style={{
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
                        : <Button style={{
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
                        </Button>)
                    }
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            <Button
              color="secondary"
              style={{ margin: '20px auto', width: 100, textAlign: 'center', marginRight: 30 }}
              data-testid='buttonSignin'
              disabled={this.state.proses}
              onClick={this.cancel}>
              Cancel
            </Button>
          </Paper>
        </Fade >
      </Modal >
    )
  }
}


const mapDispatchToProps = {
  fetchDataEvent
}

const mapStateToProps = ({ isAdminsuper, userId, ip }) => {
  return {
    isAdminsuper,
    userId,
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(modalEvent)