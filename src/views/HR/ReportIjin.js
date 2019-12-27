import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  Paper, Tabs, Tab, Typography, Box, Divider, Grid
} from '@material-ui/core';

import MenuItem from '@material-ui/core/MenuItem';
import SelectOption from '@material-ui/core/Select';

import SwipeableViews from 'react-swipeable-views';

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

export default class ReportIjin extends Component {
  state = {
    month: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    monthSelected: 0,
    value: 0,
    index: 0
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue })
  };

  handleChangeIndex = index => {
    this.setState({ index: index })
  };

  handleChangeTabs = name => event => {
    this.setState({ [name]: event.target.value });
    
  };

  render() {
    return (
      <div style={{ padding: '10px 40px' }}>
        <p style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>Report</p>
        <p style={{ margin: 0 }}>eksport report</p>

        <Paper square style={{ padding: '10px 20px 20px 20px', margin: '10px 0px' }}>
          <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tabs
              value={this.state.value}
              indicatorColor="secondary"
              textColor="secondary"
              onChange={this.handleChangeTabs('monthSelected')}

            >
              <Tab label="Semua" style={{ marginRight: 30 }} />
              <Tab label="PIP" style={{ marginRight: 30 }} />
              <Tab label="BPW" style={{ marginRight: 30 }} />
            </Tabs>
            <Grid style={{ display: 'flex', alignItems: 'center' }}>
              <SelectOption
                value={this.state.jenisIjin}
                disabled={this.state.proses}
              >
                {
                  this.state.month.map((el, index) =>
                    <MenuItem value={index}>{el}</MenuItem>
                  )
                }
              </SelectOption>
            </Grid>
          </Grid>

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
