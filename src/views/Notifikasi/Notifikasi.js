import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { Grid, Paper, Tab, Tabs, Divider, Typography, Box, Button, CircularProgress } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import TimeAgo from "react-timeago";

import swal from 'sweetalert';
import { API, BaseURL } from '../../config/API';

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

class notifikasi extends Component {
  state = {
    tabNotif: 0,
    category: null,
    categoryNotifikasi: [],
    limit: 2,
    page: 0,
    data: [],
    canLoadMore: false
  }

  async componentDidMount() {
    await this.fetchNotificationCategory()
    // await this.fetchDataNotification()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.category !== prevState.category || this.state.tabNotif !== prevState.tabNotif) {
      await this.setState({ page: 0, data: [] })
      await this.fetchDataNotification()
    }
  }


  fetchNotificationCategory = async () => {
    try {
      let token = Cookies.get('POLAGROUP')
      let { data } = await API.get(`/notification/category`, { headers: { token } })

      this.setState({ categoryNotifikasi: data.data, category: data.data[0].id || null })
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      }
    }
  }

  fetchDataNotification = async () => {
    try {
      let token = Cookies.get('POLAGROUP'), query = [`page=${this.state.page}&limit=${this.state.limit}`]

      if (this.state.tabNotif === 0) {
        query.push(`is-notif-polaku=1`)
        if (this.state.category !== null) query.push(`category-notification=${this.state.category}`)
      }
      else query.push(`is-notif-polaku=0`)

      query.length > 0 ? query = query.join('&') : query = ''

      let { data } = await API.get(`/notification?${query}`, { headers: { token } })

      if (data.data.length > 0) {
        this.setState({ data: [...this.state.data, ...data.data], canLoadMore: true })
      } else {
        this.setState({ canLoadMore: false })
      }
    } catch (err) {
      // console.log(err)
    }
  }

  _loadMore = async () => {
    await this.setState({ page: this.state.page + 1, prosesLoadMore: true })
    await this.fetchDataNotification()
    await this.setState({ prosesLoadMore: false })
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
            {
              (this.props.isAdminNotification || this.props.isAdminsuper) &&
              <img src={require('../../Assets/settings.png').default} loading="lazy" alt="address" width={25} maxHeight={25} style={{ alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/notifikasi/setting')} />
            }
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
                {
                  this.state.categoryNotifikasi.map((category, index) =>
                    <Button variant={this.state.category === category.id ? "contained" : "outlined"} color="secondary" style={{ marginRight: 10, height: 30 }} onClick={() => this.setState({ category: category.id })}>{category.name}</Button>
                  )
                }
              </Grid>
              <Divider />

              <Grid style={{ maxHeight: 500, overflowX: 'auto' }}>
                {
                  this.state.data.length > 0 &&
                  this.state.data.map(notif =>
                    <>
                      <Grid style={{
                        padding: '10px 15px',
                        backgroundColor: !notif.read
                          ? "#ffebeb"
                          : "white",
                        cursor: 'pointer'
                      }}>
                        <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <p style={{ margin: 0, marginRight: 5 }}>{notif.tbl_notification_category ? notif.tbl_notification_category.name : (notif.title || notif.value)}</p>
                          {
                            notif.tbl_notification_category && notif.tbl_notification_category.icon
                              ? <img
                                src={`${BaseURL}/${notif.tbl_notification_category.icon}`}
                                alt="Logo"
                                width={10}
                                height={10}
                                style={{ marginBottom: 5, marginRight: 5 }}
                              />
                              : null
                          }
                          <TimeAgo
                            date={notif.created_at}
                            style={{ fontSize: 12, color: 'gray' }}
                          />
                        </Grid>
                        <b style={{ fontSize: 15, margin: '5px 0px' }}>{notif.title || notif.value}</b>
                        {/* <p style={{ margin: 0, fontSize: 13 }}>{notif.description.replace(/<[^>]*>?/gm, '').replace('&nbsp;', '')}</p> */}
                        <Grid dangerouslySetInnerHTML={{ __html: notif.description }} style={{ fontSize: 13 }} />
                      </Grid>
                      <Divider />
                    </>
                  )
                }
                <Grid style={{ textAlign: 'center', margin: 20 }}>
                  {
                    this.state.prosesLoadMore
                      ? <CircularProgress />
                      : this.state.canLoadMore && <Button variant="contained" color="secondary" onClick={this._loadMore} >Load More</Button>
                  }
                </Grid>
              </Grid>
            </TabPanel>

            {/* UPDATED */}
            <TabPanel value={this.state.tabNotif} index={1}>
              <Grid style={{ maxHeight: 500, overflowX: 'auto' }}>
                {
                  this.state.data.length > 0 &&
                  this.state.data.map(notif =>
                    <>
                      <Grid style={{
                        padding: '10px 15px',
                        backgroundColor: !notif.read
                          ? "#ffebeb"
                          : "white",
                        cursor: 'pointer'
                      }}>
                        <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <p style={{ margin: 0, marginRight: 5 }}>{notif.tbl_notification_category ? notif.tbl_notification_category.name : (notif.title || notif.value)}</p>
                          <TimeAgo
                            date={notif.created_at}
                            style={{ fontSize: 12, color: 'gray' }}
                          />
                        </Grid>
                        <b style={{ fontSize: 15, margin: '5px 0px' }}>{notif.title || notif.value}</b>
                        {/* <p style={{ margin: 0,  }}>{notif.description.replace(/<[^>]*>?/gm, '').replace('&nbsp;', '')}</p> */}
                        <Grid dangerouslySetInnerHTML={{ __html: notif.description }} style={{ fontSize: 13 }} />
                      </Grid>
                      <Divider />
                    </>
                  )
                }
                <Grid style={{ textAlign: 'center', margin: 20 }}>
                  {
                    this.state.prosesLoadMore
                      ? <CircularProgress />
                      : this.state.canLoadMore && <Button variant="contained" color="secondary" onClick={this._loadMore} >Load More</Button>
                  }
                </Grid>
              </Grid>
            </TabPanel>
          </SwipeableViews>
          {
            (this.props.isAdminNotification || this.props.isAdminsuper) &&
            <p style={{ margin: '10px', color: 'gray', cursor: 'pointer' }} onClick={() => this.props.history.push('/notifikasi/create')}>+ tambah notifikasi baru</p>
          }
        </Paper>
      </Grid>
    )
  }
}

const mapStateToProps = ({ isAdminNotification, isAdminsuper }) => {
  return {
    isAdminNotification,
    isAdminsuper
  }
}
export default connect(mapStateToProps)(notifikasi)