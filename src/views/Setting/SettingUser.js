import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import PropTypes from 'prop-types';

import {
  Grid, Tabs, Tab, Divider, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TextField, MenuItem, Select, Button, FormControl
} from '@material-ui/core'

import SwipeableViews from 'react-swipeable-views';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArchiveIcon from '@material-ui/icons/Archive';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

import orderBy from 'lodash/orderBy';

import CardReport from '../../components/report/CardReport';
import Download from '../../components/exportToExcel';

import {
  fetchDataUsers, fetchDataCompanies, fetchDataPosition, fetchDataBuildings
} from '../../store/action'

import swal from 'sweetalert';
import { API } from '../../config/API';

const invertDirection = {
  asc: "desc",
  desc: "asc"
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

class SettingUser extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      value: 0,
      rowsPerPage: 10,
      page: 0,
      columnToSort: "",
      sortDirection: "desc",
      keyword: "",
      filterCategori: "",

      data: [],
      dataForDisplay: [],

      companyId: '',
      companyName: '',
      fullname: '',
      username: '',
      password: '',
      konfirmasiPassword: '',
      passwordNotExact: false,
      email: '',
      initial: '',
      dateBirth: new Date(1990, 0, 1),
      nik: '',
      address: '',
      phone: '',
      idEvaluator1: 0,
      idEvaluator2: 0,
      dataUser: [],
      dataUserForChoose: [],
      positionId: '',
      buildingId: '',

      companyIdNotValid: false,
      companyNameNotValid: false,
      fullnameNotValid: false,
      usernameNotValid: false,
      passwordNotValid: false,
      konfirmasiPasswordNotValid: false,
      emailNotValid: false,
      initialNotValid: false,
      nikNotValid: false,
      idEvaluator1NotValid: false,
      idEvaluator2NotValid: false,
      dataUserNotValid: false,
      dataUserForChooseNotValid: false,
      positionIdNotValid: false,
      buildingIdNotValid: false,

      labelValue: [
        {
          label: "nama",
          value: "name"
        }, {
          label: "company",
          value: "company"
        }, {
          label: "nik",
          value: "nik"
        }, {
          label: "evaluator1",
          value: "evaluator1"
        }, {
          label: "evaluator2",
          value: "evaluator2"
        }
      ],

      fileCuti: null,
      fileEvaluator: null,
      fileUser: null,
    }
  }

  async componentDidMount() {
    this._isMounted = true
    if (this._isMounted) {
      await this.fetchData()
      await this.props.fetchDataCompanies()
      await this.props.fetchDataPosition()
      await this.props.fetchDataBuildings()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.konfirmasiPassword !== this.state.konfirmasiPassword) {
      if (this.state.konfirmasiPassword !== this.state.password) {
        this.setState({
          passwordNotExact: true
        })
      } else {
        this.setState({
          passwordNotExact: false
        })
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  fetchData = async () => {
    await this.props.fetchDataUsers()

    let tempNewDataUsers = []
    await this.props.dataUsers.forEach(user => {
      let objUser = {
        userId: user.user_id,
        company: user.tbl_account_detail.tbl_company !== null ? user.tbl_account_detail.tbl_company.company_name : "",
        name: user.tbl_account_detail ? user.tbl_account_detail.fullname : "",
        username: user.username,
        initial: user.tbl_account_detail ? user.tbl_account_detail.initial : "",
        nik: user.tbl_account_detail ? user.tbl_account_detail.nik : "",
        evaluator1: user.tbl_account_detail.idEvaluator1 ? user.tbl_account_detail.idEvaluator1.tbl_account_detail.fullname : "-",
        evaluator2: user.tbl_account_detail.idEvaluator2 ? user.tbl_account_detail.idEvaluator2.tbl_account_detail.fullname : "-",
        isActive: user.activated === 1 ? true : false,
        rawData: user
      }
      tempNewDataUsers.push(objUser)
    });

    this._isMounted && this.setState({
      data: tempNewDataUsers,
      dataForDisplay: tempNewDataUsers,
      dataUser: this.props.dataUsers
    })
  }

  handleChangeTabs = (event, newTabs) => {
    this.setState({ value: newTabs })
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
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

  handleChange = name => async event => {
    if (name === 'companyId') {
      let company = this.props.dataCompanies.find(company => company.company_id === event.target.value)
      let filterUser = await this.props.dataUsers.filter(user => user.tbl_account_detail.company_id === event.target.value)

      this.setState({ [name]: event.target.value, companyName: company.company_name, dataUser: filterUser });
    } else if (name === 'konfirmasiPassword') {
      this.setState({ [name]: event.target.value });
    } else {
      this.setState({ [name]: event.target.value });
    }
  };

  addNewUser = () => {
    // this.state.konfirmasiPassword
    if (!this.state.passwordNotExact &&
      this.state.username !== "" &&
      this.state.password !== "" &&
      this.state.email !== "" &&
      this.state.fullname !== "" &&
      this.state.initial !== "" &&
      this.state.nik !== "" &&
      this.state.dateBirth !== "" &&
      this.state.buildingId !== "" &&
      this.state.companyId !== "" &&
      this.state.idEvaluator1 !== 0 &&
      this.state.positionId !== ""
    ) {
      let token = Cookies.get('POLAGROUP')

      var formData = new FormData();

      formData.append("username", this.state.username) //
      formData.append("password", this.state.password)
      formData.append("email", this.state.email) //
      formData.append("fullname", this.state.fullname) //
      formData.append("initial", this.state.initial) //
      formData.append("nik", this.state.nik) //
      formData.append("address", this.state.address) //
      formData.append("date_of_birth", this.state.dateBirth) //
      formData.append("building_id", this.state.buildingId) //
      formData.append("company_id", this.state.companyId) //
      formData.append("phone", this.state.phone) //
      formData.append("name_evaluator_1", this.state.idEvaluator1)
      formData.append("name_evaluator_2", this.state.idEvaluator2)
      formData.append("position_id", this.state.positionId)

      API.post('/users/signup', formData, { headers: { token } })
        .then(() => {
          this.fetchData()
          this.resetForm()
          swal("Tambah user sukses", "", "success")
        })
        .catch(err => {
          swal('Error', `${err}`)
        })
    } else {
      this.validateForm()
      swal("data belum lengkap")
    }
  }

  resetForm = () => {
    this.setState({
      username: "",
      password: "",
      konfirmasiPassword: "",
      email: "",
      fullname: "",
      initial: "",
      nik: "",
      dateBirth: new Date(1990, 0, 1),
      buildingId: "",
      companyId: "",
      idEvaluator1: 0,
      idEvaluator2: 0,
      positionId: "",
      address: "",
      phone: ""
    })
  }

  validateForm = () => {
    if (this.state.companyId === '') {
      this.setState({
        companyIdNotValid: true
      })
    } else {
      this.setState({
        companyIdNotValid: false
      })
    }
    if (this.state.companyName === '') {
      this.setState({
        companyNameNotValid: true
      })
    } else {
      this.setState({
        companyNameNotValid: false
      })
    }
    if (this.state.fullname === '') {
      this.setState({
        fullnameNotValid: true
      })
    } else {
      this.setState({
        fullnameNotValid: false
      })
    }
    if (this.state.username === '') {
      this.setState({
        usernameNotValid: true
      })
    } else {
      this.setState({
        usernameNotValid: false
      })
    }
    if (this.state.password === '') {
      this.setState({
        passwordNotValid: true
      })
    } else {
      this.setState({
        passwordNotValid: false
      })
    }
    if (this.state.konfirmasiPassword === '') {
      this.setState({
        konfirmasiPasswordNotValid: true
      })
    } else {
      this.setState({
        konfirmasiPasswordNotValid: false
      })
    }
    if (this.state.email === '') {
      this.setState({
        emailNotValid: true
      })
    } else {
      this.setState({
        emailNotValid: false
      })
    }
    if (this.state.initial === '') {
      this.setState({
        initialNotValid: true
      })
    } else {
      this.setState({
        initialNotValid: false
      })
    }
    if (this.state.nik === '') {
      this.setState({
        nikNotValid: true
      })
    } else {
      this.setState({
        nikNotValid: false
      })
    }
    if (this.state.idEvaluator1 === 0) {
      this.setState({
        idEvaluator1NotValid: true
      })
    } else {
      this.setState({
        idEvaluator1NotValid: false
      })
    }
    if (this.state.positionId === '') {
      this.setState({
        positionIdNotValid: true
      })
    } else {
      this.setState({
        positionIdNotValid: false
      })
    }
    if (this.state.buildingId === '') {
      this.setState({
        buildingIdNotValid: true
      })
    } else {
      this.setState({
        buildingIdNotValid: false
      })
    }
  }

  searching = async event => {
    event.preventDefault()
    let hasilSearch
    if (this.state.filterCategori === "") {
      hasilSearch = await this.state.data.filter(el =>
        (el.company && el.company.toLowerCase().match(new RegExp(this.state.keyword.toLowerCase()))) ||
        (el.name && el.name.toLowerCase().match(new RegExp(this.state.keyword.toLowerCase()))) ||
        (el.username && el.username.toLowerCase().match(new RegExp(this.state.keyword.toLowerCase()))) ||
        (el.initial && el.initial.toLowerCase().match(new RegExp(this.state.keyword.toLowerCase()))) ||
        (el.nik && el.nik.toLowerCase().match(new RegExp(this.state.keyword.toLowerCase()))) ||
        (el.evaluator1 && el.evaluator1.toLowerCase().match(new RegExp(this.state.keyword.toLowerCase()))) ||
        (el.evaluator2 && el.evaluator2.toLowerCase().match(new RegExp(this.state.keyword.toLowerCase())))
      )
    } else {
      hasilSearch = await this.state.data.filter(el => el[this.state.filterCategori].toLowerCase().match(new RegExp(this.state.keyword.toLowerCase())))
    }
    this.setState({ dataForDisplay: hasilSearch })
  }

  handleUploadFile = args => (e) => {
    if (args === "cuti") {
      this.setState({ fileCuti: e.target.files[0] })
    } else if (args === "evaluator") {
      this.setState({ fileEvaluator: e.target.files[0] })
    } else if (args === "addUser") {
      this.setState({ fileUser: e.target.files[0] })
    }
  }

  importFile = args => () => {
    let token = Cookies.get('POLAGROUP')

    var formData = new FormData();

    formData.append("jenisImport", args)

    if (args === "cuti") {
      formData.append("file", this.state.fileCuti)
    } else if (args === "evaluator") {
      formData.append("file", this.state.fileEvaluator)
    } else if (args === "addUser") {
      formData.append("file", this.state.fileUser)
    }

    API.post('/users/importUser', formData, { headers: { token } })
      .then(data => {
        this.setState({ file: null })
        swal("Import data sukses", "", "success")
      })
      .catch(err => {
        swal("please try again")
      })
  }

  render() {
    return (
      <>
        <p style={{ margin: 10, fontSize: 30 }}>User</p>
        <Grid style={{ border: '1px solid #dde6e9' }}>
          <Tabs
            value={this.state.value}
            indicatorColor="secondary"
            textColor="secondary"
            onChange={this.handleChangeTabs}
            style={{ margin: '5px 20px 15px 20px' }}
          >
            <Tab label="All Users" style={{ marginRight: 30 }} />
            <Tab label="New User" style={{ marginRight: 30 }} />
            <Tab label="Import" style={{ marginRight: 30 }} />
          </Tabs>
          <Divider />
          <SwipeableViews
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
            style={{ height: '100%', padding: 20 }}>

            {/* LIST USERS */}
            <TabPanel value={this.state.value} index={0}>
              {
                this.state.dataForDisplay.length !== 0 && <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <ArchiveIcon style={{ marginRight: 5 }} />
                  <Download nameSheet="Data_User" labelValue={this.state.labelValue} data={this.state.dataForDisplay} title="download data user" />
                </Grid>
              }
              <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <form style={{ width: '100%', marginRight: 15, marginTop: 3 }} onSubmit={this.searching}>
                  <TextField
                    id="pencarian"
                    placeholder="Masukan keyword"
                    variant="outlined"
                    value={this.state.keyword}
                    onChange={this.handleChange('keyword')}
                    disabled={this.state.proses}
                    style={{ width: '100%', marginRight: 15, marginTop: 3 }}
                    InputProps={{
                      style: {
                        height: 35
                      }
                    }}
                  />
                </form>
                <FormControl style={{ width: 150, marginRight: 15 }}>
                  <Select value={this.state.filterCategori} onChange={this.handleChange('filterCategori')} displayEmpty>
                    <MenuItem value="">
                      <em>Filter</em>
                    </MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                    <MenuItem value="name">Nama</MenuItem>
                    <MenuItem value="username">Username</MenuItem>
                    <MenuItem value="initial">Initial</MenuItem>
                    <MenuItem value="nik">NIK</MenuItem>
                    <MenuItem value="evaluator1">Evaluator 1</MenuItem>
                    <MenuItem value="evaluator2">Evaluator 2</MenuItem>
                  </Select>
                </FormControl>
                <Button onClick={this.searching} variant="contained" style={{ width: 150 }}>
                  Cari
                </Button>
              </Grid>
              <Table>
                <TableHead style={{ backgroundColor: '#f8f8f8' }}>
                  <TableRow>
                    <TableCell style={{ padding: 13, marginLeft: 50, maxWidth: '10%' }} onClick={() => this.handleSort('company')}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                        Company
                        {
                          this.state.columnToSort === 'company' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ padding: 13, maxWidth: '20%' }} onClick={() => this.handleSort('name')}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                        Nama
                        {
                          this.state.columnToSort === 'name' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ padding: 13, maxWidth: '5%' }} align="center" onClick={() => this.handleSort('username')}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                        Username
                        {
                          this.state.columnToSort === 'username' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ padding: 13, maxWidth: '5%' }} align="center" onClick={() => this.handleSort('initial')}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                        Initial
                        {
                          this.state.columnToSort === 'initial' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ padding: 13, maxWidth: '10%' }} align="center" onClick={() => this.handleSort('nik')}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                        NIK
                        {
                          this.state.columnToSort === 'nik' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ padding: 13, maxWidth: '18%' }} align="center" onClick={() => this.handleSort('evaluator1')}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                        Evaluator 1
                        {
                          this.state.columnToSort === 'evaluator1' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ padding: 13, maxWidth: '18%' }} align="center" onClick={() => this.handleSort('evalutator2')}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                        Evaluator 2
                        {
                          this.state.columnToSort === 'evalutator2' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ padding: 13, maxWidth: '5%' }} align="center" onClick={() => this.handleSort('isActive')}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                        Active
                        {
                          this.state.columnToSort === 'isActive' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ maxWidth: '5%' }} align="center" >
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        Action
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    orderBy(this.state.dataForDisplay, this.state.columnToSort, this.state.sortDirection).slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((el, index) => (
                      <CardReport data={el} key={index} reportUser={true} refresh={this.fetchData} />
                    ))
                  }
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 30, 50, 100]}
                component="div"
                count={this.state.dataForDisplay.length}
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
            </TabPanel>


            {/* ADD USER */}
            <TabPanel value={this.state.value} index={1}>
              <Typography style={{ fontSize: 40, margin: '10px auto 30px auto', width: 250 }}>Tambah User</Typography>
              <Grid container style={{ display: 'flex' }}>
                <Grid item lg={2} />
                <Grid item sm={12} lg={4} id="kiri" style={{ display: 'flex', padding: 10, flexDirection: 'column' }}>
                  <form>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>NIK</p>
                      <TextField
                        required
                        value={this.state.nik}
                        onChange={this.handleChange('nik')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 40, padding: 0 }
                        }}
                        style={{ width: 250 }}
                        error={this.state.nikNotValid}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>Fullname</p>
                      <TextField
                        value={this.state.fullname}
                        onChange={this.handleChange('fullname')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 40, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                        error={this.state.fullnameNotValid}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>Initial</p>
                      <TextField
                        value={this.state.initial}
                        onChange={this.handleChange('initial')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 40, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                        error={this.state.initialNotValid}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>Tanggal lahir</p>
                      <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                        <KeyboardDatePicker
                          margin="normal"
                          id="date_in"
                          label="Date in"
                          format="dd/MM/yyyy"
                          style={{ margin: 0, width: 250 }}
                          value={this.state.dateBirth}
                          onChange={date => this.setState({ dateBirth: date })}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                          maxDate={new Date()}
                          disabled={this.state.proses}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>Alamat</p>
                      <TextField
                        value={this.state.address}
                        onChange={this.handleChange('address')}
                        variant="outlined"
                        multiline
                        rows="4"
                        InputProps={{
                          style: { padding: 10, width: '100%' }
                        }}
                        style={{ width: 250 }}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>Nomor Telepon</p>
                      <TextField
                        type="number"
                        value={this.state.phone}
                        onChange={this.handleChange('phone')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 40, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>Username</p>
                      <TextField
                        value={this.state.username}
                        onChange={this.handleChange('username')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 40, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                        error={this.state.usernameNotValid}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>Password</p>
                      <TextField
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 40, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                        error={this.state.passwordNotValid}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>Konfirmasi password</p>
                      <TextField
                        type="password"
                        value={this.state.konfirmasiPassword}
                        onChange={this.handleChange('konfirmasiPassword')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 40, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                        error={this.state.passwordNotExact}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                      <p style={{ margin: 0, width: 150 }}>Email</p>
                      <TextField
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange('email')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 40, padding: 0, width: '100%' }
                        }}
                        style={{ width: 250 }}
                        error={this.state.emailNotValid}
                      />
                    </Grid>
                  </form>

                </Grid>
                <Grid item sm={12} lg={5} id="kanan" style={{ display: 'flex', padding: 10, flexDirection: 'column' }}>
                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                    <p style={{ margin: 0, width: 150 }}>Company</p>
                    <Select
                      value={this.state.companyId}
                      onChange={this.handleChange('companyId')}
                      style={{ width: 100 }}
                      error={this.state.companyIdNotValid}
                    >
                      {
                        this.props.dataCompanies.map((company, index) =>
                          <MenuItem value={company.company_id} key={index}>{company.company_name}</MenuItem>
                        )
                      }
                    </Select>
                  </Grid>
                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                    <p style={{ margin: 0, width: 150 }}>Posisi</p>
                    <Select
                      value={this.state.positionId}
                      onChange={this.handleChange('positionId')}
                      style={{ width: 200 }}
                      error={this.state.positionIdNotValid}
                    >
                      <MenuItem value="">-</MenuItem>
                      {
                        this.props.dataPositions.map((position, index) =>
                          <MenuItem value={position.position_id} key={index}>{position.position}</MenuItem>
                        )
                      }
                    </Select>
                  </Grid>
                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                    <p style={{ margin: 0, width: 150 }}>Gedung</p>
                    <Select
                      value={this.state.buildingId}
                      onChange={this.handleChange('buildingId')}
                      style={{ width: 150 }}
                      error={this.state.buildingIdNotValid}
                    >
                      <MenuItem value="">-</MenuItem>
                      {
                        this.props.dataBuildings.map((building, index) =>
                          <MenuItem value={building.building_id} key={index}>{building.building}</MenuItem>
                        )
                      }
                    </Select>
                  </Grid>
                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                    <p style={{ margin: 0, width: 150 }}>Evaluator 1</p>
                    <Select
                      value={this.state.idEvaluator1}
                      onChange={this.handleChange('idEvaluator1')}
                      style={{ width: 250 }}
                      error={this.state.idEvaluator1NotValid}
                    >
                      <MenuItem value="">-</MenuItem>
                      {
                        this.state.dataUser.map((user, index) =>
                          <MenuItem value={user.user_id} key={index}>{user.tbl_account_detail.fullname}</MenuItem>
                        )
                      }
                    </Select>
                  </Grid>
                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                    <p style={{ margin: 0, width: 150 }}>Evaluator 2</p>
                    <Select
                      value={this.state.idEvaluator2}
                      onChange={this.handleChange('idEvaluator2')}
                      style={{ width: 250 }}
                      error={this.state.idEvaluator2NotValid}
                    >
                      <MenuItem value="">-</MenuItem>
                      {
                        this.state.dataUser.map((user, index) =>
                          <MenuItem value={user.user_id} key={index}>{user.tbl_account_detail.fullname}</MenuItem>
                        )
                      }
                    </Select>
                  </Grid>
                </Grid>
                <Grid item lg={1} />
              </Grid>
              <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 30 }}>
                <Button style={{ marginRight: 20 }}>
                  Reset
                </Button>
                <Button color="primary" variant="contained" onClick={this.addNewUser}>
                  Simpan
                </Button>
              </Grid>
            </TabPanel>


            {/* IMPORT DATA */}
            <TabPanel value={this.state.value} index={2}>

              {/* IMPORT CUTI */}
              <Grid style={{ marginBottom: 50 }}>
                <Grid container style={{ display: 'flex', alignItems: 'center' }}>
                  <Grid item xs={12} md={12} lg={6} style={{ display: 'flex' }}>
                    <p style={{ margin: '7px 0px 0px 20px', fontWeight: 'bold', width: 200 }}>Choose File Leave</p>
                    <Grid style={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        component="label"
                        style={{ marginBottom: 5 }}
                      >
                        {
                          this.state.fileCuti
                            ? "Change File"
                            : "Select File"
                        }
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={this.handleUploadFile("cuti")}
                        />
                      </Button>
                      {
                        this.state.fileCuti && <Grid style={{ display: 'flex' }}>
                          <p style={{ margin: '0px 10px' }}>{this.state.fileCuti.name}</p>
                          <CancelPresentationIcon fontSize="small" onClick={() => this.setState({ fileCuti: null })} style={{ cursor: 'pointer' }} />
                        </Grid>
                      }
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6} style={{ display: 'flex' }} >
                    <p style={{ margin: '0px 10px 0px 20px' }}>format .xlsx </p>
                    <a href={process.env.PUBLIC_URL + '/leave.xlsx'}>download sample import cuti</a>
                  </Grid>
                </Grid>
                <Grid style={{ margin: '10px 0px 0px 220px' }}>
                  <Button color="primary" variant="contained" onClick={this.importFile("cuti")}>
                    Upload
                </Button>
                </Grid>
              </Grid>

              {/* IMPORT EVALUATOR */}
              <Grid style={{ marginBottom: 50 }}>
                <Grid container style={{ display: 'flex', alignItems: 'center' }}>
                  <Grid item xs={12} md={12} lg={6} style={{ display: 'flex' }}>
                    <p style={{ margin: '7px 0px 0px 20px', fontWeight: 'bold', width: 200 }}>Choose File Evaluator</p>
                    <Grid style={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        component="label"
                        style={{ marginBottom: 5 }}
                      >
                        {
                          this.state.fileEvaluator
                            ? "Change File"
                            : "Select File"
                        }
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={this.handleUploadFile("evaluator")}
                        />
                      </Button>
                      {
                        this.state.fileEvaluator && <Grid style={{ display: 'flex' }}>
                          <p style={{ margin: '0px 10px' }}>{this.state.fileEvaluator.name}</p>
                          <CancelPresentationIcon fontSize="small" onClick={() => this.setState({ fileEvaluator: null })} style={{ cursor: 'pointer' }} />
                        </Grid>
                      }
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6} style={{ display: 'flex' }} >
                    <p style={{ margin: '0px 10px 0px 20px' }}>format .xlsx </p>
                    <a href={process.env.PUBLIC_URL + '/evaluator.xlsx'}>download sample import cuti</a>
                  </Grid>
                </Grid>
                <Grid style={{ margin: '10px 0px 0px 220px' }}>
                  <Button color="primary" variant="contained" onClick={this.importFile("evaluator")}>
                    Upload
                </Button>
                </Grid>
              </Grid>

              {/* IMPORT NEW USER */}
              <Grid style={{ marginBottom: 50 }}>
                <Grid container style={{ display: 'flex', alignItems: 'center' }}>
                  <Grid item xs={12} md={12} lg={6} style={{ display: 'flex' }}>
                    <p style={{ margin: '7px 0px 0px 20px', fontWeight: 'bold', width: 200 }}>Choose File User</p>
                    <Grid style={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        component="label"
                        style={{ marginBottom: 5 }}
                      >
                        {
                          this.state.fileUser
                            ? "Change File"
                            : "Select File"
                        }
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={this.handleUploadFile("addUser")}
                        />
                      </Button>
                      {
                        this.state.fileUser && <Grid style={{ display: 'flex' }}>
                          <p style={{ margin: '0px 10px' }}>{this.state.fileUser.name}</p>
                          <CancelPresentationIcon fontSize="small" onClick={() => this.setState({ fileUser: null })} style={{ cursor: 'pointer' }} />
                        </Grid>
                      }
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12} lg={6} style={{ display: 'flex' }} >
                    <p style={{ margin: '0px 10px 0px 20px' }}>format .xlsx </p>
                    <a href={process.env.PUBLIC_URL + '/user.xlsx'}>download sample import cuti</a>
                  </Grid>
                </Grid>
                <Grid style={{ margin: '10px 0px 0px 220px' }}>
                  <Button color="primary" variant="contained" onClick={this.importFile("addUser")}>
                    Upload
                </Button>
                </Grid>
              </Grid>

            </TabPanel>


          </SwipeableViews>
        </Grid>
      </>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataCompanies,
  fetchDataPosition,
  fetchDataBuildings
}

const mapStateToProps = ({ loading, error, dataUsers, dataCompanies, dataPositions, dataBuildings }) => {
  return {
    loading,
    error,
    dataUsers,
    dataCompanies,
    dataPositions,
    dataBuildings
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingUser)