import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import {
  Grid, Paper, Typography, Box, FormControlLabel, Checkbox, TextField, Button, FormControl, Select, MenuItem,
  // Tab, Tabs, Divider
} from '@material-ui/core';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
// import SwipeableViews from 'react-swipeable-views';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import swal from 'sweetalert';
import Loading from '../../components/Loading';

import { API, BaseURL } from '../../config/API';
import { fetchDataCompanies } from '../../store/action';

const animatedComponents = makeAnimated();

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

class SettingNotifikasi extends Component {
  state = {
    proses: true,
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
    ],
    optionEmployee: [],
    optionCompany: []
  }

  async componentDidMount() {
    this.setState({ proses: true })
    await this.props.fetchDataCompanies()
    await this.fetchDataUsers()
    await this.fetchOptionCompany()
    this.fetchSettingNotification()
    this.setState({ proses: false })
  }

  // FETCHING
  fetchOptionCompany = async () => {
    let optionCompany = [], idCompany = []

    // console.log(this.props.dataCompanies)
    if (this.props.isAdminsuper) {
      optionCompany = this.props.dataCompanies
    } else {
      await this.props.admin.forEach(el => {
        if (idCompany.indexOf(el.company_id) === -1) {
          let check = this.props.dataCompanies.find(element => el.company_id === element.company_id)
          if (check) {
            idCompany.push(el.company_id)
            optionCompany.push(check)
          }
        }
      })
    }

    this.setState({ optionCompany })
  }

  fetchDataUsers = async () => {
    try {
      let token = Cookies.get('POLAGROUP')

      let getData = await API.get(`/users/for-option`, { headers: { token } })

      let listUser = []
      await getData.data.data.forEach(user => {
        listUser.push({ value: user.user_id, label: user.tbl_account_detail.fullname, nik: user.tbl_account_detail.nik })
      })

      this.setState({ optionEmployee: listUser })
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      }
    }
  }

  fetchSettingNotification = async () => {
    try {
      let token = Cookies.get('POLAGROUP'), datas = []
      let { data } = await API.get('/notification/category/setting', { headers: { token } })

      if (this.props.isAdminsuper) {
        datas = data.data
      } else {
        data.data.forEach(el => {
          let check = el.admin.find(element => element.user_id === this.props.userId)
          if (check) datas.push(el)
        })
      }

      this.setState({ settingNotifikasi: datas })
    } catch (err) {
      swal('please try again', '', 'error')
    }
  }



  // HANDLE CHANGE
  handleChange = (index, name) => event => {
    let newData = this.state.settingNotifikasi
    newData[index][name] = event.target.value
    this.setState({ settingNotifikasi: newData })
  }

  handleChangeAdmin = (index, name, indexAdmin) => event => {
    let newData = this.state.settingNotifikasi
    newData[index].admin[indexAdmin][name] = event.target.value
    this.setState({ settingNotifikasi: newData })
  }

  handleSelectFileIcon = async (index, e) => {
    let newData = this.state.settingNotifikasi
    newData[index].icon = e.target.files[0]
    newData[index].iconPath = URL.createObjectURL(e.target.files[0])
    await this.setState({ settingNotifikasi: newData })

    this.saveSettingNotifikasi(index)
  }

  handleChangeChecked = (indexNotif, indexAdmin) => event => {
    let newData = this.state.settingNotifikasi

    if (indexAdmin !== undefined) {
      newData[indexNotif].admin[indexAdmin][event.target.name] = event.target.checked
    } else {
      newData[indexNotif][event.target.name] = event.target.checked
    }
    this.setState({ settingNotifikasi: newData })
  }

  // SELECT EMPLOYEE
  handleChangeSelect = (index, newValue, indexAdmin, actionMeta) => {
    let newData
    if (indexAdmin !== undefined) {
      if (newValue) {
        newData = this.state.settingNotifikasi
        newData[index].admin[indexAdmin].newAdminSelected = newValue
      } else {
        newData = this.state.settingNotifikasi
        newData[index].admin[indexAdmin].newAdminSelected = null
      }
    } else {
      if (newValue) {
        newData = this.state.settingNotifikasi
        newData[index].newAdminName = newValue
      } else {
        newData = this.state.settingNotifikasi
        newData[index].newAdminName = null
      }
    }

    this.setState({
      settingNotifikasi: newData
    })
  };



  // SETTING NOTIFIKASI
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
          let token = Cookies.get('POLAGROUP'), newData = this.state.settingNotifikasi

          if (this.state.settingNotifikasi[index].id) await API.delete(`/notification/category/${this.state.settingNotifikasi[index].id}`, { headers: { token } })

          newData.splice(index, 1)
          this.setState({ settingNotifikasi: newData })

          this.fetchSettingNotification()
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



  // ADMIN NOTIFIKASI
  handleAddAdminNotifikasi = (indexNotif) => {
    let newData = this.state.settingNotifikasi

    newData[indexNotif].addNewAdmin = true

    newData[indexNotif].newAdminName = ''
    newData[indexNotif].newAdminCanDelete = false
    newData[indexNotif].newAdminCanEdit = false
    newData[indexNotif].newAdminCanCreate = false
    newData[indexNotif].newAdminCompanyId = ''

    this.setState({ settingNotifikasi: newData })
  }

  handleCancelAddAmin = (indexNotif, indexAdmin) => {
    let newData = this.state.settingNotifikasi

    if (indexAdmin !== undefined) {
      newData[indexNotif].admin[indexAdmin].isEdit = false
    } else {
      newData[indexNotif].addNewAdmin = false
    }

    this.setState({ settingNotifikasi: newData })
  }

  saveAdminNotifikasi = (index, indexAdmin) => async (event) => {
    if (event) event.preventDefault()

    let newData = this.state.settingNotifikasi
    if (newData[index].newAdminName.value && newData[index].newAdminCompanyId) {
      if (indexAdmin !== undefined) {  //Edit
        newData[index].admin[indexAdmin].isEdit = false
        newData[index].admin[indexAdmin].fullname = newData[index].admin[indexAdmin].newAdminSelected.label
        newData[index].admin[indexAdmin].user_id = newData[index].admin[indexAdmin].newAdminSelected.value

        let newAdmin = {
          admin_companies_id: newData[index].admin[indexAdmin].admin_companies_id,
          userId: newData[index].admin[indexAdmin].newAdminSelected.value,
          companyId: newData[index].admin[indexAdmin].company_id,
          role: {
            created: newData[index].admin[indexAdmin].created,
            edited: newData[index].admin[indexAdmin].edited,
            deleted: newData[index].admin[indexAdmin].deleted,
          }
        }

        let token = Cookies.get('POLAGROUP')
        await API.put(`/designation/role/${newData[index].admin[indexAdmin].user_role_id}`, newAdmin, {
          headers: {
            token,
            ip: this.props.ip
          }
        })
        swal('Ubah data admin berhasil', '', 'success')

      } else {
        let admin = {
          fullname: newData[index].newAdminName.label,
          user_id: newData[index].newAdminName.value,
          company: this.state.optionCompany.find(el => el.company_id === newData[index].newAdminCompanyId),
          created: newData[index].newAdminCanCreate,
          edited: newData[index].newAdminCanEdit,
          deleted: newData[index].newAdminCanDelete,
        }

        newData[index].admin.push(admin)
        newData[index].addNewAdmin = false

        let newAdmin = {
          name: `Notifikasi ${newData[index].name}`,
          userId: newData[index].newAdminName.value,
          companyId: newData[index].newAdminCompanyId,
          notification_category_id: newData[index].id,
          roles: [
            {
              menuId: 10,
              view: 1,
              created: newData[index].newAdminCanCreate,
              edited: newData[index].newAdminCanEdit,
              deleted: newData[index].newAdminCanDelete,
              download: 1
            }
          ]
        }

        let token = Cookies.get('POLAGROUP')
        await API.post('/designation', newAdmin, {
          headers: {
            token,
            ip: this.props.ip
          }
        })
        swal('Tambah admin berhasil', '', 'success')

      }
    } else {
      swal('Data tidak lengkap', '', 'warning')
    }
    this.setState({ settingNotifikasi: newData })

  }

  handleEditAdmin = (index, indexAdmin) => {
    let newData = this.state.settingNotifikasi
    newData[index].admin[indexAdmin].isEdit = true
    newData[index].admin[indexAdmin].newAdminSelected = this.state.optionEmployee.find(el => el.value === newData[index].admin[indexAdmin].user_id)
    this.setState({ settingNotifikasi: newData })
  }



  render() {
    function fetchStatus(admin) {
      let status = ''

      if (admin.created) {
        status += 'Create'
      }
      if (admin.edited) {
        status === '' ? status += 'Edit' : status += ', Edit'
      }
      if (admin.deleted) {
        status === '' ? status += 'Delete' : status += ', Delete'
      }

      return status
    }

    return (
      <>
        {
          this.state.proses && <Loading loading={this.state.proses} />
        }
        {/* <Paper style={{ paddingBottom: 5, marginBottom: 20 }}>
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
        {/* <TabPanel value={this.state.tabNotif} index={0} style={{ padding: '10px 20px' }}>
            </TabPanel>

            {/* NOTIFIKASI */}
        {/* <TabPanel value={this.state.tabNotif} index={1} style={{ padding: '10px 20px' }}>
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
        </Paper> */}

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
                        element.isEdit
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

                  {/* LIST ADMIN */}
                  {
                    element.admin && element.admin.map((admin, indexAdmin) =>
                      admin.isEdit
                        ? <Grid style={{ display: 'flex', width: '100%', padding: '5px 0px', alignItems: 'center' }} key={'admin' + index}>
                          <Grid style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 }}>
                            <Grid style={{ width: '50%' }}>
                              <ReactSelect
                                value={admin.newAdminSelected}
                                components={animatedComponents}
                                options={this.state.optionEmployee}
                                onChange={value => this.handleChangeSelect(index, value, indexAdmin)}
                                getOptionLabel={(option) => `${option.nik} - ${option.label}`}
                                isDisabled={this.state.proses || this.state.disabledUser}
                              />
                            </Grid>
                            <FormControl variant="outlined" style={{ width: '40%', height: 38, }} size="small">
                              <Select
                                placeholder="perusahaan"
                                value={admin.company_id}
                                onChange={this.handleChangeAdmin(index, 'company_id', indexAdmin)}
                                disabled={this.state.proses}
                              >
                                {
                                  this.state.optionCompany.map((company, index) =>
                                    <MenuItem value={company.company_id} key={"company" + index}>{company.company_name}</MenuItem>
                                  )
                                }
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid style={{ width: '40%' }}>
                            <FormControlLabel style={{ margin: 0 }} control={<Checkbox checked={admin.created} onChange={this.handleChangeChecked(index, indexAdmin)} value={admin.created} name="created" />} label="Create"
                            />
                            <FormControlLabel style={{ margin: 0 }} control={<Checkbox checked={admin.edited} onChange={this.handleChangeChecked(index, indexAdmin)} value={admin.edited} name="edited" />} label="Edit"
                            />
                            <FormControlLabel style={{ margin: 0 }} control={<Checkbox checked={admin.deleted} onChange={this.handleChangeChecked(index, indexAdmin)} value={admin.deleted} name="deleted" />} label="Delete"
                            />
                          </Grid>

                          <Grid style={{ width: '20%', textAlign: 'center' }}>
                            <SaveIcon style={{ color: 'green', width: 30, height: 30, cursor: 'pointer', marginRight: 20 }} onClick={this.saveAdminNotifikasi(index, indexAdmin)} />
                            <CancelIcon style={{ color: 'red', width: 30, height: 30, cursor: 'pointer' }} onClick={() => this.handleCancelAddAmin(index, indexAdmin)} />
                          </Grid>
                        </Grid>
                        : <Grid style={{ display: 'flex', width: '100%', padding: '5px 0px', alignItems: 'center' }} key={'admin' + index}>
                          <Grid style={{ width: '40%' }}>
                            <p style={{ margin: 0 }}>{admin.fullname} ({admin.company.company_name})</p>
                          </Grid>
                          <Grid style={{ width: '40%' }}>{fetchStatus(admin)}</Grid>
                          {
                            this.state.optionCompany.find(el => el.company_id === admin.company.company_id) && <Grid style={{ width: '20%', textAlign: 'center' }}>
                              <img src={require('../../Assets/edit-gray.png').default} loading="lazy" alt={`edit ${index}`} width={18} maxHeight={18} style={{ alignSelf: 'center', marginRight: 20, cursor: 'pointer' }} onClick={() => this.handleEditAdmin(index, indexAdmin)} />
                              <img src={require('../../Assets/delete-gray.png').default} loading="lazy" alt={`delete ${index}`} width={18} maxHeight={18} style={{ alignSelf: 'center', cursor: 'pointer' }} />
                            </Grid>
                          }
                        </Grid>

                    )
                  }

                  {/* FORM NEW ADMIN */}
                  {
                    element.addNewAdmin &&
                    <Grid style={{ display: 'flex', width: '100%', padding: '5px 0px', alignItems: 'center' }} key={'admin' + index}>
                      <Grid style={{ width: '40%', display: 'flex', justifyContent: 'space-between', paddingRight: 10 }}>
                        <Grid style={{ width: '50%' }}>
                          <ReactSelect
                            value={element.newAdminName}
                            components={animatedComponents}
                            options={this.state.optionEmployee}
                            onChange={value => this.handleChangeSelect(index, value)}
                            getOptionLabel={(option) => `${option.nik} - ${option.label}`}
                            isDisabled={this.state.proses || this.state.disabledUser}
                          />
                        </Grid>

                        <FormControl variant="outlined" style={{ width: '40%', height: 38, }} size="small">
                          <Select
                            placeholder="perusahaan"
                            value={element.newAdminCompanyId}
                            onChange={this.handleChange(index, 'newAdminCompanyId')}
                            disabled={this.state.proses}
                          >
                            {
                              this.state.optionCompany.map((company, index) =>
                                <MenuItem value={company.company_id} key={"company" + index}>{company.company_name}</MenuItem>
                              )
                            }
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid style={{ width: '40%' }}>
                        <FormControlLabel style={{ margin: 0 }} control={<Checkbox checked={element.newAdminCanCreate} onChange={this.handleChangeChecked(index)} value={element.newAdminCanCreate} name="newAdminCanCreate" />} label="Create"
                        />
                        <FormControlLabel style={{ margin: 0 }} control={<Checkbox checked={element.newAdminCanEdit} onChange={this.handleChangeChecked(index)} value={element.newAdminCanEdit} name="newAdminCanEdit" />} label="Edit"
                        />
                        <FormControlLabel style={{ margin: 0 }} control={<Checkbox checked={element.newAdminCanDelete} onChange={this.handleChangeChecked(index)} value={element.newAdminCanDelete} name="newAdminCanDelete" />} label="Delete"
                        />
                      </Grid>

                      <Grid style={{ width: '20%', textAlign: 'center' }}>
                        <SaveIcon style={{ color: 'green', width: 30, height: 30, cursor: 'pointer' }} onClick={this.saveAdminNotifikasi(index)} />
                        <CancelIcon style={{ color: 'red', width: 30, height: 30, cursor: 'pointer' }} onClick={() => this.handleCancelAddAmin(index)} />
                      </Grid>

                    </Grid>
                  }
                  <p style={{ margin: '10px', color: 'gray', cursor: 'pointer', width: 90 }} onClick={() => this.handleAddAdminNotifikasi(index)}>+ admin baru</p>
                </Paper>
              )
            }
            <p style={{ margin: '10px', color: 'gray', cursor: 'pointer', width: 180 }} onClick={this.handleAddSettingNotifikasi}>+ pengaturan notifikasi baru</p>
          </>
        }
      </>
    )
  }
}

const mapStateToProps = ({ userId, isAdminsuper, dataUsers, admin, dataCompanies }) => {
  return {
    userId,
    isAdminsuper,
    dataUsers,
    admin,
    dataCompanies
  }
}

const mapDispatchToProps = {
  fetchDataCompanies
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingNotifikasi)