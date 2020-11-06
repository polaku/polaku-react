import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import Cookies from 'js-cookie';

import {
  Grid, CircularProgress, Paper, Tabs, Tab, Divider, TextField, Button, TablePagination
  // Checkbox
} from '@material-ui/core';

import CardService from './cardService';
import CardEmployee from './cardEmployee';
// import SeCreatableSelect from 'react-select/creatable';
// import makeAnimated from 'react-select/animated';

import { fetchDataUsers, fetchDataCompanies, fetchDataDinas } from '../../store/action';

import ModalCreateEditMuchEmployee from '../modal/modalCreateEditMuchEmployee';

class panelEmployee extends Component {
  state = {
    labelTab: ['Semua'],
    search: '',
    valueA: 0,
    valueB: 0,
    index: 0,
    selectAll: false,
    check: false,
    data: [],
    dataForDisplay: [],
    dataDinas: [],
    dataForDisplayDinas: [],
    dataForEdit: [],
    listCompany: [],

    openModalCreateEditMuchEmployee: false,
    isCreate: false,
    page: 0,
    rowsPerPage: 10,
    proses: true
  }

  async componentDidMount() {
    this.setState({ proses: true })
    if (this.state.valueA === 0) {
      await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: this.state.page })
    } else {
      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage, page: this.state.page })
    }

    await this.props.fetchDataCompanies()

    let newTab = [{ id: 0, label: 'Semua' }]
    await this.props.dataCompanies.forEach(company => {
      newTab.push({ id: company.company_id, label: company.acronym })
    })

    this.setState({ proses: false, labelTab: newTab })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search && this.state.search === "") {
      this.setState({ dataForDisplay: this.state.data })
    }

    if (this.state.value !== prevState.value) {
      if (this.state.value === 0) {
        this.setState({ dataForDisplay: this.state.data })
      } else {
        let data
        if (this.state.valueA === 0) {
          data = await this.state.data.filter(el => el.tbl_company.acronym === this.state.label[this.state.value])
        } else {
          console.log(this.state.value)
          // data = await this.state.data.filter(el => el.tbl_company.acronym === this.state.label[this.state.value])
        }
        this.setState({ dataForDisplay: data })
      }
    }

    if (this.state.valueA !== prevState.valueA) {
      if (this.state.valueA === 0) {
        await this.props.fetchDataUsers({ limit: 10, page: 0 }) //limit:,skip:,company:
      } else {
        await this.props.fetchDataDinas({ limit: 10, page: 0 })
      }
      this.setState({ valueB: 0, page: 0, rowsPerPage: 10 })
    }

    if (this.props.dataUsers !== prevProps.dataUsers || this.props.dataDinas !== prevProps.dataDinas) {
      await this.fetchData()
      this.setState({ proses: false })
    }
  }

  fetchData = async () => {
    let label = this.state.labelTab, tempNewDataUsers = []

    if (this.state.valueA === 0) { //EMPLOYEE
      await this.props.dataUsers.forEach(user => {
        let objUser = {
          userId: user.user_id,
          company: user.tbl_account_detail.tbl_company !== null ? user.tbl_account_detail.tbl_company.company_name : "",
          name: user.tbl_account_detail ? user.tbl_account_detail.fullname : "",
          evaluator1: user.tbl_account_detail.idEvaluator1 ? user.tbl_account_detail.idEvaluator1.tbl_account_detail.initial : "-",
          evaluator2: user.tbl_account_detail.idEvaluator2 ? user.tbl_account_detail.idEvaluator2.tbl_account_detail.initial : "-",
          isActive: user.activated,
          position: user.tbl_account_detail.tbl_position ? user.tbl_account_detail.tbl_position.position : '-',
          rawData: user
        }
        tempNewDataUsers.push(objUser)
      });

      this.setState({ data: tempNewDataUsers, dataForDisplay: tempNewDataUsers, label })
    } else {
      console.log(this.props.dataDinas)
      await this.props.dataDinas.forEach(user => {
        let objUser = {
          userId: user.user_id,
          nik: user.tbl_account_detail ? user.tbl_account_detail.nik : "",
          name: user.tbl_account_detail ? user.tbl_account_detail.fullname : "",
          totalDinas: user.dinas.length,
          dinas: user.dinas,
          rawData: user
        }
        tempNewDataUsers.push(objUser)
      });


      this.setState({ data: tempNewDataUsers, dataForDisplay: tempNewDataUsers, label })
    }
  }

  handleChangeTabA = (event, newValue) => {
    this.setState({ valueA: newValue })
  };

  handleChangeTabB = async (event, newValue) => {
    let selected = newValue
    console.log(selected)
    await this.setState({ valueB: selected, proses: true })

    if (this.state.valueA === 0) {

      let companySelectedId = this.state.labelTab[selected]
      await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: this.state.page, company: companySelectedId.id })
    } else {
      let status
      if (selected === 1) status = 'tetap'
      else if (selected === 2) status = 'kontrak'
      else if (selected === 3) status = 'probation'
      else if (selected === 4) status = 'berhenti'
      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage, page: this.state.page, status })
    }
    this.setState({ proses: false })
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeCheck = event => {
    this.setState({
      selectAll: event.target.checked,
      check: event.target.checked
    })
  }

  handleSearch = async () => {
    if (this.state.valueB !== 0) {
      let companySelectedId = this.state.labelTab[this.state.valueB]
      await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: this.state.page, company: companySelectedId.id, keyword: this.state.search })
    } else {
      await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: this.state.page, keyword: this.state.search })
    }
  }

  handleSearchDinas = async () => {
    if (this.state.valueB !== 0) {
      let status
      if (this.state.valueB === 1) status = 'tetap'
      else if (this.state.valueB === 2) status = 'kontrak'
      else if (this.state.valueB === 3) status = 'probation'
      else if (this.state.valueB === 4) status = 'berhenti'

      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage, page: this.state.page, status, keyword: this.state.keywordDinas })
    } else {
      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage, page: this.state.page, keyword: this.state.keywordDinas })
    }
  }

  handleModalCreateEditMuchEmployee = (args) => {
    if (!this.state.openModalCreateEditMuchEmployee) {
      let isCreate = args === "create" ? true : false;
      this.setState({
        openModalCreateEditMuchEmployee: !this.state.openModalCreateEditMuchEmployee,
        isCreate
      })
    } else {
      this.setState({
        openModalCreateEditMuchEmployee: !this.state.openModalCreateEditMuchEmployee
      })
    }

  }

  // handleCheck = async (addressId) => {
  //   let checkSelected = this.state.dataForEdit.find(el => el.id === addressId)
  //   if (checkSelected) {
  //     console.log("SUDAH ADA")
  //     let data = await this.state.dataForEdit.filter(el => el.id !== addressId)
  //     this.setState({ dataForEdit: data, check: false })
  //   } else {
  //     console.log("BELUM ADA")
  //     let selected = this.state.data.find(el => el.id === addressId)
  //     let data = this.state.dataForEdit
  //     data.push(selected)
  //     console.log(data)
  //     this.setState({ dataForEdit: data })
  //     if (data.length === this.state.dataForDisplay.length) {
  //       this.setState({ selectAll: true, check: true })
  //     }
  //   }
  // }

  refresh = async () => {
    this.setState({ proses: true, rowsPerPage: 10, page: 0 })
    if (this.state.valueA === 0) {
      await this.props.fetchDataUsers({ limit: 10, page: 0 })
    } else {
      await this.props.fetchDataDinas({ limit: 10, page: 0 })
    }
  }

  handleChangePage = async (event, newPage) => {
    this.setState({
      page: newPage
    })
    this.setState({ proses: true })
    if (this.state.valueA === 0) {
      await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: newPage }) //limit:,skip:,company: 
    } else {
      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage, page: newPage })
    }
  }

  handleChangeRowsPerPage = async (event) => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
    })
    this.setState({ proses: true })
    if (this.state.valueA === 0) {
      await this.props.fetchDataUsers({ limit: this.state.rowsPerPage + event.target.value, page: 0 }) //limit:,skip:,company: 
    } else {
      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage + event.target.value, page: 0 })
    }
  }

  render() {
    return (
      <div style={{ width: '100%', paddingTop: 0 }}>
        {
          this.state.loading
            ? <div style={{ textAlign: 'center' }}>
              <CircularProgress color="secondary" style={{ marginTop: 20 }} />
            </div>
            : <Grid>
              <Paper square style={{ padding: 10, paddingLeft: 20 }}>
                <Tabs
                  value={this.state.valueA}
                  indicatorColor="secondary"
                  textColor="secondary"
                  onChange={this.handleChangeTabA}
                >
                  <Tab label="Karyawan" style={{ marginRight: 30 }} />
                  <Tab label="Dinas" style={{ marginRight: 30 }} />
                </Tabs>
                <Divider />
              </Paper>

              {
                this.state.valueA === 0
                  // Karyawan
                  ? <>
                    <Grid style={{ display: 'flex', margin: '20px 15px' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.handleModalCreateEditMuchEmployee('edit')}>
                        <img src={process.env.PUBLIC_URL + '/edit-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Ubah banyak</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.handleModalCreateEditMuchEmployee('create')}>
                        <img src={process.env.PUBLIC_URL + '/add-much-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah banyak</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-employee')}>
                        <img src={process.env.PUBLIC_URL + '/add-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah karyawan</p>
                      </Grid>
                    </Grid>

                    <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                      <Tabs
                        value={this.state.valueB}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={this.handleChangeTabB}
                      >
                        {
                          this.state.labelTab.map((el, index) =>
                            <Tab key={index} label={el.label} style={{ marginRight: 10, minWidth: 80 }} />
                          )
                        }
                      </Tabs>
                      <Divider />
                      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        {/* <form style={{ width: '100%', marginRight: 15, marginTop: 3 }}> */}
                        <TextField
                          id="pencarian"
                          placeholder="Cari berdasarkan nama/nik"
                          variant="outlined"
                          value={this.state.search}
                          onChange={this.handleChange('search')}
                          disabled={this.state.proses}
                          style={{ width: '100%', marginRight: 15, marginTop: 3 }}
                          InputProps={{
                            style: {
                              height: 35
                            }
                          }}
                        />
                        {/* </form> */}
                        <Button onClick={this.handleSearch} variant="contained" style={{ width: 150 }}>
                          Cari
                        </Button>
                      </Grid>
                    </Paper>

                    <Paper id="header" style={{ display: 'flex', padding: '15px 20px', margin: 3, borderRadius: 0, alignItems: 'center' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '25%' }}>
                        {/* <Checkbox
                    checked={this.state.check}
                    onChange={this.handleChangeCheck}
                    value="secondary"
                    color="secondary"
                    size="small"
                  /><p style={{ margin: 0 }}>pilih untuk lakukan aksi</p> */}
                        <p style={{ margin: 0 }}>Karyawan</p>
                      </Grid>
                      <p style={{ margin: 0, width: '25%' }}>Divisi</p>
                      <p style={{ margin: 0, width: '15%' }}>Evaluator 1</p>
                      <p style={{ margin: 0, width: '15%' }}>Evaluator 2</p>
                      <p style={{ margin: 0, width: '10%' }}>Status</p>
                      <p style={{ margin: 0, width: '10%', textAlign: 'center' }}>Aksi</p>
                    </Paper>

                  </>
                  // Dinas
                  : <>
                    <Grid style={{ display: 'flex', margin: '20px 15px' }}>
                      {/* <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }}>
                        <img src={process.env.PUBLIC_URL + '/edit-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Ubah banyak</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }}>
                        <img src={process.env.PUBLIC_URL + '/add-much-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah banyak karyawan dinas</p>
                      </Grid> */}
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-service')}>
                        <img src={process.env.PUBLIC_URL + '/add-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah karyawan dinas</p>
                      </Grid>
                    </Grid>

                    <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                      <Tabs
                        value={this.state.valueB}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={this.handleChangeTabB}
                      >
                        <Tab label={`Semua (${this.props.counterAllUser})`} style={{ marginRight: 10, minWidth: 80 }} />
                        <Tab label={`Tetap (${this.props.counterEmployeeTetap})`} style={{ marginRight: 10, minWidth: 80 }} />
                        <Tab label={`Kontrak (${this.props.counterEmployeeKontrak})`} style={{ marginRight: 10, minWidth: 80 }} />
                        <Tab label={`Probation (${this.props.counterEmployeeProbation})`} style={{ marginRight: 10, minWidth: 80 }} />
                        <Tab label={`Berhenti (${this.props.counterEmployeeBerhenti})`} style={{ marginRight: 10, minWidth: 80 }} />
                      </Tabs>
                      <Divider />
                      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        {/* <form style={{ width: '100%', marginRight: 15, marginTop: 3 }}> */}
                        <TextField
                          id="pencarian"
                          placeholder="Cari berdasarkan nama/nik"
                          variant="outlined"
                          value={this.state.keywordDinas}
                          onChange={this.handleChange('keywordDinas')}
                          disabled={this.state.proses}
                          style={{ width: '100%', marginRight: 15, marginTop: 3 }}
                          InputProps={{
                            style: {
                              height: 35
                            }
                          }}
                        />
                        {/* </form> */}
                        <Button onClick={this.handleSearchDinas} variant="contained" style={{ width: 150 }}>
                          Cari
                        </Button>
                      </Grid>
                    </Paper>

                    <Paper id="header" style={{ display: 'flex', padding: '15px 20px', margin: 3, borderRadius: 0, alignItems: 'center' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                        {/* <Checkbox
                  checked={this.state.check}
                  onChange={this.handleChangeCheck}
                  value="secondary"
                  color="secondary"
                  size="small"
                /><p style={{ margin: 0 }}>pilih untuk lakukan aksi</p> */}
                        <p style={{ margin: 0 }}>Karyawan</p>
                      </Grid>
                      <p style={{ margin: 0, width: '25%' }}>Dinas ke perusahaan</p>
                      <p style={{ margin: 0, textAlign: 'center' }}>Aksi</p>
                    </Paper>
                  </>
              }

              {
                this.state.proses
                  ? <div style={{ textAlign: 'center' }}>
                    <CircularProgress color="secondary" style={{ marginTop: 20 }} />
                  </div>
                  : this.state.valueA === 0
                    ? this.state.dataForDisplay.map((data, index) =>
                      <CardEmployee key={index} data={data} selectAll={this.state.selectAll} handleCheck={this.handleCheck} refresh={this.refresh} />)
                    : this.state.dataForDisplay.map((data, index) => <CardService key={index} data={data} selectAll={this.state.selectAll} handleCheck={this.handleCheck} refresh={this.refresh} rowsPerPage={this.state.rowsPerPage} page={this.state.page} />)
              }

              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={this.props.lengthAllDataUsers}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'next page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />

            </Grid>
        }
        {
          this.state.openModalCreateEditMuchEmployee && <ModalCreateEditMuchEmployee status={this.state.openModalCreateEditMuchEmployee} close={this.handleModalCreateEditMuchEmployee} isCreate={this.state.isCreate} refresh={this.refresh} />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataCompanies,
  fetchDataDinas
}

const mapStateToProps = ({ loading, dataUsers, lengthAllDataUsers, dataCompanies, dataDinas, counterEmployeeTetap, counterEmployeeKontrak, counterEmployeeProbation, counterEmployeeBerhenti, allUser }) => {
  return {
    loading,
    dataUsers,
    lengthAllDataUsers,
    dataCompanies,
    dataDinas,
    counterEmployeeTetap,
    counterEmployeeKontrak,
    counterEmployeeProbation,
    counterEmployeeBerhenti,
    counterAllUser: allUser
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(panelEmployee))