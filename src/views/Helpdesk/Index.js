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
    dataTopicsHelpdesk: [],
    listQuestion: [],
    keyword: '',
    listSearching: []
  }

  async componentDidMount() {
    await this.props.fetchDataTopicsHelpdesk()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.dataTopicsHelpdesk !== prevProps.dataTopicsHelpdesk) {

      let listQuestion = []
      await this.props.dataTopicsHelpdesk.forEach(async (topics) => {
        topics.tbl_sub_topics_helpdesks.length > 0 && await topics.tbl_sub_topics_helpdesks.forEach(async (subTopics) => {
          subTopics.tbl_question_helpdesks.length > 0 && await subTopics.tbl_question_helpdesks.forEach(question => {
            question.question_id = question.id
            question.topics_id = topics.id
            question.sub_topics = subTopics.sub_topics
            listQuestion.push({ ...question, ...topics })
          })
        })
      });

      this.setState({ dataTopicsHelpdesk: this.props.dataTopicsHelpdesk, listQuestion })
    }

    if (this.state.keyword !== prevState.keyword) {
      let searchQuestion = await this.state.listQuestion.filter(el => el.question && el.question.replace(/(<([^>]+)>)/ig, "").toLowerCase().match(new RegExp(this.state.keyword.toLowerCase())))
      let searchAnswer = await this.state.listQuestion.filter(el => el.answer && el.answer.replace(/(<([^>]+)>)/ig, "").toLowerCase().match(new RegExp(this.state.keyword.toLowerCase())))

      searchAnswer.length > 0 && searchAnswer.forEach(answer => {
        let checkAnswer = searchQuestion.find(question => question.question_id === answer.question_id)
        if (!checkAnswer) searchQuestion.push(answer)
      })

      this.setState({ listSearching: searchQuestion })
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

      this.setState({ newTopics: null, icon: null, iconPath: null })
      swal('Tambah topik berhasil', '', 'success')
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      } else {
        swal('Tambah topik gagal', '', 'error')
      }
      // console.log(err)
    }
  }

  render() {
    return (
      <Grid style={{ maxWidth: 900, margin: '0px auto' }}>
        <Grid container style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Grid item xs={12} sm={8}>
            <h1 style={{ margin: 0 }}>Hi {this.props.nickname || this.props.fullname},</h1>
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
              this.state.keyword
                ? this.state.listSearching.map((question, index) =>
                  <Grid item xs={12}>
                    <Paper style={{ padding: 15, cursor: 'pointer' }}
                      onClick={() => this.props.history.push(`/helpdesk/detail/${question.topics_id}/sub-topics/${question.sub_topics_id}/question/${question.question_id}`)}
                    >
                      <h3 style={{ marginTop: 3, marginBottom: 5 }}>{question.question}</h3>
                      <p style={{ marginTop: 3, marginBottom: 5 }}>{question.answer.replace(/(<([^>]+)>)/ig, "").split(' ').slice(0, 20).join(' ')}</p>
                    </Paper>
                  </Grid>
                )
                : this.state.dataTopicsHelpdesk.length > 0
                  ? this.state.dataTopicsHelpdesk.map((topics, index) =>
                    <CardTopics key={'topics' + index} data={topics} />
                  )
                  : <Grid style={{ width: '100%', textAlign: 'center' }}>
                    <p style={{ letterSpacing: 2 }}>BELUM ADA TOPIK</p>
                  </Grid>
            }

            {
              (this.props.isAdminHelpdesk || this.props.isAdminsuper) && !this.state.keyword && <Grid item xs={12} sm={6} md={4} lg={3}  >
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

const mapStateToProps = ({ dataTopicsHelpdesk, userId, isAdminHelpdesk, isAdminsuper, nickname, fullname }) => {
  return {
    dataTopicsHelpdesk,
    userId,
    isAdminHelpdesk,
    isAdminsuper,
    nickname,
    fullname
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Helpdesk)