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
    if (this.props.designation || this.props.isAdminsuper) {
      this.fetchMenu()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.designation !== prevProps.designation && (this.props.designation && this.props.designation.length > 0)) || this.props.isAdminsuper !== prevProps.isAdminsuper) {
      this.fetchMenu()
    }
  }

  fetchMenu = () => {
    let menu = []
    let checkAdminMeetingRoom = this.props.designation && this.props.designation.find(menu => menu.menu_id === 6)
    if (checkAdminMeetingRoom || this.props.isAdminsuper) menu.push({
      icon: 'SupervisedUserCircleOutlinedIcon',
      title: 'Meeting Room',
      information: 'Kelola meeting room dan aksesnya',
      route: '/setting/setting-meeting-room'
    })

    let checkAdminCompany = this.props.designation && this.props.designation.find(menu => menu.menu_id === 2 || menu.menu_id === 3 || menu.menu_id === 4 || menu.menu_id === 5)
    if (checkAdminCompany || this.props.isAdminsuper) menu.push({
      icon: 'BusinessOutlinedIcon',
      title: 'Perusahaan',
      information: 'Atur alamat, jam kerja, struktur perusahaan, dan karyawan. Termasuk proses onboarding.',
      route: '/setting/setting-perusahaan'
    })
    console.log(menu)
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

const mapStateToProps = ({ designation, isAdminsuper }) => {
  return {
    designation,
    isAdminsuper
  }
}
export default connect(mapStateToProps)(Setting)