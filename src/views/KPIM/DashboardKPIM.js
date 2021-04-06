import React, { Component, lazy } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Cookies from "js-cookie";

import {
  Grid,
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  TableFooter,
  Collapse,
  TextField,
  MenuItem,
  InputAdornment,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogActions,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

import {
  fetchDataAllKPIM,
  fetchDataAllTAL,
  fetchDataRewardKPIM,
} from "../../store/action";
import { API } from "../../config/API";

import swal from "sweetalert";
import { CalendarToday, ExpandMore } from "@material-ui/icons";

const CardIndicator = lazy(() => import('../../components/kpim/cardIndicatorKPIM'));
// const CardItemTAL = lazy(() => import('../../components/kpim/cardItemTAL'));

class DashboardKPIM extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      openAddRow: true,
      openPerulangan: false,
      proses: false,
      months: [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
      statusAddNewTal: false,
      chooseWhen: [],
      firstDateInWeek: new Date().getDate() - (new Date().getDay() - 1),

      indicator_tal: "",
      weight: "",
      when: "",
      load: "",
      achievement: "",
      link: "",

      weekSelected: null,
      monthSelected: null,

      allKPIM: [],
      kpimSelected: [],
      persenKPIM: 0,
      kpimTAL: null,
      kpimTeam: [],

      talSelected: [],
      persenTAL: 0,
      totalWeight: 0,

      lastUpdate: null,
      currentReward: "",

      validateCreateTAL: false,

      idBawahanSelected: 0,
      talTeam: [],
      prosesTAL: true,
      prosesKPIM: true,
      listBawahan: this.props.bawahan,

    };
  }

  async componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      if (this.props.location.state) {
        try {
          this.setState({
            idBawahanSelected: this.props.location.state.userId,
            weekSelected: this.getNumberOfWeek(new Date()),
            monthSelected: new Date().getMonth() + 1,
          });

          let token = Cookies.get("POLAGROUP");
          let dataUser = await API.get(
            `/users/${this.props.location.state.userId}`,
            {
              headers: {
                token,
                ip: this.props.ip,
              },
            }
          );

          this.setState({ listBawahan: dataUser.data.bawahan });
          await this.fetchData(
            new Date().getMonth() + 1,
            this.getNumberOfWeek(new Date()),
            this.props.location.state.userId
          );

          await this.props.fetchDataRewardKPIM(this.props.location.state.userId);

          await this.props.myRewardKPIM.sort(this.sortingReward);
        } catch (err) {
          if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
            swal('Gagal', 'Koneksi tidak stabil', 'error')
          }
        }
      } else if (this.props.userId) {
        this.setState({
          weekSelected: this.getNumberOfWeek(new Date()),
          monthSelected: new Date().getMonth() + 1,
        });
        await this.fetchData(
          new Date().getMonth() + 1,
          this.getNumberOfWeek(new Date()),
          this.props.userId
        );

        await this.props.fetchDataRewardKPIM(this.props.userId);

        await this.props.myRewardKPIM.sort(this.sortingReward);
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    //assign tal selected for display
    if (prevState.weekSelected !== this.state.weekSelected) {
      if (prevState.weekSelected !== null) {
        await this.fetchData(
          this.state.monthSelected,
          this.state.weekSelected,
          this.props.location.state
            ? this.props.location.state.userId
            : this.props.userId
        );
      }
    }

    //assign kpim selected for display
    if (prevState.monthSelected !== this.state.monthSelected) {
      if (prevState.monthSelected !== null) {
        if (this.state.monthSelected === new Date().getMonth() + 1) {
          this.setState({
            weekSelected: this.getNumberOfWeek(new Date()),
          });
        } else {
          let mingguAwalBulan = this.getNumberOfWeek(
            new Date(new Date().getFullYear(), this.state.monthSelected, 1)
          );

          this.setState({
            weekSelected: mingguAwalBulan,
          });
        }
      }
    }

    //fetch myreward kpim
    if (prevState.persenKPIM !== this.state.persenKPIM) {
      this.setState({
        currentReward: "",
      });
      this.props.myRewardKPIM.forEach((el) => {
        if (this.state.persenKPIM >= el.nilai_bawah) {
          this.setState({
            currentReward: el.reward,
          });
        }
      });
    }

    if (prevProps.userId !== this.props.userId) {
      if (!this.props.location.state) {
        this.setState({ listBawahan: this.props.bawahan });
        await this.fetchData(
          new Date().getMonth() + 1,
          this.getNumberOfWeek(new Date()),
          this.props.userId
        );

        await this.props.fetchDataRewardKPIM(this.props.userId);

        await this.props.myRewardKPIM.sort(this.sortingReward);

        this.setState({
          weekSelected: this.getNumberOfWeek(new Date()),
          monthSelected: new Date().getMonth() + 1,
        });
      }
    }

    if (prevProps.location.state !== this.props.location.state) {
      if (!this.props.location.state && prevProps.userId !== null) {
        this.setState({
          listBawahan: this.props.bawahan,
          prosesKPIM: true,
          prosesTAL: true,
        });
        await this.fetchData(
          new Date().getMonth() + 1,
          this.getNumberOfWeek(new Date()),
          this.props.userId
        );

        await this.props.fetchDataRewardKPIM(this.props.userId);

        await this.props.myRewardKPIM.sort(this.sortingReward);

        this.setState({
          weekSelected: this.getNumberOfWeek(new Date()),
          monthSelected: new Date().getMonth() + 1,
        });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchData = async (monthSelected, weekSelected, userId) => {
    let tempTAL = [],
      talTeam;
    await this.props.fetchDataAllKPIM({
      "for-dashboard": true,
      year: new Date().getFullYear(),
      month: monthSelected,
      week: weekSelected,
      userId,
    });

    // ===== HANDLE TAL ===== //
    let dataTAL = await this.props.dataAllKPIM.find(
      (kpim) =>
        kpim.user_id === userId && kpim.indicator_kpim.toLowerCase() === "tal"
    );

    dataTAL &&
      dataTAL.tbl_kpim_scores[dataTAL.tbl_kpim_scores.length - 1].tbl_tals &&
      (await dataTAL.tbl_kpim_scores[
        dataTAL.tbl_kpim_scores.length - 1
      ].tbl_tals.forEach((tal) => {
        let newTAL = { ...tal, ...tal.tbl_tal_scores[0] };
        delete newTAL.tbl_tal_scores;
        tempTAL.push(newTAL);
      }));

    await this.fetchTALSelected(tempTAL, monthSelected, weekSelected);
    this.setState({ prosesTAL: false });
    // ===== HANDLE TAL ===== //

    // ===== HANDLE TAL TEAM ===== //
    if (this.state.listBawahan.length > 0) {
      await this.props.fetchDataAllTAL({
        "for-tal-team": true,
        year: new Date().getFullYear(),
        month: monthSelected,
        week: weekSelected,
        userId: this.props.location.state
          ? this.props.location.state.userId
          : this.props.userId,
      });

      talTeam = await this.fetchDataTALTeam(monthSelected, weekSelected);
    }
    // ==== HANDLE TAL TEAM ===== //

    // ===== HANDLE KPIM ===== //
    let allKPIM = [];
    let KPIM = await this.props.dataAllKPIM.filter(
      (kpim) =>
        kpim.user_id === userId &&
        kpim.indicator_kpim.toLowerCase() !== "tal" &&
        kpim.indicator_kpim.toLowerCase() !== "kpim team"
    );
    let KPIMTeam = await this.props.dataAllKPIM.find(
      (kpim) =>
        kpim.user_id === userId &&
        kpim.indicator_kpim.toLowerCase() !== "tal" &&
        kpim.indicator_kpim.toLowerCase() === "kpim team"
    );
    let TAL = await this.props.dataAllKPIM.find(
      (kpim) =>
        kpim.user_id === userId && kpim.indicator_kpim.toLowerCase() === "tal"
    );
    if (KPIMTeam) allKPIM.push(KPIMTeam);

    this.setState({
      kpimSelected: [],
    });

    let kpimSelected = [];

    if (talTeam) kpimSelected.push(talTeam);
    if (allKPIM.length > 0) kpimSelected = [...kpimSelected, ...allKPIM];
    if (KPIM.length > 0) kpimSelected = [...kpimSelected, ...KPIM];
    if (TAL) kpimSelected.push(TAL);

    await this.fetchKPIMSelected(kpimSelected, monthSelected);
    this.setState({ prosesKPIM: false });
    // ===== HANDLE KPIM ===== //
  };

  //Untuk table tal yang bawah
  fetchTALSelected = async (data, monthSelected, weekSelected) => {
    let talSelected = data,
      tempPersenTAL = 0,
      tempTotalWeight = 0,
      validateCreateTAL = false;
    talSelected.forEach((talWeek) => {
      tempPersenTAL +=
        Number(talWeek.achievement) * (Number(talWeek.weight) / 100);
      tempTotalWeight += Number(talWeek.weight);
    });

    if (weekSelected >= this.getNumberOfWeek(new Date())) {
      validateCreateTAL = true;
    }

    await this.fetchOptionDateInWeek(monthSelected, weekSelected);

    this._isMounted &&
      this.setState({
        validateCreateTAL,
        talSelected,
        persenTAL: tempPersenTAL,
        totalWeight: tempTotalWeight,
      });
  };

  fetchKPIMSelected = async (data, monthSelected) => {
    let kpimSelected = data,
      persenKPIM = 0,
      kpimTAL = null;

    kpimSelected.length > 0 &&
      (await kpimSelected.forEach(async (kpim) => {
        if (kpim.indicator_kpim.toLowerCase() !== "tal team") {
          let kpimNow = await kpim.tbl_kpim_scores.find(
            (kpim_score) => kpim_score.month === monthSelected
          );
          persenKPIM +=
            Number(kpimNow.score_kpim_monthly) * (Number(kpimNow.bobot) / 100);

          if (kpim.indicator_kpim.toLowerCase() === "tal") {
            kpimTAL = kpimNow;
          }
        }
      }));

    // DELETE KPIM TAL
    // kpimSelected = await kpimSelected.filter(kpim => kpim.indicator_kpim.toLowerCase() !== "tal")

    this._isMounted &&
      this.setState({
        kpimSelected,
        persenKPIM: Math.round(persenKPIM),
        kpimTAL,
      });
  };

  fetchDataTALTeam = async (monthSelected, weekSelected) => {
    let persenWeek = 0;

    // ===== FETCH TAL WEEK (START) ===== //
    let talBawahanThisWeek = [];
    this.state.listBawahan &&
      (await this.state.listBawahan.forEach(async (element) => {
        //fetch kpim per user
        let newTAL = [],
          tempTALScore = 0;
        newTAL = await this.props.dataAllTAL.filter(
          (el) => el.user_id === element.user_id
        );

        await newTAL.forEach(async (el) => {
          let talScore = await el.tbl_tal_scores.find(
            (tal_score) => tal_score.week === weekSelected
          );
          if (talScore) tempTALScore += talScore.score_tal;
        });
        let talBawahan = {
          fullname: element.fullname,
          score_tal: tempTALScore,
        };
        talBawahanThisWeek.push(talBawahan);
        persenWeek += tempTALScore;
      }));
    // =====  FETCH TAL WEEK (END)  ===== //

    // ===== FETCH TAL MONTH (START) ===== //
    let pembagiTALTEAM = 0,
      tempTALScore = 0,
      tempWeekBawahan = [],
      userIdProcessing = this.props.dataAllTAL[0]
        ? this.props.dataAllTAL[0].user_id
        : null;
    await this.props.dataAllTAL.forEach(async (tal) => {
      await tal.tbl_tal_scores.forEach((tal_score) => {
        tempTALScore += tal_score.score_tal;
        if (tempWeekBawahan.indexOf(tal_score.week) < 0)
          tempWeekBawahan.push(tal_score.week);
        if (userIdProcessing !== tal.user_id) {
          userIdProcessing = tal.user_id;
          pembagiTALTEAM += tempWeekBawahan.length;
          tempWeekBawahan = [];
        }
      });
    });
    pembagiTALTEAM += tempWeekBawahan.length;

    let objTAL = {
      indicator_kpim: "TAL TEAM",
      persenMonth: Math.round(tempTALScore / pembagiTALTEAM),
      persenWeek: Math.round(persenWeek / this.state.listBawahan.length),
      month: monthSelected,
      year: "" + new Date().getFullYear(),
      talBawahanThisWeek,
    };

    return objTAL;
    // =====  FETCH TAL MONTH (END)  ===== //
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  addNewTal = () => {
    this.setState({
      statusAddNewTal: !this.state.statusAddNewTal,
      indicator_tal: "",
      weight: "",
      when: "",
      load: "",
      achievement: "",
      link: "",
    });
  };

  saveNewTal = async () => {
    if (Number(this.state.totalWeight) + Number(this.state.weight) <= 100) {
      this.setState({
        proses: true,
      });
      let newData = {
        indicator_tal: this.state.indicator_tal,
        weight: this.state.weight,
        time: this.state.when,
        load: this.state.load,
        kpim_score_id: this.state.kpimTAL.kpim_score_id,

        isRepeat: 0,
        forDay: 1,
        week: this.state.weekSelected,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        user_id: this.props.userId,
      };

      if (this.props.location.state) {
        newData.user_id = this.props.location.state.userId;
      } else {
        newData.user_id = this.props.userId;
      }

      let token = Cookies.get("POLAGROUP");
      API.post("/tal", newData, {
        headers: {
          token,
          ip: this.props.ip,
        },
      })
        .then(async ({ data }) => {
          await this.fetchData(
            this.state.monthSelected,
            this.state.weekSelected,
            this.props.location.state
              ? this.props.location.state.userId
              : this.props.userId
          );
          this.setState({
            indicator_tal: "",
            weight: "",
            when: "",
            load: "",
            achievement: "",
            link: "",
            statusAddNewTal: false,
            lastUpdate: new Date(),
            proses: false,
          });
        })
        .catch((err) => {
          this.setState({
            proses: false,
          });
          if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
            swal('Gagal', 'Koneksi tidak stabil', 'error')
          } else {
            swal("please try again");
          }
        });
    } else {
      swal("Weight tal lebih dari 100", "", "warning");
    }
  };

  reset = () => {
    this.setState({
      indicator_tal: "",
      weight: "",
      when: "",
      load: "",
      achievement: "",
      link: "",
    });
  };

  getNumberOfWeek = (date) => {
    //yyyy-mm-dd (first date in week)
    let theDay = date;
    var target = new Date(theDay);
    var dayNr = (new Date(theDay).getDay() + 6) % 7;

    target.setDate(target.getDate() - dayNr + 3);

    var reference = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - reference) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  };

  // CALENDER GOOGLE

  refresh = async () => {
    await this.fetchData(
      this.state.monthSelected,
      this.state.weekSelected,
      this.props.location.state
        ? this.props.location.state.userId
        : this.props.userId
    );
    this.setState({
      lastUpdate: new Date(),
    });
  };

  compare = (a, b) => {
    if (Number(a.week) < Number(b.week)) {
      return -1;
    }
    if (Number(a.week) > Number(b.week)) {
      return 1;
    }
    return 0;
  };

  sortingReward = (a, b) => {
    if (Number(a.nilai_atas) < Number(b.nilai_atas)) {
      return -1;
    }
    if (Number(a.nilai_atas) > Number(b.nilai_atas)) {
      return 1;
    }
    return 0;
  };

  fetchOptionDateInWeek = (monthSelected, weekSelected) => {
    let date = [];

    let awalMingguSekarang = new Date().getDate() - new Date().getDay() + 1;
    let selisihMinggu = weekSelected - this.getNumberOfWeek(new Date());

    for (let i = 1; i <= 7; i++) {
      let newDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        awalMingguSekarang + selisihMinggu * 7
      );

      if (monthSelected === newDate.getMonth() + 1) {
        date.push(newDate.getDate());
      }
      awalMingguSekarang++;
    }

    let day = ["Setiap hari"];
    date.forEach((el) => {
      let date = new Date(
        new Date().getFullYear(),
        monthSelected - 1,
        el
      ).getDay();
      let listDay = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];

      day.push(listDay[date]);
    });

    this.setState({
      chooseWhen: day,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid>
        <Grid container style={{ marginBottom: 10 }}>
          <Grid item xs={12}>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: 20 }}>
              KEY PERFORMANCE INDICATOR MONITORING{" "}
              {this.props.location.state &&
                `(${this.props.location.state.fullname})`}
            </p>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: 10 }}>
          <Grid item md={6} sm={12}>
            <Paper style={{ padding: 10 }}>
              <p style={{ margin: "0px 0px 5px 0px", fontSize: 18 }}>
                Performa KPIM
              </p>
              <p style={{ margin: 0, fontSize: 12 }}>performa bulan ini</p>
              <LinearProgress
                variant="determinate"
                value={this.state.persenKPIM}
                classes={{
                  colorPrimary: classes.colorPrimary,
                  barColorPrimary: classes.barColorPrimary,
                }}
              />
              <Grid
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p style={{ margin: 0, fontSize: 12 }}>statistik bulan ini</p>
                <p
                  style={{ margin: 0, fontSize: 15 }}
                >{`${this.state.persenKPIM}/100`}</p>
              </Grid>
            </Paper>
          </Grid>
          <Grid item md={6} sm={12}>
            <Paper style={{ padding: 10 }}>
              <p style={{ margin: "0px 0px 5px 0px", fontSize: 18 }}>
                Rewards & Consequences
              </p>
              <p style={{ margin: 0, fontSize: 12 }}>30%: SP1</p>
              <LinearProgress
                variant="determinate"
                value={this.state.persenKPIM}
                classes={{
                  colorPrimary: classes.colorPrimary,
                  barColorPrimary: classes.barColorPrimary,
                }}
              />
              <Grid
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p style={{ margin: 0, fontSize: 12 }}>
                  lihat lebih lanjut &gt;
                </p>
                <p
                  style={{ margin: 0, fontSize: 15 }}
                >{`${this.state.persenKPIM}/100`}</p>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: 10 }}>
          <Grid item md={2} sm={6}>
            <Paper style={{ padding: 10 }}>
              {this.state.prosesKPIM ? (
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 128,
                    width: "100%",
                  }}
                >
                  <CircularProgress color="secondary" />
                </Grid>
              ) : (
                  this.state.kpimSelected.map((element, index) => (
                    <CardIndicator
                      data={element}
                      key={index}
                      refresh={this.refresh}
                      weekSelected={this.state.weekSelected}
                      monthSelected={this.state.monthSelected}
                      lastUpdate={this.state.lastUpdate}
                    />
                  ))
                )}
            </Paper>
          </Grid>
          <Grid item md={2} sm={6}>
            <Paper style={{ padding: 10 }}>
              {this.state.prosesKPIM ? (
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 128,
                    width: "100%",
                  }}
                >
                  <CircularProgress color="secondary" />
                </Grid>
              ) : (
                  this.state.kpimSelected.map((element, index) => (
                    <CardIndicator
                      data={element}
                      key={index}
                      refresh={this.refresh}
                      weekSelected={this.state.weekSelected}
                      monthSelected={this.state.monthSelected}
                      lastUpdate={this.state.lastUpdate}
                    />
                  ))
                )}
            </Paper>
          </Grid>
          <Grid item md={2} sm={6}>
            <Paper style={{ padding: 10 }}>
              {this.state.prosesKPIM ? (
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 128,
                    width: "100%",
                  }}
                >
                  <CircularProgress color="secondary" />
                </Grid>
              ) : (
                  this.state.kpimSelected.map((element, index) => (
                    <CardIndicator
                      data={element}
                      key={index}
                      refresh={this.refresh}
                      weekSelected={this.state.weekSelected}
                      monthSelected={this.state.monthSelected}
                      lastUpdate={this.state.lastUpdate}
                    />
                  ))
                )}
            </Paper>
          </Grid>
        </Grid>

        <AppBar position="static" style={{ backgroundColor: "transparent" }}>
          <Toolbar>
            <IconButton edge="start" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ color: "black" }}>
              Perusahaan
            </Typography>
            &emsp;&emsp;&emsp;
            <IconButton edge="start" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ color: "black" }}>
              Departemen
            </Typography>
          </Toolbar>
        </AppBar>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Minggu 2 (3 tugas)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tugas</TableCell>
                    <TableCell align="right">Tenggat</TableCell>
                    <TableCell align="right">Bobot</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Pencapaian</TableCell>
                    <TableCell align="right">Perusahaan</TableCell>
                    <TableCell align="right">Waktu</TableCell>
                    <TableCell align="right">Oleh</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Judul design 2
                    </TableCell>
                    <TableCell align="right">Selasa</TableCell>
                    <TableCell align="right">10%</TableCell>
                    <TableCell align="right">Menunggu</TableCell>
                    <TableCell align="right">lorem ipsum</TableCell>
                    <TableCell align="right">lorem ipsum</TableCell>
                    <TableCell align="right">3'15''</TableCell>
                    <TableCell align="right">lorem ipsum</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <Grid style={{ padding: 10 }}>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "transparent" }}
                      startIcon={<AddIcon />}
                    >
                      Tugas Baru
                    </Button>
                  </Grid>
                </TableFooter>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Backlog</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tugas</TableCell>
                    <TableCell align="right">Tenggat</TableCell>
                    <TableCell align="right">Bobot</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Pencapaian</TableCell>
                    <TableCell align="right">Perusahaan</TableCell>
                    <TableCell align="right">Waktu</TableCell>
                    <TableCell align="right">Oleh</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Judul design 2
                    </TableCell>
                    <TableCell align="right">Selasa</TableCell>
                    <TableCell align="right">10%</TableCell>
                    <TableCell align="right">Menunggu</TableCell>
                    <TableCell align="right">lorem ipsum</TableCell>
                    <TableCell align="right">lorem ipsum</TableCell>
                    <TableCell align="right">3'15''</TableCell>
                    <TableCell align="right">lorem ipsum</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>


          <Collapse in={!this.state.openAddRow} timeout="auto" unmountOnExit>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <TextField id="standard-basic" label="Tugas" />
                      </TableCell>

                      <TableCell align="right">
                        <TextField
                          id="standard-select-currency"
                          select
                          label={" "}
                          value=""
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday />
                              </InputAdornment>
                            ),
                          }}
                          style={{ width: 100 }}
                        >
                          <MenuItem>Senin</MenuItem>
                          <MenuItem>Selasa</MenuItem>
                          <MenuItem>Rabu</MenuItem>
                          <MenuItem>Kamis</MenuItem>
                          <MenuItem>Jumat</MenuItem>
                          <MenuItem>Sabtu</MenuItem>
                          <MenuItem>Minggu</MenuItem>
                          <MenuItem>Pengulangan</MenuItem>
                          <MenuItem>Tanggal</MenuItem>
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            this.setState({
                              openPerulangan: !this.state.openPerulangan,
                            })
                          }
                        >
                          Perulangan
                        </Button>

                        <Dialog
                          open={this.state.openPerulangan}
                          onClose={() =>
                            this.setState({
                              openPerulangan: false,
                            })
                          }
                          aria-labelledby="form-dialog-title"
                        >
                          <DialogTitle id="form-dialog-title">
                            Subscribe
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              To subscribe to this website, please enter your
                              email address here. We will send updates
                              occasionally.
                            </DialogContentText>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="Email Address"
                              type="email"
                              fullWidth
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() =>
                                this.setState({
                                  openPerulangan: !this.state.openPerulangan,
                                })
                              }
                              color="primary"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() =>
                                this.setState({
                                  openPerulangan: !this.state.openPerulangan,
                                })
                              }
                              color="primary"
                            >
                              Subscribe
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          id="standard-select-currency"
                          select
                          label="Oleh"
                          style={{ width: 100 }}
                        >
                          <MenuItem>A</MenuItem>
                          <MenuItem>A</MenuItem>
                        </TextField>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="success" aria-label="add an alarm">
                          <PlayArrowIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Collapse>
          <AccordionDetails>
            <Button
              variant="contained"
              style={{ backgroundColor: "transparent" }}
              startIcon={this.state.openAddRow ? <AddIcon /> : <ClearIcon />}
              onClick={() =>
                this.setState({ openAddRow: !this.state.openAddRow })
              }
            >
              {this.state.openAddRow ? "Tugas Baru" : "Batal"}
            </Button>
          </AccordionDetails>

        </Accordion>
      </Grid>
    );
  }
}

const styles = () => ({
  colorPrimary: {
    backgroundColor: "#d6d6d6",
  },
  barColorPrimary: {
    backgroundColor: "#3e98c7",
  },
});

const mapDispatchToProps = {
  fetchDataAllKPIM,
  fetchDataAllTAL,
  fetchDataRewardKPIM,
};

const mapStateToProps = ({
  loading,
  error,
  dataAllKPIM,
  dataAllTAL,
  userId,
  bawahan,
  myRewardKPIM,
  ip,
}) => {
  return {
    loading,
    error,
    dataAllKPIM,
    dataAllTAL,
    userId,
    bawahan,
    myRewardKPIM,
    ip,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DashboardKPIM));
