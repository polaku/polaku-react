import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { Grid, Tabs, Tab, Divider, Box, Typography, Badge, Avatar, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import SelectOption from '@material-ui/core/Select';

import SwipeableViews from 'react-swipeable-views';

import CardSettingUserKPIMTAL from '../../components/kpim/cardSettingUserKPIMTAL';

import { fetchDataAllKPIM, fetchDataAllTAL } from '../../store/action';

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

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

class SettingKPIM extends Component {
  state = {
    value: 1,
    data: [],
    bulan: new Date().getMonth() + 1,
    minggu: '',
    optionMinggu: [],
    dataForDisplay: [],
    allKPIM: [],
    allTAL: [],
    firstDateInWeek: new Date().getDate() - (new Date().getDay() - 1),
    weekNow: null
  }

  async componentDidMount() {
    this.fetchWeek()
    this.setState({
      minggu: this.getWeeks(new Date())
    })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.bawahan !== this.props.bawahan) {
      let month = new Date().getMonth() + 1
      this.fetchData(month)
    }
  }

  fetchData = async (month) => {
    let temp = [], tempForDisplay = []
    await this.props.fetchDataAllKPIM(new Date().getFullYear())
    await this.props.fetchDataAllTAL(new Date().getFullYear())

    this.setState({
      allKPIM: this.props.dataAllKPIM,
      allTAL: this.props.dataAllTAL
    })

    await this.props.bawahan.forEach(async element => {
      let newData = {
        user_id: element.user_id,
        fullname: element.fullname,
        avatar: element.avatar
      }
      newData.kpim = await this.props.dataAllKPIM.filter(el => el.user_id === element.user_id)
      temp.push(newData)
    });
    console.log("minggu ke ", this.state.minggu)
    await temp.forEach(async user => {
      user.tal = await this.props.dataAllTAL.filter(element => user.user_id === element.user_id && Number(element.week) === Number(this.state.minggu) )

      // user.tal = await this.props.dataAllTAL.forEach(element => {
      //   // user.user_id === element.user_id && Number(element.week) === Number(this.state.weekNow)
      //   console.log(Number(element.week), Number(this.state.weekNow), Number(element.week) === Number(this.state.weekNow))
      // })
    })

    tempForDisplay = temp

    await tempForDisplay.forEach(async user => {
      await user.kpim.forEach(async kpim => {
        let filteredKPIMScore = await kpim.kpimScore.filter(kpimScore => Number(kpimScore.month) === Number(month))
        kpim.score = filteredKPIMScore
      })
    })
    this.setState({ data: temp, dataForDisplay: tempForDisplay })
  }

  fetchWeek = () => {
    let i = 1, arr = []

    for (; i <= 52; i++) {
      arr.push(i)
    }
    this.setState({ optionMinggu: arr })
  }

  handleChangeTabs = (event, newValue) => {
    this.setState({ value: newValue })
  };

  handleChange = name => async event => {
    if (name === 'bulan') {
      let batasAtas, batasBawah, loopingWeek = []
      if (event.target.value === "" || event.target.value === 0) {
        this.fetchWeek()
        this.fetchData(new Date().getMonth() + 1)
      } else {
        batasAtas = Math.ceil(event.target.value * 4.345)
        batasBawah = batasAtas - 4

        for (batasBawah; batasBawah <= batasAtas; batasBawah++) {
          loopingWeek.push(batasBawah)
        }

        if (batasAtas === 53) {
          loopingWeek[loopingWeek.length - 1] = 1
        }

        this.setState({
          optionMinggu: loopingWeek
        })
        await this.fetchData(event.target.value)
      }
    }

    this.setState({ [name]: event.target.value });

    if (name === 'minggu') {
      console.log("MASUK")
      await this.fetchData(this.state.bulan)
    }
  };

  refresh = () => {
    let month = new Date().getMonth() + 1
    this.fetchData(month)
  }

  getWeeks = date => {
    let theDay = date
    var target = new Date(theDay);
    var dayNr = (new Date(theDay).getDay() + 6) % 7;

    target.setDate(target.getDate() - dayNr + 3);

    var jan4 = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - jan4) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

  render() {
    return (
      <Grid>
        <Tabs
          value={this.state.value}
          indicatorColor="secondary"
          textColor="secondary"
          onChange={this.handleChangeTabs}
        >
          <Tab label="Semua" style={{ marginRight: 30 }} />
          <Tab label={`Butuh tindakan (${this.state.data.length})`} style={{ marginRight: 30 }} />
          <Tab label="Ditugaskan" style={{ marginRight: 30 }} />
        </Tabs>
        <Divider />

        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          style={{ height: '100%' }}>

          {/* SEMUA */}
          <TabPanel value={this.state.value} index={0} style={{ height: '85vh' }}>
            TEST
          </TabPanel>

          {/* BUTUH TINDAKAN */}
          <TabPanel value={this.state.value} index={1} style={{ height: '85vh', width: '98%' }}>
            <Grid id="user" container style={{ marginLeft: 20 }}>
              {
                this.state.data.map((el, index) =>
                  <Grid style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'cener', width: 80, marginRight: 30 }} key={index}>
                    <Badge
                      overlap="circle"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      badgeContent={<div style={{ backgroundColor: '#b4b4b4', borderRadius: 15, height: 30, width: 30, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{el.nilai}</div>}
                    >
                      <Avatar alt="Travis Howard" src="http://api.polagroup.co.id/uploads/icon_user.png" style={{ width: 80, height: 80 }} />
                    </Badge>
                    <p style={{ margin: 0, textAlign: 'center' }}>{el.fullname}</p>
                  </Grid>
                )
              }
            </Grid>
            <Grid id="filter" style={{ marginTop: 10, marginBottom: 30, display: 'flex', alignItems: 'flex-end' }}>
              <p style={{ margin: '0px 10px 5px 0px' }}>filter</p>
              <FormControl >
                <InputLabel>
                  Bulan
                </InputLabel>
                <SelectOption
                  value={this.state.bulan}
                  onChange={this.handleChange('bulan')}
                  style={{ width: 150, marginRight: 10 }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={0}>
                    telah berjalan
                  </MenuItem>
                  {
                    months.map((el, index) =>
                      <MenuItem value={index + 1} key={index}>{el}</MenuItem>
                    )
                  }
                </SelectOption>
              </FormControl>
              <FormControl >
                <InputLabel>
                  Minggu
                </InputLabel>
                <SelectOption
                  value={this.state.minggu}
                  onChange={this.handleChange('minggu')}
                  style={{ width: 150, marginRight: 10 }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={0}>
                    telah berjalan
                  </MenuItem>
                  {
                    this.state.optionMinggu.map((el, index) =>
                      <MenuItem value={el} key={index}>{el}</MenuItem>
                    )
                  }
                </SelectOption>
              </FormControl>
            </Grid>

            <Grid id="main" style={{ marginTop: 20, }}>
              {/* CARD */}
              {
                this.state.dataForDisplay.map((el, index) =>
                  <CardSettingUserKPIMTAL data={el} key={index} refresh={this.refresh} firstDateInWeek={this.state.firstDateInWeek} weekNow={this.state.minggu} month={this.state.bulan} />
                )
              }
            </Grid>

          </TabPanel>

          {/* DITUGASKAN */}
          <TabPanel value={this.state.value} index={2} style={{ height: '85vh' }}>
            TEST
          </TabPanel>
        </SwipeableViews>
      </Grid>
    )
  }
}

const mapDispatchToProps = {
  fetchDataAllKPIM,
  fetchDataAllTAL
}

const mapStateToProps = ({ loading, error, dataAllKPIM, bawahan, dataAllTAL }) => {
  return {
    loading,
    error,
    dataAllKPIM,
    bawahan,
    dataAllTAL,
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingKPIM)