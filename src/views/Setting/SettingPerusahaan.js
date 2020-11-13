import React, { Component } from 'react';
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

class SettingPerusahaan extends Component {
  state = {
    value: this.props.location.state ? this.props.location.state.index : 0,
    index: 0,
    openModalOnBoarding: false,
    label: []
  }

  componentDidMount() {
    // if (this.props.location.state) {
    //   this.setState({ value: this.props.location.state.index })
    // }
    if (this.props.designation) {
      this.fetchLabel()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.designation !== prevProps.designation || this.props.isAdminsuper !== prevProps.isAdminsuper) {
      this.fetchLabel()
    }
  }

  fetchLabel = () => {
    let label = []
    console.log("this.props.designation", this.props.designation)
    let checkAlamat = this.props.designation && this.props.designation.find(menu => menu.menu_id === 2)
    let checkStruktur = this.props.designation && this.props.designation.find(menu => menu.menu_id === 3)
    let checkKaryawn = this.props.designation && this.props.designation.find(menu => menu.menu_id === 4)
    let checkAdmin = this.props.designation && this.props.designation.find(menu => menu.menu_id === 5)

    if (this.props.isAdminsuper) label.push('OnBoarding')
    if (checkAlamat) label.push('Alamat')
    if (checkStruktur) label.push('Struktur')
    if (checkKaryawn) label.push('Karyawan')
    if (checkAdmin) label.push('Admin')
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
                  <PanelOnBoarding index={this.state.value} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} />
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
                  <PanelOnBoarding index={this.state.value} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} />
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
                  <PanelOnBoarding index={this.state.value} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} />
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
                  <PanelOnBoarding index={this.state.value} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} />
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
                  <PanelOnBoarding index={this.state.value} />
                </>
                : this.state.label[this.state.value] === 'Alamat' ? <PanelAddress index={this.state.value} />
                  : this.state.label[this.state.value] === 'Struktur' ? <PanelStructure index={this.state.value} />
                    : this.state.label[this.state.value] === 'Karyawan' ? <PanelEmployee index={this.state.value} />
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

const mapStateToProps = ({ designation, isAdminsuper }) => {
  return {
    designation,
    isAdminsuper
  }
}

export default connect(mapStateToProps)(SettingPerusahaan)