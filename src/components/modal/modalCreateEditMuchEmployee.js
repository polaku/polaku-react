import React, { Component } from 'react'
import Cookies from 'js-cookie';

import {
  Modal, Fade, Grid, Backdrop, Button, Divider, FormControlLabel, Checkbox
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import DragAndDrop from '../DragAndDrop';

import { API } from '../../config/API';

import swal from 'sweetalert';

export default class modalCreateEditMuchEmployee extends Component {
  state = {
    files: [],

    fullname: true,
    nickname: true,
    initial: true,
    birth_date: true,
    address: true,
    phone: false,
    selfEmail: false,
    officeEmail: false,
    username: false,
    building: false,
    company: false,
    evaluator1: false,
    evaluator2: false,
    department: false,
    position: false,
    leave: false,
    statusEmpolyee: false,
    joinDate: false,
    startBigLeave: false,
    bigLeave: false,
    nextFrameDate: false,
    nextLensaDate: false,

    key: ["fullname", "nickname", "initial", "birth_date", "address", "phone", "selfEmail", "officeEmail", "username", "building", "company", "evaluator1", "evaluator2", "department", "position", "leave", "statusEmpolyee", "joinDate", "startBigLeave", "bigLeave", "nextFrameDate", "nextLensaDate"],
    label: ['Nama Lengkap', 'Nama Panggilan', 'Inisial', 'Tanggal Lahir', 'Alamat', 'No Telepon', 'Email Pribadi', 'Email Kantor', 'Username', 'Gedung', 'Perusahaan', 'Evaluator 1', 'Evaluator 2', 'Divisi', 'Posisi', 'Sisa Cuti', 'Status Karyawan', 'Tanggal Gabung', 'Tanggal Mulai Cuti Besar', 'Sisa Cuti Besar', 'Tanggal Frame Selanjutnya', 'Tanggal Lensa Selanjutnya']
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.files !== prevState.files && this.state.files.length !== 0) {
      if (this.props.isCreate) {
        this.saveManyEmployee()
      } else {
        this.editManyEmployee()
      }
    }
  }

  handleChangeCheck = (event, name) => {
    this.setState({ [name]: event.target.checked });
  };

  saveManyEmployee = () => {
    let token = Cookies.get('POLAGROUP')
    let newData = new FormData()
    console.log(this.state.files[0])
    newData.append('file', this.state.files[0])
    newData.append('jenisImport', 'add')

    API.post('/users/settingImportUser', newData, { headers: { token } })
      .then(async (data) => {
        swal('Berhasil tambah banyak karyawan', '', 'success')
        await this.props.refresh()
        this.props.close()
      })
      .catch(err => {
        console.log(err)
        swal('please try again')
      })
  }

  editManyEmployee = () => {
    let token = Cookies.get('POLAGROUP')
    let newData = new FormData()
    console.log(this.state.files[0])
    newData.append('file', this.state.files[0])
    newData.append('jenisImport', 'edit')

    this.state.nik && newData.append('nik', this.state.nik)
    this.state.fullname && newData.append('fullname', this.state.fullname)
    this.state.nickname && newData.append('nickname', this.state.nickname)
    this.state.initial && newData.append('initial', this.state.initial)
    this.state.birth_date && newData.append('birth_date', this.state.birth_date)
    this.state.address && newData.append('address', this.state.address)
    this.state.phone && newData.append('phone', this.state.phone)
    this.state.selfEmail && newData.append('selfEmail', this.state.selfEmail)
    this.state.officeEmail && newData.append('officeEmail', this.state.officeEmail)
    this.state.username && newData.append('username', this.state.username)
    this.state.building && newData.append('building', this.state.building)
    this.state.company && newData.append('company', this.state.company)
    this.state.evaluator1 && newData.append('evaluator1', this.state.evaluator1)
    this.state.evaluator2 && newData.append('evaluator2', this.state.evaluator2)
    this.state.department && newData.append('department', this.state.department)
    this.state.position && newData.append('position', this.state.position)
    this.state.leave && newData.append('leave', this.state.leave)
    this.state.statusEmpolyee && newData.append('statusEmpolyee', this.state.statusEmpolyee)
    this.state.joinDate && newData.append('joinDate', this.state.joinDate)
    this.state.startBigLeave && newData.append('startBigLeave', this.state.startBigLeave)
    this.state.bigLeave && newData.append('bigLeave', this.state.bigLeave)
    this.state.nextFrameDate && newData.append('nextFrameDate', this.state.nextFrameDate)
    this.state.nextLensaDate && newData.append('nextLensaDate', this.state.nextLensaDate)

    API.post('/users/settingImportUser', newData, { headers: { token } })
      .then(async (data) => {
        swal('Berhasil ubah banyak karyawan', '', 'success')
        await this.props.refresh()
        this.props.close()
      })
      .catch(err => {
        console.log(err)
        swal('please try again')
      })
  }

  handleFiles = async (files) => {
    this.setState({ files })
  }

  downloadTemplate = () => {
    window.open(process.env.PUBLIC_URL + '/user.xlsx')
  }

  render() {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={this.props.status}
        onClose={this.props.close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <Grid style={{
            backgroundColor: 'white',
            boxShadow: 5,
            width: 750,
            display: 'flex',
            flexDirection: 'column',
            padding: '15px 30px 15px 30px'
          }}>
            <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
              <b style={{ margin: 0, fontSize: 23 }}>
                {
                  this.props.isCreate
                    ? "Tambah Banyak Karyawan Sekaligus"
                    : "Ubah Banyak Karyawan Sekaligus"
                }</b>
              <CloseIcon style={{ cursor: 'pointer' }} onClick={this.props.close} />
            </Grid>
            <Divider />

            <Grid style={{ display: 'flex', margin: '20px 0px' }}>
              {
                this.props.isCreate
                  ? <Grid style={{ display: 'flex', flexDirection: 'column', width: '50%', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                    <img src={process.env.PUBLIC_URL + '/download-example.png'} alt="Logo" style={{ width: 65, maxHeight: 120, alignSelf: 'center', marginTop: 3, marginBottom: 10 }} />
                    <b>1. Unduh file Excel Tambah Sekaligus</b>
                    <Button variant="outlined" style={{ width: '90%', alignSelf: 'center', marginTop: 60 }} onClick={this.downloadTemplate}>
                      Unduh Template Excel
                    </Button>
                  </Grid>
                  : <Grid style={{ display: 'flex', flexDirection: 'column', width: '50%', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                    <img src={process.env.PUBLIC_URL + '/upload-logo-1.png'} alt="Logo" style={{ width: 230, maxHeight: 120, alignSelf: 'center' }} />
                    <b>1. Pilih Kolom & Download Template excel</b>
                    <Grid style={{ border: '1px solid #e0e0e0', margin: 10, padding: '5px 10px', height: 100, overflow: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                      {
                        this.state.key.map((el, index) =>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={this.state[el]}
                                onChange={(e) => this.handleChangeCheck(e, el)}
                                name="fullname" style={{ width: 10, height: 10, marginRight: 8, marginLeft: 10 }}
                              />
                            }
                            label={<p style={{ fontSize: 14, margin: 0 }}>{this.state.label[index]}</p>}
                            key={index}
                            style={{ marginBottom: 5 }}
                          />
                        )
                      }
                    </Grid>
                    <Button variant="outlined" style={{ width: '90%', alignSelf: 'center' }} onClick={this.downloadTemplate}>
                      Unduh Template Excel
                    </Button>
                  </Grid>
              }


              <Grid style={{ display: 'flex', flexDirection: 'column', width: '50%', textAlign: 'center' }}>
                <img src={process.env.PUBLIC_URL + '/upload-logo-2.png'} alt="Logo" style={{ width: 230, maxHeight: 120, alignSelf: 'center' }} />
                <b>2. Unggah Template Excel yang Sudah Diubah</b>
                <Grid style={{ margin: '5px 10px' }}>
                  <DragAndDrop handleFiles={this.handleFiles} status="employee" proses={false} />
                </Grid>
              </Grid>
            </Grid>

            <Divider />

            {/* <Grid> */}
            <p style={{ margin: '10px 0px 0px 0px', color: '#d91b51', cursor: 'pointer', textAlign: 'end' }} onClick={this.addAlamat} disabled={this.state.proses}>Lihat riwayat perubahan terakhir {'>'}</p>
            {/* </Grid> */}

          </Grid>
        </Fade>
      </Modal>
    )
  }
}
