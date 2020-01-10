import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  Paper, Tabs, Tab, Typography, Box, Divider, Grid, Button, Popover, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TextField, Select
} from '@material-ui/core';
// import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import SwipeableViews from 'react-swipeable-views';

import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import ArchiveIcon from '@material-ui/icons/Archive';

import CardReport from '../../components/report/CardReport';
import Download from '../../components/exportToExcel'

import orderBy from 'lodash/orderBy';

import swal from 'sweetalert';

import { fetchDataContactUs } from '../../store/action';

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
      {value === index && <Box pt={2}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

class ReportIjin extends Component {
  state = {
    month: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    monthSelected: 0,
    value: 0,
    index: 0,
    anchorEl: null,
    openFilter: false,
    monthStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    monthEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    newMonthStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    newMonthEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    data: [],
    dataForDisplay: [],
    page: 0,
    rowsPerPage: 5,
    columnToSort: "",
    sortDirection: "desc",

    labelValue: [
      {
        label: "name",
        value: "name"
      }, {
        label: "tanggal_mulai",
        value: "tglMulai"
      }, {
        label: "tanggal_selesai",
        value: "tglSelesai"
      }, {
        label: "lama_ijin",
        value: "lamaIjin"
      }, {
        label: "status_ijin",
        value: "statusIjin"
      }, {
        label: "sisa_cuti",
        value: "sisaCuti"
      }
    ],

    searchName: "",
    filterCategori: ""
  }

  async componentDidMount() {
    await this.props.fetchDataContactUs()
    await this.fetchData()
  }

  fetchData = async () => {
    let newData = []
    let data = await this.props.dataAllContactUs.filter(el => el.status === "approved")
    // console.log(this.props.dataAllContactUs)

    data.forEach(element => {

      if (element.date_imp) { //IMP
        if (
          (
            new Date(element.date_imp).getMonth() >= new Date(this.state.monthStart).getMonth() &&
            new Date(element.date_imp).getFullYear() >= new Date(this.state.monthStart).getFullYear()
          ) && (
            (
              new Date(element.date_imp).getMonth() <= new Date(this.state.monthEnd).getMonth() &&
              new Date(element.date_imp).getFullYear() <= new Date(this.state.monthEnd).getFullYear()
            ) || new Date(element.date_imp).getFullYear() < new Date(this.state.monthEnd).getFullYear()
          )
        ) {

          element.statusIjin = "IMP"
          element.tglMulai = `${element.date_imp.slice(8, 10)}/${element.date_imp.slice(5, 7)}/${element.date_imp.slice(0, 4)} (${element.start_time_imp.slice(0, 5)})`
          element.tglSelesai = `${element.date_imp.slice(8, 10)}/${element.date_imp.slice(5, 7)}/${element.date_imp.slice(0, 4)} (${element.end_time_imp.slice(0, 5)})`
          element.lamaIjin = `${Number(element.end_time_imp.slice(0, 2)) - Number(element.start_time_imp.slice(0, 2))} jam`
          element.sisaCuti = element.tbl_user.tbl_account_detail.leave

          newData.push(element)
        }
      } else if (element.leave_request) { //CUTI
        let startDate = element.leave_date.slice(0, 10)

        if (
          (new Date(startDate).getMonth() >= new Date(this.state.monthStart).getMonth() && new Date(startDate).getFullYear() >= new Date(this.state.monthStart).getFullYear()) &&
          (
            (new Date(startDate).getMonth() <= new Date(this.state.monthEnd).getMonth() && new Date(startDate).getFullYear() <= new Date(this.state.monthEnd).getFullYear()) ||
            new Date(startDate).getFullYear() < new Date(this.state.monthEnd).getFullYear()
          )
        ) {

          element.statusIjin = "Cuti"
          element.tglMulai = `${element.leave_date.slice(8, 10)}/${element.leave_date.slice(5, 7)}/${element.leave_date.slice(0, 4)}`
          element.lamaIjin = `${element.leave_request} hari`
          element.sisaCuti = element.tbl_user.tbl_account_detail.leave

          if (element.leave_date_in) element.tglSelesai = `${element.leave_date_in.slice(8, 10)}/${element.leave_date_in.slice(5, 7)}/${element.leave_date_in.slice(0, 4)}`
          else element.tglSelesai = `${element.leave_date.slice(element.leave_date.length - 2, element.leave_date.length)}/${element.leave_date.slice(element.leave_date.length - 5, element.leave_date.length - 3)}/${element.leave_date.slice(element.leave_date.length - 10, element.leave_date.length - 6)}`

          newData.push(element)
        }
      } else if (element.date_ijin_absen_start) { //IA
        if (
          (new Date(element.date_ijin_absen_start).getMonth() >= new Date(this.state.monthStart).getMonth() && new Date(element.date_ijin_absen_start).getFullYear() >= new Date(this.state.monthStart).getFullYear()) &&
          ((new Date(element.date_ijin_absen_start).getMonth() <= new Date(this.state.monthEnd).getMonth() && new Date(element.date_ijin_absen_start).getFullYear() <= new Date(this.state.monthEnd).getFullYear()) || new Date(element.date_ijin_absen_start).getFullYear() < new Date(this.state.monthEnd).getFullYear())
        ) {

          element.statusIjin = "Ijin Absen"
          element.tglMulai = `${element.date_ijin_absen_start.slice(8, 10)}/${element.date_ijin_absen_start.slice(5, 7)}/${element.date_ijin_absen_start.slice(0, 4)}`
          element.tglSelesai = `${element.date_ijin_absen_end.slice(8, 10)}/${element.date_ijin_absen_end.slice(5, 7)}/${element.date_ijin_absen_end.slice(0, 4)}`
          element.lamaIjin = `${Number(element.date_ijin_absen_end.slice(8, 10)) - Number(element.date_ijin_absen_start.slice(8, 10)) + 1} hari`
          element.sisaCuti = element.tbl_user.tbl_account_detail.leave

          newData.push(element)
        }
      }
    });

    this.setState({
      dataForDisplay: newData,
      data: newData
    })
  }

  handleChangeTabs = (event, newValue) => {
    this.setState({ value: newValue })
  };

  handleChangeIndex = index => {
    this.setState({ index: index })
  };

  handleChange = name => value => {
    this.setState({ [name]: value });
  };

  handleSearching = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget, openFilter: true })
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      openFilter: false,
      newMonthStart: this.state.monthStart,
      newMonthEnd: this.state.monthEnd,
    })
  };

  filterData = async () => {
    await this.setState({
      anchorEl: null,
      openFilter: false,
      monthStart: this.state.newMonthStart,
      monthEnd: this.state.newMonthEnd,
      dataForDisplay: [],
      data: [],
    })
    this.fetchData()
  }

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

  searching = async event => {
    event.preventDefault()
    if (this.state.filterCategori === "") {
      swal("Categori filter belum dipilih");
    } else {
      let hasilSearch = await this.state.data.filter(el => el[this.state.filterCategori].toLowerCase().match(new RegExp(this.state.searchName.toLowerCase())))
      this.setState({ dataForDisplay: hasilSearch })
      if (this.state.filterCategori === "") {
        this.setState({ dataForDisplay: this.state.data })
      }
    }
  }

  render() {
    function getDate(waktuAwal, waktuAkhir) {
      let months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

      let month1 = months[new Date(waktuAwal).getMonth()]
      let month2 = months[new Date(waktuAkhir).getMonth()]

      if (month1 === month2) return `${month1} ${new Date(waktuAkhir).getFullYear()}`
      else if (new Date(waktuAwal).getFullYear() === new Date(waktuAkhir).getFullYear()) return `${month1} - ${month2} ${new Date(waktuAkhir).getFullYear()}`
      else return `${month1} ${new Date(waktuAwal).getFullYear()} -${month2} ${new Date(waktuAkhir).getFullYear()}`

    }

    return (
      <div style={{ padding: '10px 40px' }}>
        <p style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>Report Ijin</p>

        {
          this.state.dataForDisplay.length !== 0 && <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <ArchiveIcon />
            <Download nameSheet="Pengajuan_Ijin" labelValue={this.state.labelValue} data={this.state.dataForDisplay} />
          </Grid>
        }

        <Paper square style={{ padding: '10px 20px 20px 20px', margin: '10px 0px' }}>
          <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tabs
              value={this.state.value}
              indicatorColor="secondary"
              textColor="secondary"
              onChange={this.handleChangeTabs}
            >
              <Tab label="Semua" style={{ marginRight: 30 }} />
              {/* <Tab label="PIP" style={{ marginRight: 30 }} />
              <Tab label="BPW" style={{ marginRight: 30 }} /> */}
            </Tabs>
            <Grid style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{getDate(this.state.monthStart, this.state.monthEnd)}</Typography>
              <Button variant="contained" onClick={this.handleClick} style={{ marginLeft: 10 }}>
                set tanggal
              </Button>
              <Popover
                open={this.state.openFilter}
                anchorEl={this.state.anchorEl}
                onClose={this.handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Grid
                  style={{ width: 300, padding: 20, display: 'flex', flexDirection: 'column' }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="month-start"
                      label="Tanggal Mulai"
                      format="dd/MM/yyyy"
                      style={{ margin: 0, width: '100%' }}
                      value={this.state.newMonthStart}
                      onChange={this.handleChange('newMonthStart')}
                      // defaultValue={new Date((new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      disabled={this.state.proses}
                    />
                  </MuiPickersUtilsProvider>
                  <p style={{ textAlign: "center", margin: 10 }}>s/d</p>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ margin: 0 }}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="month-end"
                      label="Tanggal Selesai"
                      format="dd/MM/yyyy"
                      style={{ margin: 0, width: '100%' }}
                      value={this.state.newMonthEnd}
                      onChange={this.handleChange('newMonthEnd')}
                      minDate={new Date(new Date(this.state.newMonthStart).getFullYear(), new Date(this.state.newMonthStart).getMonth(), new Date(this.state.newMonthStart).getDate() + 1)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      disabled={this.state.proses}
                    />
                  </MuiPickersUtilsProvider>
                  <Button variant="contained" style={{ alignSelf: 'flex-end', marginTop: 15 }} onClick={this.filterData}>
                    oke
                  </Button>
                </Grid>
              </Popover>
            </Grid>
          </Grid>
          <Divider />
          <Grid style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <form style={{ width: '100%', marginRight: 15, marginTop: 3 }} onSubmit={this.searching}>
              <TextField
                id="pencarian"
                placeholder={`Pencarian ${this.state.filterCategori}`}
                variant="outlined"
                value={this.state.searchName}
                onChange={this.handleSearching('searchName')}
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
              <Select value={this.state.filterCategori} onChange={this.handleSearching('filterCategori')} displayEmpty>
                <MenuItem value="">
                  <em>Filter</em>
                </MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="statusIjin">Status</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={() => this.handleSort('created_at')} variant="contained" style={{ width: 150 }}>
              {
                this.state.columnToSort === 'created_at' ? (this.state.sortDirection === "desc" ? <>Terbaru <ArrowDropDownOutlinedIcon /></> : <>Terlama <ArrowDropUpOutlinedIcon /></>) : <>Terbaru<ArrowDropDownOutlinedIcon /></>
              }
            </Button>
          </Grid>
        </Paper>
        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          style={{ height: '100%' }}>

          {/* Semua */}
          <TabPanel value={this.state.value} index={0} style={{ height: '85vh' }}>
            <Paper style={{ padding: 10, marginBottom: 5 }}>
              <Table>
                <TableHead style={{ backgroundColor: '#f8f8f8' }}>
                  <TableRow>
                    <TableCell style={{ marginLeft: 50, width: '40%' }} onClick={() => this.handleSort('name')}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        Nama
                        {
                          this.state.columnToSort === 'name' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ width: '10%' }} align="center" onClick={() => this.handleSort('tglMulai')}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        Tgl Mulai
                        {
                          this.state.columnToSort === 'tglMulai' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ width: '10%' }} align="center" onClick={() => this.handleSort('tglSelesai')}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        Tgl Selesai
                        {
                          this.state.columnToSort === 'tglSelesai' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ width: '10%' }} align="center" onClick={() => this.handleSort('lamaIjin')}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        Lama
                        {
                          this.state.columnToSort === 'lamaIjin' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ width: '15%' }} align="center" onClick={() => this.handleSort('categori_id')}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        Status
                        {
                          this.state.columnToSort === 'categori_id' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ width: '10%' }} align="center" onClick={() => this.handleSort('sisaCuti')}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        Sisa Cuti
                        {
                          this.state.columnToSort === 'sisaCuti' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    orderBy(this.state.dataForDisplay, this.state.columnToSort, this.state.sortDirection).slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((el, index) => (
                      <CardReport data={el} key={index} />
                    ))
                  }
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
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

            </Paper>
          </TabPanel>

          {/* Alamat */}
          <TabPanel value={this.state.value} index={1}>
            Alamat
          </TabPanel>

          {/* Struktur */}
          <TabPanel value={this.state.value} index={2}>
            Struktur
          </TabPanel>
        </SwipeableViews>
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataContactUs
}

const mapStateToProps = ({ dataAllContactUs }) => {
  return {
    dataAllContactUs
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportIjin)