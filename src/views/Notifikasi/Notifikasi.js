import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { Grid, Paper, Tab, Tabs, Divider, Typography, Box, Button } from '@material-ui/core';
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
      {value === index && <Box pt={2} style={{ padding: 0 }}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default class notifikasi extends Component {
  state = {
    tabNotif: 0,
    category: 'HR'
  }

  render() {
    return (
      <Grid style={{ padding: 20 }}>
        <Grid style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 15px 10px 15px', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: 20 }}>Notifikasi</p>
        </Grid>
        <Paper style={{ paddingBottom: 5 }}>
          <Grid style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 20 }}>
            <Tabs
              value={this.state.tabNotif}
              indicatorColor="secondary"
              textColor="secondary"
              onChange={(event, newValue) => {
                this.setState({ tabNotif: newValue })
              }}
            >
              <Tab label="Polaku" style={{ color: '#d71149', maxWidth: 150 }} />
              <Tab label="Update" style={{ color: '#d71149', maxWidth: 150 }} />
            </Tabs>
            <img src={require('../../Assets/settings.png').default} loading="lazy" alt="address" width={25} maxHeight={25} style={{ alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/notifikasi/setting')} />
          </Grid>
          <Divider />

          <SwipeableViews
            index={this.state.tabNotif}
            onChangeIndex={index => this.setState({ tabNotif: index })}
            style={{ height: '100%' }}>

            {/* POLAKU */}
            <TabPanel value={this.state.tabNotif} index={0}>
              <Grid style={{ display: 'flex', alignItems: 'center', padding: 15 }}>
                <p style={{ margin: 0, marginRight: 15 }}>Kategori :</p>
                <Button variant={this.state.category === "HR" ? "contained" : "outlined"} color="secondary" style={{ marginRight: 10, height: 30 }} onClick={() => this.setState({ category: 'HR' })}>HR</Button>
                <Button variant={this.state.category === "KPI" ? "contained" : "outlined"} color="secondary" style={{ marginRight: 10, height: 30 }} onClick={() => this.setState({ category: 'KPI' })}>KPI</Button>
              </Grid>
              <Divider />

              <Grid style={{ maxHeight: 500, overflowX: 'auto' }}>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
              </Grid>
            </TabPanel>

            {/* POLAKU */}
            <TabPanel value={this.state.tabNotif} index={1}>
              <Grid style={{ display: 'flex', alignItems: 'center', padding: 15 }}>
                <p style={{ margin: 0, marginRight: 15 }}>Kategori :</p>
                <Button variant={this.state.category === "HR" ? "contained" : "outlined"} color="secondary" style={{ marginRight: 10, height: 30 }} onClick={() => this.setState({ category: 'HR' })}>HR</Button>
                <Button variant={this.state.category === "KPI" ? "contained" : "outlined"} color="secondary" style={{ marginRight: 10, height: 30 }} onClick={() => this.setState({ category: 'KPI' })}>KPI</Button>
              </Grid>
              <Divider />

              <Grid style={{ maxHeight: 500, overflowX: 'auto' }}>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
                <Grid>
                  <Grid onClick={() => this.props.history.push('/notifikasi/1')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, color: 'gray' }}>HR</p>
                      <p style={{ margin: 0, marginLeft: 5, color: 'gray', fontSize: 12 }}>kemarin</p>
                    </Grid>
                    <b style={{ fontSize: 15, margin: '5px 0px' }}>Cuti Bersama Lebaran</b>
                    <p style={{ margin: 0, fontSize: 13 }}>Dalam rangka lebaran dan idul fitri, PT Pola Inti Perkasa akan cuti Bersama mulai tanggal 13-14 Mei 2021.</p>
                  </Grid>
                  <Divider />
                </Grid>
              </Grid>
            </TabPanel>
          </SwipeableViews>
          <p style={{ margin: '10px', color: 'gray', cursor: 'pointer' }} onClick={() => this.props.history.push('/notifikasi/create')}>+ tambah notifikasi baru</p>
        </Paper>
      </Grid>
    )
  }
}