import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import publicIp from 'public-ip';

import { Button, CircularProgress } from '@material-ui/core';

import { fetchDataEvent, fetchDataEventNeedApproval } from '../../store/action';
import { API } from '../../config/API';

import ModalEvent from '../modal/modalEvent'

import swal from 'sweetalert';

class cardEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      month: '',
      joinEvent: [],
      statusJoinUser: 'Not Join',
      proses: false,
      creator: {},
      statusApproval: false,
      openModal: false,
      closeModal: ''
    }
  }

  async componentDidMount() {
    let temp = []
    if (this.props.userId) {
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
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.data) {
      if (this.props.data.tbl_users !== prevProps.data.tbl_users) {
        let temp = []
        await this.props.data.tbl_users.forEach(element => {

          if (element.tbl_event_responses.response === 'join') {
            temp.push(element)
          }
          if (Number(element.user_id) === Number(this.props.userId) && element.tbl_event_responses.response === 'join') {

            this.setState({
              statusJoinUser: 'Join'
            })
          } else if (Number(element.user_id) === Number(this.props.userId) && element.tbl_event_responses.response === 'cancel join') {

            this.setState({
              statusJoinUser: 'Cancel Join'
            })
          }
        });
        this.setState({
          joinEvent: temp
        })
      }
    }

    if (prevState.closeModal !== this.state.closeModal) {
      this.setState({
        openModal: false
      })
    }
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
            ip: await publicIp.v4()
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
      if (getData) {
        this.props.fetchDataEvent()
        // this.props.fetchDataMyEvent()

        swal(`${args} Success`);
        this.setState({
          proses: false
        })
      }

    } catch (err) {
      if (err.message === 'Request failed with status code 403') {
        swal('Waktu login telah habis, silahkan login kembali');
      } else {
        swal(err);
      }
      swal('please try again')
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

  approve = async (args) => {
    let token = Cookies.get('POLAGROUP')

    API.put(`/events/approvalEvent/${this.props.data.event_id}`,
      {
        status: Number(args),
      },
      {
        headers: {
          token,
          ip: await publicIp.v4()
        }
      })
      .then(() => {
        this.props.fetchDataEventNeedApproval()
      })
      .catch(err => {
        swal('please try again')
        this.setState({
          proses: false
        })
      })
  }

  openModal = () => {
    this.setState({
      openModal: true
    })
  }

  closeModal = () => {
    this.setState({
      closeModal: new Date(),
    })
  }

  render() {
    function getMonth(args) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let month = months[new Date(args).getMonth()]
      return `${month}`
    }

    return (
      <div style={{ borderWidth: 1, marginBottom: 10, backgroundColor: '#F1F1F1', borderRadius: 5, cursor: 'pointer', padding: 5 }} onClick={this.openModal}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{
            width: 70,
            borderWidth: 1,
            borderRadius: 10
          }}>
            <p style={{ fontSize: 35, margin: 0, textAlign: 'center' }}>{new Date(this.props.data.start_date).getDate()}</p>
            <p style={{ fontSize: 15, margin: 0, textAlign: 'center', marginBottom: 5 }}>{getMonth(this.props.data.start_date)}</p>
          </div>

          <div style={{ marginLeft: 10, marginBottom: 5, width: '100%' }}>
            <p style={{
              fontSize: 20,
              fontWeight: 'bolder',
              margin: 0
            }}>{this.props.data.event_name}</p>
            <p style={{ margin: 0 }}>{this.props.data.location}</p>
            {
              //LAYOUT FOR APROVAL EVENT
              this.props.approval
              && <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end'
              }}>
                <Button color="secondary"
                  style={{
                    width: 'auto',
                    justifyContent: 'center',
                  }} onClick={() => this.approve(2)}>
                  {
                    this.state.proses
                      ? <CircularProgress />
                      : <p style={{ margin: 0 }}> Tolak </p>
                  }
                </Button>
                <Button color="primary"
                  style={{
                    width: 'auto',
                    justifyContent: 'center',
                  }} onClick={() => this.approve(1)}>
                  {
                    this.state.proses
                      ? <CircularProgress />
                      : <p style={{ margin: 0 }}> Setujui </p>
                  }
                </Button>
              </div>

            }
          </div>
        </div>
        {
          this.state.openModal &&
          <ModalEvent status={this.state.openModal} closeModal={this.closeModal} data={this.props.data} />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataEvent,
  fetchDataEventNeedApproval
}

const mapStateToProps = ({ loading, userId, error }) => {
  return {
    loading,
    userId,
    error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(cardEvent)