import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Grid, Breadcrumbs, Link, FormControl, TextField, Button, FormControlLabel, RadioGroup, Radio, Typography } from '@material-ui/core';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import swal from 'sweetalert';

import { fetchDataCompanies, fetchDataDepartment } from '../../store/action';
import { API } from '../../config/API';

const animatedComponents = makeAnimated();

class PanelFormQuestion extends Component {
  state = {
    subTopik: null,
    question: null,
    editorState: EditorState.createEmpty(),
    help: null,
    inviteOption: null,
    company: null,
    department: null,
    employee: null,
    listUser: []
  }

  async componentDidMount() {
    await this.props.fetchDataCompanies()
    await this.props.fetchDataDepartment()
    await this.fetchOptionUser()

    if (this.props.questionSelectedForEdit) {
      console.log(this.props.questionSelectedForEdit)
      let company = [], department = [], employee = []

      if (this.props.questionSelectedForEdit.tbl_question_fors[0].option === 'company') {
        await this.props.questionSelectedForEdit.tbl_question_fors.forEach(el => {
          let companySelected = this.props.dataCompanies.find(element => el.company_id === element.company_id)

          if (companySelected) company.push(companySelected)
        })
        console.log(company)
      } else if (this.props.questionSelectedForEdit.tbl_question_fors[0].option === 'department') {
        await this.props.questionSelectedForEdit.tbl_question_fors.forEach(el => {
          let departmentSelected = this.props.dataDepartments.find(element => el.departments_id === element.departments_id)

          if (departmentSelected) department.push(departmentSelected)
        })
      } else if (this.props.questionSelectedForEdit.tbl_question_fors[0].option === 'employee') {
        console.log(this.state.listUser)
        await this.props.questionSelectedForEdit.tbl_question_fors.forEach(el => {
          let employeeSelected = this.state.listUser.find(user => el.user_id === user.value)

          if (employeeSelected) employee.push(employeeSelected)
        })
      }

      this.setState({
        subTopik: this.props.optionListSubTopics.find(subTopics => subTopics.value === this.props.questionSelectedForEdit.sub_topics_id),
        question: this.props.questionSelectedForEdit.question,
        editorState: EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(this.props.questionSelectedForEdit.answer)
          )),
        help: this.props.questionSelectedForEdit.help,
        inviteOption: this.props.questionSelectedForEdit.tbl_question_fors[0].option,
        company,
        department,
        employee
      })
    }
  }

  fetchOptionUser = async () => {
    try {
      let token = Cookies.get('POLAGROUP')

      let getData = await API.get(`/users/for-option`, { headers: { token } })

      let listUser = []
      await getData.data.data.forEach(user => {
        listUser.push({ value: user.user_id, label: user.tbl_account_detail.fullname, nik: user.tbl_account_detail.nik })
      })
      console.log(listUser)
      this.setState({ listUser })
    } catch (err) {
      // console.log(err)
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

  handleInputChange = (inputValue, actionMeta) => {
    if (inputValue) {
      this.setState({
        subTopik: inputValue
      })
    }
  };

  submit = async () => {
    try {
      let token = Cookies.get('POLAGROUP')
      let newData = {
        topicsId: this.props.topicsId,
        subTopik: this.state.subTopik.value,
        question: this.state.question,
        editorState: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
        help: this.state.help,
        inviteOption: this.state.inviteOption,
        company: this.state.company,
        department: this.state.department,
        employee: this.state.employee
      }
      if (this.props.questionSelectedForEdit) {
        await API.put(`helpdesk/question/${this.props.questionSelectedForEdit.id}`, newData, { headers: { token } })
        swal('Edit pertanyaan berhasil', '', 'success')
        this.props.refresh()
      } else {
        await API.post('helpdesk/question', newData, { headers: { token } })
        swal('Tambah pertanyaan berhasil', '', 'success')
        this.props.refresh()
      }
    } catch (err) {
      if (this.props.questionSelectedForEdit) swal('Edit pertanyaan berhasil', '', 'success')
      else swal('Tambah pertanyaan gagal', '', 'error')

      console.log(err)
    }
  }

  render() {
    return (
      <Grid item style={{ width: '70%', minWidth: 550 }}>
        <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 15, marginBottom: 20 }}>
          <Link style={{ color: '#d71149', cursor: 'pointer' }} onClick={() => this.props.history.goBack()} >Helpdesk</Link>
          <Typography color="textPrimary" style={{ fontSize: 15 }}>
            {this.props.topics}
          </Typography>
        </Breadcrumbs>

        <Grid style={{ display: 'flex', flexDirection: 'column' }}>
          <Grid id="form-sub-topik" style={{ display: 'flex', flexDirection: 'column' }}>
            <b style={{ margin: 0, fontSize: 15 }} htmlFor="sub-topik">sub-topik</b>
            <Grid style={{ marginTop: 10 }}>
              <CreatableSelect
                value={this.state.subTopik}
                components={animatedComponents}
                options={this.props.optionListSubTopics}
                onChange={value => this.handleChangeSelect('subTopik', value)}
                onInputChange={this.handleInputChange}
                placeholder="pilih atau buat baru"
                isDisabled={this.props.questionSelectedForEdit}
              />
            </Grid>
          </Grid>

          <Grid id="form-pertanyaan" style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
            <b style={{ margin: 0, fontSize: 15 }} htmlFor="pertanyaan">pertanyaan</b>
            <TextField
              id="pertanyaan"
              value={this.state.question}
              onChange={this.handleChange('question')}
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
            <b style={{ margin: 0, fontSize: 15 }}>jawaban</b >
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
            />
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
                    options={this.props.dataCompanies}
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
                <FormControlLabel
                  value="employee"
                  control={<Radio color="primary" />}
                  label="Karyawan" />
                <Grid style={{ marginLeft: 30 }}>
                  <ReactSelect
                    isMulti
                    value={this.state.employee}
                    components={animatedComponents}
                    options={this.state.listUser}
                    onChange={value => this.handleChangeSelect('employee', value)}
                    getOptionLabel={(option) => `${option.nik} - ${option.label}`}
                    isDisabled={this.state.inviteOption !== 'employee'}
                  />
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid style={{ marginTop: 20, marginBottom: 50, display: 'flex', justifyContent: 'flex-end' }} >
            <Button onClick={this.props.cancel} style={{ marginRight: 20 }}>
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

const mapStateToProps = ({ dataCompanies, dataDepartments }) => {
  return {
    dataCompanies,
    dataDepartments
  }
}

const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataDepartment
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PanelFormQuestion))