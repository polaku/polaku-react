import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  Grid, CircularProgress, Paper, Tabs, Tab, Divider, TextField, Button, TablePagination
} from '@material-ui/core';

import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';

import { fetchDataCompanies, fetchDataDinas, fetchDataUsers } from '../../store/action';

const ModalCreateEditMuchEmployee = lazy(() => import('../modal/modalCreateEditMuchEmployee'));
const ModalLogSetting = lazy(() => import('../modal/modalLogSetting'));
const CardService = lazy(() => import('./cardService'));
const CardEmployee = lazy(() => import('./cardEmployee'));

const invertDirection = {
  asc: "desc",
  desc: "asc"
}

class panelEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelTab: ['Semua'],
      search: '',
      searchDinas: '',
      valueA: this.props.indexTab ? this.props.indexTab : 0,
      valueB: 0,
      valueStatus: 0,
      index: 0,
      selectAll: false,
      check: false,
      data: [],
      dataForDisplay: [],
      dataDinas: [],
      dataForEdit: [],
      listCompany: [],

      openModalCreateEditMuchEmployee: false,
      isCreate: false,
      page: 0,
      rowsPerPage: 10,
      proses: true,
      optionCompany: [],

      openModalLogSetting: false,
      type: '',

      columnToSort: "",
      sortDirection: "desc",
    }
  }

  async componentDidMount() {
    this.setState({ proses: true })
    if (this.state.valueA === 0) {
      await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: this.state.page })
    } else {
      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage, page: this.state.page })
    }

    await this.props.fetchDataCompanies()

    if (this.props.dataCompanies && this.props.admin) {
      this.fetchOptionCompany()
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search && this.state.search === "") {
      this.setState({ dataForDisplay: this.state.data })
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

    if (this.props.dataCompanies !== prevProps.dataCompanies || this.props.admin !== prevProps.admin) {
      this.fetchOptionCompany()
    }
  }

  fetchData = async () => {
    let label = this.state.labelTab, tempNewDataUsers = []

    if (this.state.valueA === 0) { //EMPLOYEE
      await this.props.dataUsers.forEach(user => {
        let objUser = {
          userId: user.user_id,
          company: user.tbl_account_detail.tbl_company !== null ? user.tbl_account_detail.tbl_company.company_name : "",
          companyId: user.tbl_account_detail.tbl_company !== null ? user.tbl_account_detail.tbl_company.company_id : "",
          name: user.tbl_account_detail ? user.tbl_account_detail.fullname : "",
          evaluator1: user.tbl_account_detail.idEvaluator1 ? user.tbl_account_detail.idEvaluator1.tbl_account_detail.initial : "-",
          evaluator2: user.tbl_account_detail.idEvaluator2 ? user.tbl_account_detail.idEvaluator2.tbl_account_detail.initial : "-",
          isActive: user.activated,
          position: user.tbl_department_positions,
          rawData: user,
          status: user.tbl_account_detail.status_employee,
          updatedStatus: user.tbl_status_employee_dates.length > 0 ? user.tbl_status_employee_dates[user.tbl_status_employee_dates.length - 1].start_date : null
        }
        tempNewDataUsers.push(objUser)
      });

      this.setState({ data: tempNewDataUsers, dataForDisplay: tempNewDataUsers, label })
    } else {
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

  fetchOptionCompany = async () => {
    if (this.props.isAdminsuper) {
      this.setState({ optionCompany: [{ acronym: 'Semua' }, ...this.props.dataCompanies] })
    } else {
      let optionCompany = []

      let idCompany = []
      await this.props.admin.forEach(el => {
        if (idCompany.indexOf(el.company_id) === -1) {
          let check = this.props.dataCompanies.find(element => el.company_id === element.company_id)
          if (check) {
            idCompany.push(el.company_id)
            optionCompany.push(check)
          }
        }
      })

      if (idCompany.length > 1) {
        optionCompany.unshift({ acronym: 'Semua' })
      }

      this.setState({ optionCompany })
    }
  }

  handleChangeTabA = (event, newValue) => {
    this.setState({ valueA: newValue })
  };

  handleChangeTabB = async (event, newValue) => {
    let selected = newValue

    await this.setState({ valueB: selected, proses: true, search: '', searchDinas: '', page: 0 })

    if (this.state.valueA === 0) { //Karyawan
      if (selected === 0) {
        await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: 0 })
      } else {
        let companySelectedId = this.state.optionCompany[selected]
        await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: 0, company: companySelectedId.company_id })
      }
    } else { //Dinas
      let status
      if (selected === 1) status = 'Tetap'
      else if (selected === 2) status = 'Kontrak'
      else if (selected === 3) status = 'Probation'
      else if (selected === 4) status = 'Berhenti'
      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage, page: 0, status })
    }
    this.setState({ proses: false })
  };

  handleChangeTabStatus = async (event, newValue) => {
    let selected = newValue

    await this.setState({ valueStatus: selected, proses: true, search: '', searchDinas: '', page: 0 })

    let query = {
      limit: this.state.rowsPerPage,
      page: 0
    }

    if (selected === 1) {
      query.status = 'Berhenti'
    }

    if (this.state.valueA !== 0) {
      let companySelectedId = this.state.optionCompany[this.state.valueA]
      query.company = companySelectedId.company_id
    }

    await this.props.fetchDataUsers(query)

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
    let query = { keyword: this.state.search }
    this.setState({ page: 0, proses: true })
    if (this.state.valueB !== 0) {
      let companySelected = this.state.optionCompany[this.state.valueB]
      if (companySelected) query.company = companySelected.company_id
    }
    await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: 0, ...query })
  }

  handleSearchDinas = async () => {
    let query = { keyword: this.state.keywordDinas }
    this.setState({ page: 0, proses: true })
    if (this.state.valueB !== 0) {
      if (this.state.valueB === 1) query.status = 'tetap'
      else if (this.state.valueB === 2) query.status = 'kontrak'
      else if (this.state.valueB === 3) query.status = 'probation'
      else if (this.state.valueB === 4) query.status = 'berhenti'
    }
    await this.props.fetchDataDinas({ limit: this.state.rowsPerPage, page: 0, ...query })
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

  handleModalLogSetting = (args) => {
    this.setState({
      openModalLogSetting: !this.state.openModalLogSetting,
      type: this.state.valueA === 0 ? 'users' : 'dinas'
    })
  }

  refresh = async () => {
    this.setState({ proses: true, rowsPerPage: 10, page: 0, search: '' })
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
    let query = {}
    if (this.state.search) query.keyword = this.state.search
    if (this.state.valueB !== 0) {
      let companySelected = this.state.optionCompany[this.state.valueB]
      if (companySelected) query.company = companySelected.company_id
    }

    if (this.state.valueA === 0) {
      await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: newPage, ...query }) //limit:,skip:,company: 
    } else {
      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage, page: newPage, ...query })
    }
  }

  handleChangeRowsPerPage = async (event) => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
    })
    this.setState({ proses: true })
    let query = {}
    if (this.state.search) query.keyword = this.state.search
    if (this.state.valueB !== 0) {
      let companySelected = this.state.optionCompany[this.state.valueB]
      if (companySelected) query.company = companySelected.company_id
    }
    if (this.state.valueA === 0) {
      await this.props.fetchDataUsers({ limit: this.state.rowsPerPage + event.target.value, page: 0, ...query }) //limit:,skip:,company: 
    } else {
      await this.props.fetchDataDinas({ limit: this.state.rowsPerPage + event.target.value, page: 0, ...query })
    }
  }

  handleSort = async (columnName) => {
    await this.setState(state => ({
      columnToSort: columnName,
      sortDirection: state.columnToSort === columnName
        ? invertDirection[state.sortDirection]
        : 'asc'
    }))
    this.sorting()
  }

  sorting = async () => {
    let query = {}

    if (this.state.search) {
      query = { keyword: this.state.search }
    }

    if (this.state.valueB !== 0) {
      let companySelected = this.state.optionCompany[this.state.valueB]
      if (companySelected) query.company = companySelected.company_id
    }

    await this.props.fetchDataUsers({ limit: this.state.rowsPerPage, page: this.state.page, ...query, order: this.state.columnToSort, sort: this.state.sortDirection })
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
                        <img src={require('../../Assets/edit-employee.png').default} loading="lazy" alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Ubah banyak</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.handleModalCreateEditMuchEmployee('create')}>
                        <img src={require('../../Assets/add-much-employee.png').default} loading="lazy" alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah banyak</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-employee', { index: this.props.index })}>
                        <img src={require('../../Assets/add-employee.png').default} loading="lazy" alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah karyawan</p>
                      </Grid>
                      <p style={{ color: '#d71149', margin: 0, cursor: 'pointer' }} onClick={this.handleModalLogSetting}>Lihat riwayat perubahan</p>
                    </Grid>

                    <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                      <Tabs
                        value={this.state.valueB}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={this.handleChangeTabB}
                      >
                        {
                          this.state.optionCompany.map((el, index) =>
                            <Tab key={index} label={el.acronym} style={{ marginRight: 10, minWidth: 80 }} />
                          )
                        }
                      </Tabs>
                      <Tabs
                        value={this.state.valueStatus}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={this.handleChangeTabStatus}
                      >
                        <Tab label={`Aktif`} style={{ marginRight: 10, minWidth: 80 }} />
                        <Tab label={`Berhenti`} style={{ marginRight: 10, minWidth: 80 }} />
                      </Tabs>
                      <Divider />
                      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
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
                        <Button onClick={this.handleSearch} variant="contained" style={{ width: 150 }}>
                          Cari
                        </Button>
                      </Grid>
                    </Paper>

                    <Paper id="header" style={{ display: 'flex', padding: '15px 20px', margin: 3, borderRadius: 0, alignItems: 'center' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '25%', cursor: 'pointer' }} onClick={() => this.handleSort('name')}>
                        <p style={{ margin: 0 }}>Karyawan</p>
                        {
                          this.state.columnToSort === 'name' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '20%' }} >
                        <p style={{ margin: 0 }}>Department</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '15%' }} onClick={() => this.handleSort('name')}>
                        <p style={{ margin: 0 }}>Evaluator 1</p>
                        {
                          this.state.columnToSort === 'name' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '15%' }} onClick={() => this.handleSort('name')}>
                        <p style={{ margin: 0 }}>Evaluator 2</p>
                        {
                          this.state.columnToSort === 'name' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '10%', cursor: 'pointer' }} onClick={() => this.handleSort('status_employee')}>
                        <p style={{ margin: 0 }}>Status</p>
                        {
                          this.state.columnToSort === 'status_employee' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '5%', cursor: 'pointer' }} onClick={() => this.handleSort('status')}>
                        <p style={{ margin: 0 }}>Aktif</p>
                        {
                          this.state.columnToSort === 'status' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                      {
                        this.props.isAdminHR && <p style={{ margin: 0, width: '10%', textAlign: 'center' }}>Aksi</p>
                      }
                    </Paper>

                  </>
                  // Dinas
                  : <>
                    <Grid style={{ display: 'flex', margin: '20px 15px' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-service', { index: this.props.index })}>
                        <img src={require('../../Assets/add-employee.png').default} loading="lazy" alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah karyawan dinas</p>
                      </Grid>
                      <p style={{ color: '#d71149', margin: 0, cursor: 'pointer' }} onClick={this.handleModalLogSetting}>Lihat riwayat perubahan</p>
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
                        <Button onClick={this.handleSearchDinas} variant="contained" style={{ width: 150 }}>
                          Cari
                        </Button>
                      </Grid>
                    </Paper>

                    <Paper id="header" style={{ display: 'flex', padding: '15px 20px', margin: 3, borderRadius: 0, alignItems: 'center' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                        <p style={{ margin: 0 }}>Karyawan</p>
                      </Grid>
                      <p style={{ margin: 0, width: '25%' }}>Dinas ke perusahaan</p>
                      {
                        this.props.isAdminHR && <p style={{ margin: 0, textAlign: 'center' }}>Aksi</p>
                      }
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
                      <CardEmployee key={index} data={data} selectAll={this.state.selectAll} handleCheck={this.handleCheck} refresh={this.refresh} index={this.props.index} />)
                    : this.state.dataForDisplay.map((data, index) => <CardService key={index} data={data} selectAll={this.state.selectAll} handleCheck={this.handleCheck} refresh={this.refresh} rowsPerPage={this.state.rowsPerPage} page={this.state.page} index={this.props.index} />)
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
          this.state.openModalCreateEditMuchEmployee && <ModalCreateEditMuchEmployee status={this.state.openModalCreateEditMuchEmployee} close={this.handleModalCreateEditMuchEmployee} isCreate={this.state.isCreate} refresh={this.refresh} data={this.state.dataForDisplay} keyword={this.state.search} optionCompany={this.state.optionCompany} indexCompany={this.state.valueB} />
        }
        {
          this.state.openModalLogSetting && <ModalLogSetting status={this.state.openModalLogSetting} close={this.handleModalLogSetting} type={this.state.type} />
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

const mapStateToProps = ({ loading, dataUsers, lengthAllDataUsers, dataCompanies, dataDinas, counterEmployeeTetap, counterEmployeeKontrak, counterEmployeeProbation, counterEmployeeBerhenti, allUser, isAdminsuper, admin, isAdminHR }) => {
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
    counterAllUser: allUser,
    isAdminsuper,
    admin,
    isAdminHR
    // dinas,
    // PIC
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(panelEmployee))