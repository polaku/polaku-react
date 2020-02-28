import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  Grid, Tabs, Tab, Divider, Box, Typography
} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';

import PanelSetting from '../../components/kpim/panelSetting';

import ModalRememberSendGrade from '../../components/modal/modalRememberSendGrade';

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

export default class SettingKPIM extends Component {
  state = {
    value: 0,
    banyakButuhTindakan: 0,
    openModalSendGrade: false
  }

  componentDidMount() {
    let numberWeekCurrent = this.getNumberOfWeek(new Date())
    let lastNumberWeekCurrent = this.getNumberOfWeek(new Date(new Date().getFullYear() + new Date().getMonth() + 1, 0))

    if (numberWeekCurrent === lastNumberWeekCurrent) {
      this.setState({
        openModalSendGrade: true
      })
    }
  }

  handleChangeTabs = (event, newValue) => {
    this.setState({ value: newValue })
  };

  setBanyakButuhTindakan = args => {
    this.setState({
      banyakButuhTindakan: args
    })
  }

  closeModalSendGrade = () => {
    this.setState({
      openModalSendGrade: false
    })
  }

  getNumberOfWeek = date => {
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
          <Tab label={this.state.banyakButuhTindakan === 0 ? "Butuh tindakan" : `Butuh tindakan (${this.state.banyakButuhTindakan})`} style={{ marginRight: 30 }} />
          {/* <Tab label="Ditugaskan" style={{ marginRight: 30 }} /> */}
        </Tabs>
        <Divider />

        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          style={{ height: '100%' }}>

          {/* SEMUA */}
          <TabPanel value={this.state.value} index={0} style={{ height: '85vh' }}>
            <PanelSetting status="all" />

          </TabPanel>

          {/* BUTUH TINDAKAN */}
          <TabPanel value={this.state.value} index={1} style={{ height: '85vh', width: '98%' }}>
            <PanelSetting setBanyakButuhTindakan={this.setBanyakButuhTindakan} />

          </TabPanel>

        </SwipeableViews>
        {
          this.state.openModalSendGrade && <ModalRememberSendGrade status={this.state.openModalSendGrade} closeModalSendGrade={this.closeModalSendGrade} />
        }
      </Grid>
    )
  }
}

