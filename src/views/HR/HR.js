import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Paper,
  Button,
  Grid,
  Tabs,
  Tab
} from '@material-ui/core';

import CardPermintaanHRD from '../../components/hr/cardPermintaanHRD';
import ModalCreateEditPermintaanHRD from '../../components/modal/modalCreateEditPermintaanHRD';

import { fetchDataContactUs } from '../../store/action';

class HR extends Component {
  state = {
    dataIjinSaya: [],
    dataIjinSayaPengajuan: [],
    dataIjinSayaDisetujui: [],
    dataIjinSayaPengajuanStaff: [],
    dataIjinSayaDisetujuiStaff: [],
    ijinTabs: 0,
    ijinTab: 0,
    display: 0,
    openModal: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.evaluator1 !== this.props.evaluator1){
      this.fetchData()
    }
  }

  fetchData = async () => {
    await this.props.fetchDataContactUs(this.props.userId)

    let tempData = await this.props.dataContactUs.filter(el => el.date_ijin_absen_start !== null || el.date_imp !== null || el.leave_date !== null)

    let tempDataPengajuan = await tempData.filter(el => el.status === 'new' || el.status === 'new2')
    let tempDataDisetujui = await tempData.filter(el => el.status === 'approved')


    let tempDataStaff = await this.props.dataContactUsStaff.filter(el => el.date_ijin_absen_start !== null || el.date_imp !== null || el.leave_date !== null)

    let tempDataPengajuanStaff = await tempDataStaff.filter(el => el.status === 'new' || el.status === 'new2')

    let tempDataDisetujuiStaff = []
    await tempDataStaff.forEach(el => {
      if (el.status === 'approved') {
        if (el.date_imp && (
          Number(el.date_imp.slice(0, 4)) === new Date().getFullYear() &&
          Number(el.date_imp.slice(5, 7)) === new Date().getMonth() + 1 &&
          Number(el.date_imp.slice(8, 10)) === new Date().getDate())) { //imp
          tempDataDisetujuiStaff.push(el)
        } else if (el.date_ijin_absen_start && (
          new Date(el.date_ijin_absen_start.slice(0, 4), el.date_ijin_absen_start.slice(5, 7) - 1, el.date_ijin_absen_start.slice(8, 10), 5, 0, 0) <= new Date() &&
          new Date(el.date_ijin_absen_end.slice(0, 4), el.date_ijin_absen_end.slice(5, 7) - 1, el.date_ijin_absen_end.slice(8, 10), 23, 0, 0) >= new Date()
        )) { //ijin absen
          tempDataDisetujuiStaff.push(el)
        } else if (el.leave_request &&
          (
            (new Date(el.leave_date.slice(0, 4), el.leave_date.slice(5, 7) - 1, el.leave_date.slice(8, 10), 5, 0, 0) <= new Date()
              && new Date(el.leave_date.slice(0, 4), el.leave_date.slice(5, 7) - 1, Number(el.leave_date.slice(8, 10)) + Number(el.leave_request)) >= new Date() //cuti from mobile
            ) || (
              new Date(el.leave_date.slice(0, 4), el.leave_date.slice(5, 7) - 1, el.leave_date.slice(8, 10), 5, 0, 0) <= new Date() &&
              new Date(
                el.leave_date.slice(el.leave_date.length - 10, el.leave_date.length - 6),
                el.leave_date.slice(el.leave_date.length - 5, el.leave_date.length - 3) - 1,
                el.leave_date.slice(el.leave_date.length - 2, el.leave_date.length), 5, 0, 0) >= new Date()
            )
          )
        ) {
          tempDataDisetujuiStaff.push(el)
        }
      }
    })

    this.setState({
      dataIjinSayaPengajuan: tempDataPengajuan,
      dataIjinSayaDisetujui: tempDataDisetujui,
      dataIjinSayaPengajuanStaff: tempDataPengajuanStaff,
      dataIjinSayaDisetujuiStaff: tempDataDisetujuiStaff,
    })
  }

  handleChangeTabs = (event, newValue) => {
    if (newValue === 0) {
      this.setState({ ijinTabs: 0, ijinTab: 0 })
    } else {
      this.setState({ ijinTabs: 1, ijinTab: 2 })
    }
  };

  changeIjinTab = args => {
    this.setState({
      ijinTab: args
    })
  }

  handleOpenModal = () => {
    this.setState({ openModal: true })
  }

  handleCloseModal = () => {
    this.setState({ openModal: false })
  }

  render() {
    return (
      <>
        <Paper square style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <Grid item style={{}} lg={12} xs={12} sm={6} md={6} xl={6}>
            <p style={{ margin: 20, fontWeight: 'bold', fontSize: 20 }}>Siapa yang sedang ijin</p>
            {
              this.props.evaluator1
                ? <>
                  <Grid style={{ border: '1px solid gray', borderRadius: 10, margin: 20, padding: 10, marginBottom: 10, maxWidth: 505 }}>
                    <Grid style={{ display: 'flex', margin: '5px 5px 5px 10px' }}>
                      <p style={{ margin: 0, fontSize: 15, width: 100 }}>Evaluator 1</p>
                      <p style={{ margin: 0, fontSize: 15 }}>: {this.props.evaluator1.name}</p>
                    </Grid>
                    {
                      this.props.evaluator2 && <Grid style={{ display: 'flex', margin: '5px 5px 5px 10px' }}>
                        <p style={{ margin: 0, fontSize: 15, width: 100 }}>Evaluator 2</p>
                        <p style={{ margin: 0, fontSize: 15 }}>: {this.props.evaluator2.name}</p>
                      </Grid>
                    }
                    <p style={{ margin: 0, fontSize: 12, color: 'gray', marginTop: 10, marginLeft: 10, fontStyle: 'italic' }}>* hubungi HRD untuk konfigurasi apabila evaluatornya berbeda</p>
                  </Grid>
                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                    <Tabs
                      value={this.state.ijinTabs}
                      indicatorColor="secondary"
                      textColor="secondary"
                      onChange={this.handleChangeTabs}
                    >
                      <Tab label="Ijin Staf" style={{ margin: '0px 10px 0px 20px' }} />
                      <Tab label="Ijin Saya" style={{ marginRight: 10 }} />
                    </Tabs>
                    {
                      this.props.evaluator1 && <Button variant="contained" color="secondary" style={{ height: 40 }} onClick={this.handleOpenModal}>
                        Pengajuan baru
                      </Button>
                    }
                  </Grid>
                  <Grid container>
                    {
                      this.state.ijinTabs === 0
                        ? <>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 0 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(0)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinSayaPengajuanStaff.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Ijin menunggu persetujuan</p>
                          </Grid>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 1 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(1)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinSayaDisetujuiStaff.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Staff sedang ijin</p>
                          </Grid>
                        </>
                        : <>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 2 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(2)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinSayaPengajuan.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Ijin dalam pengajuan</p>
                          </Grid>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 3 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(3)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinSayaDisetujui.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Ijin sudah disetujui</p>
                          </Grid>
                        </>
                    }
                  </Grid >
                </>
                : <Grid style={{ display: 'flex', backgroundColor: 'red', color: 'white', fontWeight: 'bold', padding: 10, margin: 20, borderRadius: 20 }}>

                  <p style={{ textAlign: 'center' }}>
                    Konfigurasi evaluator belum dilakukan harap hubungi HRD untuk menggunakan fitur ijin
                  </p>
                </Grid>
            }
          </Grid >
          <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={require('../../assets/icon orang.png')} alt="Logo" style={{ width: 400, maxHeight: 250, }} />
          </Grid>
          {/* <img src="https://polaku.polagroup.co.id/uploads/logo.png" alt="Logo" /> */}

        </Paper >

        <Grid container>
          {
            this.state.ijinTab === 0 && this.state.dataIjinSayaPengajuanStaff.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={0} ijinTab={0} fetchData={this.fetchData} />
              </Grid>
            )
          }
          {
            this.state.ijinTab === 1 && this.state.dataIjinSayaDisetujuiStaff.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={0} ijinTab={1} fetchData={this.fetchData} />
              </Grid>
            )
          }
          {
            this.state.ijinTab === 2 && this.state.dataIjinSayaPengajuan.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={1} ijinTab={2} fetchData={this.fetchData} />
              </Grid>
            )
          }
          {
            this.state.ijinTab === 3 && this.state.dataIjinSayaDisetujui.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={1} ijinTab={3} fetchData={this.fetchData} />
              </Grid>
            )
          }
        </Grid>

        <ModalCreateEditPermintaanHRD status={this.state.openModal} handleCloseModal={this.handleCloseModal} fetchData={this.fetchData} />
      </>
    )
  }
}

const mapDispatchToProps = {
  fetchDataContactUs,
}

const mapStateToProps = ({ userId, dataContactUs, dataContactUsStaff, evaluator1, evaluator2 }) => {
  return {
    userId,
    dataContactUs,
    dataContactUsStaff,
    evaluator1,
    evaluator2,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HR)