import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Paper, TextField, Button } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIconImg from '../../Assets/add-icon.png';

import swal from 'sweetalert';

import { fetchDataTopicsHelpdesk } from '../../store/action';
import { API, BaseURL } from '../../config/API';

class CardTopics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topics_id: null,
      topics: null,
      icon: null,
      iconPath: null,
      isEdit: false,
      userId: null
    };
  }

  componentDidMount() {
    this.setState({ topics_id: this.props.data.id, topics: this.props.data.topics, icon: this.props.data.icon, userId: this.props.data.user_id, iconPath: this.props.data.icon ? `${BaseURL}/${this.props.data.icon}` : null })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      this.setState({ topics_id: this.props.data.id, topics: this.props.data.topics, icon: this.props.data.icon, userId: this.props.data.user_id, iconPath: this.props.data.icon ? `${BaseURL}/${this.props.data.icon}` : null })
    }
  }

  edit = () => {
    this.setState({ isEdit: true })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  editTopics = async (e) => {
    e.preventDefault();

    try {
      let token = Cookies.get('POLAGROUP')
      let formData = new FormData()

      formData.append('topics', this.state.topics)
      formData.append('icon', this.state.icon)

      await API.put(`/helpdesk/topics/${this.state.topics_id}`, formData, { headers: { token } })
      this.setState({ isEdit: false })
      await this.props.fetchDataTopicsHelpdesk()

      swal('Ubah topik berhasil', '', 'success')
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      } else {
        swal('Ubah topik gagal', '', 'error')
      }
      // console.log(err)
    }
  }

  deleteTopics = async () => {
    swal({
      title: "Apa anda yakin ingin menghapus topik ini?",
      text: "Tindakan ini tidak bisa dibatalkan",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (yesAnswer) => {
        if (yesAnswer) {
          this.setState({
            proses: true
          })
          let token = Cookies.get('POLAGROUP')

          API.delete(`/helpdesk/topics/${this.state.topics_id}`, { headers: { token } })
            .then(async () => {
              this.setState({ isEdit: false })
              await this.props.fetchDataTopicsHelpdesk()

              swal('Hapus topik berhasil', '', 'success')
            })
            .catch(err => {
              if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
                swal('Gagal', 'Koneksi tidak stabil', 'error')
              } else {
                swal('Hapus topik gagal', '', 'error')
              }
              // console.log(err)
            })
        }
      });
  }

  handleUploadFile = async (e) => {
    let file = e.target.files[0]
    await this.setState({ icon: file, iconPath: URL.createObjectURL(file) })

    if (!this.state.isEdit) {
      try {
        let token = Cookies.get('POLAGROUP')
        let formData = new FormData()

        formData.append('icon', file)

        await API.put(`/helpdesk/topics/${this.state.topics_id}`, formData, { headers: { token } })
        this.setState({ isEdit: false })
        await this.props.fetchDataTopicsHelpdesk()

        swal('Ubah topik berhasil', '', 'success')
      } catch (err) {
        if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
          swal('Gagal', 'Koneksi tidak stabil', 'error')
        } else {
          swal('Ubah topik gagal', '', 'error')
        }
        // console.log(err)
      }
    }
  }

  render() {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} >
        <Paper style={{ display: 'flex', padding: 10, borderRadius: 10, minHeight: 55, justifyContent: 'space-between' }} >
          <Button
            component="label"
            style={{ minWidth: 30, height: 30, padding: 0, marginRight: 5, backgroundColor: 'white', border: this.state.iconPath ? null : '1px dashed #707070' }}
            disabled={!this.state.isEdit && this.state.iconPath}
          >
            <img src={this.state.iconPath || AddIconImg} alt="add-icon" style={{ width: 20, height: 20 }} />
            <input
              type="file"
              accept="image/png,image/jpeg"
              style={{ display: "none" }}
              onChange={this.handleUploadFile}
            />
          </Button>
          {
            this.state.isEdit
              ? <form onSubmit={this.editTopics}>
                <TextField
                  value={this.state.topics}
                  onChange={this.handleChange('topics')}
                  variant="outlined"
                  inputProps={{
                    style: { padding: '0px 10px', height: 35 }
                  }}
                  InputProps={{
                    style: { borderRadius: 10 }
                  }}
                  disabled={this.state.proses}
                  placeholder="Tulis topik & enter..."
                />
              </form>
              : <Grid style={{ width: '100%', textAlign: 'left', paddingTop: 4, cursor: 'pointer' }} onClick={() => this.props.history.push(`/helpdesk/detail/${this.state.topics_id}`)}>
                <p style={{ fontSize: 18, margin: 0 }}>{this.state.topics}</p>
              </Grid>
          }
          {
            (this.props.isAdminHelpdesk || this.props.isAdminsuper) && !this.state.isEdit && <Grid style={{ minWidth: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <EditIcon width={20} style={{ cursor: 'pointer' }} onClick={this.edit} />
              <DeleteIcon width={20} style={{ color: 'red', cursor: 'pointer' }} onClick={this.deleteTopics} />
            </Grid>
          }

        </Paper>
      </Grid>

    )
  }
}

const mapDispatchToProps = {
  fetchDataTopicsHelpdesk
}

const mapStateToProps = ({ userId, isAdminHelpdesk, isAdminsuper }) => {
  return {
    userId,
    isAdminsuper,
    isAdminHelpdesk
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CardTopics))
