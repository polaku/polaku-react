import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  Grid, CircularProgress, Paper, TextField, Button, TablePagination, Tabs, Tab, Divider
} from '@material-ui/core';

import { fetchDataCompanies, fetchDataDesignation } from '../../store/action';

const ModalCreateEditMuchEmployee = lazy(() => import('../modal/modalCreateEditMuchEmployee'));
const ModalLogSetting = lazy(() => import('../modal/modalLogSetting'));
const CardAdmin = lazy(() => import('./cardAdmin'));

class panelAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelTab: ['Semua'],
      search: '',
      value: 0,
      index: 0,
      selectAll: false,
      check: false,
      data: [],
      dataForDisplay: [],
      dataDinas: [],
      dataForDisplayDinas: [],
      dataForEdit: [],
      optionCompany: [],

      openModalCreateEditMuchEmployee: false,
      isCreate: false,
      company: '',
      page: 0,
      rowsPerPage: 10,
      proses: true,

      openModalLogSetting: false,
    }
  }

  async componentDidMount() {
    await this.props.fetchDataCompanies()
    await this.props.fetchDataDesignation({ limit: this.state.rowsPerPage, page: this.state.page })
    await this.fetchData()

    if (this.props.dataCompanies && this.props.admin) {
      this.fetchOptionCompany()
    }
    this.setState({ proses: false })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search && this.state.search === "") {
      this.setState({ dataForDisplay: this.state.data })
    }

    if (this.props.dataCompanies !== prevProps.dataCompanies || this.props.admin !== prevProps.admin) {
      if (this.state.optionCompany.length > 0) {
        this.fetchOptionCompany()
      }
    }
  }

  fetchData = async () => {
    let label = this.state.labelTab
    this.setState({ dataForDisplay: [] })
    this.setState({ data: this.props.dataDesignation, dataForDisplay: this.props.dataDesignation, label })
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
    this.setState({ proses: true, page: 0 })

    if (this.state.value !== 0) {
      await this.props.fetchDataDesignation({ limit: this.state.rowsPerPage, page: this.state.page, company: this.state.company, keyword: this.state.search })
    } else {
      await this.props.fetchDataDesignation({ limit: this.state.rowsPerPage, page: this.state.page, keyword: this.state.search })
    }
    this.setState({ proses: false })
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

  refresh = async () => {
    this.setState({ proses: true, rowsPerPage: 10, page: 0 })
    await this.props.fetchDataDesignation({ limit: 10, page: 0 })
    this.setState({ proses: false })
  }

  handleChangePage = async (event, newPage) => {
    this.setState({
      page: newPage
    })
    this.setState({ proses: true })
    await this.props.fetchDataDesignation({ limit: this.state.rowsPerPage, page: newPage })
    this.setState({ proses: false })
  }

  handleChangeRowsPerPage = async (event) => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
    })
    this.setState({ proses: true })

    await this.props.fetchDataDesignation({ limit: this.state.rowsPerPage + event.target.value, page: 0 }) //limit:,skip:
    this.setState({ proses: false })

  }

  handleModalLogSetting = (args) => {
    this.setState({
      openModalLogSetting: !this.state.openModalLogSetting
    })
  }

  handleChangeTab = async (event, newValue) => {
    this.setState({ company: newValue, search: '', page: 0 })

    if (newValue === 0) {
      await this.props.fetchDataDesignation({ limit: this.state.rowsPerPage, page: 0 })
      await this.fetchData()
    } else {
      await this.props.fetchDataDesignation({ limit: this.state.rowsPerPage, page: 0, company: this.state.optionCompany[newValue].company_id })
      await this.fetchData()
    }
  };

  render() {
    return (
      <div style={{ width: '100%', paddingTop: 0 }}>
        {
          this.state.loading
            ? <div style={{ textAlign: 'center' }}>
              <CircularProgress color="secondary" style={{ marginTop: 20 }} />
            </div>
            : <>
              <Grid style={{ display: 'flex', margin: '20px 15px' }}>
                <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-admin', { index: this.props.index })}>
                  <img src={require('../../Assets/add-employee.png').default} loading="lazy" alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Tambah admin</p>
                </Grid>
                <p style={{ color: '#d71149', margin: 0, cursor: 'pointer' }} onClick={this.handleModalLogSetting}>Lihat riwayat perubahan</p>
              </Grid>

              <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                <Tabs
                  value={this.state.company}
                  indicatorColor="secondary"
                  textColor="secondary"
                  onChange={this.handleChangeTab}
                >
                  {
                    this.state.optionCompany.map((el, index) =>
                      <Tab key={index} label={el.acronym} style={{ marginRight: 10, minWidth: 80 }} />
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
                <Grid style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                  <p style={{ margin: 0 }}>Karyawan</p>
                </Grid>
                <p style={{ margin: 0, width: '50%' }}>Akses</p>
                <p style={{ margin: 0, width: '20%', textAlign: 'center' }}>Aksi</p>
              </Paper>


              {
                this.state.proses
                  ? <div style={{ textAlign: 'center' }}>
                    <CircularProgress color="secondary" style={{ marginTop: 20 }} />
                  </div>
                  : this.state.dataForDisplay.map((designation, index) =>
                    <CardAdmin key={"admin" + index} selectAll={this.state.selectAll} handleCheck={this.handleCheck} refresh={this.refresh} data={designation} />
                  )
              }


              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={this.props.lengthAllDataDesignation}
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
            </>
        }
        {
          this.state.openModalCreateEditMuchEmployee && <ModalCreateEditMuchEmployee status={this.state.openModalCreateEditMuchEmployee} close={this.handleModalCreateEditMuchEmployee} isCreate={this.state.isCreate} refresh={this.refresh} />
        }
        {
          this.state.openModalLogSetting && <ModalLogSetting status={this.state.openModalLogSetting} close={this.handleModalLogSetting} type="designation" />
        }
      </div >
    )
  }
}

const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataDesignation
}

const mapStateToProps = ({ loading, dataCompanies, dataDinas, allUser, dataDesignation, lengthAllDataDesignation, admin, isAdminsuper }) => {
  return {
    loading,
    dataCompanies,
    dataDinas,
    counterAllUser: allUser,
    dataDesignation,
    lengthAllDataDesignation,
    admin,
    isAdminsuper
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(panelAdmin))