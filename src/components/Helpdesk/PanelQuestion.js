import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Grid, Breadcrumbs, Link, List, ListItem, Divider, Button } from '@material-ui/core';
// import { EditorState, convertToRaw } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';

import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import swal from 'sweetalert';

import { API } from '../../config/API';
import { fetchDataTopicsHelpdesk } from '../../store/action';

class PanelQuestion extends Component {
  state = {
    listQuestion: [],
    showDetailQuestion: false,
    questionSelected: null,
    like: false,
    unlike: false
  }

  async componentDidMount() {
    if (this.props.data) {
      await this.fetchData()
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      if (this.props.data) {
        await this.fetchData()

        if (this.props.match.params.idQuestion) {
          let questionSelected = this.props.data.tbl_question_helpdesks.find(el => el.id = this.props.match.params.idQuestion)
          this.setState({ showDetailQuestion: !this.state.showDetailQuestion, questionSelected: questionSelected })
        } else {
          this.setState({ showDetailQuestion: false, questionSelected: null })

        }
      } else {
        this.setState({ listQuestion: [] })
      }

      if (!this.props.match.params.idQuestion) {
        this.setState({ showDetailQuestion: false, questionSelected: null })
      }
    }

    if (prevProps.match.params.idQuestion !== this.props.match.params.idQuestion) {
      if (!this.props.match.params.idQuestion) {
        this.setState({ showDetailQuestion: false, questionSelected: null })
      }
    }

    if (this.state.questionSelected !== prevState.questionSelected) {
      if (this.state.questionSelected) {
        try {
          let token = Cookies.get('POLAGROUP')
          let { data } = await API.get(`/helpdesk/question/like-unlike/${this.state.questionSelected.id}`, { headers: { token } })

          if (data.data) this.setState({ like: data.data.like, unlike: data.data.unlike })
          else this.setState({ like: false, unlike: false })
        } catch (err) {
          // console.log(err)
          this.setState({ like: false, unlike: false })
        }
      } else {
        this.setState({ like: false, unlike: false })
      }
    }
  }

  fetchData = async () => {
    await this.props.data.tbl_question_helpdesks.forEach(question => {
      let likes = 0, unlikes = 0
      question.tbl_question_likes.forEach(dataLikes => {
        if (dataLikes.like) likes++
        else unlikes++
      })
      question.totalLikes = likes
      question.totalUnlikes = unlikes
    })
    console.log(this.props.data.tbl_question_helpdesks)
    this.setState({ listQuestion: this.props.data.tbl_question_helpdesks })

  }

  deleteQuestion = (index) => {
    swal({
      title: "Apa anda yakin ingin menghapus pertanyaan ini?",
      text: "Tindakan ini tidak bisa dibatalkan",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (yesAnswer) => {
        if (yesAnswer) {
          // this.setState({
          //   proses: true
          // })
          let token = Cookies.get('POLAGROUP'), dataListQuestion = this.state.listQuestion

          API.delete(`/helpdesk/question/${dataListQuestion[index].id}`, { headers: { token } })
            .then(async () => {
              dataListQuestion.splice(index, 1)
              this.setState({ proses: false, listQuestion: dataListQuestion })
              swal('Hapus pertanyaan berhasil', '', 'success')
            })
            .catch(err => {
              swal('Hapus pertanyaan gagal', '', 'error')
              // console.log(err)
            })
        }
      });
  }

  handleShowDetailQuestion = (data) => {
    if (data.id) {
      this.props.history.push(`/helpdesk/detail/${this.props.match.params.id}/sub-topics/${this.props.match.params.idSub}/question/${data.id}`)
    } else {
      this.props.history.push(`/helpdesk/detail/${this.props.match.params.id}/sub-topics/${this.props.match.params.idSub}`)
    }

    this.setState({ showDetailQuestion: !this.state.showDetailQuestion, questionSelected: data })
  }

  handleLike = async () => {
    await this.setState({ like: !this.state.like, unlike: false })
    try {
      let token = Cookies.get('POLAGROUP')
      await API.put(`/helpdesk/question/like-unlike/${this.state.questionSelected.id}`, { like: this.state.like, unlike: this.state.unlike }, { headers: { token } })
    } catch (err) {
      // console.log(err)
      this.setState({ like: !this.state.like, unlike: false })
    }
  }

  handleUnlike = async () => {
    await this.setState({ like: false, unlike: !this.state.unlike })
    try {
      let token = Cookies.get('POLAGROUP')
      await API.put(`/helpdesk/question/like-unlike/${this.state.questionSelected.id}`, { like: this.state.like, unlike: this.state.unlike }, { headers: { token } })
      await this.props.fetchDataTopicsHelpdesk()
    } catch (err) {
      // console.log(err)
      this.setState({ like: false, unlike: !this.state.unlike })
    }
  }

  changeOrder = async (id, subTopicsId, args, index) => {
    try {
      let token = Cookies.get('POLAGROUP')
      let newData = {
        sub_topics_id: subTopicsId,
        order: args
      }

      await API.put(`/helpdesk/question/${id}/order`, newData, { headers: { token } })

      let dataListQuestion = this.state.listQuestion

      let temp = dataListQuestion[index]
      if (args === 'up') {
        dataListQuestion[index] = dataListQuestion[index - 1]
        dataListQuestion[index - 1] = temp
      } else {
        dataListQuestion[index] = dataListQuestion[index + 1]
        dataListQuestion[index + 1] = temp
      }
      this.setState({ dataListQuestion })
    } catch (err) {
      console.log(err)
      swal('silahkan coba lagi', '', 'warning')
    }
  }

  render() {
    // DETAIL QUESTION
    if (this.state.showDetailQuestion) return (
      <Grid item style={{ width: '70%', minWidth: 550 }}>
        <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 15, marginBottom: 10 }}>
          <Link style={{ color: '#d71149', cursor: 'pointer' }} onClick={() => this.props.history.push('/helpdesk')} >Helpdesk</Link>
          <Link style={{ color: '#d71149', cursor: 'pointer' }} onClick={this.handleShowDetailQuestion} >{this.props.data.sub_topics}</Link>
        </Breadcrumbs>
        <h1 style={{ margin: 0 }}>{this.state.questionSelected.question}</h1>

        <Grid dangerouslySetInnerHTML={{ __html: this.state.questionSelected.answer }} />

        <Grid style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f5', padding: '10px 20px', width: '310px', borderRadius: 5, justifyContent: 'space-between', marginBottom: 15 }}>
          <p style={{ margin: 0 }}>Apakah artikel ini membantu?</p>
          <Grid style={{ display: 'flex', alignItems: 'center', width: 70, justifyContent: 'space-between' }}>
            <Button variant="contained" style={{ backgroundColor: this.state.like ? 'green' : 'white', padding: 5, minWidth: 25 }} onClick={this.handleLike}>
              <ThumbUpOutlinedIcon style={{ width: 20, height: 18, color: this.state.like ? 'white' : '#737373' }} />
            </Button>
            <Button variant="contained" style={{ backgroundColor: this.state.unlike ? 'red' : 'white', padding: 5, minWidth: 25 }} onClick={this.handleUnlike}>
              <ThumbDownOutlinedIcon style={{ width: 20, height: 18, color: this.state.unlike ? 'white' : '#737373' }} />
            </Button>
          </Grid>
        </Grid>

        {
          this.state.questionSelected.help && <Grid style={{ display: 'flex', flexDirection: 'column', marginBottom: 30 }}>
            <b style={{ fontSize: 12, marginBottom: 5 }}>Butuh bantuan lebih lanjut</b>
            <Button variant="contained" color="secondary" size="small" style={{ textTransform: 'none', width: 70, fontSize: 11 }} onClick={() =>
              this.state.questionSelected.help
                ? !isNaN(Number(this.state.questionSelected.help[1]))
                  ? window.open(
                    `https://api.whatsapp.com/send?phone=${this.state.questionSelected.help[0] === '0'
                      ? `62${this.state.questionSelected.help.slice(1)}`
                      : this.state.questionSelected.help.slice(0, 2) === '62'
                        ? this.state.questionSelected.help
                        : `62${this.state.questionSelected.help}`
                    }`
                  )
                  : null
                : null
            }>
              Hubungi
            </Button>
          </Grid>
        }

      </Grid>
    )

    else return (
      <Grid item style={{ width: '70%', minWidth: 550 }}>
        <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 15, marginBottom: 10 }}>
          <Link style={{ color: '#d71149', cursor: 'pointer' }} onClick={() => this.props.history.push('/helpdesk')} >Helpdesk</Link>
        </Breadcrumbs>
        <h1 style={{ margin: 0 }}>Yang sering ditanyakan</h1>
        <List component="nav" aria-label="secondary mailbox folders">
          {
            this.state.listQuestion.length > 0
              ? this.state.listQuestion.map((question, index) =>
                <>
                  <ListItem button style={{ padding: 5, paddingLeft: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                    <p style={{ margin: 0, cursor: 'pointer', width: '100%' }} onClick={() => this.handleShowDetailQuestion(question)}>{question.question}</p>
                    <Grid style={{ minWidth: 150, display: 'flex', alignItems: 'center' }}>
                      {/* LIKE OR UNLIKE */}
                      {
                        (this.props.isAdminHelpdesk || this.props.isAdminsuper) &&
                        <>
                          <Grid style={{ minWidth: 55, display: 'flex', alignItems: 'center' }}>
                            <p style={{ margin: 0, marginRight: 2, fontSize: 11 }}>{question.totalLikes}</p>
                            <ThumbUpOutlinedIcon style={{ color: '#737373', width: 20, height: 18, marginRight: 5 }} />
                            <p style={{ margin: 0, marginRight: 2, fontSize: 11 }}>{question.totalUnlikes}</p>
                            <ThumbDownOutlinedIcon style={{ color: '#737373', width: 20, height: 18, }} />
                          </Grid>


                          {/* EDIT OR DELETE */}
                          <Grid style={{ minWidth: 40, marginLeft: 15, marginRight: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <EditIcon style={{ width: 22, height: 20 }} onClick={() => this.props.editQuestion(index)} />
                            <DeleteIcon style={{ color: 'red', width: 22, height: 20 }} onClick={() => this.deleteQuestion(index)} />
                          </Grid>

                          {/* ORDER LIST */}
                          <Grid style={{ display: 'flex', flexDirection: 'column', justifyContent: index === 0 || index === this.state.listQuestion.length - 1 ? 'center' : 'space-between', height: 25 }}>
                            {
                              index !== 0 && <img src={process.env.PUBLIC_URL + '/caret-up.png'} alt={index + "up"} style={{ width: 20, height: 10, cursor: 'pointer' }} onClick={() => this.changeOrder(question.id, question.sub_topics_id, 'up', index)} />
                            }
                            {
                              index !== this.state.listQuestion.length - 1 && <img src={process.env.PUBLIC_URL + '/caret-down.png'} alt={index + "down"} style={{ width: 20, height: 10, cursor: 'pointer' }} onClick={() => this.changeOrder(question.id, question.sub_topics_id, 'down', index)} />
                            }
                          </Grid>
                        </>
                      }

                    </Grid>
                  </ListItem>
                  <Divider />
                </>
              )
              : <p style={{ margin: 0 }}>Belum ada pertanyaan</p>
          }
        </List>

        {
          (this.props.isAdminHelpdesk || this.props.isAdminsuper) && <Grid style={{ marginTop: 10 }}>
            <p style={{ margin: 0, color: '#d71149', cursor: 'pointer' }} onClick={this.props.addQuestion}>+ tambah pertanyaan</p>
          </Grid>
        }
      </Grid>
    )

  }
}

const mapDispatchToProps = {
  fetchDataTopicsHelpdesk
}

const mapStateToProps = ({ isAdminHelpdesk, isAdminsuper }) => {
  return {
    isAdminsuper,
    isAdminHelpdesk
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PanelQuestion))