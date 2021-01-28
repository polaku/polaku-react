import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Paper, TextField, Button } from '@material-ui/core';

import swal from 'sweetalert';

import CardTopics from '../../components/Helpdesk/CardTopics';

import { API } from '../../config/API';
import { fetchDataTopicsHelpdesk } from '../../store/action';

class Helpdesk extends Component {
  state = {
    newTopics: null,
    newIcon: null,
    iconPath: null,
    dataTopicsHelpdesk: []
  }

  async componentDidMount() {
    await this.props.fetchDataTopicsHelpdesk()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.dataTopicsHelpdesk !== prevProps.dataTopicsHelpdesk) {
      this.setState({ dataTopicsHelpdesk: this.props.dataTopicsHelpdesk })
    }

    if (this.state.keyword !== prevState.keyword) {
      // console.log(this.props.dataTopicsHelpdesk)
      let data = await this.props.dataTopicsHelpdesk.filter(el => el.topics.toLowerCase().match(new RegExp(this.state.keyword.toLowerCase())))
      this.setState({ dataTopicsHelpdesk: data })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleUploadFile = (e) => {
    this.setState({ icon: e.target.files[0], iconPath: URL.createObjectURL(e.target.files[0]) })
  }

  createTopics = async (e) => {
    e.preventDefault();

    try {
      let token = Cookies.get('POLAGROUP')
      let formData = new FormData()

      formData.append('topics', this.state.newTopics)
      formData.append('icon', this.state.icon)

      await API.post('/helpdesk/topics', formData, { headers: { token } })
      await this.props.fetchDataTopicsHelpdesk()

      this.setState({ topics: null, icon: null, iconPath: null })
      swal('Tambah topik berhasil', '', 'success')
    } catch (err) {
      swal('Tambah topik gagal', '', 'error')
      // console.log(err)
    }
  }

  render() {
    return (
      <Grid style={{ maxWidth: 900, margin: '0px auto' }}>
        <Grid container style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Grid item xs={12} sm={8}>
            <h1 style={{ margin: 0 }}>Hi nama,</h1>
            <h1 style={{ margin: 0 }}>Ada yang bisa kami bantu?</h1>
            {/* <Paper style={{ width: 380 }}> */}
            <TextField
              id="sub-topik"
              value={this.state.keyword}
              onChange={this.handleChange('keyword')}
              margin="normal"
              variant="outlined"
              disabled={this.state.proses}
              style={{ marginTop: 10, width: '90%', backgroundColor: 'white' }}
              inputProps={{
                style: {
                  padding: '13px 17px',
                }
              }}
              InputProps={{
                style: {
                  borderRadius: 20,
                }
              }}
              placeholder="ketik kata kunci topik (misal: Polaku)"
            />
            {/* </Paper> */}
          </Grid>
          <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
            <img src={process.env.PUBLIC_URL + '/helpdesk.png'} alt="helpdesk" style={{ width: 250, height: 170, alignSelf: 'center' }} />
          </Grid>
        </Grid>

        <Grid>
          <h2 style={{ textAlign: 'center' }}>Pilih topik sesuai kendala kamu</h2>

          <Grid container spacing={2}>
            {
              this.state.dataTopicsHelpdesk.length > 0
                ? this.state.dataTopicsHelpdesk.map((topics, index) =>
                  <CardTopics key={'topics' + index} data={topics} />
                )
                : <Grid style={{ width: '100%', textAlign: 'center' }}>
                  <p style={{ letterSpacing: 2 }}>BELUM ADA TOPIK</p>
                </Grid>
            }

            {
              (this.props.isAdminHelpdesk || this.props.isAdminsuper) && <Grid item xs={12} sm={6} md={4} lg={3}  >
                <Paper style={{ display: 'flex', padding: 10, borderRadius: 10, alignItems: 'center', minHeight: 55 }}>
                  <Button
                    component="label"
                    style={{ minWidth: 30, height: 30, padding: 0, marginRight: 5, backgroundColor: 'white', border: this.state.iconPath ? null : '1px dashed #707070' }}
                  >
                    <img src={this.state.iconPath || process.env.PUBLIC_URL + '/add-icon.png'} alt="add-icon" style={{ width: 20, height: 20 }} />
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      style={{ display: "none" }}
                      onChange={this.handleUploadFile}
                    />
                  </Button>
                  <form onSubmit={this.createTopics}>
                    <TextField
                      value={this.state.newTopics}
                      onChange={this.handleChange('newTopics')}
                      variant="outlined"
                      inputProps={{
                        style: { padding: '0px 10px', height: 35 }
                      }}
                      InputProps={{
                        style: { borderRadius: 10 }
                      }}
                      style={{ padding: 0 }}
                      disabled={this.state.proses}
                      placeholder="Tulis topik & enter..."
                    />
                  </form>
                </Paper>
              </Grid>
            }

          </Grid>
        </Grid>
      </Grid>
    )
  }
}


const mapDispatchToProps = {
  fetchDataTopicsHelpdesk
}

const mapStateToProps = ({ dataTopicsHelpdesk, userId, isAdminHelpdesk, isAdminsuper }) => {
  return {
    dataTopicsHelpdesk,
    userId,
    isAdminHelpdesk,
    isAdminsuper
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Helpdesk)