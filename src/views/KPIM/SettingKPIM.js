import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { Grid, Tabs, Tab, Divider, Box, Typography, Badge, Avatar, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import SelectOption from '@material-ui/core/Select';

import SwipeableViews from 'react-swipeable-views';

import CardSettingUserKPIMTAL from '../../components/kpim/cardSettingUserKPIMTAL';

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

export default class SettingKPIM extends Component {
  state = {
    value: 1,
    data: [{
      nama: "Tio",
      nilai: 80
    }, {
      nama: "Ardi",
      nilai: 75
    }],
    bulan: '',
    minggu: '',
    optionMinggu: []
  }

  componentDidMount() {
    this.fetchWeek()
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

  handleChange = name => event => {
    if (name === 'bulan') {
      let batasAtas, batasBawah, loopingWeek = []
      if (event.target.value === "" || event.target.value === 0) {
        this.setState({
          [name]: event.target.value
        })
        this.fetchWeek()
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
          [name]: event.target.value, optionMinggu: loopingWeek
        })
      }

    }

    this.setState({ [name]: event.target.value });
    // console.log(event.target.value)
  };

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
          <TabPanel value={this.state.value} index={1} style={{ height: '85vh' }}>
            <Grid id="user" container>
              {
                this.state.data.map((el, index) =>
                  <Grid style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'cener', width: 80, marginRight: 15 }} key={index}>
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
                    <p style={{ margin: 0, textAlign: 'center' }}>{el.nama}</p>
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
                      <MenuItem value={index} key={index}>{el}</MenuItem>
                    )
                  }
                </SelectOption>
              </FormControl>

            </Grid>

            <Grid id="main" style={{ marginTop: 20, }}>

              {/* CARD */}
              <CardSettingUserKPIMTAL/>

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
