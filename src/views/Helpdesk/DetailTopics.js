import React, { Component } from 'react';
import { connect } from 'react-redux';

import Cookies from 'js-cookie';

import { Grid, Paper, List, ListItem, TextField, Button } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

import PanelQuestion from '../../components/Helpdesk/PanelQuestion';
import PanelFormQuestion from '../../components/Helpdesk/PanelFormQuestion';
import swal from 'sweetalert';

import { fetchDataTopicsHelpdesk } from '../../store/action';

import { API, BaseURL } from '../../config/API';

class DetailTopics extends Component {
  state = {
    proses: true,
    index: 0,
    topics: null,
    iconPath: null,
    listSubTopics: [],
    newSubTopics: null,
    addNewQuestion: false,
    subTopicsSelected: null,

    indexSubTopics: 0,
    questionSelectedForEdit: null,

  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    try {
      let token = Cookies.get('POLAGROUP')
      let { data } = await API.get(`/helpdesk/topics/${this.props.match.params.id}`, { headers: { token } })

      let optionListSubTopics = []

      await data.data.tbl_sub_topics_helpdesks.forEach(subTopics => {
        optionListSubTopics.push({ value: subTopics.id, label: subTopics.sub_topics, isEdit: false })
      })

      if (data.data.tbl_sub_topics_helpdesks.length > 0) {
        data.data.tbl_sub_topics_helpdesks[0].isSelected = true
      }
      this.setState({
        topics: data.data.topics,
        iconPath: data.data.icon ? `${BaseURL}/${data.data.icon}` : null,
        listSubTopics: data.data.tbl_sub_topics_helpdesks,
        optionListSubTopics,
        proses: false,
        subTopicsSelected: data.data.tbl_sub_topics_helpdesks.length > 0 ? data.data.tbl_sub_topics_helpdesks[0] : null
      })
    } catch (err) {
      // console.log(err)
    }
  }

  handleChange = index => event => {
    let listSubTopicsSelected = this.state.listSubTopics
    listSubTopicsSelected[index].sub_topics = event.target.value
    this.setState({ listSubTopics: listSubTopicsSelected });
  };

  createSubTopics = async (e) => {
    e.preventDefault();

    try {
      let token = Cookies.get('POLAGROUP')
      let formData = new FormData()

      formData.append('topics', this.state.newTopics)

      await API.post('/helpdesk/sub-topics', formData, { headers: { token } })
      await this.props.fetchDataTopicsHelpdesk()

      swal('Tambah topik berhasil', '', 'success')
    } catch (err) {
      swal('Tambah topik gagal', '', 'error')
      // console.log(err)
    }
  }

  handleUploadFile = async (e) => {
    let file = e.target.files[0]
    await this.setState({ icon: file, iconPath: URL.createObjectURL(file) })

    if (!this.state.isEdit) {
      try {
        let token = Cookies.get('POLAGROUP')
        let formData = new FormData()

        formData.append('icon', file)

        await API.put(`/helpdesk/topics/${this.props.match.params.id}`, formData, { headers: { token } })
        this.setState({ isEdit: false })
        await this.props.fetchDataTopicsHelpdesk()

        swal('Ubah topik berhasil', '', 'success')
      } catch (err) {
        swal('Ubah topik gagal', '', 'error')
        // console.log(err)
      }
    }
  }

  edit = (index) => {
    let dataListSubTopics = this.state.listSubTopics

    dataListSubTopics[index].isEdit = true
    this.setState({ listSubTopics: dataListSubTopics })
  }

  cancelEditSubTopics = (index) => {
    let dataListSubTopics = this.state.listSubTopics

    dataListSubTopics[index].isEdit = false
    this.setState({ listSubTopics: dataListSubTopics })
  }

  deleteSubTopics = (index) => {
    swal({
      title: "Apa anda yakin ingin menghapus sub topik ini?",
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
          let token = Cookies.get('POLAGROUP'), dataListSubTopics = this.state.listSubTopics

          API.delete(`/helpdesk/sub-topics/${dataListSubTopics[index].id}`, { headers: { token } })
            .then(async () => {
              dataListSubTopics.splice(index, 1)
              this.setState({ isEdit: false, proses: false, listSubTopics: dataListSubTopics })
              swal('Hapus sub topik berhasil', '', 'success')
            })
            .catch(err => {
              swal('Hapus sub topik gagal', '', 'error')
              // console.log(err)
            })
        }
      });
  }

  addQuestion = () => {
    this.setState({ addNewQuestion: !this.state.addNewQuestion, questionSelectedForEdit: null })
  }

  changeSubTopicsSelected = (indexSelected) => {
    let newListSubTopics = this.state.listSubTopics, subTopicsSelected = null

    newListSubTopics.forEach((list, index) => {
      if (indexSelected === index) {
        list.isSelected = true
        subTopicsSelected = list
      }
      else list.isSelected = false
    })

    this.setState({ listSubTopics: newListSubTopics, subTopicsSelected, indexSubTopics: indexSelected, addNewQuestion: false })
  }

  editSubTopics = index => async (event) => {
    event.preventDefault()
    try {
      let subTopicsSelected = this.state.listSubTopics[index], token = Cookies.get('POLAGROUP')

      await API.put(`helpdesk/sub-topics/${subTopicsSelected.id}`, { subTopics: subTopicsSelected.sub_topics }, { headers: { token } })

      this.cancelEditSubTopics(index)

      swal('Edit sub topik berhasil', '', 'success')
    } catch (err) {
      // console.log(err)
      swal('Edit sub topik gagal', '', 'error')
    }
  }

  editQuestion = (index) => {
    let newListSubTopics = this.state.listSubTopics[this.state.indexSubTopics]
    this.setState({ addNewQuestion: true, questionSelectedForEdit: newListSubTopics.tbl_question_helpdesks[index] })
  }

  refresh = async () => {
    await this.fetchData()
    this.setState({ addNewQuestion: false })
  }

  cancel = () => {
    this.setState({ addNewQuestion: false })
  }
  render() {
    return (
      <Grid container style={{ maxWidth: 900, margin: '0px auto', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

        <Grid item style={{ width: '20%', minWidth: 250, marginBottom: 20 }}>
          <Grid style={{ display: 'flex', marginBottom: 10 }}>
            {
              this.state.iconPath
                ? <Paper style={{ width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <img src={this.state.iconPath} alt="favicon" style={{ width: 30, height: 30 }} />
                </Paper>
                : <Button
                  component="label"
                  style={{ minWidth: 40, height: 40, padding: 0, marginRight: 5, backgroundColor: 'white', border: '1px dashed #707070' }}
                  disabled={this.state.iconPath}
                >
                  <img src={process.env.PUBLIC_URL + '/add-icon.png'} alt="add-icon" style={{ width: 20, height: 20 }} />
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    style={{ display: "none" }}
                    onChange={this.handleUploadFile}
                  />
                </Button>
            }
            <Grid>
              <b style={{ fontSize: 20 }}>{this.state.topics}</b>
              <p style={{ margin: 0, fontSize: 12, cursor: 'pointer', color: '#da295b' }} onClick={() => this.props.history.goBack()}>Lihat semua topik</p>
            </Grid>

          </Grid>

          <List component="nav" aria-label="secondary mailbox folders">
            {
              this.state.listSubTopics.length === 0
                ? <p style={{ margin: 0, fontSize: 14 }}>Belum ada sub topik</p>
                : this.state.listSubTopics.map((subTopics, index) =>
                  !subTopics.isEdit
                    ? <ListItem button style={{ padding: 5, borderLeft: '1px solid #c2c2c2', paddingLeft: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: subTopics.isSelected ? '#f0f0f0' : null }} onClick={() => this.changeSubTopicsSelected(index)}>
                      <p style={{ color: subTopics.isSelected ? 'black' : '#a8a8a8', margin: 0, fontSize: 14, fontWeight: subTopics.isSelected ? 'bold' : null }}>{subTopics.sub_topics}</p>
                      {
                        (this.props.isAdminHelpdesk || this.props.isAdminsuper) && <Grid style={{ minWidth: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <EditIcon style={{ cursor: 'pointer', width: 20 }} onClick={() => this.edit(index)} />
                          <DeleteIcon style={{ color: 'red', cursor: 'pointer', width: 20 }} onClick={() => this.deleteSubTopics(index)} />
                        </Grid>
                      }
                    </ListItem>
                    : <Grid style={{ margin: '3px 0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5px 5px 5px' }}>
                      <form onSubmit={this.editSubTopics(index)} >
                        <TextField
                          value={subTopics.sub_topics}
                          onChange={this.handleChange(index)}
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
                      <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, cursor: 'pointer', width: 20, height: 20 }} onClick={() => this.cancelEditSubTopics(index)} />
                    </Grid>
                )
            }
          </List>
        </Grid>

        {
          (this.state.addNewQuestion)
            ? <PanelFormQuestion topics={this.state.topics} topicsId={this.props.match.params.id} optionListSubTopics={this.state.optionListSubTopics} questionSelectedForEdit={this.state.questionSelectedForEdit} refresh={this.refresh} cancel={this.cancel} />
            : <PanelQuestion topicsId={this.props.match.params.id} addQuestion={this.addQuestion} data={this.state.subTopicsSelected} editQuestion={this.editQuestion} />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailTopics)