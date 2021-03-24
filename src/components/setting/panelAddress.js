import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  Grid, CircularProgress, Paper, Tabs, Tab, Divider, TextField, Button, TablePagination
} from '@material-ui/core';

import { fetchDataUsers, fetchDataAddress, fetchDataCompanies } from '../../store/action';

const ModalLogSetting = lazy(() => import('../modal/modalLogSetting'));
const CardAddress = lazy(() => import('./cardAddress'));

class panelAddress extends Component {
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
      dataForEdit: [],
      proses: true,
      openModalLogSetting: false,
      page: 0,
      rowsPerPage: 10,
      optionCompany: []
    }
  }

  async componentDidMount() {
    await this.props.fetchDataCompanies()
    await this.props.fetchDataAddress({ limit: this.state.rowsPerPage, page: this.state.page })
    await this.fetchData()

    if (this.props.dataCompanies && this.props.admin) {
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

    if (this.props.dataCompanies !== prevProps.dataCompanies || this.props.admin !== prevProps.admin) {
      this.fetchOptionCompany()
    }
  }

  fetchData = () => {
    this.setState({ proses: true })
    let label = this.state.labelTab

    this.props.dataAddress && this.props.dataAddress.forEach(element => {
      if (label.indexOf(element.tbl_company.acronym) < 0) {
        label.push(element.tbl_company.acronym)
      }
    });
    this.setState({ data: this.props.dataAddress, dataForDisplay: this.props.dataAddress, label, proses: false })
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

  handleChangeTab = async (event, newValue) => {
    this.setState({ value: newValue, search: '', page: 0 })

    let companySelected = this.state.optionCompany[newValue]
    if (newValue === 0) {
      await this.props.fetchDataAddress({ limit: this.state.rowsPerPage, page: 0 })
      await this.fetchData()
    } else {
      await this.props.fetchDataAddress({ limit: this.state.rowsPerPage, page: 0, company: companySelected.company_id })
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
    if (this.state.value !== 0) {
      let companySelected = this.state.optionCompany[this.state.value]
      await this.props.fetchDataAddress({ limit: this.state.rowsPerPage, page: 0, company: companySelected.company_id, keyword: this.state.search })
      await this.fetchData()
    } else {
      await this.props.fetchDataAddress({ limit: this.state.rowsPerPage, page: 0, keyword: this.state.search })
      await this.fetchData()
    }
  }

  handleModalLogSetting = () => {
    this.setState({
      openModalLogSetting: !this.state.openModalLogSetting
    })
  }

  handleChangePage = async (event, newPage) => {
    this.setState({
      page: newPage
    })
    this.setState({ proses: true })

    let query = {}
    if (this.state.search) query.keyword = this.state.search
    if (this.state.value !== 0) {
      let companySelected = this.state.optionCompany[this.state.value]
      if (companySelected) query.company = companySelected.company_id
    }
    await this.props.fetchDataAddress({ limit: this.state.rowsPerPage, page: newPage, ...query })
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
    if (this.state.value !== 0) {
      let companySelected = this.state.optionCompany[this.state.value]
      if (companySelected) query.company = companySelected.company_id
    }
    await this.props.fetchDataAddress({ limit: this.state.rowsPerPage + event.target.value, page: 0, ...query })
    await this.fetchData()
    this.setState({ proses: false })
  }

  refresh = async () => {
    this.setState({ proses: true })
    await this.props.fetchDataAddress({ limit: this.state.rowsPerPage, page: this.state.page })
    await this.fetchData()
  }

  render() {
    return (
      <div style={{ width: '100%', paddingTop: 0 }}>
        {
          this.state.proses
            ? <div style={{ textAlign: 'center' }}>
              <CircularProgress color="secondary" style={{ marginTop: 20 }} />
            </div>
            : <Grid>
              <Grid style={{ display: 'flex', margin: 10 }}>
                <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-address', { index: this.props.index })}>
                  <img src={require('../../Assets/add-address.png').default} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Tambah alamat</p>
                </Grid>
                <p style={{ color: '#d71149', margin: 0, cursor: 'pointer' }} onClick={this.handleModalLogSetting}>Lihat riwayat perubahan</p>
              </Grid>

              <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                <Tabs
                  value={this.state.value}
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
                    placeholder="cari berdasarkan nama jalan"
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
                <Grid style={{ display: 'flex', alignItems: 'center', width: '40%' }}>
                  <p style={{ margin: 0 }}>Alamat</p>
                </Grid>
                <p style={{ margin: 0, width: '20%' }}>Perusahaan</p>
                <p style={{ margin: 0, width: '20%' }}>Karyawan</p>
                <p style={{ margin: 0, width: '20%', textAlign: 'center' }}>Aksi</p>
              </Paper>

              {
                this.state.dataForDisplay.map((address, index) =>
                  <CardAddress key={index} data={address} selectAll={this.state.selectAll} handleCheck={this.handleCheck} refresh={this.refresh} index={this.props.index} />
                )
              }
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={this.props.totalDataAddress}
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
          this.state.openModalLogSetting && <ModalLogSetting status={this.state.openModalLogSetting} close={this.handleModalLogSetting} type="address" />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataAddress,
  fetchDataCompanies
}

const mapStateToProps = ({ loading, dataUsers, dataAddress, totalDataAddress, dataCompanies, isAdminsuper, admin }) => {
  return {
    loading,
    dataUsers,
    dataAddress,
    totalDataAddress,
    dataCompanies,
    isAdminsuper,
    admin
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(panelAddress))