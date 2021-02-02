import React, { Component } from "react";
import Cookies from "js-cookie";
import { connect } from "react-redux";

import { Grid, Popover, Button, CircularProgress } from "@material-ui/core";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import PencapaianKPIM from "./pencapaianKPIM";
import { API } from "../../config/API";
import swal from "sweetalert";

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

class cardIndicator extends Component {
  state = {
    open: false,
    anchorEl: null,
    persenBefore: 0,
    persenNow: 0,
    editIndicator: false,
    dataTALWeek: [],
    proses: true,
    bobotNow: 0,
  };
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.data !== this.props.data ||
      prevProps.monthSelected !== this.props.monthSelected ||
      prevProps.weekSelected !== this.props.weekSelected ||
      prevProps.lastUpdate !== this.props.lastUpdate
    ) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    let persenBefore = 0,
      persenNow = 0,
      bobotNow = 0;
    if (this.props.data.indicator_kpim.toLowerCase() !== "tal team") {
      let dataBefore = this.props.data.tbl_kpim_scores.find(
        (el) => el.month === Number(this.props.monthSelected) - 1
      );
      dataBefore = { ...this.props.data, ...dataBefore };
      delete dataBefore.tbl_kpim_scores;
      let dataNow = this.props.data.tbl_kpim_scores.find(
        (el) => el.month === Number(this.props.monthSelected)
      );
      dataNow = { ...this.props.data, ...dataNow };
      delete dataNow.tbl_kpim_scores;

      if (this.props.data.indicator_kpim.toLowerCase() === "kpim team") {
        if (isNaN(Math.ceil(dataBefore.score_kpim_monthly))) persenBefore = 0;
        else
          persenBefore =
            Math.round(Math.ceil(dataBefore.score_kpim_monthly)) || 0;

        if (isNaN(Math.ceil(dataNow.score_kpim_monthly))) persenNow = 0;
        else persenNow = Math.round(Math.ceil(dataNow.score_kpim_monthly)) || 0;
      } else if (this.props.data.indicator_kpim.toLowerCase() !== "tal") {
        if (dataBefore.pencapaian_monthly && dataBefore.target_monthly !== 0)
          persenBefore = Math.round(
            (Math.ceil(Number(dataBefore.pencapaian_monthly)) /
              Number(dataBefore.target_monthly)) *
              100
          );

        if (dataNow.target_monthly !== 0)
          persenNow = Math.round(
            Math.ceil(
              (Number(dataNow.pencapaian_monthly) /
                Number(dataNow.target_monthly)) *
                100
            )
          );
      } else {
        if (isNaN(Math.ceil(dataBefore.score_kpim_monthly))) persenBefore = 0;
        else
          persenBefore =
            Math.round(Math.ceil(dataBefore.score_kpim_monthly)) || 0;

        if (isNaN(Math.ceil(dataNow.score_kpim_monthly))) persenNow = 0;
        else persenNow = Math.round(Math.ceil(dataNow.score_kpim_monthly)) || 0;
      }
      bobotNow = dataNow.bobot;
    }

    this.setState({
      proses: false,
      persenBefore,
      persenNow,
      bobotNow,
    });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget, open: true });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false,
    });
  };

  refresh = () => {
    this.props.refresh();
  };

  calculateKPIMScore = async () => {
    let token = Cookies.get("POLAGROUP");

    API.put(
      "/kpim/calculateKPIMTEAM",
      { year: new Date().getFullYear(), month: this.props.monthSelected },
      {
        headers: {
          token,
          ip: this.props.ip,
        },
      }
    )
      .then(() => {
        swal("Nilai sudah terbaru", "", "success");
      })
      .catch((err) => {
        swal("please try again");
      });
  };

  render() {
    function getNumberOfWeek(date) {
      //yyyy-mm-dd
      let theDay = date;
      var target = new Date(theDay);
      var dayNr = (new Date(theDay).getDay() + 6) % 7;

      target.setDate(target.getDate() - dayNr + 3);

      var reference = new Date(target.getFullYear(), 0, 4);
      var dayDiff = (target - reference) / 86400000;
      var weekNr = 1 + Math.ceil(dayDiff / 7);

      return weekNr;
    }

    return (
      <>
        <Grid item xs={3} md={2} style={{ padding: 3 }}>
          <Grid
            style={{
              padding: 10,
              cursor: "pointer",
              backgroundColor:
                this.props.data.indicator_kpim === "TAL TEAM"
                  ? "#ff5887"
                  : "white",
              minHeight: 127.5,
            }}
            onClick={this.handleClick}
          >
            <Grid
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ margin: 0, fontSize: 14 }}>
                {this.props.data.indicator_kpim}
              </p>
              {this.state.open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Grid>
            {this.props.data.indicator_kpim !== "TAL TEAM" && (
              <Grid>
                <p style={{ margin: 0, fontSize: 10 }}>
                  Bobot: {this.state.bobotNow}
                </p>
              </Grid>
            )}
            <Grid></Grid>
            {this.state.proses ? (
              <Grid
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "67px",
                  width: "100%",
                }}
              >
                <CircularProgress color="secondary" />
              </Grid>
            ) : this.props.data.indicator_kpim.toLowerCase() === "tal team" ? (
              <Grid
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                  marginTop: 7,
                }}
              >
                <Grid style={{ marginRight: 20 }}>
                  <p style={{ margin: 0, fontSize: 35 }}>
                    {Math.floor(this.props.data.persenWeek)}%
                  </p>
                  <p style={{ margin: 0, fontSize: 12 }}>
                    Minggu{" "}
                    {this.props.weekSelected === getNumberOfWeek(new Date())
                      ? "ini"
                      : this.props.weekSelected}
                  </p>
                </Grid>
                <Grid>
                  <p style={{ margin: 0, fontSize: 25 }}>
                    {Math.floor(this.props.data.persenMonth)}%
                  </p>
                  <p style={{ margin: 0, fontSize: 12 }}>
                    Bulan{" "}
                    {this.props.data.month === new Date().getMonth() + 1
                      ? "ini"
                      : months[this.props.data.month - 1]}
                  </p>
                </Grid>
              </Grid>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: 30 }}>
                  {Math.floor(this.state.persenNow)}%
                </p>
                <Grid style={{ display: "flex", alignItems: "center" }}>
                  {this.state.persenBefore - this.state.persenNow <= 0 ? (
                    <ArrowDropUpIcon style={{ color: "green" }} />
                  ) : (
                    <ArrowDropDownIcon style={{ color: "red" }} />
                  )}

                  <p
                    style={{
                      margin: "3px 5px 0px 0px",
                      fontSize: 10,
                      color:
                        this.state.persenBefore - this.state.persenNow <= 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {Math.abs(
                      Math.floor(this.state.persenBefore - this.state.persenNow)
                    )}
                    %
                  </p>
                  <p style={{ margin: "3px 0px 0px 0px", fontSize: 10 }}>
                    {" "}
                    dari periode sebelumnya
                  </p>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Grid style={{ width: 250, padding: 10 }}>
            {this.props.data.indicator_kpim.toLowerCase() === "tal team"
              ? this.props.data.talBawahanThisWeek.map((tal, index) => (
                  <PencapaianKPIM
                    data={tal}
                    key={index}
                    refresh={this.refresh}
                    index={index}
                    indicator={this.props.data.indicator_kpim}
                  />
                ))
              : this.props.data.tbl_kpim_scores.map((kpim, index) => (
                  <PencapaianKPIM
                    data={kpim}
                    key={index}
                    refresh={this.refresh}
                    index={index}
                    indicator={this.props.data.indicator_kpim}
                    year={this.props.data.year}
                  />
                ))}

            {this.props.data.indicator_kpim.toLowerCase() === "kpim team" && (
              <Grid style={{ width: "100%", textAlign: "end" }}>
                <Button variant="contained" onClick={this.calculateKPIMScore}>
                  refresh score
                </Button>
              </Grid>
            )}
          </Grid>
        </Popover>
      </>
    );
  }
}

const mapStateToProps = ({ ip }) => {
  return {
    ip,
  };
};

export default connect(mapStateToProps)(cardIndicator);
