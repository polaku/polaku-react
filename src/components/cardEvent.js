import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { fetchDataEvent, fetchDataEventNeedApproval } from '../store/action';
import { API } from '../config/API';

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
      console.log(temp);
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
  }

  joinEvent = async (args) => {
    this.setState({
      proses: true
    })

    let token = localStorage.getItem('token'), getData

    try {
      getData = await API.post(`/events/follow`,
        {
          event_id: this.props.data.event_id, response: args.toLowerCase(),
        },
        {
          headers: { token }
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

        alert(`${args} Success`)
        this.setState({
          proses: false
        })
      }

    } catch (err) {
      if (err.message === 'Request failed with status code 403') {
        alert('Waktu login telah habis, silahkan login kembali')
      } else {
        alert(err)
      }
      this.setState({
        proses: false
      })
    }
  }

  join = () => {
    console.log("join")
    this.joinEvent("Join")
  }

  cancelJoin = () => {
    console.log("cancel join")

    this.joinEvent("Cancel Join")
  }

  approve = args => {
    let token = localStorage.getItem('token')

    API.put(`/events/approvalEvent/${this.props.data.event_id}`,
      {
        status: Number(args),
      },
      {
        headers: { token }
      })
      .then(() => {
        this.props.fetchDataEventNeedApproval()
      })
      .catch(err => {
        console.log(err)
        this.setState({
          proses: false
        })
      })
  }

  render() {
    function getMonth(args) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      let month = months[new Date(args).getMonth()]
      return `${month}`
    }

    return (
      <div style={{ borderWidth: 1, marginBottom: 10, backgroundColor: '#F1F1F1', borderRadius: 15, padding: 15, paddingLeft: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{
            width: 70,
            height: 70,
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 5,
            marginRight: 10
          }}>
            <p style={{ fontSize: 30, margin: 0, textAlign: 'center' }}>{new Date(this.props.data.start_date).getDate()}</p>
            <p style={{ fontSize: 15, margin: 0, textAlign: 'center', marginBottom: 5 }}>{getMonth(this.props.data.start_date)}</p>
          </div>

          <div style={{ marginLeft: 10 }}>
            <p style={{
              fontSize: 18,
              fontWeight: 'bold',
              margin: 0
            }}>{this.props.data.event_name}</p>
            <p style={{ margin: 0 }}>{this.props.data.location}</p>
            {
              new Date(this.props.data.start_date).getDate() === new Date(this.props.data.end_date).getDate()
                ? <p style={{ margin: 0 }}>{new Date(this.props.data.start_date).getDate()} {getMonth(this.props.data.start_date)}</p>
                : <p style={{ margin: 0 }}>{new Date(this.props.data.start_date).getDate()} - {new Date(this.props.data.end_date).getDate()} {getMonth(this.props.data.start_date)}</p>
            }
            {this.state.creator.tbl_account_detail && <p style={{ margin: 0 }}>{this.state.creator.tbl_account_detail.fullname}</p>}
          </div>
        </div>
        {
          //LAYOUT FOR APROVAL EVENT
          this.props.approval
            ? (new Date(this.props.data.start_date).getDate() === new Date().getDate()) && <div style={{ alignSelf: 'end' }}>
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
            : <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <p style={{ margin: 0 }}> {this.state.joinEvent.length} Mengikuti </p>
              {
                this.state.statusJoinUser !== 'Join'
                  ? (new Date(this.props.data.start_date).getDate() === new Date().getDate()) && <Button style={{
                    width: 'auto',
                    backgroundColor: '#A2A2A2',
                    justifyContent: 'center',
                    paddingTop: 8,
                    paddingBottom: 8,
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
                  : (new Date(this.props.data.start_date).getDate() === new Date().getDate()) && <Button style={{
                    width: 'auto',
                    backgroundColor: '#A2A2A2',
                    justifyContent: 'center',
                    paddingTop: 8,
                    paddingBottom: 8,
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