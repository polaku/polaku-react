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
        label: "total_nilai",
        value: "totalNilai"
      }, {
        label: "tal",
        value: "tal"
      }, {
        label: "kpim",
        value: "kpim"
      }
    ],

    searchName: "",
    filterCategori: ""
  }

  async componentDidMount() {
    await this.fetchData()
  }

  fetchData = async () => {
    let newData = [{
      name: "Tio",
      totalNilai: 80,
      tal: 75,
      kpim: 60
    }, {
      name: "Ardi",
      totalNilai: 70,
      tal: 85,
      kpim: 70
    }]

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
        <p style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>Report KPIM</p>

        {
          this.state.dataForDisplay.length !== 0 && <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <ArchiveIcon />
            <Download nameSheet="Laporan_KPIM" labelValue={this.state.labelValue} data={this.state.dataForDisplay} />
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
                    <TableCell style={{ width: '20%' }} align="center" onClick={() => this.handleSort('totalNilai')}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        Total nilai
                        {
                          this.state.columnToSort === 'totalNilai' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ width: '20%' }} align="center" onClick={() => this.handleSort('tal')}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        TAL
                        {
                          this.state.columnToSort === 'tal' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
                        }
                      </Grid>
                    </TableCell>
                    <TableCell style={{ width: '20%' }} align="center" onClick={() => this.handleSort('kpim')}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} >
                        KPIM
                        {
                          this.state.columnToSort === 'kpim' ? (this.state.sortDirection === "desc" ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />) : null
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