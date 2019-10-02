import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';

import FormControl from '@material-ui/core/FormControl';
import { fetchDataUsers } from '../../store/action';

import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import { API } from '../../config/API';

const animatedComponents = makeAnimated();

class modalCreatorMasterAndAssistant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proses: false,
      user: {},
      users: [],
    }
  }

  async componentDidMount() {
    let temp = []
    await this.props.fetchDataUsers()
    this.props.dataUsers.forEach(element => {
      let newData = {
        user_id: element.user_id,
      }
      if (element.tbl_account_detail) newData.fullname = element.tbl_account_detail.fullname
      temp.push(newData)
    });

    this.setState({
      users: temp,
    })
  }

  send = e => {
    e.preventDefault();

    let token = localStorage.getItem('token')
    this.setState({
      proses: true
    })
    let newData = {
      user_id: this.state.user.user_id,
    }

    API.post('/events/masterCreator', newData, { headers: { token } })
      .then(() => {
        this.setState({
          proses: false,
        })
        this.props.refresh()
      })
      .catch(err => {
        this.setState({
          proses: false,
        })
        if (err.message === "Request failed with status code 400") {
          alert("Creator master sudah ada")
        }
      })
  }

  handleChangePartisipan = (newValue, actionMeta) => {
    this.setState({
      user: newValue
    })
  };

  cancel = () => {
    this.props.closeModal()
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
        onClose={this.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <div style={{
            backgroundColor: 'white',
            boxShadow: 5,
            padding: 30,
            width: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {
              this.props.isAdmin
                ? <Typography variant="h5" style={{ textAlign: 'center' }}>Assign Creator Master</Typography>
                : <Typography variant="h5" style={{ textAlign: 'center' }}>Assign Creator Assistant</Typography>
            }

            <form noValidate autoComplete="off" onSubmit={this.send} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <FormControl style={{ margin: '10px 0 10px 0' }}>
                <SeCreatableSelect
                  components={animatedComponents}
                  options={this.state.users}
                  onChange={this.handleChangePartisipan}
                  getOptionLabel={(option) => option.fullname}
                  getOptionValue={(option) => option.user_id}
                  disabled={this.state.proses}
                />
              </FormControl>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={this.cancel}
                  variant="contained"
                  color="secondary"
                  style={{ alignSelf: 'center', marginRight:10 }}
                  disabled={this.state.proses}>
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ alignSelf: 'center' }}
                  disabled={this.state.proses}>
                  SEND
              {this.state.proses && <CircularProgress size={24} style={{
                    color: 'blue',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -12,
                    marginLeft: -12,
                  }} />}
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers
}

const mapStateToProps = ({ loading, dataUsers }) => {
  return {
    loading,
    dataUsers,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(modalCreatorMasterAndAssistant)