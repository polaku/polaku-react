import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';

import PropTypes from "prop-types";

import {
  Paper,
  Tabs,
  Tab,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Modal,
} from "@material-ui/core";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import SwipeableViews from "react-swipeable-views";

import ArrowDropUpOutlinedIcon from "@material-ui/icons/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";
import ArchiveIcon from "@material-ui/icons/Archive";

import Download from '../../components/exportToExcel'
import Loading from '../../components/Loading';

import orderBy from "lodash/orderBy";

import swal from "sweetalert";

import { fetchDataContactUs, fetchDataCompanies } from "../../store/action";

const CardReport = lazy(() => import('../../components/report/CardReport'));

const invertDirection = {
  asc: "desc",
  desc: "asc",
};

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
    this._isMounted = false;
    this.state = {
      loading: true,
      month: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
      statue: "",
      monthSelected: 0,
      value: 0,
      index: 0,
      anchorEl: null,
      openFilter: false,
      monthStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      monthEnd: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ),
      newMonthStart: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ),
      newMonthEnd: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ),
      data: [],
      dataForDisplay: [],
      page: 0,
      rowsPerPage: 5,
      columnToSort: "",
      sortDirection: "desc",

      labelValue: [
        {
          label: "name",
          value: "name",
        },
        {
          label: "tanggal_mulai",
          value: "tglMulai",
        },
        {
          label: "tanggal_selesai",
          value: "tglSelesai",
        },
        {
          label: "lama_ijin",
          value: "lamaIjin",
        },
        {
          label: "status_ijin",
          value: "statusIjin",
        },
        {
          label: "sisa_cuti",
          value: "sisaCuti",
        },
        {
          label: "keterangan",
          value: "message",
        },
        {
          label: "status_ijin",
          value: "status",
        },
        {
          label: "lampiran",
          value: "doctor_letter",
        },
      ],

      searchName: "",
      filterCategori: "",
      optionCompany: [],
      valueTabCompany: 0
    };
  }

  async componentDidMount() {
    this._isMounted = true;

    this.setState({ loading: true })
    if (this._isMounted) {
      await this.props.fetchDataContactUs({
        limit: this.state.rowsPerPage,
        page: this.state.page,
        startDate: this.state.monthStart,
        endDate: this.state.monthEnd,
      });
      await this.fetchData();
    }

    if (this.props.dataCompanies.length === 0) {
      await this.props.fetchDataCompanies()
    }

    if (this.props.dataCompanies.length > 0 && this.props.admin) {
      this.fetchOptionCompany()
    }

    this.setState({ loading: false })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.value !== prevState.value) {
      this.setState({ loading: true })

      let newStatus
      if (this.state.value === 1) newStatus = 'new'
      else if (this.state.value === 2) newStatus = 'new2'
      else if (this.state.value === 3) newStatus = 'approved'
      else if (this.state.value === 4) newStatus = 'rejected'

      await this.setState({ statue: newStatus })
      // await this.props.fetchDataContactUs({
      //   limit: this.state.rowsPerPage,
      //   page: 0,
      //   startDate: this.state.newMonthStart,
      //   endDate: this.state.newMonthEnd,
      // });
      await this.fetchData();

      this.setState({ loading: false })
    }

    if (this.props.dataCompanies !== prevProps.dataCompanies || this.props.admin !== prevProps.admin) {
      this.fetchOptionCompany()
    }
  }

  fetchData = async () => {
    let newData = [], data;

    if (this.state.statue) {
      data = await this.props.dataAllContactUs.filter(
        (el) => el.status === this.state.statue
      );
    } else {
      data = this.props.dataAllContactUs
    }

    if (this.state.valueTabCompany !== 0) {
      let companySelected = this.state.optionCompany[this.state.valueTabCompany]

      data = await this.props.dataAllContactUs.filter(
        (el) => el.company_id === companySelected.company_id
      );
    }

    data.forEach((element) => {
      if (element.date_imp) {
        //IMP
        if (
          new Date(element.date_imp).getMonth() >=
          new Date(this.state.monthStart).getMonth() &&
          new Date(element.date_imp).getFullYear() >=
          new Date(this.state.monthStart).getFullYear() &&
          ((new Date(element.date_imp).getMonth() <=
            new Date(this.state.monthEnd).getMonth() &&
            new Date(element.date_imp).getFullYear() <=
            new Date(this.state.monthEnd).getFullYear()) ||
            new Date(element.date_imp).getFullYear() <
            new Date(this.state.monthEnd).getFullYear())
        ) {
          element.statusIjin = "IMP";
          element.tglMulai = `${element.date_imp.slice(
            8,
            10
          )}/${element.date_imp.slice(5, 7)}/${element.date_imp.slice(
            0,
            4
          )} (${element.start_time_imp.slice(0, 5)})`;
          element.tglSelesai = `${element.date_imp.slice(
            8,
            10
          )}/${element.date_imp.slice(5, 7)}/${element.date_imp.slice(
            0,
            4
          )} (${element.end_time_imp.slice(0, 5)})`;
          element.lamaIjin = `${Number(element.end_time_imp.slice(0, 2)) -
            Number(element.start_time_imp.slice(0, 2))
            } jam`;
          element.sisaCuti = element.tbl_user.tbl_account_detail.leave;

          newData.push(element);
        }
      } else if (element.leave_request) {
        //CUTI
        let startDate = element.leave_date.slice(0, 10);

        if (
          new Date(startDate).getMonth() >=
          new Date(this.state.monthStart).getMonth() &&
          new Date(startDate).getFullYear() >=
          new Date(this.state.monthStart).getFullYear() &&
          ((new Date(startDate).getMonth() <=
            new Date(this.state.monthEnd).getMonth() &&
            new Date(startDate).getFullYear() <=
            new Date(this.state.monthEnd).getFullYear()) ||
            new Date(startDate).getFullYear() <
            new Date(this.state.monthEnd).getFullYear())
        ) {
          element.statusIjin = "Cuti";
          element.tglMulai = `${element.leave_date.slice(
            8,
            10
          )}/${element.leave_date.slice(5, 7)}/${element.leave_date.slice(
            0,
            4
          )}`;
          element.lamaIjin = `${element.leave_request} hari`;
          element.sisaCuti = element.tbl_user.tbl_account_detail.leave;

          if (element.leave_date_in)
            element.tglSelesai = `${element.leave_date_in.slice(
              8,
              10
            )}/${element.leave_date_in.slice(
              5,
              7
            )}/${element.leave_date_in.slice(0, 4)}`;
          else {
            // element.tglSelesai = `${element.leave_date.slice(
            //   element.leave_date.length - 2,
            //   element.leave_date.length
            // )}/${element.leave_date.slice(
            //   element.leave_date.length - 5,
            //   element.leave_date.length - 3
            // )}/${element.leave_date.slice(
            //   element.leave_date.length - 10,
            //   element.leave_date.length - 6
            // )}`;
            let leaveDate = element.leave_date.split(',')
            element.tglSelesai = new Date(leaveDate[leaveDate.length - 1])
          }

          newData.push(element);
        }
      } else if (element.date_ijin_absen_start) {
        let ijinAbsenDate = element.date_ijin_absen_start.split(',')
        //IA
        if (
          new Date(ijinAbsenDate[0]).getMonth() >=
          new Date(this.state.monthStart).getMonth() &&
          new Date(ijinAbsenDate[0]).getFullYear() >=
          new Date(this.state.monthStart).getFullYear() &&
          ((new Date(ijinAbsenDate[0]).getMonth() <=
            new Date(this.state.monthEnd).getMonth() &&
            new Date(ijinAbsenDate[0]).getFullYear() <=
            new Date(this.state.monthEnd).getFullYear()) ||
            new Date(ijinAbsenDate[0]).getFullYear() <
            new Date(this.state.monthEnd).getFullYear())
        ) {
          element.statusIjin = "Ijin Absen";
          element.tglMulai = `${ijinAbsenDate[0].slice(8, 10)}/${ijinAbsenDate[0].slice(5, 7)}/${ijinAbsenDate[0].slice(0, 4)}`;

          if (element.date_ijin_absen_end) {
            element.tglSelesai = `${element.date_ijin_absen_end.slice(
              8,
              10
            )}/${element.date_ijin_absen_end.slice(
              5,
              7
            )}/${element.date_ijin_absen_end.slice(0, 4)}`;
            element.lamaIjin = `${Number(element.date_ijin_absen_end.slice(8, 10)) -
              Number(element.date_ijin_absen_start.slice(8, 10)) +
              1
              } hari`;
          } else {
            element.tglSelesai = `${ijinAbsenDate[ijinAbsenDate.length - 1].slice(
              8,
              10
            )}/${ijinAbsenDate[ijinAbsenDate.length - 1].slice(
              5,
              7
            )}/${ijinAbsenDate[ijinAbsenDate.length - 1].slice(0, 4)}`;
            element.lamaIjin = `${ijinAbsenDate.length} hari`;
          }


          element.sisaCuti = element.tbl_user.tbl_account_detail.leave;

          newData.push(element);
        }
      }

      if(element.status === 'new') element.status = 'Menunggu disetujui evaluator 1'
      if(element.status === 'new2') element.status = 'Menunggu disetujui evaluator 2'
      if(element.status === 'approved') element.status = 'Disetujui'
      if(element.status === 'cancel') element.status = 'Dibatalkan'
    });

    // newData = await newData.filter(el => el.status !== 'cancel')
    this._isMounted && this.setState({
      dataForDisplay: newData,
      data: newData,
      loading: false
    })
  }

  handleChangeTabs = (event, newValue) => {
    this.setState({ value: newValue });
  };

  handleChangeIndex = (index) => {
    this.setState({ index: index });
  };

  handleChange = (name) => (value) => {
    this.setState({ [name]: value });
  };

  handleSearching = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget, openFilter: true });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      openFilter: false,
      newMonthStart: this.state.monthStart,
      newMonthEnd: this.state.monthEnd,
    });
  };

  filterData = async () => {
    this.setState({
      anchorEl: null,
      openFilter: false,
      monthStart: this.state.newMonthStart,
      monthEnd: this.state.newMonthEnd,
      dataForDisplay: [],
      data: [],
      page: 0,
      loading: true,
      valueTabCompany: 0,
      statue: "",
    })

    await this.props.fetchDataContactUs({
      limit: this.state.rowsPerPage,
      page: 0,
      startDate: this.state.newMonthStart,
      endDate: this.state.newMonthEnd,
    });
    await this.fetchData();

    this.setState({ loading: false })
  };

  handleChangePage = async (event, newPage) => {
    this.setState({
      page: newPage,
      loading: true
    });
    await this.props.fetchDataContactUs({
      limit: this.state.rowsPerPage,
      page: newPage,
      startDate: this.state.newMonthStart,
      endDate: this.state.newMonthEnd,
    });
    await this.fetchData();
    this.setState({ loading: false })
  };

  handleChangeRowsPerPage = async (event) => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0,
      loading: true
    });
    await this.props.fetchDataContactUs({
      limit: event.target.value,
      page: 0,
      startDate: this.state.newMonthStart,
      endDate: this.state.newMonthEnd,
    });
    await this.fetchData();
    this.setState({ loading: false })
  };

  handleSort = (columnName) => {
    this.setState((state) => ({
      columnToSort: columnName,
      sortDirection:
        state.columnToSort === columnName
          ? invertDirection[state.sortDirection]
          : "asc",
    }));
  };

  searching = async (event) => {
    event.preventDefault();
    if (this.state.filterCategori === "") {
      swal("Categori filter belum dipilih");
    } else {
      let hasilSearch = await this.state.data.filter((el) =>
        el[this.state.filterCategori]
          .toLowerCase()
          .match(new RegExp(this.state.searchName.toLowerCase()))
      );
      this.setState({ dataForDisplay: hasilSearch });
      if (this.state.filterCategori === "") {
        this.setState({ dataForDisplay: this.state.data });
      }
    }
  };

  handleChangeStatue = (event) => {
    this.setState({ value: event.target.value });
  };

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

  handleChangeTabB = async (event, newValue) => {
    await this.setState({ loading: true, valueTabCompany: newValue })
    await this.fetchData()
    this.setState({ loading: false })
  };

  render() {
    function getDate(waktuAwal, waktuAkhir) {
      let months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      let month1 = months[new Date(waktuAwal).getMonth()];
      let month2 = months[new Date(waktuAkhir).getMonth()];

      if (month1 === month2)
        return `${month1} ${new Date(waktuAkhir).getFullYear()}`;
      else if (
        new Date(waktuAwal).getFullYear() === new Date(waktuAkhir).getFullYear()
      )
        return `${month1} - ${month2} ${new Date(waktuAkhir).getFullYear()}`;
      else
        return `${month1} ${new Date(
          waktuAwal
        ).getFullYear()} -${month2} ${new Date(waktuAkhir).getFullYear()}`;
    }

    if (this.state.loading) return <Loading loading={this.state.loading} />;

    return (
      <div style={{ padding: "10px 40px" }}>
        <p style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>
          Report Ijin
        </p>

        {this.state.dataForDisplay.length !== 0 && (
          <Grid style={{ display: "flex", alignItems: "center" }}>
            <ArchiveIcon />
            <Download
              nameSheet="Pengajuan_Ijin"
              labelValue={this.state.labelValue}
              data={this.state.dataForDisplay}
              title="download report"
              report="ijin"
              startDate={this.state.monthStart}
              monthEnd={this.state.monthEnd}
            />
          </Grid>
        )}

        <Paper
          square
          style={{ padding: "10px 20px 20px 20px", margin: "10px 0px" }}
        >
          <Grid style={{ display: "flex", justifyContent: "space-between" }}>
            <Tabs
              value={this.state.value}
              indicatorColor="secondary"
              textColor="secondary"
              onChange={this.handleChangeTabs}
            >
              <Tab label="Semua" style={{ marginRight: 30 }} />
              <Tab label="Menunggu persetujuan evaluator 1" style={{ marginRight: 30 }} />
              <Tab label="Menunggu persetujuan evaluator 2" style={{ marginRight: 30 }} />
              <Tab label="Disetujui" style={{ marginRight: 30 }} />
              <Tab label="Ditolak" style={{ marginRight: 30 }} />
            </Tabs>
            <Grid style={{ display: "flex", alignItems: "center" }}>
              <Typography>
                {getDate(this.state.monthStart, this.state.monthEnd)}
              </Typography>
              <Button
                variant="contained"
                onClick={this.handleClick}
                style={{ marginLeft: 10 }}
              >
                set tanggal
              </Button>
              <Modal
                open={this.state.openFilter}
                onClose={this.handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <Grid
                  style={{
                    width: 300,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",

                    backgroundColor: "#fff",
                    border: "2px solid #000",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    style={{ margin: 0 }}
                  >
                    <KeyboardDatePicker
                      margin="normal"
                      id="month-start"
                      label="Tanggal Mulai"
                      format="dd/MM/yyyy"
                      style={{ margin: 0, width: "100%" }}
                      value={this.state.newMonthStart}
                      onChange={this.handleChange("newMonthStart")}
                      // defaultValue={new Date((new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      disabled={this.state.proses}
                    />
                  </MuiPickersUtilsProvider>
                  <p style={{ textAlign: "center", margin: 10 }}>s/d</p>
                  <MuiPickersUtilsProvider
                    utils={DateFnsUtils}
                    style={{ margin: 0 }}
                  >
                    <KeyboardDatePicker
                      margin="normal"
                      id="month-end"
                      label="Tanggal Selesai"
                      format="dd/MM/yyyy"
                      style={{ margin: 0, width: "100%" }}
                      value={this.state.newMonthEnd}
                      onChange={this.handleChange("newMonthEnd")}
                      minDate={
                        new Date(
                          new Date(this.state.newMonthStart).getFullYear(),
                          new Date(this.state.newMonthStart).getMonth(),
                          new Date(this.state.newMonthStart).getDate() + 1
                        )
                      }
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      disabled={this.state.proses}
                    />
                  </MuiPickersUtilsProvider>
                  <Button
                    variant="contained"
                    style={{ alignSelf: "flex-end", marginTop: 15 }}
                    onClick={this.filterData}
                  >
                    oke
                  </Button>
                </Grid>
              </Modal>
            </Grid>
          </Grid>

          <Divider />

          {
            this.state.optionCompany.length > 1 && <>
              <Tabs
                value={this.state.valueTabCompany}
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
            </>
          }

          <Grid
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <form
              style={{ width: "100%", marginRight: 15, marginTop: 3 }}
              onSubmit={this.searching}
            >
              <TextField
                id="pencarian"
                placeholder={`Pencarian ${this.state.filterCategori}`}
                variant="outlined"
                value={this.state.searchName}
                onChange={this.handleSearching("searchName")}
                disabled={this.state.proses}
                style={{ width: "100%", marginRight: 15, marginTop: 3 }}
                InputProps={{
                  style: {
                    height: 35,
                  },
                }}
              />
            </form>
            <FormControl style={{ width: 150, marginRight: 15 }}>
              <Select
                value={this.state.filterCategori}
                onChange={this.handleSearching("filterCategori")}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Filter</em>
                </MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="statusIjin">Status</MenuItem>
              </Select>
            </FormControl>
            <Button
              onClick={() => this.handleSort("created_at")}
              variant="contained"
              style={{ width: 150 }}
            >
              {this.state.columnToSort === "created_at" ? (
                this.state.sortDirection === "desc" ? (
                  <>
                    Terbaru <ArrowDropDownOutlinedIcon />
                  </>
                ) : (
                  <>
                    Terlama <ArrowDropUpOutlinedIcon />
                  </>
                )
              ) : (
                <>
                  Terbaru
                  <ArrowDropDownOutlinedIcon />
                </>
              )}
            </Button>
          </Grid>
        </Paper>
        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          style={{ height: "100%" }}
        >
          {/* Semua */}
          <TabPanel
            value={this.state.value}
            index={0}
            style={{ height: "85vh" }}
          >
            <Paper style={{ padding: 10, marginBottom: 5 }}>
              <Table>
                <TableHead style={{ backgroundColor: "#f8f8f8" }}>
                  <TableRow>
                    <TableCell
                      style={{ marginLeft: 50, width: "40%" }}
                      onClick={() => this.handleSort("name")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Nama
                        {this.state.columnToSort === "name" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglMulai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Mulai
                        {this.state.columnToSort === "tglMulai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglSelesai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Selesai
                        {this.state.columnToSort === "tglSelesai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("lamaIjin")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Lama
                        {this.state.columnToSort === "lamaIjin" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "15%" }}
                      align="center"
                      onClick={() => this.handleSort("categori_id")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Status
                        {this.state.columnToSort === "categori_id" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("sisaCuti")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Sisa Cuti
                        {this.state.columnToSort === "sisaCuti" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderBy(
                    this.state.dataForDisplay,
                    this.state.columnToSort,
                    this.state.sortDirection
                  )
                    .slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                      this.state.rowsPerPage
                    )
                    .map((el, index) => (
                      <CardReport data={el} key={index} />
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={this.state.dataForDisplay.length}
                // count={this.props.totalDataContactUs}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  "aria-label": "previous page",
                }}
                nextIconButtonProps={{
                  "aria-label": "next page",
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </TabPanel>

          {/* Baru */}
          <TabPanel
            value={this.state.value}
            index={1}
            style={{ height: "85vh" }}
          >
            <Paper style={{ padding: 10, marginBottom: 5 }}>
              <Table>
                <TableHead style={{ backgroundColor: "#f8f8f8" }}>
                  <TableRow>
                    <TableCell
                      style={{ marginLeft: 50, width: "40%" }}
                      onClick={() => this.handleSort("name")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Nama
                        {this.state.columnToSort === "name" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglMulai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Mulai
                        {this.state.columnToSort === "tglMulai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglSelesai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Selesai
                        {this.state.columnToSort === "tglSelesai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("lamaIjin")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Lama
                        {this.state.columnToSort === "lamaIjin" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "15%" }}
                      align="center"
                      onClick={() => this.handleSort("categori_id")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Status
                        {this.state.columnToSort === "categori_id" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("sisaCuti")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Sisa Cuti
                        {this.state.columnToSort === "sisaCuti" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderBy(
                    this.state.dataForDisplay,
                    this.state.columnToSort,
                    this.state.sortDirection
                  )
                    .slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                      this.state.rowsPerPage
                    )
                    .map((el, index) => (
                      <CardReport data={el} key={index} />
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={this.state.dataForDisplay.length}
                // count={this.props.totalDataContactUs}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  "aria-label": "previous page",
                }}
                nextIconButtonProps={{
                  "aria-label": "next page",
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </TabPanel>

          {/* Evaluator 2 */}
          <TabPanel
            value={this.state.value}
            index={2}
            style={{ height: "85vh" }}
          >
            <Paper style={{ padding: 10, marginBottom: 5 }}>
              <Table>
                <TableHead style={{ backgroundColor: "#f8f8f8" }}>
                  <TableRow>
                    <TableCell
                      style={{ marginLeft: 50, width: "40%" }}
                      onClick={() => this.handleSort("name")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Nama
                        {this.state.columnToSort === "name" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglMulai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Mulai
                        {this.state.columnToSort === "tglMulai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglSelesai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Selesai
                        {this.state.columnToSort === "tglSelesai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("lamaIjin")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Lama
                        {this.state.columnToSort === "lamaIjin" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "15%" }}
                      align="center"
                      onClick={() => this.handleSort("categori_id")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Status
                        {this.state.columnToSort === "categori_id" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("sisaCuti")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Sisa Cuti
                        {this.state.columnToSort === "sisaCuti" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderBy(
                    this.state.dataForDisplay,
                    this.state.columnToSort,
                    this.state.sortDirection
                  )
                    .slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                      this.state.rowsPerPage
                    )
                    .map((el, index) => (
                      <CardReport data={el} key={index} />
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={this.state.dataForDisplay.length}
                // count={this.props.totalDataContactUs}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  "aria-label": "previous page",
                }}
                nextIconButtonProps={{
                  "aria-label": "next page",
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </TabPanel>

          {/* Disetujui */}
          <TabPanel
            value={this.state.value}
            index={3}
            style={{ height: "85vh" }}
          >
            <Paper style={{ padding: 10, marginBottom: 5 }}>
              <Table>
                <TableHead style={{ backgroundColor: "#f8f8f8" }}>
                  <TableRow>
                    <TableCell
                      style={{ marginLeft: 50, width: "40%" }}
                      onClick={() => this.handleSort("name")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Nama
                        {this.state.columnToSort === "name" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglMulai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Mulai
                        {this.state.columnToSort === "tglMulai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglSelesai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Selesai
                        {this.state.columnToSort === "tglSelesai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("lamaIjin")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Lama
                        {this.state.columnToSort === "lamaIjin" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "15%" }}
                      align="center"
                      onClick={() => this.handleSort("categori_id")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Status
                        {this.state.columnToSort === "categori_id" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("sisaCuti")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Sisa Cuti
                        {this.state.columnToSort === "sisaCuti" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderBy(
                    this.state.dataForDisplay,
                    this.state.columnToSort,
                    this.state.sortDirection
                  )
                    .slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                      this.state.rowsPerPage
                    )
                    .map((el, index) => (
                      <CardReport data={el} key={index} />
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={this.state.dataForDisplay.length}
                // count={this.props.totalDataContactUs}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  "aria-label": "previous page",
                }}
                nextIconButtonProps={{
                  "aria-label": "next page",
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </TabPanel>

          {/* Ditolak */}
          <TabPanel
            value={this.state.value}
            index={4}
            style={{ height: "85vh" }}
          >
            <Paper style={{ padding: 10, marginBottom: 5 }}>
              <Table>
                <TableHead style={{ backgroundColor: "#f8f8f8" }}>
                  <TableRow>
                    <TableCell
                      style={{ marginLeft: 50, width: "40%" }}
                      onClick={() => this.handleSort("name")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Nama
                        {this.state.columnToSort === "name" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglMulai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Mulai
                        {this.state.columnToSort === "tglMulai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("tglSelesai")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Tgl Selesai
                        {this.state.columnToSort === "tglSelesai" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("lamaIjin")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Lama
                        {this.state.columnToSort === "lamaIjin" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "15%" }}
                      align="center"
                      onClick={() => this.handleSort("categori_id")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Status
                        {this.state.columnToSort === "categori_id" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                    <TableCell
                      style={{ width: "10%" }}
                      align="center"
                      onClick={() => this.handleSort("sisaCuti")}
                    >
                      <Grid style={{ display: "flex", alignItems: "center" }}>
                        Sisa Cuti
                        {this.state.columnToSort === "sisaCuti" ? (
                          this.state.sortDirection === "desc" ? (
                            <ArrowDropUpOutlinedIcon />
                          ) : (
                            <ArrowDropDownOutlinedIcon />
                          )
                        ) : null}
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderBy(
                    this.state.dataForDisplay,
                    this.state.columnToSort,
                    this.state.sortDirection
                  )
                    .slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                      this.state.rowsPerPage
                    )
                    .map((el, index) => (
                      <CardReport data={el} key={index} />
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={this.state.dataForDisplay.length}
                // count={this.props.totalDataContactUs}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  "aria-label": "previous page",
                }}
                nextIconButtonProps={{
                  "aria-label": "next page",
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </TabPanel>

        </SwipeableViews>
      </div >
    );
  }
}

const mapDispatchToProps = {
  fetchDataContactUs,
  fetchDataCompanies
};

const mapStateToProps = ({ dataAllContactUs, isAdminsuper, dataCompanies, admin }) => {
  return {
    dataAllContactUs,
    isAdminsuper,
    dataCompanies,
    admin
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportIjin);
