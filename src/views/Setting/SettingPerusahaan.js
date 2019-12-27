import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  Paper, Tabs, Tab, Typography, Box, Divider
} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';

import PanelOnboarding from '../../components/setting/panelOnBoarding'

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

export default class SettingPerusahaan extends Component {
  state = {
    labelTab: ['OnBoarding', 'Alamat', 'Struktur', 'Karyawan', 'Admin'],
    value: 0,
    index: 0
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue })
  };

  handleChangeIndex = index => {
    this.setState({ index: index })
  };

  render() {
    return (
      <div>
        <Paper square style={{ padding: 10, paddingLeft: 20, paddingBottom: 20 }}>
          <Tabs
            value={this.state.value}
            indicatorColor="secondary"
            textColor="secondary"
            onChange={this.handleChange}
          >
            <Tab label="OnBoarding" style={{ marginRight: 30 }} />
            <Tab label="Alamat" style={{ marginRight: 30 }} />
            <Tab label="Struktur" style={{ marginRight: 30 }} />
            <Tab label="Karyawan" style={{ marginRight: 30 }} />
            <Tab label="Admin" style={{ marginRight: 30 }} />
          </Tabs>
          <Divider />
        </Paper>
        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          style={{ height: '100%' }}>

          {/* OnBoarding */}
          <TabPanel value={this.state.value} index={0} style={{ height: '85vh' }}>
            <Paper style={{ padding: 10, paddingLeft: 20, marginBottom: 5 }}>
              pilih untuk lakukan aksi
            </Paper>
            <PanelOnboarding />
          </TabPanel>

          {/* Alamat */}
          <TabPanel value={this.state.value} index={1}>
            Alamat
          </TabPanel>

          {/* Struktur */}
          <TabPanel value={this.state.value} index={2}>
            Struktur
          </TabPanel>

          {/* Karyawan */}
          <TabPanel value={this.state.value} index={3}>
            Karyawan
          </TabPanel>

          {/* Admin */}
          <TabPanel value={this.state.value} index={4}>
            Admin
          </TabPanel>
        </SwipeableViews>
      </div>
    )
  }
}
