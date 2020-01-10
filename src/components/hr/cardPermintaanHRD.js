import React, { Component } from 'react'

import { Card, Grid, Avatar, Paper, Button } from '@material-ui/core';

import ModalCreateEditPermintaanHRD from '../modal/modalCreateEditPermintaanHRD';

import swal from 'sweetalert';

import { API } from '../../config/API';

export default class cardPermintaanHRD extends Component {
  state = {
    isCuti: false,
    status: '',
    keterangan: '',
    waktu1: new Date(),
    waktu2: new Date(),
    category: '',
    proses: false,
    openModal: false,
    // status: 0
  }

  async componentDidMount() {
    if (this.props.data.date_ijin_absen_start) {
      let selisih = new Date(this.props.data.date_ijin_absen_end).getDate() - new Date(this.props.data.date_ijin_absen_start).getDate() + 1

      await this.setState({
        category: 'IA',
        keterangan: `${selisih} hari`,
        waktu1: `${this.props.data.date_ijin_absen_start}`,
        waktu2: `${this.props.data.date_ijin_absen_end}`
      })
    } else if (this.props.data.leave_request) {
      let tempWaktu = this.props.data.leave_date.split(',')

      if (tempWaktu.length > 1) {
        this.setState({
          waktu1: `${tempWaktu[0]}`,
          waktu2: `${tempWaktu[tempWaktu.length - 1]}`
        })
      } else {
        let dateOut

        if (this.props.data.leave_date_in) {
          dateOut = new Date
            (this.props.data.leave_date_in.slice(0, 4),
              this.props.data.leave_date_in.slice(5, 7) - 1,
              Number(this.props.data.leave_date_in.slice(8, 10)) - 1)
        } else {
          dateOut = new Date
            (this.props.data.leave_date.slice(this.props.data.leave_date.length - 10, this.props.data.leave_date.length - 6),
              this.props.data.leave_date.slice(this.props.data.leave_date.length - 5, this.props.data.leave_date.length - 3) - 1,
              this.props.data.leave_date.slice(this.props.data.leave_date.length - 2, this.props.data.leave_date.length))
        }

        this.setState({
          waktu1: this.props.data.leave_date.slice(0, 10),
          waktu2: dateOut
        })

      }

      this.setState({
        isCuti: true,
        keterangan: `${this.props.data.leave_request} hari`,
        category: 'Cuti'
      })
    } else if (this.props.data.date_imp) {
      let selisih = this.props.data.end_time_imp.split(':')[0] - this.props.data.start_time_imp.split(':')[0]
      this.setState({
        category: 'IMP',
        keterangan: `${selisih} jam`,
        waktu1: this.props.data.start_time_imp.slice(0, 5),
        waktu2: this.props.data.end_time_imp.slice(0, 5)
      })
    }

    if (this.props.data.status === 'new') {
      this.setState({
        status: 'Menunggu approval evaluator 1'
      })
    } else if (this.props.data.status === 'new2') {
      this.setState({
        status: 'Menunggu approval evaluator 2'
      })
    } else if (this.props.data.status === 'approved') {
      this.setState({
        status: 'Disetujui'
      })
    }
  }

  getMonth = args => {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return months[args]
  }

  getDay = args => {
    let day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

    return day[args]
  }

  cancelPermintaan = async () => {
    swal({
      title: "Apa anda yakin ingin dibatalkan?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.setState({
            proses: true
          })
          let token = localStorage.getItem('token')

          API.put(`/contactUs/cancel/${this.props.data.contact_id}`, {}, { headers: { token } })
            .then(data => {
              swal("Cancel success", "", "success");
              this.props.fetchData()
              this.setState({
                proses: false
              })
            })
            .catch(err => {
              swal("Error!", `${err}`);


              this.setState({
                proses: false
              })
            })
        }
      });
  }

  rejected = async () => {
    swal({
      title: "Apa anda yakin ingin menolaknya?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((yesAnswer) => {
        if (yesAnswer) {
          let token = localStorage.getItem('token')
          API.get(`/contactUs/rejected/${this.props.data.contact_id}`, { headers: { token } })
            .then(async () => {
              swal("Sukses ditolak", "", "success");
              this.props.fetchData()
              this.setState({
                proses: false
              })
            })
            .catch(err => {
              swal('Error', `${err}`)
            })
        }
      });
  }

  approved = async () => {
    swal({
      title: "Apa anda yakin ingin menyetujuinya?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((yesAnswer) => {
        if (yesAnswer) {
          let newStatus, token = localStorage.getItem('token')
          if (this.props.data.status === 'new') {
            newStatus = 'new2'
          } else if (this.props.data.status === 'new2') {
            newStatus = 'approved'
          }

          API.put(`/contactUs/approved/${this.props.data.contact_id}`, { status: newStatus }, { headers: { token } })
            .then(async () => {
              swal("Sukses disetujui", "", "success");
              this.props.fetchData()
              this.setState({
                proses: false
              })
            })
            .catch(err => {
              swal('Error', `${err}`);
            })
        }
      });



  }

  handleOpenModal = () => {
    this.setState({ openModal: true })
  }

  handleCloseModal = () => {
    this.setState({ openModal: false })
  }

  fetchData = () => {
    this.props.fetchData()
  }

  render() {
    return (
      <>
        <Card style={{ marginBottom: '15px', backgroundColor: '#ececec', width: '100%' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', borderRadius: 0 }}>

            {/* Header 1 */}
            <Paper style={{ padding: '0px 20px', display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 0, width: '100%', justifyContent: 'space-between' }}>
              <Grid style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt="icon_user" src={this.props.data.tbl_user.tbl_account_detail.avatar} style={{ marginRight: 10 }} />
                <p style={{ fontWeight: 'bold', margin: 0, fontSize: 18 }}>{this.props.data.name}</p>
              </Grid>
              <Grid style={{ display: 'flex', alignItems: 'center', paddingRight: 15 }}>
                <p style={{ fontSize: 18, color: 'gray' }}>{this.state.category}</p>
              </Grid>
            </Paper>

            {/* Header 2 */}
            <>
              {
                this.state.category === 'IMP'
                  ? <Grid style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', padding: 10 }} >
                    <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ margin: 0, fontSize: 20 }}>{this.getMonth(new Date(this.props.data.date_imp).getMonth())}</p>
                      <p style={{ fontWeight: 'bold', margin: 0, fontSize: 32 }}>{new Date(this.props.data.date_imp).getDate()}</p>
                      <p style={{ margin: 0, fontSize: 18, color: 'gray' }}>{this.state.waktu1}</p>
                    </Grid>

                    <p style={{ margin: 0, fontSize: 15 }}>{this.state.category} {this.state.keterangan}</p>

                    <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ margin: 0, fontSize: 20 }}>{this.getMonth(new Date(this.props.data.date_imp).getMonth())}</p>
                      <p style={{ fontWeight: 'bold', margin: 0, fontSize: 32 }}>{new Date(this.props.data.date_imp).getDate()}</p>
                      <p style={{ margin: 0, fontSize: 18, color: 'gray' }}>{this.state.waktu2}</p>
                    </Grid>
                  </Grid>
                  : <Grid style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', padding: 10 }} >
                    <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ margin: 0, fontSize: 20 }}>{this.getMonth(new Date(this.state.waktu1).getMonth())}</p>
                      <p style={{ fontWeight: 'bold', margin: 0, fontSize: 32 }}>{new Date(this.state.waktu1).getDate()}</p>
                      <p style={{ margin: 0, fontSize: 18, color: 'gray' }}>{this.getDay(new Date(this.state.waktu1).getDay())}</p>
                    </Grid>

                    <p style={{ margin: 0, fontSize: 15 }}>{this.state.category} {this.state.keterangan}</p>
                    <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ margin: 0, fontSize: 20 }}>{this.getMonth(new Date(this.state.waktu2).getMonth())}</p>
                      <p style={{ fontWeight: 'bold', margin: 0, fontSize: 32 }}>{new Date(this.state.waktu2).getDate()}</p>
                      <p style={{ margin: 0, fontSize: 18, color: 'gray' }}>{this.getDay(new Date(this.state.waktu2).getDay())}</p>
                    </Grid>

                  </Grid>
              }
            </>

          </Card>

          <Grid style={{ padding: 10, display: 'flex', flexDirection: 'column' }}>
            <Grid style={{ display: 'flex' }}>
              <p style={{ margin: 0, fontWeight: 'bold', width: 75 }}>Status</p>
              <p style={{ margin: 0 }}>: {this.state.status}</p>
            </Grid>
            <Grid style={{ display: 'flex' }}>
              <p style={{ margin: 0, fontWeight: 'bold', width: 75 }}>Message</p>
              <p style={{ margin: 0 }}>: {this.props.data.message}</p>
            </Grid>
            <Grid style={{ display: 'flex' }}>
              <p style={{ margin: 0, fontWeight: 'bold', width: 75 }}>Pengajuan</p>
              <p style={{ margin: 0 }}>: {this.props.data.created_at.slice(0, 10)} {this.props.data.created_at.slice(11, 16)}</p>
            </Grid>
          </Grid>

          {
            this.props.ijinTabs === 1 && (
              this.props.ijinTab === 2
                ? <Grid style={{ textAlign: 'right', margin: 10, marginBottom: 15 }}>
                  <Button color="secondary" onClick={this.handleOpenModal}>
                    ubah
                </Button>
                  <Button variant="contained" color="secondary" onClick={this.cancelPermintaan}>
                    batal
                </Button>
                </Grid>
                : <Grid style={{ textAlign: 'right', margin: 10, marginBottom: 15 }}>
                  <Button variant="contained" color="secondary" onClick={this.cancelPermintaan}>
                    batal
                </Button>
                </Grid>
            )
          }
          {
            this.props.ijinTabs === 0 && this.props.ijinTab === 0
            && <Grid style={{ textAlign: 'right', margin: 10, marginBottom: 15 }}>
              <Button color="secondary" onClick={this.rejected}>
                tolak
            </Button>
              <Button variant="contained" color="secondary" onClick={this.approved}>
                setujui
            </Button>
            </Grid>
          }

        </Card>

        {
          this.state.openModal && <ModalCreateEditPermintaanHRD status={this.state.openModal} handleCloseModal={this.handleCloseModal} fetchData={this.fetchData} data={this.props.data} />
        }


      </>
    )
  }
}
