import React, { Component } from 'react';
import { connect } from 'react-redux';
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

class PanelQuestion extends Component {
  state = {
    listQuestion: [],
    showDetailQuestion: false,
    questionSelected: null,
    like: false,
    unlike: false
  }

  componentDidMount() {
    if (this.props.data) {
      this.fetchData()
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      await this.fetchData()
      this.setState({ showDetailQuestion: false, questionSelected: null })
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
    } catch (err) {
      // console.log(err)
      this.setState({ like: false, unlike: !this.state.unlike })
    }
  }

  render() {

    if (this.state.showDetailQuestion) return (
      <Grid item style={{ width: '70%', minWidth: 550 }}>
        <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 15, marginBottom: 10 }}>
          <Link style={{ color: '#d71149' }} href="/helpdesk" >Helpdesk</Link>
          <Link style={{ color: '#d71149' }} href="/" >Topik</Link>
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

        <Grid style={{ display: 'flex', flexDirection: 'column', marginBottom: 30 }}>
          <b style={{ fontSize: 12, marginBottom: 5 }}>Butuh bantuan lebih lanjut</b>
          <Button variant="contained" color="secondary" size="small" style={{ textTransform: 'none', width: 70, fontSize: 11 }} onClick={() =>
            this.state.questionSelected.help
              ? !isNaN(Number(this.state.questionSelected.help[1]))
                ? window.open(
                  `https://api.whatsapp.com/send?phone=${this.state.questionSelected.help[0] === '0'
                    ? `62${this.state.questionSelected.help.slice(1)}`
                    : this.state.questionSelected.help.slice(1)
                  }`
                )
                : null
              : null
          }>
            Hubungi
          </Button>
        </Grid>
      </Grid>
    )

    else return (
      <Grid item style={{ width: '70%', minWidth: 550 }}>
        <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 15, marginBottom: 10 }}>
          <Link style={{ color: '#d71149' }} href="/helpdesk" >Helpdesk</Link>
          <Link style={{ color: '#d71149' }} href="/" >Topik</Link>
        </Breadcrumbs>
        <h1 style={{ margin: 0 }}>Yang sering ditanyakan</h1>
        <List component="nav" aria-label="secondary mailbox folders">
          {
            this.state.listQuestion.length > 0
              ? this.state.listQuestion.map((question, index) =>
                <>
                  <ListItem button style={{ padding: 5, paddingLeft: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => this.handleShowDetailQuestion(question)}>
                    <p style={{ margin: 0 }}>{question.question}</p>
                    <Grid style={{ minWidth: 100, display: 'flex', alignItems: 'center' }}>
                      {/* LIKE OR UNLIKE */}
                      {
                        (this.props.isAdminHelpdesk || this.props.isAdminsuper) &&
                        <>
                          <Grid style={{ minWidth: 50, display: 'flex', alignItems: 'center', }}>
                            <p style={{ margin: 0, marginRight: 2, fontSize: 11 }}>{question.totalLikes}</p>
                            <ThumbDownOutlinedIcon style={{ color: '#737373', width: 20, height: 18, marginRight: 8 }} />
                            <p style={{ margin: 0, marginRight: 2, fontSize: 11 }}>{question.totalUnlikes}</p>
                            <ThumbUpOutlinedIcon style={{ color: '#737373', width: 20, height: 18 }} />
                          </Grid>


                          {/* EDIT OR DELETE */}
                          <Grid style={{ minWidth: 50, marginLeft: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <EditIcon style={{ width: 22, height: 20 }} onClick={() => this.props.editQuestion(index)} />
                            <DeleteIcon style={{ color: 'red', width: 22, height: 20 }} onClick={() => this.deleteQuestion(index)} />
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

const mapStateToProps = ({ isAdminHelpdesk, isAdminsuper }) => {
  return {
    isAdminsuper,
    isAdminHelpdesk
  }
}
export default connect(mapStateToProps)(PanelQuestion)