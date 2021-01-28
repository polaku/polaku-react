import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Breadcrumbs, Link, FormControl, TextField, Button, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { fetchDataCompanies, fetchDataDepartment } from '../../store/action';
import { API } from '../../config/API';

const animatedComponents = makeAnimated();

class PanelDetailQuestion extends Component {
  state = {
    subTopik: null,
    question: null,
    editorState: EditorState.createEmpty(),
    help: null,
    inviteOption: null,
    company: null,
    department: null,
    semua: false,
  }

  async componentDidMount() {
    await this.props.fetchDataCompanies()
    await this.props.fetchDataDepartment()
    await this.fetchOptionUser()
    console.log(this.props.dataDepartments)

  }

  fetchOptionUser = async () => {
    try {
      let token = Cookies.get('POLAGROUP')

      let getData = await API.get(`/users/for-option`, { headers: { token } })

      let listUser = []
      await getData.data.data.forEach(user => {
        listUser.push({ value: user.user_id, label: user.tbl_account_detail.fullname, nik: user.tbl_account_detail.nik })
      })

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
      editorState,
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

  render() {
    return (
      <Grid item style={{ width: '70%', minWidth: 550 }}>
        <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 15, marginBottom: 20 }}>
          <Link style={{ color: '#d71149' }} href="/helpdesk" >Helpdesk</Link>
          <Link style={{ color: '#d71149' }} href="/getting-started/installation/" >Topik</Link>
          <Link style={{ color: '#d71149' }} href="/getting-started/installation/" >Sub-topik</Link>
        </Breadcrumbs>

        <Grid style={{ display: 'flex', flexDirection: 'column' }}>
          <Grid id="form-sub-topik" style={{ display: 'flex', flexDirection: 'column' }}>
            <b style={{ margin: 0, fontSize: 15 }} htmlFor="sub-topik">sub-topik</b>
            <TextField
              id="sub-topik"
              value={this.state.subTopik}
              onChange={this.handleChange('subTopik')}
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
            <b style={{ margin: 0, fontSize: 15 }} htmlFor="jawaban">jawaban</b >
            <Editor
              id="jawaban"
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

          <Grid id="form-perusahaan" style={{ display: 'flex', flexDirection: 'column', marginTop: 15 }}>
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

          <Grid style={{ marginTop: 20, marginBottom: 50, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="secondary">
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

export default connect(mapStateToProps, mapDispatchToProps)(PanelDetailQuestion)