import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { Grid, Paper, Tab, Tabs, Divider, Typography, Box, FormControlLabel, Checkbox, TextField, Button } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';

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

export default class SettingNotifikasi extends Component {
  state = {
    tabNotif: 1,
    notifikasi: [
      {
        title: 'HR',
        notifikasi: false,
        emailKantor: false,
        emailPribadi: false,
      }
    ],
    settingNotifikasi: [
      // {
      //   name: 'HR',
      //   icon: '',
      //   iconPath: null,
      //   isEdit: true,
      //   admin: [
      //     {
      //       name: 'Jansen',
      //       isEdit: false
      //       canDelete: true,
      //       canEdit: true,
      //       canCreate: true
      //     }
      //   ]
      // },

      // {
      //   name: '',
      //   icon: '',
      //   iconPath: null,
      //   isEdit: false,
      //   admin: []
      // }
    ]
  }

  componentDidMount() {
    this.fetchSettingNotification()
  }

  fetchSettingNotification = async () => {
    try {
      let token = Cookies.get('POLAGROUP')

      let { data } = await API.get('/notification/category', { headers: { token } })
      console.log(data.data)
      this.setState({ settingNotifikasi: data.data })
    } catch (err) {
      swal('please try again', '', 'error')
    }
  }

  handleChange = (index, name, indexAdmin) => event => {
    let newData = this.state.settingNotifikasi
    newData[index][name] = event.target.value
    this.setState({ settingNotifikasi: newData })
  }

  handleSelectFileIcon = async (index, e) => {
    let newData = this.state.settingNotifikasi
    newData[index].icon = e.target.files[0]
    newData[index].iconPath = URL.createObjectURL(e.target.files[0])
    await this.setState({ settingNotifikasi: newData })
    console.log('asdddd')
    this.saveSettingNotifikasi(index)
  }

  handleChangeChecked = (index) => {

  }

  handleAddSettingNotifikasi = () => {
    let newData = this.state.settingNotifikasi

    newData.push({
      name: '',
      icon: '',
      iconPath: null,
      isEdit: false,
      admin: []
    })

    this.setState({ settingNotifikasi: newData })
  }

  handleDeleteSettingNotifikasi = (index) => {
    swal({
      title: "Apa anda yakin ingin menghapus pengaturan notifikasi ini?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (yesAnswer) => {
        if (yesAnswer) {
          let newData = this.state.settingNotifikasi
          newData.splice(index, 1)
          this.setState({ settingNotifikasi: newData })
        }
      });
  }

  handleEditSettingNotifikasi = (index) => {
    let newData = this.state.settingNotifikasi
    newData[index].isEdit = true
    this.setState({ settingNotifikasi: newData })
  }

  submitSettingNotifikasi = index => async (event) => {
    event.preventDefault()

    let newData = this.state.settingNotifikasi
    newData[index].isEdit = false
    await this.setState({ settingNotifikasi: newData })

    this.saveSettingNotifikasi(index)
  }

  saveSettingNotifikasi = async (index) => {
    console.log('masuk')
    try {
      let token = Cookies.get('POLAGROUP')
      let formData = new FormData()

      if (this.state.settingNotifikasi[index].name) formData.append('name', this.state.settingNotifikasi[index].name)
      if (this.state.settingNotifikasi[index].iconPath) formData.append('icon', this.state.settingNotifikasi[index].icon)

      if (this.state.settingNotifikasi[index].id) {
        await API.put(`/notification/category/${this.state.settingNotifikasi[index].id}`, formData, { headers: { token } })
      } else {
        await API.post('/notification/category', formData, { headers: { token } })
        swal('Tambah kategori notifikasi berhasil', '', 'success')
      }
      this.fetchSettingNotification()
    } catch (err) {
      swal('Error', '', 'error')
    }
  }

  handleAddAdminNotifikasi = (indexNotif) => {
    let newData = this.state.settingNotifikasi

    newData[indexNotif].admin.push({
      name: '',
      isEdit: false,
      canDelete: false,
      canEdit: false,
      canCreate: false
    })

    this.setState({ settingNotifikasi: newData })
  }

  handleDeleteSettingNotifikasi = (index) => {
    swal({
      title: "Apa anda yakin ingin menghapus pengaturan notifikasi ini?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (yesAnswer) => {
        if (yesAnswer) {
          let token = Cookies.get('POLAGROUP'), newData = this.state.settingNotifikasi

          if (this.state.settingNotifikasi[index].id) await API.delete(`/notification/category/${this.state.settingNotifikasi[index].id}`, { headers: { token } })

          newData.splice(index, 1)
          this.setState({ settingNotifikasi: newData })

          this.fetchSettingNotification()
        }
      });
  }

  saveAdminNotifikasi = (index, indexAdmin) => async (event) => {
    event.preventDefault()

    let newData = this.state.settingNotifikasi
    newData[index].admin[indexAdmin].isEdit = false
    this.setState({ settingNotifikasi: newData })

    if (newData[index].admin[indexAdmin].id) {

    } else {

    }
  }



  render() {
    function fetchStatus(admin) {
      let status = ''

      if (admin.canCreate) {
        status += 'Create'
      }
      if (admin.canEdit) {
        status === '' ? status += 'Edit' : status += ', Edit'
      }
      if (admin.canDelete) {
        status === '' ? status += 'Delete' : status += ', Delete'
      }

      return status
    }

    return (
      <>
        <Paper style={{ paddingBottom: 5, marginBottom: 20 }}>
          <Grid style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 20 }}>
            <Tabs
              value={this.state.tabNotif}
              indicatorColor="secondary"
              textColor="secondary"
              onChange={(event, newValue) => {
                this.setState({ tabNotif: newValue })
              }}
            >
              <Tab label="Biodata diri" style={{ color: '#d71149', maxWidth: 150 }} />
              <Tab label="Notifikasi" style={{ color: '#d71149', maxWidth: 150 }} />
            </Tabs>
          </Grid>
          <Divider />

          <SwipeableViews
            index={this.state.tabNotif}
            onChangeIndex={index => this.setState({ tabNotif: index })}
            style={{ height: '100%' }}>

            {/* BIODATA */}
            <TabPanel value={this.state.tabNotif} index={0} style={{ padding: '10px 20px' }}>
            </TabPanel>

            {/* NOTIFIKASI */}
            <TabPanel value={this.state.tabNotif} index={1} style={{ padding: '10px 20px' }}>
              <p style={{ fontSize: 13, margin: 0 }}>Atur notifikasi yang kamu terima disini</p>

              <Grid id="header-top" style={{ display: 'flex', backgroundColor: '#f8f8f8', padding: 10 }}>
                <Grid style={{ width: '61%', fontSize: 15 }}>Polaku</Grid>
                <Grid style={{ width: '13%', fontSize: 15, textAlign: 'center' }}>Notifikasi</Grid>
                <Grid style={{ width: '13%', fontSize: 15, textAlign: 'center' }}>Email kantor</Grid>
                <Grid style={{ width: '13%', fontSize: 15, textAlign: 'center' }}>Email  pribadi</Grid>
              </Grid>

              {
                this.state.notifikasi.map((element, index) =>
                  <Grid>
                    <Grid style={{ padding: 5 }}>
                      <b>{element.title}</b>
                    </Grid>
                    <Divider />
                    <Grid style={{ display: 'flex', padding: 5 }}>
                      <Grid style={{ width: '61%', fontSize: 14, display: 'flex', alignItems: 'center' }}>Disetujui ijin</Grid>
                      <Grid style={{ width: '13%', display: 'flex', justifyContent: 'center' }}><FormControlLabel style={{ margin: 0 }} control={<Checkbox checked={element.notifikasi} onChange={this.handleChangeChecked(index, 'notifikasi')} value={element.company_id} />}
                      /></Grid>
                      <Grid style={{ width: '13%', display: 'flex', justifyContent: 'center' }}><FormControlLabel style={{ margin: 0 }} control={<Checkbox checked={element.emailKantor} onChange={this.handleChangeChecked(index, 'emailKantor')} value={element.company_id} />}
                      /></Grid>
                      <Grid style={{ width: '13%', display: 'flex', justifyContent: 'center' }}><FormControlLabel style={{ margin: 0 }} control={<Checkbox checked={element.emailPribadi} onChange={this.handleChangeChecked(index, 'emailPribadi')} value={element.company_id} />}
                      /></Grid>
                    </Grid>
                  </Grid>
                )
              }

            </TabPanel>
          </SwipeableViews>
        </Paper>

        {
          this.state.tabNotif === 1 && <>
            {
              this.state.settingNotifikasi.map((element, index) =>
                <Paper style={{ padding: 20, marginBottom: 20 }}>
                  <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: 20 }}>Pengaturan Notifikasi</p>
                    {
                      this.state.settingNotifikasi.length > 1 && <img src={require('../../Assets/remove.png').default} loading="lazy" alt={`remove${index}`} width={25} height={25} style={{ alignSelf: 'center', marginLeft: 10, cursor: 'pointer' }} onClick={() => this.handleDeleteSettingNotifikasi(index)} />
                    }
                  </Grid>

                  <Grid style={{ display: 'flex', margin: '5px 0px 10px' }}>
                    <Grid style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ margin: 0, marginRight: 5 }}>Nama: </p>
                      {
                        element.isEdit || !element.name
                          ? <form onSubmit={this.submitSettingNotifikasi(index)}>
                            <TextField
                              id="name"
                              value={element.name}
                              onChange={this.handleChange(index, 'name')}
                              variant="outlined"
                              inputProps={{
                                style: {
                                  padding: '8px 10px',
                                  fontSize: 14
                                }
                              }}
                              disabled={this.state.proses}
                            />
                          </form>
                          : <>
                            <p style={{ margin: 0 }}>{element.name}</p>
                            <img src={require('../../Assets/edit-gray.png').default} loading="lazy" alt={`edit ${index}`} width={15} maxHeight={15} style={{ alignSelf: 'center', marginLeft: 5, cursor: 'pointer' }} onClick={() => this.handleEditSettingNotifikasi(index)} />
                          </>
                      }

                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', marginLeft: 50 }}>
                      <p style={{ margin: 0, marginRight: 5 }}>Icon: </p>
                      {
                        element.isEdit || !element.icon
                          ? <Button
                            variant="contained"
                            component="label"
                            style={{ height: 30 }}
                          >
                            Select File
                            <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => this.handleSelectFileIcon(index, e)}
                            />
                          </Button>
                          : <>
                            <img src={element.iconPath || `${BaseURL}/${element.icon}`} loading="lazy" alt={`edit ${index}`} width={15} maxHeight={15} style={{ alignSelf: 'center', marginLeft: 5 }} />
                            <img src={require('../../Assets/edit-gray.png').default} loading="lazy" alt={`edit ${index}`} width={15} maxHeight={15} style={{ alignSelf: 'center', marginLeft: 5, cursor: 'pointer' }} onClick={() => this.handleEditSettingNotifikasi(index)} />
                          </>
                      }
                    </Grid>
                  </Grid>

                  <Grid style={{ display: 'flex', width: '100%', borderBottom: '1px solid black', paddingBottom: 5 }}>
                    <Grid style={{ width: '40%' }}>Nama admin karyawan</Grid>
                    <Grid style={{ width: '40%' }}>Status</Grid>
                    <Grid style={{ width: '20%', textAlign: 'center' }}>Aksi</Grid>
                  </Grid>

                  {
                    element.admin && element.admin.map((admin, indexAdmin) =>
                      <Grid style={{ display: 'flex', width: '100%', padding: '5px 0px', alignItems: 'center' }} key={'admin' + index}>
                        <Grid style={{ width: '40%' }}>
                          {
                            admin.isEdit || !admin.name
                              ? <form onSubmit={this.saveAdminNotifikasi(index, indexAdmin)}>
                                <TextField
                                  id="name"
                                  value={admin.name}
                                  onChange={this.handleChange(index, 'name', indexAdmin)}
                                  variant="outlined"
                                  inputProps={{
                                    style: {
                                      padding: '8px 10px',
                                      fontSize: 14
                                    }
                                  }}
                                  disabled={this.state.proses}
                                />
                              </form>
                              : <p style={{ margin: 0 }}>{admin.name}</p>
                          }</Grid>
                        <Grid style={{ width: '40%' }}>{fetchStatus(admin)}</Grid>
                        {
                          admin.isEdit && <Grid style={{ width: '20%', textAlign: 'center' }}>
                            <img src={require('../../Assets/edit-gray.png').default} loading="lazy" alt={`edit ${index}`} width={15} maxHeight={15} style={{ alignSelf: 'center', marginRight: 20, cursor: 'pointer' }} />
                            <img src={require('../../Assets/delete-gray.png').default} loading="lazy" alt={`delete ${index}`} width={15} maxHeight={15} style={{ alignSelf: 'center', cursor: 'pointer' }} />
                          </Grid>
                        }

                      </Grid>
                    )
                  }

                  <p style={{ margin: '10px', color: 'gray', cursor: 'pointer' }} onClick={() => this.handleAddAdminNotifikasi(index)}>+ admin baru</p>

                </Paper>

              )
            }
            <p style={{ margin: '10px', color: 'gray', cursor: 'pointer' }} onClick={this.handleAddSettingNotifikasi}>+ pengaturan notifikasi baru</p>
          </>
        }
      </>
    )
  }
}
