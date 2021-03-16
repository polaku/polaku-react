import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Paper, Tabs, Tab, Typography, Box, Divider, Button
} from '@material-ui/core';

import SwipeableViews from 'react-swipeable-views';

import PanelOnBoarding from '../../components/setting/panelOnBoarding';
import PanelAddress from '../../components/setting/panelAddress';
import PanelStructure from '../../components/setting/panelStructure';
import PanelEmployee from '../../components/setting/panelEmployee';
import PanelAdmin from '../../components/setting/panelAdmin';

const ModalOnBoarding = lazy(() => import('../../components/modal/modalOnBoarding'));

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

class SettingPerusahaan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.location.state ? this.props.location.state.index : 0,
      index: 0,
      openModalOnBoarding: false,
      label: []
    }
  }

  componentDidMount() {
    if (this.props.isAdminsuper || (this.props.admin && this.props.admin.length > 0) || this.props.isAdminAddress || this.props.isAdminStructure || this.props.isAdminEmployee || this.props.isAdminAdmin) {
      this.fetchLabel()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isAdminAddress !== prevProps.isAdminAddress || this.props.isAdminStructure !== prevProps.isAdminStructure || this.props.isAdminEmployee !== prevProps.isAdminEmployee || this.props.isAdminAdmin !== prevProps.isAdminAdmin || this.props.isAdminsuper !== prevProps.isAdminsuper || (this.props.admin !== prevProps.admin && this.props.admin.length > 0)) {
      this.fetchLabel()
    }
  }

  fetchLabel = () => {
    let label = []
    if (this.props.isAdminsuper) label.push('OnBoarding')
    if (this.props.isAdminAddress || this.props.isAdminsuper || this.props.isPIC) label.push('Alamat')
    if (this.props.isAdminStructure || this.props.isAdminsuper || this.props.isPIC) label.push('Struktur')
    if (this.props.isAdminEmployee || this.props.isAdminsuper || this.props.isPIC) label.push('Karyawan')
    if (this.props.isAdminAdmin || this.props.isAdminsuper || this.props.isPIC) label.push('Admin')
    this.setState({ label })
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

  changeTab = (index) => {
    this.setState({ value: index })
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
            {
              this.state.label.map((label, index) =>
                <Tab label={label} key={'label' + index} style={{ marginRight: 30 }} />
              )
            }
          </Tabs>
          <Divider />
        </Paper>
        <SwipeableViews
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          style={{ height: '100%' }}>

          {/* OnBoarding */}
          <TabPanel value={this.state.value} index={0}>
            {
              this.state.label[this.state.value] === 'OnBoarding'
                ? <>
                  <Paper style={{ padding: 10, paddingLeft: 20, marginBottom: 5 }}>
                    pilih untuk lakukan aksi
                    <Button variant="outlined" style={{ marginLeft: '10px' }} onClick={this.handleModalOnBoarding}>onboarding baru</Button>
                  </Paper>
                  <PanelOnBoarding index={this.state.value} changeTab={this.changeTab} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} indexTab={this.props.location.state ? this.props.location.state.indexTab : 0} />
                      : this.state.label[this.state.value] === 'Admin' && <PanelAdmin index={this.state.value} />
            }
          </TabPanel>

          <TabPanel value={this.state.value} index={1}>
            {
              this.state.label[this.state.value] === 'OnBoarding'
                ? <>
                  <Paper style={{ padding: 10, paddingLeft: 20, marginBottom: 5 }}>
                    pilih untuk lakukan aksi
                    <Button variant="outlined" style={{ marginLeft: '10px' }} onClick={this.handleModalOnBoarding}>onboarding baru</Button>
                  </Paper>
                  <PanelOnBoarding index={this.state.value} changeTab={this.changeTab} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} indexTab={this.props.location.state ? this.props.location.state.indexTab : 0} />
                      : this.state.label[this.state.value] === 'Admin' && <PanelAdmin index={this.state.value} />
            }
          </TabPanel>

          <TabPanel value={this.state.value} index={2}>
            {
              this.state.label[this.state.value] === 'OnBoarding'
                ? <>
                  <Paper style={{ padding: 10, paddingLeft: 20, marginBottom: 5 }}>
                    pilih untuk lakukan aksi
                    <Button variant="outlined" style={{ marginLeft: '10px' }} onClick={this.handleModalOnBoarding}>onboarding baru</Button>
                  </Paper>
                  <PanelOnBoarding index={this.state.value} changeTab={this.changeTab} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} indexTab={this.props.location.state ? this.props.location.state.indexTab : 0} />
                      : this.state.label[this.state.value] === 'Admin' && <PanelAdmin index={this.state.value} />
            }
          </TabPanel>
          <TabPanel value={this.state.value} index={3}>
            {
              this.state.label[this.state.value] === 'OnBoarding'
                ? <>
                  <Paper style={{ padding: 10, paddingLeft: 20, marginBottom: 5 }}>
                    pilih untuk lakukan aksi
                    <Button variant="outlined" style={{ marginLeft: '10px' }} onClick={this.handleModalOnBoarding}>onboarding baru</Button>
                  </Paper>
                  <PanelOnBoarding index={this.state.value} changeTab={this.changeTab} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} indexTab={this.props.location.state ? this.props.location.state.indexTab : 0} />
                      : this.state.label[this.state.value] === 'Admin' && <PanelAdmin index={this.state.value} />
            }
          </TabPanel>
          <TabPanel value={this.state.value} index={4}>
            {
              this.state.label[this.state.value] === 'OnBoarding'
                ? <>
                  <Paper style={{ padding: 10, paddingLeft: 20, marginBottom: 5 }}>
                    pilih untuk lakukan aksi
                    <Button variant="outlined" style={{ marginLeft: '10px' }} onClick={this.handleModalOnBoarding}>onboarding baru</Button>
                  </Paper>
                  <PanelOnBoarding index={this.state.value} changeTab={this.changeTab} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} indexTab={this.props.location.state ? this.props.location.state.indexTab : 0} />
                      : this.state.label[this.state.value] === 'Admin' && <PanelAdmin index={this.state.value} />
            }
          </TabPanel>
        </SwipeableViews>

        {
          this.state.openModalOnBoarding && <ModalOnBoarding status={this.state.openModalOnBoarding} close={this.handleModalOnBoarding} />
        }
      </div>
    )
  }
}

const mapStateToProps = ({ isAdminsuper, admin, isAdminAddress, isAdminStructure, isAdminEmployee, isAdminAdmin, isPIC }) => {
  return {
    isAdminsuper,
    admin,
    isAdminAddress,
    isAdminStructure,
    isAdminEmployee,
    isAdminAdmin,
    isPIC
  }
}

export default connect(mapStateToProps)(SettingPerusahaan)