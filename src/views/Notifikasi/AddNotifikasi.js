import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Grid, Breadcrumbs, Link, FormControl, TextField, Button, FormControlLabel, RadioGroup, Radio, Typography, Select, MenuItem } from '@material-ui/core';
import ReactSelect from 'react-select';
// import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import swal from 'sweetalert';

import { fetchDataCompanies, fetchDataDepartment } from '../../store/action';
import { API } from '../../config/API';

const animatedComponents = makeAnimated();

class addNotifikasi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: null,
      title: null,
      editorState: EditorState.createEmpty(),
      help: null,
      inviteOption: 'all',
      company: null,
      department: null,
      employee: null,
      listUser: [],
      categoryNotifikasi: [],
      optionCompany: [],
      isNotifPolaku: null
    };
  }
  async componentDidMount() {
    await this.props.fetchDataCompanies()
    await this.props.fetchDataDepartment()
    await this.fetchNotificationCategory()

    if (this.props.questionSelectedForEdit) {
      let company = [], department = []

      if (this.props.questionSelectedForEdit.tbl_question_fors.length > 0) {
        if (this.props.questionSelectedForEdit.tbl_question_fors[0].option === 'company') {
          await this.props.questionSelectedForEdit.tbl_question_fors.forEach(el => {
            let companySelected = this.props.dataCompanies.find(element => el.company_id === element.company_id)

            if (companySelected) company.push(companySelected)
          })
        } else if (this.props.questionSelectedForEdit.tbl_question_fors[0].option === 'department') {
          await this.props.questionSelectedForEdit.tbl_question_fors.forEach(el => {
            let departmentSelected = this.props.dataDepartments.find(element => el.departments_id === element.departments_id)

            if (departmentSelected) department.push(departmentSelected)
          })
        }
      }

      this.setState({
        subTopik: this.props.optionListSubTopics.find(subTopics => subTopics.value === this.props.questionSelectedForEdit.sub_topics_id),
        question: this.props.questionSelectedForEdit.question,
        editorState: EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(this.props.questionSelectedForEdit.answer)
          )),
        help: this.props.questionSelectedForEdit.help,
        inviteOption: this.props.questionSelectedForEdit.tbl_question_fors.length > 0 ? this.props.questionSelectedForEdit.tbl_question_fors[0].option : '',
        company,
        department
      })
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.inviteOption !== prevState.inviteOption) {
      this.setState({ company: null, department: null })
    }

    if (this.state.category !== prevState.category) {
      let optionCompany = []
      let categorySelected = this.state.categoryNotifikasi.find(el => el.id === this.state.category)

      await categorySelected.admin.forEach(el => {
        if (el.user_id === this.props.userId) {
          let check = this.props.dataCompanies.find(element => element.company_id === el.company_id)
          if (check) optionCompany.push(check)
        }
      })
      this.setState({ optionCompany })
      // let checkAdmin = el.admin.find(element => element.user_id === this.props.userId)
    }
  }

  fetchNotificationCategory = async () => {
    try {
      let token = Cookies.get('POLAGROUP'), datas = []
      let { data } = await API.get('/notification/category/setting', { headers: { token } })

      if (this.props.isAdminsuper) {
        datas = data.data
      } else {
        data.data.forEach(el => {
          let flag = false
          if (el.user_id === this.props.userId) flag = true

          let check = el.admin.find(element => element.user_id === this.props.userId)
          if (check || flag) datas.push(el)
        })
      }

      this.setState({ categoryNotifikasi: datas })
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      }
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  handleChangeSelect = (name, newValue, actionMeta) => {
    this.setState({
      [name]: newValue
    })
  };

  handleChangeRadio = event => {
    this.setState({ inviteOption: event.target.value });
  };

  submit = async () => {
    try {
      let answer = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

      if (((!this.props.isAdminsuper && this.state.category) || (this.props.isAdminsuper && ((this.state.isNotifPolaku === 1 && this.state.category) || this.state.isNotifPolaku === 0))) && this.state.title && answer && this.state.inviteOption &&
        (this.state.inviteOption === 'all' ||
          (this.state.inviteOption === 'company' && this.state.company) ||
          (this.state.inviteOption === 'department' && this.state.department))
      ) {
        let token = Cookies.get('POLAGROUP')
        let newData = {
          category_notification_id: this.state.category,
          title: this.state.title,
          description: answer,
          contact: this.state.help,
          option: this.state.inviteOption,
          company: this.state.company,
          department: this.state.department,
          is_notif_polaku: this.props.isAdminsuper ? this.state.isNotifPolaku : 1
        }

        await API.post('/notification', newData, { headers: { token } })
        swal('Tambah notifikasi berhasil', '', 'success')

        this.props.history.push('/notifikasi')
        //   this.props.refresh()

        // if (this.props.questionSelectedForEdit) {
        //   await API.put(`helpdesk/question/${this.props.questionSelectedForEdit.id}`, newData, { headers: { token } })
        //   swal('Edit pertanyaan berhasil', '', 'success')
        //   this.props.refresh()
        // } else {
        //   await API.post('helpdesk/question', newData, { headers: { token } })
        //   swal('Tambah pertanyaan berhasil', '', 'success')
        //   this.props.refresh()
        // }
      } else {
        swal('Data tidak lengkap')
      }
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      } else {
        if (this.props.questionSelectedForEdit) swal('Edit pertanyaan berhasil', '', 'success')
        else swal('Tambah pertanyaan gagal', '', 'error')
      }
    }
  }

  render() {
    return (
      <Grid item style={{ width: '70%', minWidth: 550, padding: 20, maxWidth: 700 }}>
        <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
          <Link style={{ color: '#d71149', cursor: 'pointer' }} onClick={() => this.props.history.push('/notifikasi')}>Notifikasi</Link>
          <Typography style={{ color: '#d71149', fontSize: 14 }}>Notifikasi baru</Typography>
        </Breadcrumbs>

        <Grid style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
          {
            this.props.isAdminsuper && <Grid id="form-is-notif-polaku" style={{ display: 'flex', flexDirection: 'column', marginTop: 10, marginBottom: 20 }}>
              <b style={{ margin: 0, fontSize: 15 }} htmlFor="pertanyaan">Jenis Notifikasi</b>
              <FormControl variant="outlined" style={{ width: '100%', height: 40 }} size="small">
                <Select
                  value={this.state.isNotifPolaku}
                  onChange={this.handleChange('isNotifPolaku')}
                  disabled={this.state.proses}
                  style={{ marginTop: 10 }}
                >
                  <MenuItem value={1}>Polaku</MenuItem>
                  <MenuItem value={0}>Update sistem</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          }

          {
            (!this.props.isAdminsuper || (this.props.isAdminsuper && this.state.isNotifPolaku))
              ? <Grid id="form-category" style={{ display: 'flex', flexDirection: 'column', marginTop: 10, marginBottom: 20 }}>
                <b style={{ margin: 0, fontSize: 15 }} htmlFor="pertanyaan">Kategori Notifikasi</b>
                <FormControl variant="outlined" style={{ width: '100%', height: 40 }} size="small">
                  <Select
                    value={this.state.category}
                    onChange={this.handleChange('category')}
                    disabled={this.state.proses}
                    style={{ marginTop: 10 }}
                  >
                    {
                      this.state.categoryNotifikasi.map((notifikasi, index) =>
                        <MenuItem value={notifikasi.id} key={"notifikasi" + index}>{notifikasi.name}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
                <p style={{ margin: 0, marginTop: 10, color: 'gray' }} htmlFor="pertanyaan">Jika tidak ada pilihan harap menambahkan kategori notifikasi di menu Setting Notifikasi</p>
              </Grid>
              : null
          }

          <Grid id="form-pertanyaan" style={{ display: 'flex', flexDirection: 'column', marginTop: 10, marginBottom: 10 }}>
            <b style={{ margin: 0, fontSize: 15 }} htmlFor="pertanyaan">Judul</b>
            <TextField
              id="pertanyaan"
              value={this.state.title}
              onChange={this.handleChange('title')}
              margin="normal"
              variant="outlined"
              disabled={this.state.proses}
              style={{ marginTop: 10 }}
              inputProps={{
                style: {
                  padding: '13px 10px'
                }
              }}
            />
          </Grid>

          <Grid id="form-jawaban" style={{ display: 'flex', flexDirection: 'column', marginTop: 10, marginBottom: 10 }}>
            <b style={{ margin: 0, fontSize: 15 }}>Isi</b >
            <Editor
              editorState={this.state.editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={this.onEditorStateChange}
              editorStyle={{ backgroundColor: 'white', height: 150, margin: 0 }}
            />
          </Grid>

          <Grid id="form-bantuan" style={{ display: 'flex', flexDirection: 'column', marginTop: 15 }}>
            <b style={{ margin: 0, fontSize: 15 }} htmlFor="bantuan">bantuan lanjut hubungi</b>
            <Grid style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ marginRight: 10, fontSize: 18 }}>+62</p>
              <TextField
                id="bantuan"
                value={this.state.help}
                onChange={this.handleChange('help')}
                margin="normal"
                variant="outlined"
                disabled={this.state.proses}
                style={{ marginTop: 10 }}
                inputProps={{
                  style: {
                    padding: '13px 10px'
                  }
                }}
                placeholder='contoh: 812345678'
              />
            </Grid>
          </Grid>

          <Grid id="form-for" style={{ display: 'flex', flexDirection: 'column', marginTop: 15 }}>
            <FormControl component="fieldset" style={{ width: '100%' }}>
              <b style={{ margin: 0, fontSize: 15 }} htmlFor="perusahaan">dapat dilihat oleh</b>
              <RadioGroup aria-label="undangan" name="undangan2" value={this.state.inviteOption} onChange={this.handleChangeRadio}>
                <FormControlLabel
                  value="all"
                  control={<Radio color="primary" />}
                  label="All" />
                <FormControlLabel
                  value="company"
                  control={<Radio color="primary" />}
                  label="Perusahaan" />
                <Grid style={{ marginLeft: 30 }}>
                  <ReactSelect
                    isMulti
                    value={this.state.company}
                    components={animatedComponents}
                    options={this.state.optionCompany}
                    onChange={value => this.handleChangeSelect('company', value)}
                    getOptionLabel={(option) => option.company_name}
                    getOptionValue={(option) => option.company_id}
                    isDisabled={this.state.inviteOption !== 'company'}
                  />
                </Grid>
                <FormControlLabel
                  value="department"
                  control={<Radio color="primary" />}
                  label="Divisi" />
                <Grid style={{ marginLeft: 30 }}>
                  <ReactSelect
                    isMulti
                    value={this.state.department}
                    components={animatedComponents}
                    options={this.props.dataDepartments}
                    onChange={value => this.handleChangeSelect('department', value)}
                    getOptionLabel={(option) => option.deptname}
                    getOptionValue={(option) => option.departments_id}
                    isDisabled={this.state.inviteOption !== 'department'}
                  />
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid style={{ marginTop: 20, marginBottom: 50, display: 'flex', justifyContent: 'flex-end' }} >
            <Button onClick={() => this.props.history.goBack()} style={{ marginRight: 20 }}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={this.submit}>
              Simpan
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = ({ userId, dataCompanies, dataDepartments, isAdminsuper }) => {
  return {
    userId,
    dataCompanies,
    dataDepartments,
    isAdminsuper
  }
}

const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataDepartment
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(addNotifikasi))