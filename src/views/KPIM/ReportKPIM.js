import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  Paper, Tabs, Tab, Typography, Box, Divider, Grid, Button, Popover,
  TextField, MenuItem, IconButton, Checkbox, MenuList, Select as SelectOption
} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';

import ArrowDropUpOutlinedIcon from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@material-ui/icons/ArrowDropDownOutlined';
import SearchIcon from '@material-ui/icons/Search';

import Download from '../../components/exportToExcel';

import { fetchDataAllKPIM } from '../../store/action';

const CardReportKPIM = lazy(() => import('../../components/kpim/cardReportKPIM'));

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
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      month: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
      yearSelected: new Date().getFullYear(),
      monthSelected: null,
      weekSelected: null,
      optionMinggu: [],
      optionYear: [],

      value: 0,
      index: 0,
      openFilter: false,

      data: [],
      dataForDisplay: [],
      page: 0,
      rowsPerPage: 5,
      columnToSort: "",
      sortDirection: "desc",

      labelValue: [
        {
          label: "Name",
          value: "name"
        }, {
          label: "Total Nilai",
          value: "totalNilai"
        }, {
          label: "TAL",
          value: "tal"
        }, {
          label: "KPIM",
          value: "kpim"
        }
      ],

      kpim: [],
      tal: [],

      searchName: "",
      filterCategori: "",
      selectAll: false,
      statusCheckAll: false,

      unduhLaporan: ["semua", "KPIM", "TAL"],
      anchorElSubMenu: null,
      openSubMenu: false,

      labelValueReportNilai: [
        {
          label: "NIK",
          value: "nik"
        }, {
          label: "Nama",
          value: "nama"
        }, {
          label: "KPIM1",
          value: "kpim1"
        }, {
          label: "KPIM2",
          value: "kpim2"
        }, {
          label: "KPIM3",
          value: "kpim3"
        }, {
          label: "KPIM4",
          value: "kpim4"
        }, {
          label: "KPIM5",
          value: "kpim5"
        }, {
          label: "TAL",
          value: "TAL"
        }, {
          label: "Total Nilai",
          value: "totalNilai"
        }, {
          label: "NIK Evaluator",
          value: "nikEvaluator"
        }, {
          label: "Nama Evaluator",
          value: "namaEvaluator"
        }, {
          label: "Bulan",
          value: "bulan"
        }, {
          label: "Tahun",
          value: "tahun"
        },
      ],
      labelValueKPIM: [
        {
          label: "NIK",
          value: "nik"
        }, {
          label: "Nama",
          value: "nama"
        }, {
          label: "Indikator",
          value: "indikator"
        }, {
          label: "Nilai",
          value: "nilai"
        }, {
          label: "NIK Evaluator",
          value: "nikEvaluator"
        }, {
          label: "Nama Evaluator",
          value: "namaEvaluator"
        }, {
          label: "Bulan",
          value: "bulan"
        }, {
          label: "Tahun",
          value: "tahun"
        },
      ],
      labelValueTAL: [
        {
          label: "NIK",
          value: "nik"
        }, {
          label: "Nama",
          value: "nama"
        }, {
          label: "TAL",
          value: "tal"
        }, {
          label: "Minggu",
          value: "minggu"
        }, {
          label: "Nilai",
          value: "nilai"
        }, {
          label: "NIK Evaluator",
          value: "nikEvaluator"
        }, {
          label: "Nama Evaluator",
          value: "namaEvaluator"
        },
      ],
      dataNilaiReport: [],
      dataNilaiKPIM: [],
      dataNilaiTAL: [],
      counterCeklis: 0,

      updatedAt: new Date(),
      dataForDownload: []
    }
  }

  async componentDidMount() {
    let optionYear = []

    for (let i = new Date().getFullYear(); i > new Date().getFullYear() - 3; i--) {
      optionYear.push(i)
    }

    this.setState({
      monthSelected: new Date().getMonth(),
      optionYear,
      loading: true,
    })

    // await this.fetchData()
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.dataNilaiKPIM !== this.state.dataNilaiKPIM) {
      if (this.state.dataNilaiKPIM.length > 0) {
        this.setState({
          statusCeklis: true
        })
      } else {
        this.setState({
          statusCeklis: false
        })
      }
    }

    if (prevState.updatedAt !== this.state.updatedAt) {
      let counter = 0, counterVisible = 0

      this.state.dataForDisplay.forEach(el => {
        if (el.isVisible) {
          counterVisible++
        }
        if (el.isCheck && el.isVisible) {
          counter++
        }
      })

      if (counterVisible !== counter) {
        this.setState({
          statusCheckAll: false
        })
      }

      this.setState({
        counterCeklis: counter
      })
    }

    if (prevState.monthSelected !== this.state.monthSelected) {

      let batasAtas, batasBawah, loopingWeek = []
      this.setState({
        loading: true,
        selectAll: false,
        statusCheckAll: false,
        counterCeklis: 0,
      })
      batasAtas = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.monthSelected + 1, 0))
      batasBawah = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.state.monthSelected, 1))

      if (batasBawah >= 52) batasBawah = 1

      for (let i = batasBawah; i <= batasAtas; i++) {
        loopingWeek.push(i)
      }

      // if (batasAtas === 53) {
      //   loopingWeek[loopingWeek.length - 1] = 1
      // }
      this.setState({
        optionMinggu: loopingWeek,
        weekSelected: 0,
      })

      await this.fetchData()
      this.setState({
        loading: false
      })
    }

    if ((prevState.weekSelected !== this.state.weekSelected && prevState.weekSelected !== null) || prevState.yearSelected !== this.state.yearSelected) {
      this.setState({
        loading: true,
        selectAll: false,
        statusCheckAll: false,
        counterCeklis: 0,
        dataForDisplay: []
      })

      await this.fetchData()
      this.setState({
        loading: false
      })
    }
  };

  getNumberOfWeek = (date) => {
    //yyyy-mm-dd (first date in week)
    if (new Date().getFullYear() === 2021) {
      let theDay = date;
      var target = new Date(theDay);
      var dayNr = (new Date(theDay).getDay() + 6) % 7;

      target.setDate(target.getDate() - dayNr + 3);

      var reference = new Date(target.getFullYear(), 0, 4);
      var dayDiff = (target - reference) / 86400000;
      var weekNr = 1 + Math.ceil(dayDiff / 7);

      return weekNr;
    } else {
      var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      var dayNum = d.getUTCDay();
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    }
  }

  fetchData = async () => {
    let tempData = [], forDisplay = []
    console.log(this.props.bawahan)
    await this.props.fetchDataAllKPIM({ 'for-report': true, year: this.state.yearSelected, month: this.state.monthSelected + 1, isAdminHR: this.props.isAdminHR, bawahan: this.props.bawahan, userId: this.props.userId, admin: this.props.admin })

    await this.props.dataAllKPIM.sort(this.sortingUser)
    if (this.props.dataAllKPIM.length > 0) {
      let tempUser = this.props.dataAllKPIM[0].user_id, temp = []
      await this.props.dataAllKPIM.forEach((kpim, index) => {
        if (tempUser !== kpim.user_id) {
          tempUser = kpim.user_id
          tempData.push(temp)
          temp = []
        }
        temp.push(kpim)
        if (index === this.props.dataAllKPIM.length - 1) {
          tempData.push(temp)
        }
      });

      tempData.forEach(async (el, index) => {
        let a = await this.fetchDataForDisplay(el)

        if ((a.kpim && a.kpim.length > 0) || (a.tal && a.tal.dataTAL.length > 0)) {
          a.isVisible = true
        } else {
          a.isVisible = false
        }

        a.isCheck = false
        forDisplay.push(a)

        if (index === tempData.length - 1) {
          this.setState({
            dataForDisplay: forDisplay,
            data: forDisplay
          })
        }
      })
    } else {
      this.setState({
        dataForDisplay: [],
        data: []
      })
    }
  };

  fetchDataForDisplay = async args => {
    let tempDataForDisplayKPIM = [], tempDataForDisplayTAL = [], nilaiKPI = 0

    let kpim = await args.filter(el => el.indicator_kpim.toLowerCase() !== "tal")
    let tal = await args.find(el => el.indicator_kpim.toLowerCase() === "tal")

    await kpim.forEach(async element => {
      let kpimScore = await element.tbl_kpim_scores.find(el => el.month === this.state.monthSelected + 1 && el.hasConfirm === true)
      if (kpimScore) {
        let score = {
          indicator_kpim: element.indicator_kpim,
          ...kpimScore
        }
        nilaiKPI += Number(kpimScore.score_kpim_monthly) * (Number(kpimScore.bobot) / 100)

        tempDataForDisplayKPIM.push(score)
      }
    });

    let tempTAL
    if (tal) tempTAL = await tal.tbl_kpim_scores.find(el => el.month === this.state.monthSelected + 1)

    tempTAL && tempTAL.tbl_tals.forEach(async element => {

      let newTALScore
      if (this.state.weekSelected === 0) {
        newTALScore = await element.tbl_tal_scores.filter(el => el.month === this.state.monthSelected + 1 && el.hasConfirm === true)
      } else {
        newTALScore = await element.tbl_tal_scores.filter(el => el.month === this.state.monthSelected + 1 && el.hasConfirm === true && el.week === this.state.weekSelected)
      }

      await newTALScore.forEach(el => {
        let newData = {
          indicator_tal: element.indicator_tal,
          ...el
        }
        tempDataForDisplayTAL.push(newData)
      })
    })

    await tempDataForDisplayTAL.sort(this.sortingWeek)

    if (tempTAL) {
      tempTAL.indicator_kpim = "TAL"
      tempTAL.dataTAL = tempDataForDisplayTAL
    }

    let b = await this.fetchDataReport(tempDataForDisplayKPIM, tempTAL, args[0].tbl_user.user_id, args[0].tbl_user.tbl_account_detail.nik, args[0].tbl_user.tbl_account_detail.fullname, args[0].tbl_user.tbl_account_detail.idEvaluator1 ? args[0].tbl_user.tbl_account_detail.idEvaluator1.tbl_account_detail.nik : '', args[0].tbl_user.tbl_account_detail.idEvaluator1 ? args[0].tbl_user.tbl_account_detail.idEvaluator1.tbl_account_detail.fullname : '')
    if (tempTAL) {
      if (tempTAL.hasConfirm) {
        nilaiKPI += Number(tempTAL.score_kpim_monthly) * (Number(tempTAL.bobot) / 100)
        return {
          kpim: tempDataForDisplayKPIM,
          tal: tempTAL,
          nilaiKPI: Math.round(nilaiKPI),
          nilaiTAL: Math.round(+tempTAL.score_kpim_monthly),
          userId: args[0].user_id,
          fullname: args[0].tbl_user.tbl_account_detail.fullname,
          evaluator: args[0].tbl_user.tbl_account_detail.idEvaluator1 ? args[0].tbl_user.tbl_account_detail.idEvaluator1.tbl_account_detail.fullname : '',
          ...b
        }
      } else {
        return {
          kpim: tempDataForDisplayKPIM,
          tal: tempTAL,
          nilaiKPI: Math.round(nilaiKPI),
          nilaiTAL: 0,
          userId: args[0].user_id,
          fullname: args[0].tbl_user.tbl_account_detail.fullname,
          evaluator: args[0].tbl_user.tbl_account_detail.idEvaluator1 ? args[0].tbl_user.tbl_account_detail.idEvaluator1.tbl_account_detail.fullname : '',
          ...b
        }
      }
    } else {
      return {}
    }
  };

  fetchDataReport = async (kpim, tal, userId, nik, userFullname, nikEvaluator, evaluatorFullname) => {
    let newArr = [null, null, null, null, null], tempTotalNilai = 0, tempDataKPIM = [], tempDataTAL = []

    kpim.forEach((el, index) => {
      newArr[index] = +el.score_kpim_monthly

      tempTotalNilai += Number(el.score_kpim_monthly) * (Number(el.bobot) / 100)
    })

    let newData = [...kpim, tal]

    if (tal) tempTotalNilai += Number(tal.score_kpim_monthly) * (Number(tal.bobot) / 100)

    let dataNilaiReport = [
      {
        nik,
        userId: userId,
        nama: userFullname,
        nikEvaluator: nikEvaluator,
        namaEvaluator: evaluatorFullname,
        kpim1: Math.round(newArr[0]),
        kpim2: Math.round(newArr[1]),
        kpim3: Math.round(newArr[2]),
        kpim4: Math.round(newArr[3]),
        kpim5: Math.round(newArr[4]),
        totalNilai: Math.round(tempTotalNilai),
        bulan: this.state.monthSelected + 1,
        tahun: this.state.yearSelected
      }
    ]

    if (tal) dataNilaiReport[0].TAL = +tal.score_kpim_monthly

    // FETCH DATA KPIM
    await newData.forEach(el => {
      let tempObj = {
        nik,
        userId: userId,
        nama: userFullname,
        nikEvaluator: nikEvaluator,
        namaEvaluator: evaluatorFullname,
        indikator: el ? el.indicator_kpim : "",
        nilai: el ? Math.round(+el.score_kpim_monthly) : "",
        bulan: this.state.monthSelected + 1,
        tahun: this.state.yearSelected
      }
      tempDataKPIM.push(tempObj)
    })

    // FETCH DATA TAL
    tal && await tal.dataTAL.forEach(el => {
      let tempObj = {
        nik,
        userId: userId,
        nama: userFullname,
        nikEvaluator: nikEvaluator,
        namaEvaluator: evaluatorFullname,
        tal: el.indicator_tal,
        minggu: el.week,
        nilai: Math.round(+el.score_tal)
      }
      tempDataTAL.push(tempObj)
    })

    return {
      dataNilaiReport,
      dataNilaiKPIM: tempDataKPIM,
      dataNilaiTAL: tempDataTAL,
    }
  };

  handleChangeTabs = (event, newValue) => {
    this.setState({ value: newValue })
  };

  handleChangeIndex = index => {
    this.setState({ index: index })
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSearching = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      openFilter: false,
      newMonthStart: this.state.monthStart,
      newMonthEnd: this.state.monthEnd,
    })
  };

  handleSort = async () => {
    this.setState({
      sortDirection: invertDirection[this.state.sortDirection]
    })
    await this.state.dataForDisplay.sort(this.sortingName)
  };

  sortingName = (a, b) => {
    if (this.state.sortDirection === "asc") {
      if (a.fullname < b.fullname) {
        return -1;
      }
      if (a.fullname > b.fullname) {
        return 1;
      }
    } else {
      if (a.fullname < b.fullname) {
        return 1;
      }
      if (a.fullname > b.fullname) {
        return -1;
      }
    }
    return 0;
  };

  sortingWeek = (a, b) => {
    if (Number(a.week) < Number(b.week)) {
      return -1;
    }
    if (Number(a.week) > Number(b.week)) {
      return 1;
    }
    return 0;
  };

  searching = async event => {
    event.preventDefault()

    let hasilSearch = await this.state.data.filter(el => el.fullname.toLowerCase().match(new RegExp(this.state.searchName.toLowerCase())))
    this.setState({ dataForDisplay: hasilSearch })
  };

  sortingUser = (a, b) => {
    if (Number(a.user_id) < Number(b.user_id)) {
      return -1;
    }
    if (Number(a.user_id) > Number(b.user_id)) {
      return 1;
    }
    return 0;
  };

  handleChangeCheck = event => {
    this.setState({
      selectAll: event.target.checked,
      statusCheckAll: event.target.checked,
    })

    if (!event.target.checked) {
      this.setState({
        dataNilaiReport: [],
        dataNilaiKPIM: [],
        dataNilaiTAL: []
      })
    }
  };

  handleClickSubMenu = async (event) => {
    this.setState({
      anchorElSubMenu: event.currentTarget,
      openSubMenu: true
    })
    await this.fetchDataForDownload()
  };

  handleCloseSubMenu = () => {
    this.setState({
      anchorElSubMenu: null,
      openSubMenu: false,
      anchorElMenu: null,
      openMenu: false
    })
  };

  fetchDataForDownload = async () => {
    let newData = await this.state.dataForDisplay.filter(el => el.isCheck && el.isVisible)

    let dataNilaiReport = []
    let dataNilaiKPIM = []
    let dataNilaiTAL = []

    newData.forEach(el => {
      dataNilaiReport = [...dataNilaiReport, ...el.dataNilaiReport]
      dataNilaiKPIM = [...dataNilaiKPIM, ...el.dataNilaiKPIM]
      dataNilaiTAL = [...dataNilaiTAL, ...el.dataNilaiTAL]
    })

    this.setState({
      dataNilaiReport,
      dataNilaiKPIM,
      dataNilaiTAL
    })
  };


  handleCheck = (userId, status) => {
    let tempData = this.state.dataForDisplay

    tempData.forEach(el => {
      if (el.userId === userId) {
        el.isCheck = status
      }
    })

    this.setState({
      dataForDisplay: tempData,
      updatedAt: new Date()
    })
  };

  render() {

    return (
      <div style={{ padding: '10px 40px' }}>
        <p style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>Report KPIM</p>

        {/* BAGIAN ATAS */}
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
              <SelectOption
                value={this.state.weekSelected}
                onChange={this.handleChange('weekSelected')}
                style={{ width: 130, marginRight: 10, marginLeft: 10 }}
              >
                <MenuItem value={0}>
                  week sebulan
                </MenuItem>
                {
                  this.state.optionMinggu.map((el, index) =>
                    <MenuItem value={el} key={index}>{el}</MenuItem>
                  )
                }
              </SelectOption>

              <SelectOption
                value={this.state.monthSelected}
                onChange={this.handleChange('monthSelected')}
              >
                {
                  this.state.month.map((month, index) =>
                    <MenuItem value={index} key={index}>{month}</MenuItem>
                  )
                }
              </SelectOption>

              <SelectOption
                value={this.state.yearSelected}
                onChange={this.handleChange('yearSelected')}
                style={{ marginLeft: 10 }}
              >
                {
                  this.state.optionYear.map((year, index) =>
                    <MenuItem value={year} key={"year" + index}>{year}</MenuItem>
                  )
                }
              </SelectOption>
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
                  endAdornment: <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.searching}
                  >
                    <SearchIcon />
                  </IconButton>,
                }}
              />
            </form>
            <Button onClick={() => this.handleSort('fullname')} variant="contained" style={{ width: 200 }}>
              {
                this.state.sortDirection === "desc" ? <>Sorting Nama <ArrowDropDownOutlinedIcon /></> : <>Sorting Nama <ArrowDropUpOutlinedIcon /></>
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

            <Paper id="header" style={{ display: 'flex', padding: '10px 20px', marginBottom: 5 }} >
              <Grid style={{ display: 'flex', width: '60%', alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid style={{ width: 300, display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={this.state.statusCheckAll}
                    onChange={this.handleChangeCheck}
                    value="secondary"
                    color="secondary"
                  />
                  <p style={{ margin: '0px 10px' }}>pilih untuk lakukan aksi</p>
                </Grid>
                <Grid style={{ display: 'flex', alignItems: 'center', paddingRight: 30 }}>
                  <Grid style={{ width: 50, textAlign: 'center' }}>
                    <p style={{ margin: 0 }}>KPI</p>
                  </Grid>
                  <Grid style={{ width: 50, textAlign: 'center' }}>
                    <p style={{ margin: 0 }}>TAL</p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid style={{ width: '25%', display: 'flex', alignItems: 'center' }}>
                <p style={{ margin: 0 }}>Evaluator</p>
              </Grid>
              <Grid style={{ width: '15%', display: 'flex', alignItems: 'center' }}>
                <p style={{ margin: 0 }}>Aksi</p>
              </Grid>
            </Paper>
            {
              this.state.loading
                ? <p style={{ textAlign: 'center' }}>Mengambil data</p>
                : this.state.dataForDisplay.length === 0
                  ? <p style={{ textAlign: 'center', color: 'red' }}>Tidak ada data</p>
                  : this.state.dataForDisplay.map((el, index) => <CardReportKPIM data={el} key={index} allSelected={this.state.selectAll} handleCheck={this.handleCheck} refresh={this.fetchData} />)
            }

          </TabPanel>
        </SwipeableViews>

        {
          this.state.counterCeklis > 0 &&
          <Grid style={{ width: '100%', position: 'fixed', bottom: 0, left: 30 }}>

            <Grid style={{ backgroundColor: "#b8b8b8", width: '70%', height: 50, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
              <Grid style={{ display: 'flex', alignItems: 'center', paddingLeft: 15 }}>
                <>
                  <Checkbox
                    checked={this.state.selectAll}
                    onChange={this.handleChangeCheck}
                    value="secondary"
                    color="secondary"
                  />
                  <p style={{ margin: '0px 0px 0px 3px' }}>pilih semua</p>
                </>
                <>
                  <Grid style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: '#d71149', display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 30 }}>
                    <p style={{ margin: 0, color: 'white', fontSize: 12 }}>{this.state.counterCeklis}</p>
                  </Grid>
                  <p style={{ margin: '0px 0px 0px 8px' }}>orang terpilih</p>
                </>
              </Grid>
              <Grid style={{ display: 'flex', alignItems: 'center', marginRight: 30 }}>
                <Button variant="contained" style={{ borderRadius: 5, padding: 0 }} onClick={this.handleClickSubMenu}>
                  <p style={{ margin: 0 }}>Unduh</p>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        }

        <Popover id="Sub menu unduh"
          open={this.state.openSubMenu}
          anchorEl={this.state.anchorElSubMenu}
          onClose={this.handleCloseSubMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuList style={{ width: 100 }} >
            {/* {
              this.state.unduhLaporan.map((el, index) =>
                <MenuItem key={index}>
                  <Download
                    title="semua"
                    report="kpim"
                    labelValueReportNilai={this.state.labelValueReportNilai}
                    data={this.state.dataNilaiReport}
                    labelValueKPIM={this.state.labelValueKPIM}
                    dataKPIM={this.state.dataNilaiKPIM}
                  // labelValueTAL={this.state.labelValueTAL}
                  // dataTAL={this.state.dataNilaiTAL} 
                  />
                </MenuItem>
              )
            } */}
            <MenuItem style={{ height: '50px' }}>
              <Download
                title="semua"
                report="kpim"
                labelValueReportNilai={this.state.labelValueReportNilai}
                data={this.state.dataNilaiReport}
                labelValueKPIM={this.state.labelValueKPIM}
                dataKPIM={this.state.dataNilaiKPIM}
              />
            </MenuItem>
          </MenuList>
        </Popover>
      </div >
    )
  }
}

const mapDispatchToProps = {
  fetchDataAllKPIM
}

const mapStateToProps = ({ dataAllKPIM, bawahan, isAdminHR, userId, admin }) => {
  return {
    dataAllKPIM,
    bawahan,
    isAdminHR,
    userId,
    admin
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportIjin)