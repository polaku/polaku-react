import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import Cookies from 'js-cookie';

import {
  Grid, CircularProgress, Paper, Tabs, Tab, Divider, TextField, Button, TableCell, TablePagination
  // Checkbox
} from '@material-ui/core';

import orderBy from 'lodash/orderBy';

import CardDepartment from './cardDepartment';
// import SeCreatableSelect from 'react-select/creatable';
// import makeAnimated from 'react-select/animated';
import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';

import { fetchDataUsers, fetchDataStructure, fetchDataCompanies } from '../../store/action';

import ModalLogSetting from '../modal/modalLogSetting';

const invertDirection = {
  asc: "desc",
  desc: "asc"
}


class panelStructure extends Component {
  state = {
    labelTab: ['Semua'],
    search: '',
    // valueA: 0,
    valueB: 0,
    index: 0,
    selectAll: false,
    check: false,
    data: [],
    dataForDisplay: [],
    dataForEdit: [],

    openModalLogSetting: false,
    columnToSort: "",
    sortDirection: "desc",
    page: 0,
    rowsPerPage: 10,
    optionCompany: [],
  }

  async componentDidMount() {
    await this.props.fetchDataCompanies()
    await this.props.fetchDataStructure({ limit: this.state.rowsPerPage, page: this.state.page })
    await this.fetchData()

    if (this.props.dataCompanies && this.props.dinas) {
      this.fetchOptionCompany()
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search && this.state.search === "") {
      this.setState({ dataForDisplay: this.state.data })
    }

    if (this.state.value !== prevState.value) {
      if (this.state.value === 0) {
        this.setState({ dataForDisplay: this.state.data })
      } else {
        let data = await this.state.data.filter(el => el.tbl_company.acronym === this.state.label[this.state.value])

        this.setState({ dataForDisplay: data })
      }
    }

    if (this.props.dataCompanies !== prevProps.dataCompanies || this.props.dinas !== prevProps.dinas) {
      this.fetchOptionCompany()
    }
  }

  fetchData = () => {
    let label = this.state.labelTab

    this.props.dataStructure.forEach(element => {
      if (label.indexOf(element.tbl_company.acronym) < 0) {
        label.push(element.tbl_company.acronym)
      }
    });

    this.setState({ data: this.props.dataStructure, dataForDisplay: this.props.dataStructure, label, page: 0, valueB: 0 })
  }

  fetchOptionCompany = () => {
    let optionCompany = [{ acronym: 'Semua' }]
    this.props.dinas.forEach(el => {
      let check = this.props.dataCompanies.find(element => el.company_id === element.company_id)
      if (check) optionCompany.push(check)
    })
    this.setState({ optionCompany })
  }

  // handleChangeTabA = (event, newValue) => {
  //   this.setState({ valueA: newValue })
  // };

  handleChangeTabB = async (event, newValue) => {
    this.setState({ valueB: newValue, search: '', page: 0 })

    let companySelected = this.state.optionCompany[newValue]
    if (newValue === 0) {
      await this.props.fetchDataStructure({ limit: this.state.rowsPerPage, page: 0 })
      await this.fetchData()
    } else {
      console.log("MASUK")
      await this.props.fetchDataStructure({ limit: this.state.rowsPerPage, page: 0, company: companySelected.company_id })
      await this.fetchData()
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, openPopOver: false })
  };

  handleChangeCheck = event => {
    this.setState({
      selectAll: event.target.checked,
      check: event.target.checked
    })
  }

  handleSearch = async () => {
    this.setState({ page: 0 })
    if (this.state.valueB !== 0) {
      let companySelected = this.state.optionCompany[this.state.valueB]
      await this.props.fetchDataStructure({ limit: this.state.rowsPerPage, page: 0, company: companySelected.company_id, keyword: this.state.search })
      await this.fetchData()
    } else {
      await this.props.fetchDataStructure({ limit: this.state.rowsPerPage, page: 0, keyword: this.state.search })
      await this.fetchData()
    }
  }

  handleModalLogSetting = () => {
    this.setState({
      openModalLogSetting: !this.state.openModalLogSetting
    })
  }

  handleSort = columnName => {
    this.setState(state => ({
      columnToSort: columnName,
      sortDirection: state.columnToSort === columnName
        ? invertDirection[state.sortDirection]
        : 'asc'
    }))
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
    await this.props.fetchDataStructure({ limit: this.state.rowsPerPage, page: newPage, ...query })
    await this.fetchData()
    this.setState({ proses: false })
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
    await this.props.fetchDataStructure({ limit: this.state.rowsPerPage + event.target.value, page: 0, ...query })

    await this.fetchData()
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
            : <Grid>
              {/* <Paper square style={{ padding: 10, paddingLeft: 20 }}>
                <Tabs
                  value={this.state.valueA}
                  indicatorColor="secondary"
                  textColor="secondary"
                  onChange={this.handleChangeTabA}
                >
                  <Tab label="Struktur organisasi" style={{ marginRight: 30 }} />
                  <Tab label="Peran" style={{ marginRight: 30 }} />
                </Tabs>
                <Divider />
              </Paper> */}


              <Grid style={{ display: 'flex', margin: '20px 15px' }}>
                {/* <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={process.env.PUBLIC_URL + '/edit-address.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Ubah banyak</p>
                </Grid> */}
                {/* <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={process.env.PUBLIC_URL + '/add-address.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Tambah banyak</p>
                </Grid> */}
                <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-department', { index: this.props.index })}>
                  <img src={process.env.PUBLIC_URL + '/add-address.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Tambah divisi</p>
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
                <Divider />
                <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  {/* <form style={{ width: '100%', marginRight: 15, marginTop: 3 }}> */}
                  <TextField
                    id="pencarian"
                    placeholder="Cari berdasarkan nama divisi"
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
                <TableCell style={{ padding: 13, width: '30%', border: 'none', textAlign: 'center', cursor: 'pointer' }} onClick={() => this.handleSort('department.deptname')}>

                  {/* <Checkbox display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'center'
                    checked={this.state.check}
                    onChange={this.handleChangeCheck}
                    value="secondary"
                    color="secondary"
                    size="small"
                  /><p style={{ margin: 0 }}>pilih untuk lakukan aksi</p> */}
                  Divisi
                  {
                    this.state.columnToSort === 'department.deptname' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                  }
                </TableCell>
                <TableCell style={{ padding: 13, width: '10%', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'center' }} align="center" onClick={() => this.handleSort('hierarchy')}>
                  Level
                  {
                    this.state.columnToSort === 'hierarchy' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                  }
                </TableCell>
                <TableCell style={{ padding: 13, width: '15%', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'center' }} align="center" onClick={() => this.handleSort('section.deptname')}>
                  Lapor ke
                  {
                    this.state.columnToSort === 'section.deptname' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                  }
                </TableCell>
                <TableCell style={{ padding: 13, width: '10%', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'center' }} align="center" onClick={() => this.handleSort('tbl_department_positions.length')}>
                  Peran
                  {
                    this.state.columnToSort === 'tbl_department_positions.length' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                  }
                </TableCell>
                <TableCell style={{ padding: 13, width: '10%', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'center' }} align="center" onClick={() => this.handleSort('tbl_department_teams.length')}>
                  Tim
                  {
                    this.state.columnToSort === 'tbl_department_teams.length' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                  }
                </TableCell>
                <TableCell style={{ padding: 13, width: '25%', textAlign: 'center', border: 'none' }} align="center">
                  <p style={{ margin: 0 }}>Aksi</p>
                </TableCell>

              </Paper>
              {
                orderBy(this.state.dataForDisplay, this.state.columnToSort, this.state.sortDirection).map((department, index) =>
                  <CardDepartment key={"department" + index} data={department} selectAll={this.state.selectAll} handleCheck={this.handleCheck} fetchData={this.fetchData} index={this.props.index} />
                )
              }
              <TablePagination
                rowsPerPageOptions={1}
                component="div"
                count={this.props.totalDataStructure}
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
          this.state.openModalLogSetting && <ModalLogSetting status={this.state.openModalLogSetting} close={this.handleModalLogSetting} type="structure" />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataStructure,
  fetchDataCompanies
}

const mapStateToProps = ({ loading, dataUsers, dataStructure, totalDataStructure, dataCompanies, dinas }) => {
  return {
    loading,
    dataUsers,
    dataStructure,
    totalDataStructure,
    dataCompanies,
    dinas
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(panelStructure))