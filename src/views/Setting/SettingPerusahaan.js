import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  Paper, Tabs, Tab, Typography, Box, Divider, Button
} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';

import PanelOnBoarding from '../../components/setting/panelOnBoarding';
import PanelAddress from '../../components/setting/panelAddress';
import PanelStructure from '../../components/setting/panelStructure';
import PanelEmployee from '../../components/setting/panelEmployee';

import ModalOnBoarding from '../../components/modal/modalOnBoarding';

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
    // labelTab: ['OnBoarding', 'Alamat', 'Struktur', 'Karyawan', 'Admin'],
    labelTab: ['OnBoarding', 'Alamat', 'Struktur'],
    value: this.props.location.state ? this.props.location.state.index : 0,
    index: 0,
    openModalOnBoarding: false,
  }

  componentDidMount() {
    // if (this.props.location.state) {
    //   this.setState({ value: this.props.location.state.index })
    // }
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue })
  };

  handleChangeIndex = index => {
    this.setState({ index: index })
  };

  handleModalOnBoarding = () => {
    this.setState({ openModalOnBoarding: !this.state.openModalOnBoarding })
  }

  render() {
    return (
      <div>
        <Paper square style={{ padding: 10, paddingLeft: 20 }}>
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
            {/* <Tab label="Admin" style={{ marginRight: 30 }} /> */}
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
              <Button variant="outlined" style={{ marginLeft: '10px' }} onClick={this.handleModalOnBoarding}>onboarding baru</Button>
            </Paper>
            <PanelOnBoarding />
          </TabPanel>

          {/* Alamat */}
          <TabPanel value={this.state.value} index={1}>
            <PanelAddress />
          </TabPanel>

          {/* Struktur */}
          <TabPanel value={this.state.value} index={2}>
            <PanelStructure />
          </TabPanel>

          {/* Karyawan */}
          <TabPanel value={this.state.value} index={3}>
            <PanelEmployee />
          </TabPanel>

          {/* Admin */}
          <TabPanel value={this.state.value} index={4}>
            Admin
          </TabPanel>
        </SwipeableViews>

        {
          this.state.openModalOnBoarding && <ModalOnBoarding status={this.state.openModalOnBoarding} close={this.handleModalOnBoarding} />
        }
      </div>
    )
  }
}
