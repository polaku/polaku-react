import React, { Component } from 'react'
import Cookies from 'js-cookie';

import {
  Modal, Fade, Grid, Backdrop, Button, Divider
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import DragAndDrop from '../DragAndDrop';

import { API } from '../../config/API';

import swal from 'sweetalert';

export default class modalCreateEditMuchEmployee extends Component {
  state = {
    listReward: [],
    nilaiBawah: '',
    nilaiAtas: '',
    newReward: '',
    statusAddReward: false,
    files: null
  }

  componentDidMount() {

  }

  closeModal = () => {
    this.props.closeModal()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  addIndicator = () => {
    this.setState({ statusAddReward: !this.state.statusAddReward })
  }

  saveIndicator = () => {
    let token = Cookies.get('POLAGROUP')

    let newReward = {
      nilai_bawah: this.state.nilaiBawah,
      nilai_atas: this.state.nilaiAtas,
      reward: this.state.newReward,
      user_id: this.props.userId
    }

    let newListReward = this.state.listReward
    newListReward.push(newReward)
    newListReward.sort(this.compare)

    API.post('/rewardKPIM', newReward, { headers: { token } })
      .then(data => {
        this.setState({ listReward: newListReward, statusAddReward: !this.state.statusAddReward })
        this.props.refresh()
      })
      .catch(err => {
        swal('please try again')
      })
  }

  handleFiles = files => {
    this.setState({ files })
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
              <b style={{ margin: 0, fontSize: 23 }}>Ubah Banyak Karyawan Sekaligus</b>
              <CloseIcon style={{ cursor: 'pointer' }} onClick={this.props.close} />
            </Grid>
            <Divider />

            <Grid style={{ display: 'flex', margin: '20px 0px' }}>
              {
                // this.props.isCreate
                true
                  ? <Grid style={{ display: 'flex', flexDirection: 'column', width: '50%', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                    <img src={process.env.PUBLIC_URL + '/download-example.png'} alt="Logo" style={{ width: 65, maxHeight: 120, alignSelf: 'center', marginTop: 3, marginBottom: 10 }} />
                    <b>1. Unduh file Excel Tambah Sekaligus</b>
                    <Button variant="outlined" style={{ width: '90%', alignSelf: 'center', marginTop: 60 }} onClick={this.saveIndicator}>
                      Unduh Template Excel
                    </Button>
                  </Grid>
                  : <Grid style={{ display: 'flex', flexDirection: 'column', width: '50%', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                    <img src={process.env.PUBLIC_URL + '/upload-logo-1.png'} alt="Logo" style={{ width: 230, maxHeight: 120, alignSelf: 'center' }} />
                    <b>1. Pilih Kolom & Download Template excel</b>
                    <Grid style={{ border: '1px solid #e0e0e0', margin: 10, padding: '5px 10px', height: 100, overflow: 'auto', textAlign: 'left' }}>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                      <p style={{ margin: 0, marginBottom: 3 }}>asdasdasd</p>
                    </Grid>
                    <Button variant="outlined" style={{ width: '90%', alignSelf: 'center' }} onClick={this.saveIndicator}>
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
