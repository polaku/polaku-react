import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Typography } from '@material-ui/core';

import CardSetting from '../../components/setting/cardSetting';

class Setting extends Component {
  state = {
    menu: [
      // {
      //   icon: 'SupervisedUserCircleOutlinedIcon',
      //   title: 'Meeting Room',
      //   information: 'Kelola meeting room dan aksesnya',
      //   route: ''
      // },
      // {
      //   icon: 'BusinessOutlinedIcon',
      //   title: 'Perusahaan',
      //   information: 'Atur alamat, jam kerja, struktur perusahaan, dan karyawan. Termasuk proses onboarding.',
      //   route: '/setting/setting-perusahaan'
      // },
      // {
      //   icon: 'SpeakerNotesOutlinedIcon',
      //   title: 'Pengumuman & Acara',
      //   information: 'Kelola pesan & acara serta aksesnya',
      //   route: ''
      // }, {
      //   icon: 'SecurityOutlinedIcon',
      //   title: 'Keamanan',
      //   information: 'Atur aktifitas log in, reset akun, perangkat terdaftar',
      //   route: ''
      // }, {
      //   icon: 'SupervisorAccountOutlinedIcon',
      //   title: 'HR',
      //   information: 'Atur Cuti, Ijin, Absen',
      //   route: ''
      // }, {
      //   icon: 'VpnKeyOutlinedIcon',
      //   title: 'Akses',
      //   information: 'Kelola akses user',
      //   route: ''
      // }, {
      //   icon: 'ContactSupportOutlinedIcon',
      //   title: 'Supporting',
      //   information: 'Kelola pendukung tambahan',
      //   route: ''
      // }, {
      //   icon: 'MenuOutlinedIcon',
      //   title: 'Menu',
      //   information: 'Kelola komponen dari menu dan urutannya',
      //   route: ''
      // }, 
      // {
      //   icon: 'AccountCircleOutlinedIcon',
      //   title: 'Akun',
      //   information: 'Atur profil akun dan biodata',
      //   route: '/setting/setting-user'
      // },
    ]
  }

  componentDidMount() {
    if (this.props.isAdminAddress || this.props.isAdminStructure || this.props.isAdminEmployee || this.props.isAdminAdmin || this.props.isAdminsuper || (this.props.admin && this.props.admin.length > 0)) {
      this.fetchMenu()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isAdminAddress !== prevProps.isAdminAddress || this.props.isAdminStructure !== prevProps.isAdminStructure || this.props.isAdminEmployee !== prevProps.isAdminEmployee || this.props.isAdminAdmin !== prevProps.isAdminAdmin || this.props.isAdminsuper !== prevProps.isAdminsuper || (this.props.admin !== prevProps.admin && this.props.admin.length > 0)) {
      this.fetchMenu()
    }
  }

  fetchMenu = () => {
    let menu = []
    if (this.props.isAdminRoom || this.props.isAdminsuper) menu.push({
      icon: 'SupervisedUserCircleOutlinedIcon',
      title: 'Meeting Room',
      information: 'Kelola meeting room dan aksesnya',
      route: '/setting/setting-meeting-room'
    })

    if (this.props.isAdminAddress || this.props.isAdminStructure || this.props.isAdminEmployee || this.props.isAdminAdmin || this.props.isAdminsuper || this.props.isPIC) menu.push({
      icon: 'BusinessOutlinedIcon',
      title: 'Perusahaan',
      information: 'Atur alamat, jam kerja, struktur perusahaan, dan karyawan. Termasuk proses onboarding.',
      route: '/setting/setting-perusahaan'
    })
    if (this.props.isAdminsuper) menu.push({
      icon: 'SecurityOutlinedIcon',
      title: 'Keamanan',
      information: 'Atur aktifitas log in, reset akun, perangkat terdaftar',
      route: '/setting/setting-keamanan'
    })

    this.setState({ menu })
  }

  render() {
    return (
      <Grid style={{ margin: "15px 30px" }}>
        <Typography style={{ fontWeight: 'bold', margin: '10px 0px', marginBottom: 20, fontSize: 25 }} >Pengaturan</Typography>

        <Grid container spacing={7}>
          {
            this.state.menu.map((el, index) =>
              <Grid item md={6} xs={12} key={index} >
                <CardSetting data={el} />
              </Grid>
            )
          }
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = ({ isAdminsuper, admin, isPIC, isAdminNews, isAdminAddress, isAdminStructure, isAdminEmployee, isAdminAdmin, isAdminRoom, isAdminKPIM, isAdminHR }) => {
  return {
    isAdminsuper,
    admin,
    isPIC,
    isAdminNews,
    isAdminAddress,
    isAdminStructure,
    isAdminEmployee,
    isAdminAdmin,
    isAdminRoom,
    isAdminKPIM,
    isAdminHR
  }
}
export default connect(mapStateToProps)(Setting)