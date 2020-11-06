import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import Cookies from 'js-cookie';

import {
  Grid, CircularProgress, Paper, TextField, Button, TablePagination
  // Checkbox
} from '@material-ui/core';

import CardAdmin from './cardAdmin';
// import SeCreatableSelect from 'react-select/creatable';
// import makeAnimated from 'react-select/animated';

import { fetchDataCompanies, fetchDataDesignation } from '../../store/action';

import ModalCreateEditMuchEmployee from '../modal/modalCreateEditMuchEmployee';

class panelAdmin extends Component {
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
    // this.setState({ proses: true })
    await this.props.fetchDataDesignation({ limit: this.state.rowsPerPage, page: this.state.page })

    // await this.props.fetchDataCompanies()

    // let newTab = [{ id: 0, label: 'Semua' }]
    // await this.props.dataCompanies.forEach(company => {
    //   newTab.push({ id: company.company_id, label: company.acronym })
    // })

    // this.setState({ proses: false, labelTab: newTab })
    this.setState({ proses: false })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search && this.state.search === "") {
      this.setState({ dataForDisplay: this.state.data })
    }


    if (this.state.valueA !== prevState.valueA) {
      await this.props.fetchDataDesignation({ limit: 10, page: 0 })
      this.setState({ proses: false, valueB: 0, page: 0, rowsPerPage: 10 })

    }

  }

  fetchData = async () => {
    let label = this.state.labelTab, tempNewDataUsers = []

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
  }

  handleChangeTabA = (event, newValue) => {
    this.setState({ valueA: newValue })
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
    this.setState({ proses: true })

    if (this.state.valueB !== 0) {
      let companySelectedId = this.state.labelTab[this.state.valueB]
      await this.props.fetchDataDesignation({ limit: this.state.rowsPerPage, page: this.state.page, company: companySelectedId.id, keyword: this.state.search })
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
                {/* <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.handleModalCreateEditMuchEmployee('edit')}>
                  <img src={process.env.PUBLIC_URL + '/edit-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Ubah banyak</p>
                </Grid>
                <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.handleModalCreateEditMuchEmployee('create')}>
                  <img src={process.env.PUBLIC_URL + '/add-much-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Tambah banyak</p>
                </Grid> */}
                <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-admin')}>
                  <img src={process.env.PUBLIC_URL + '/add-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Tambah admin</p>
                </Grid>
              </Grid>

              <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
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
                  {/* <Checkbox
                    checked={this.state.check}
                    onChange={this.handleChangeCheck}
                    value="secondary"
                    color="secondary"
                    size="small"
                  /><p style={{ margin: 0 }}>pilih untuk lakukan aksi</p> */}
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
                  : this.props.dataDesignation.map(designation =>
                    <CardAdmin selectAll={this.state.selectAll} handleCheck={this.handleCheck} refresh={this.refresh} data={designation} />
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
      </div >
    )
  }
}

const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataDesignation
}

const mapStateToProps = ({ loading, dataCompanies, dataDinas, allUser, dataDesignation, lengthAllDataDesignation }) => {
  return {
    loading,
    dataCompanies,
    dataDinas,
    counterAllUser: allUser,
    dataDesignation,
    lengthAllDataDesignation
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(panelAdmin))