import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Button, Paper, Checkbox, FormControlLabel, FormGroup, IconButton } from '@material-ui/core';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import swal from 'sweetalert';

import { fetchDataUsers, fetchDataDesignation } from '../../store/action';

import { API } from '../../config/API';

const animatedComponents = makeAnimated();

class AddAdmin extends Component {
  state = {
    adminType: '',
    adminTypeSelected: null,
    adminId: '',
    adminIdSelected: null,
    proses: false,

    semua: false,

    alamat: false,
    kelolaAlamat: false,
    mengunduhAlamat: false,
    melihatAlamat: false,
    expandAlamat: false,

    struktur: false,
    kelolaStruktur: false,
    mengunduhStruktur: false,
    melihatStruktur: false,
    expandStruktur: false,

    karyawan: false,
    kelolaKaryawan: false,
    mengunduhKaryawan: false,
    melihatKaryawan: false,
    expandKaryawan: false,

    admin: false,
    kelolaAdmin: false,
    mengunduhAdmin: false,
    melihatAdmin: false,
    expandAdmin: false,

    meeting: false,
    kpim: false,
    hr: false,

    optionDesignation: [],
    dataDesignation: [],
    statusDesignation: false,

    disabledUser: false,
    isEdit: false
  }

  async componentDidMount() {
    await this.props.fetchDataUsers()
    await this.fetchOptionDesignation()

    if (this.props.location.state) {
      // console.log(this.props.location.state.data)
      if (this.props.location.state.data) {
        let adminIdSelected = this.props.dataUsers.find(el => el.user_id === this.props.location.state.data.user_id)
        let adminTypeSelected = this.state.optionDesignation.find(el => el.value === this.props.location.state.data.designations_id)
        this.setState({
          disabledUser: true,
          isEdit: true,
          adminType: this.props.location.state.data.designations_id,
          adminTypeSelected,
          adminId: this.props.location.state.data.user_id,
          adminIdSelected,
        })
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.kelolaAlamat !== prevState.kelolaAlamat || this.state.mengunduhAlamat !== prevState.mengunduhAlamat || this.state.melihatAlamat !== prevState.melihatAlamat) {
      if (this.state.kelolaAlamat && this.state.mengunduhAlamat && this.state.melihatAlamat) {
        this.setState({
          alamat: true
        })
      } else {
        this.setState({
          alamat: false
        })
      }
    }

    if (this.state.kelolaStruktur !== prevState.kelolaStruktur || this.state.mengunduhStruktur !== prevState.mengunduhStruktur || this.state.melihatStruktur !== prevState.melihatStruktur) {
      if (this.state.kelolaStruktur && this.state.mengunduhStruktur && this.state.melihatStruktur) {
        this.setState({
          struktur: true
        })
      } else {
        this.setState({
          struktur: false
        })
      }
    }

    if (this.state.kelolaKaryawan !== prevState.kelolaKaryawan || this.state.mengunduhKaryawan !== prevState.mengunduhKaryawan || this.state.melihatKaryawan !== prevState.melihatKaryawan) {
      if (this.state.kelolaKaryawan && this.state.mengunduhKaryawan && this.state.melihatKaryawan) {
        this.setState({
          karyawan: true
        })
      } else {
        this.setState({
          karyawan: false
        })
      }
    }

    if (this.state.kelolaAdmin !== prevState.kelolaAdmin || this.state.mengunduhAdmin !== prevState.mengunduhAdmin || this.state.melihatAdmin !== prevState.melihatAdmin) {
      if (this.state.kelolaAdmin && this.state.mengunduhAdmin && this.state.melihatAdmin) {
        this.setState({
          admin: true
        })
      } else {
        this.setState({
          admin: false
        })
      }
    }

    if ((this.state.alamat !== prevState.alamat) || (this.state.struktur !== prevState.struktur) || (this.state.karyawan !== prevState.karyawan) || (this.state.admin !== prevState.admin) || (this.state.meeting !== prevState.meeting) || (this.state.kpim !== prevState.kpim) || (this.state.hr !== prevState.hr)) {
      if (this.state.alamat
        && this.state.struktur
        && this.state.karyawan
        && this.state.admin
        && this.state.meeting
        && this.state.kpim
        && this.state.hr) {
        this.setState({ semua: true })
      } else {
        this.setState({ semua: false })
      }
    }

    if (this.state.adminType !== prevState.adminType) {
      if (isNaN(this.state.adminType) || this.state.adminType === null) {
        this.resetCheckbox()
        this.setState({ statusDesignation: false })
      } else {
        console.log("PILIH")
        let { tbl_user_roles } = this.state.dataDesignation.find(el => el.designations_id === this.state.adminType)
        console.log(tbl_user_roles)
        let data = {}

        // ALAMAT
        let alamat = tbl_user_roles.find(menu => menu.menu_id === 2)
        if (alamat) {
          if (alamat.view) data.melihatAlamat = true
          if (alamat.download) data.mengunduhAlamat = true
          if (alamat.created && alamat.edited && alamat.deleted) data.kelolaAlamat = true
        }

        // STRUKTUR
        let struktur = tbl_user_roles.find(menu => menu.menu_id === 3)
        if (struktur) {
          if (struktur.view) data.melihatStruktur = true
          if (struktur.download) data.mengunduhStruktur = true
          if (struktur.created && struktur.edited && struktur.deleted) data.kelolaStruktur = true
        }

        // KARYAWAN
        let karyawan = tbl_user_roles.find(menu => menu.menu_id === 4)
        if (karyawan) {
          if (karyawan.view) data.melihatKaryawan = true
          if (karyawan.download) data.mengunduhKaryawan = true
          if (karyawan.created && karyawan.edited && karyawan.deleted) data.kelolaKaryawan = true
        }

        // ADMIN
        let admin = tbl_user_roles.find(menu => menu.menu_id === 5)
        if (admin) {
          if (admin.view) data.melihatAdmin = true
          if (admin.download) data.mengunduhAdmin = true
          if (admin.created && admin.edited && admin.deleted) data.kelolaAdmin = true
        }

        // MEETING ROOM
        let meeting = tbl_user_roles.find(menu => menu.menu_id === 6)
        if (meeting) data.meeting = true

        // KPIM
        let kpim = tbl_user_roles.find(menu => menu.menu_id === 7)
        if (kpim) data.kpim = true

        // HR
        let hr = tbl_user_roles.find(menu => menu.menu_id === 8)
        if (hr) data.hr = true

        this.setState({ statusDesignation: true, ...data })
      }
    }
  }

  fetchOptionDesignation = async () => {
    try {
      let token = Cookies.get('POLAGROUP'), optionDesignation = []
      let { data } = await API.get(`/designation?option=true`, { headers: { token } })

      await data.data.forEach(el => {
        optionDesignation.push({ value: el.designations_id, label: el.designations })
      })

      this.setState({ dataDesignation: data.data, optionDesignation })
    } catch (err) {
      console.log(err)
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleCheck = (event) => {
    this.setState({ [event.target.name]: event.target.checked });

    if (event.target.name === 'semua') {
      this.setState({
        alamat: event.target.checked,
        kelolaAlamat: event.target.checked,
        mengunduhAlamat: event.target.checked,
        melihatAlamat: event.target.checked,
        struktur: event.target.checked,
        kelolaStruktur: event.target.checked,
        mengunduhStruktur: event.target.checked,
        melihatStruktur: event.target.checked,
        kelolaKaryawan: event.target.checked,
        mengunduhKaryawan: event.target.checked,
        melihatKaryawan: event.target.checked,
        karyawan: event.target.checked,
        kelolaAdmin: event.target.checked,
        mengunduhAdmin: event.target.checked,
        melihatAdmin: event.target.checked,
        admin: event.target.checked,
        meeting: event.target.checked,
        kpim: event.target.checked,
        hr: event.target.checked
      })
    }
    else if (event.target.name === 'alamat') {
      this.setState({
        kelolaAlamat: event.target.checked,
        mengunduhAlamat: event.target.checked,
        melihatAlamat: event.target.checked,
      })
    }
    else if (event.target.name === 'struktur') {
      this.setState({
        kelolaStruktur: event.target.checked,
        mengunduhStruktur: event.target.checked,
        melihatStruktur: event.target.checked,
      })
    }
    else if (event.target.name === 'karyawan') {
      this.setState({
        kelolaKaryawan: event.target.checked,
        mengunduhKaryawan: event.target.checked,
        melihatKaryawan: event.target.checked,
      })
    }
    else if (event.target.name === 'admin') {
      this.setState({
        kelolaAdmin: event.target.checked,
        mengunduhAdmin: event.target.checked,
        melihatAdmin: event.target.checked,
      })
    }
  };

  handleExpand = (name) => {
    this.setState({ [name]: !this.state[name] })
  }

  handleInputChange = (inputValue, actionMeta) => {
    if (inputValue) {
      this.setState({
        adminType: inputValue
      })
    }
  };

  handleChangeSelect = (name, newValue, actionMeta) => {
    if (newValue) {
      if (name === 'adminType') {
        this.resetCheckbox()
        this.setState({
          adminType: newValue.value,
          adminTypeSelected: newValue
        })
      } else {
        this.setState({
          adminId: newValue.user_id,
          adminIdSelected: newValue
        })
      }
    } else {
      if (name === 'adminType') {
        this.setState({
          adminType: '',
          adminTypeSelected: null
        })
      } else {
        this.setState({
          adminId: '',
          adminIdSelected: null
        })
      }
    }
  };

  resetCheckbox = () => {
    this.setState({
      semua: false,

      alamat: false,
      kelolaAlamat: false,
      mengunduhAlamat: false,
      melihatAlamat: false,
      expandAlamat: false,

      struktur: false,
      kelolaStruktur: false,
      mengunduhStruktur: false,
      melihatStruktur: false,
      expandStruktur: false,

      karyawan: false,
      kelolaKaryawan: false,
      mengunduhKaryawan: false,
      melihatKaryawan: false,
      expandKaryawan: false,

      admin: false,
      kelolaAdmin: false,
      mengunduhAdmin: false,
      melihatAdmin: false,
      expandAdmin: false,

      meeting: false,
      kpim: false,
      hr: false,
    })
  }

  navigateBack = () => {
    this.props.history.push('/setting/setting-perusahaan',  { index: this.props.location.state.index })
  }

  submit = async () => {
    // LIST MENU IN DATABASE
    // 1=Berita Pola, 
    // 2=Alamat, 
    // 3=Struktur, 
    // 4=Karyawan, 
    // 5=Admin, 
    // 6=Meeting Room, 
    // 7=KPIM&TAL, 
    // 8=HR

    try {
      this.setState({ proses: true })

      let roles = []
      if (isNaN(this.state.adminType)) {
        if (this.state.semua) {
          roles = [
            // { menuId: 1, view: 1, created: 1, edited: 1, deleted: 1, download: 1 },
            { menuId: 2, view: 1, created: 1, edited: 1, deleted: 1, download: 1 },
            { menuId: 3, view: 1, created: 1, edited: 1, deleted: 1, download: 1 },
            { menuId: 4, view: 1, created: 1, edited: 1, deleted: 1, download: 1 },
            { menuId: 5, view: 1, created: 1, edited: 1, deleted: 1, download: 1 },
            { menuId: 6, view: 1, created: 1, edited: 1, deleted: 1, download: 1 },
            { menuId: 7, view: 1, created: 1, edited: 1, deleted: 1, download: 1 },
            { menuId: 8, view: 1, created: 1, edited: 1, deleted: 1, download: 1 },
          ]
        } else {
          // ALAMAT
          if (this.state.kelolaAlamat || this.state.mengunduhAlamat || this.state.melihatAlamat) {
            let alamat = {
              menuId: 2
            }
            if (this.state.melihatAlamat) alamat.view = 1
            if (this.state.kelolaAlamat) {
              alamat.created = 1
              alamat.edited = 1
              alamat.deleted = 1
            }
            if (this.state.mengunduhAlamat) alamat.download = 1
            roles.push(alamat)
          }

          // STRUKTUR
          if (this.state.kelolaStruktur || this.state.mengunduhStruktur || this.state.melihatStruktur) {
            let struktur = {
              menuId: 3
            }
            if (this.state.melihatStruktur) struktur.view = 1
            if (this.state.kelolaStruktur) {
              struktur.created = 1
              struktur.edited = 1
              struktur.deleted = 1
            }
            if (this.state.mengunduhStruktur) struktur.download = 1
            roles.push(struktur)
          }

          // KARYAWAN
          if (this.state.kelolaKaryawan || this.state.mengunduhKaryawan || this.state.melihatKaryawan) {
            let karyawan = {
              menuId: 4
            }
            if (this.state.melihatKaryawan) karyawan.view = 1
            if (this.state.kelolaKaryawan) {
              karyawan.created = 1
              karyawan.edited = 1
              karyawan.deleted = 1
            }
            if (this.state.mengunduhKaryawan) karyawan.download = 1
            roles.push(karyawan)
          }

          // ADMIN
          if (this.state.kelolaAdmin || this.state.mengunduhAdmin || this.state.melihatAdmin) {
            let admin = {
              menuId: 5
            }
            if (this.state.melihatAdmin) admin.view = 1
            if (this.state.kelolaAdmin) {
              admin.created = 1
              admin.edited = 1
              admin.deleted = 1
            }
            if (this.state.mengunduhAdmin) admin.download = 1
            roles.push(admin)
          }

          // MEETING ROOM
          if (this.state.meeting) {
            roles.push({ menuId: 6, view: 1, created: 1, edited: 1, deleted: 1, download: 1 })
          }

          // KPIM
          if (this.state.kpim) {
            roles.push({ menuId: 7, view: 1, created: 1, edited: 1, deleted: 1, download: 1 })
          }

          // HR
          if (this.state.hr) {
            roles.push({ menuId: 8, view: 1, created: 1, edited: 1, deleted: 1, download: 1 })
          }
        }
      }

      let data = {
        name: this.state.adminType,
        userId: this.state.adminId,
        roles
      }
      console.log(data)
      let token = Cookies.get('POLAGROUP')
      await API.post('/designation', data, { headers: { token } })
      this.setState({ proses: false })
      this.resetCheckbox()
      await this.props.fetchDataDesignation({ limit: 10, page: 0 })
      if (this.state.isEdit) {
        swal('Edit Admin Sukses', '', 'success')
      } else {
        swal('Tambah Admin Sukses', '', 'success')
      }
      this.navigateBack()
    } catch (err) {
      if (this.state.isEdit) {
        swal('Edit Admin gagal', '', 'error')
      } else {
        swal('Tambah Admin gagal', '', 'error')
      }
      this.setState({ proses: false })
    }
  }

  render() {
    return (
      <Grid>
        <Grid style={{ display: 'flex' }}>
          <Grid style={{ backgroundColor: '#d71149', padding: 10, borderRadius: 50, width: 75, textAlign: 'center', marginRight: 10 }}>
            <img src={process.env.PUBLIC_URL + '/admin.png'} alt="Logo" style={{ width: 40, height: 50, alignSelf: 'center' }} />
          </Grid>
          <Grid style={{ display: 'flex', flexDirection: 'column' }}>
            <b style={{ fontSize: 20, fontWeight: 'bold' }}>Tambahkan Admin</b>
            <b style={{ fontSize: 15 }}>Pengaturan Admin</b>
            <p style={{ margin: 0, fontSize: 12, color: '#d71149', cursor: 'pointer' }} onClick={this.navigateBack}>{'<'} kembali ke menu tambah admin</p>
          </Grid>
        </Grid>

        <Grid container style={{ margin: '20px 0px 10px' }} spacing={3}>
          <Grid item sm={12} md={4}>
            <Paper style={{ padding: 20 }}>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>Admin</p>
              <Grid style={{ width: '100%', height: 40, maxWidth: 500, marginBottom: 20 }}>
                <CreatableSelect
                  value={this.state.adminTypeSelected}
                  components={animatedComponents}
                  options={this.state.optionDesignation}
                  onChange={value => this.handleChangeSelect('adminType', value)}
                  onInputChange={this.handleInputChange}
                />
              </Grid>

              <Grid style={{ width: '100%', height: 40, maxWidth: 500, marginBottom: 20 }}>
                <ReactSelect
                  value={this.state.adminIdSelected}
                  components={animatedComponents}
                  options={this.props.dataUsers}
                  onChange={value => this.handleChangeSelect('adminId', value)}
                  getOptionLabel={(option) => `${option.tbl_account_detail.nik} - ${option.tbl_account_detail.fullname}`}
                  getOptionValue={(option) => option.user_id}
                  isDisabled={this.state.proses || this.state.disabledUser}
                />
              </Grid>


              <FormGroup >
                <FormControlLabel
                  control={<Checkbox checked={this.state.semua} onChange={this.handleCheck} name="semua" />}
                  label="Semua"
                  disabled={this.state.statusDesignation}
                />
                {/* ALAMAT */}
                <>
                  <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={<Checkbox checked={this.state.alamat} onChange={this.handleCheck} name="alamat" />}
                      label="Alamat"
                      disabled={this.state.statusDesignation}
                    />
                    {
                      this.state.expandAlamat
                        ? <IconButton style={{ width: 30, height: 30 }} onClick={() => this.handleExpand('expandAlamat')}>
                          <ExpandLessIcon />
                        </IconButton>
                        : <IconButton style={{ width: 30, height: 30 }} onClick={() => this.handleExpand('expandAlamat')}>
                          <ExpandMoreIcon />
                        </IconButton>
                    }
                  </Grid>
                  {
                    this.state.expandAlamat && <FormGroup style={{ marginLeft: 30 }}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.kelolaAlamat} onChange={this.handleCheck} name="kelolaAlamat" />}
                        label="Kelola Alamat"
                        disabled={this.state.statusDesignation}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={this.state.mengunduhAlamat} onChange={this.handleCheck} name="mengunduhAlamat" />}
                        label="Mengunduh Alamat"
                        disabled={this.state.statusDesignation}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={this.state.melihatAlamat} onChange={this.handleCheck} name="melihatAlamat" />}
                        label="Melihat Alamat"
                        disabled={this.state.statusDesignation}
                      />
                    </FormGroup>
                  }
                </>

                {/* STRUKTUR */}
                <>
                  <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={<Checkbox checked={this.state.struktur} onChange={this.handleCheck} name="struktur" />}
                      label="Struktur"
                      disabled={this.state.statusDesignation}
                    />
                    {
                      this.state.expandStruktur
                        ? <IconButton style={{ width: 30, height: 30 }} onClick={() => this.handleExpand('expandStruktur')}>
                          <ExpandLessIcon />
                        </IconButton>
                        : <IconButton style={{ width: 30, height: 30 }} onClick={() => this.handleExpand('expandStruktur')}>
                          <ExpandMoreIcon />
                        </IconButton>
                    }
                  </Grid>
                  {
                    this.state.expandStruktur && <FormGroup style={{ marginLeft: 30 }}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.kelolaStruktur} onChange={this.handleCheck} name="kelolaStruktur" />}
                        label="Kelola Struktur"
                        disabled={this.state.statusDesignation}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={this.state.mengunduhStruktur} onChange={this.handleCheck} name="mengunduhStruktur" />}
                        label="Mengunduh Struktur"
                        disabled={this.state.statusDesignation}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={this.state.melihatStruktur} onChange={this.handleCheck} name="melihatStruktur" />}
                        label="Melihat Struktur"
                        disabled={this.state.statusDesignation}
                      />
                    </FormGroup>
                  }
                </>

                {/* KARYAWAN */}
                <>
                  <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={<Checkbox checked={this.state.karyawan} onChange={this.handleCheck} name="karyawan" />}
                      label="Karyawan"
                      disabled={this.state.statusDesignation}
                    />
                    {
                      this.state.expandKaryawan
                        ? <IconButton style={{ width: 30, height: 30 }} onClick={() => this.handleExpand('expandKaryawan')}>
                          <ExpandLessIcon />
                        </IconButton>
                        : <IconButton style={{ width: 30, height: 30 }} onClick={() => this.handleExpand('expandKaryawan')}>
                          <ExpandMoreIcon />
                        </IconButton>
                    }
                  </Grid>
                  {
                    this.state.expandKaryawan && <FormGroup style={{ marginLeft: 30 }}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.kelolaKaryawan} onChange={this.handleCheck} name="kelolaKaryawan" />}
                        label="Kelola Karyawan"
                        disabled={this.state.statusDesignation}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={this.state.mengunduhKaryawan} onChange={this.handleCheck} name="mengunduhKaryawan" />}
                        label="Mengunduh Karyawan"
                        disabled={this.state.statusDesignation}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={this.state.melihatKaryawan} onChange={this.handleCheck} name="melihatKaryawan" />}
                        label="Melihat Karyawan"
                        disabled={this.state.statusDesignation}
                      />
                    </FormGroup>
                  }
                </>

                {/* ADMIN */}
                <>
                  <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={<Checkbox checked={this.state.admin} onChange={this.handleCheck} name="admin" />}
                      label="Admin"
                      disabled={this.state.statusDesignation}
                    />
                    {
                      this.state.expandAdmin
                        ? <IconButton style={{ width: 30, height: 30 }} onClick={() => this.handleExpand('expandAdmin')}
                        >
                          <ExpandLessIcon />
                        </IconButton>
                        : <IconButton style={{ width: 30, height: 30 }} onClick={() => this.handleExpand('expandAdmin')}>
                          <ExpandMoreIcon />
                        </IconButton>
                    }
                  </Grid>
                  {
                    this.state.expandAdmin && <FormGroup style={{ marginLeft: 30 }}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.kelolaAdmin} onChange={this.handleCheck} name="kelolaAdmin" />}
                        label="Kelola Admin"
                        disabled={this.state.statusDesignation}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={this.state.mengunduhAdmin} onChange={this.handleCheck} name="mengunduhAdmin" />}
                        label="Mengunduh Admin"
                        disabled={this.state.statusDesignation}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={this.state.melihatAdmin} onChange={this.handleCheck} name="melihatAdmin" />}
                        label="Melihat Admin"
                        disabled={this.state.statusDesignation}
                      />
                    </FormGroup>
                  }
                </>

                <FormControlLabel
                  control={<Checkbox checked={this.state.meeting} onChange={this.handleCheck} name="meeting" />}
                  label="Meeting room"
                  disabled={this.state.statusDesignation}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.meeting} onChange={this.handleCheck} name="meeting" />}
                  label="Admin room"
                  style={{ marginLeft: 20 }}
                  disabled={this.state.statusDesignation}
                />

                <FormControlLabel
                  control={<Checkbox checked={this.state.kpim} onChange={this.handleCheck} name="kpim" />}
                  label="KPIM & TAL"
                  disabled={this.state.statusDesignation}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.kpim} onChange={this.handleCheck} name="kpim" />}
                  label="Report"
                  style={{ marginLeft: 20 }}
                  disabled={this.state.statusDesignation}
                />

                <FormControlLabel
                  control={<Checkbox checked={this.state.hr} onChange={this.handleCheck} name="hr" />}
                  label="HR"
                  disabled={this.state.statusDesignation}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.hr} onChange={this.handleCheck} name="hr" />}
                  label="Report"
                  style={{ marginLeft: 20 }}
                  disabled={this.state.statusDesignation}
                />

              </FormGroup>
            </Paper>
          </Grid>

          <Grid item sm={12} md={6}>
            <Paper style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', minHeight: 300 }}>
              <img src={process.env.PUBLIC_URL + '/tambah-admin.png'} alt="Logo" style={{ width: 150, height: 100, alignSelf: 'center' }} />
              <p style={{ fontSize: 13, color: '#d71149', fontWeight: 'bold', marginTop: 0 }}>Tambah Karyawan Baru</p>
            </Paper>
          </Grid>
        </Grid>

        <Button variant="outlined" color="secondary" style={{ width: 150, margin: 10 }} onClick={() => this.props.history.goBack()} disabled={this.state.proses}>batalkan</Button>
        <Button variant="contained" color="secondary" style={{ width: 150, margin: 10 }} onClick={this.submit} disabled={this.state.proses}>simpan</Button>
      </Grid>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataDesignation
}

const mapStateToProps = ({ dataUsers }) => {
  return {
    dataUsers
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAdmin)