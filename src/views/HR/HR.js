import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';

import {
  Paper, Button, Grid, Tabs, Tab
} from '@material-ui/core';
import Loading from '../../components/Loading';

import { fetchDataContactUs } from '../../store/action';

const ModalCreateEditPermintaanHRD = lazy(() => import('../../components/modal/modalCreateEditPermintaanHRD'));
const CardPermintaanHRD = lazy(() => import('../../components/hr/cardPermintaanHRD'));

class HR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proses: true,
      dataIjinSaya: [],
      dataIjinSayaPengajuan: [],
      dataIjinSayaDisetujui: [],
      dataIjinPengajuanStaff: [],
      dataIjinStaffSedangIjin: [],
      dataIjinStaffDisetujui: [],
      dataIjinStaffSudahLewat: [],
      ijinTabs: 0,
      ijinTab: 0,
      display: 0,
      openModal: false,
    }
  }

  componentDidMount() {
    if (this.props.userId) {
      this.fetchData()
    }

    if (this.props.bawahan.length === 0) {
      // this.setState({ ijinTabs: 1 })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchData()
    }

    if (prevProps.bawahan !== this.props.bawahan) {
      if (this.props.bawahan.length === 0) {
        this.setState({ ijinTab: 2 })
      }
    }
  }

  fetchData = async () => {
    this.setState({
      proses: true,
      dataIjinSayaPengajuan: [],
      dataIjinSayaDisetujui: [],
      dataIjinPengajuanStaff: [],
      dataIjinStaffSedangIjin: [],
    })

    await this.props.fetchDataContactUs(this.props.userId)

    let tempData = await this.props.dataContactUs.filter(el => el.date_ijin_absen_start !== null || el.date_imp !== null || el.leave_date !== null)

    let tempDataPengajuan = await tempData.filter(el => el.status === 'new' || el.status === 'new2')
    let tempDataDisetujui = await tempData.filter(el => el.status === 'approved')


    let tempDataStaff = await this.props.dataContactUsStaff.filter(el => el.date_ijin_absen_start !== null || el.date_imp !== null || el.leave_date !== null)

    // let tempDataPengajuanStaff = await tempDataStaff.filter(el => el.status === 'new' || el.status === 'new2')
    let tempDataPengajuanStaff = []

    let tempDataStaffSedangIjin = [], tempDataIjinSudahLewat = [], tempDataIjinDisetujui = []
    await tempDataStaff.forEach(el => {
      if (el.status === 'approved') {
        if (el.date_imp && (
          Number(el.date_imp.slice(0, 4)) === new Date().getFullYear() &&
          Number(el.date_imp.slice(5, 7)) === new Date().getMonth() + 1 &&
          Number(el.date_imp.slice(8, 10)) === new Date().getDate())) { //imp
          tempDataStaffSedangIjin.push(el)
        } else if (el.date_ijin_absen_start && (
          new Date(el.date_ijin_absen_start.slice(0, 4), el.date_ijin_absen_start.slice(5, 7) - 1, el.date_ijin_absen_start.slice(8, 10), 5, 0, 0) <= new Date() &&
          new Date(el.date_ijin_absen_end.slice(0, 4), el.date_ijin_absen_end.slice(5, 7) - 1, el.date_ijin_absen_end.slice(8, 10), 23, 0, 0) >= new Date()
        )) { //ijin absen
          tempDataStaffSedangIjin.push(el)
        } else if (el.leave_request) {
          let lastDate = el.leave_date.split(" ")

          if (el.leave_date_in) { // pakai leave_date_in

            if (
              new Date(el.leave_date.slice(0, 4), el.leave_date.slice(5, 7) - 1, el.leave_date.slice(8, 10), 0, 0, 0) <= new Date() &&
              new Date(el.leave_date_in.slice(0, 4), el.leave_date_in.slice(5, 7) - 1, el.leave_date_in.slice(8, 10), 0, 0, 0) > new Date()
            ) {
              tempDataStaffSedangIjin.push(el)
            }
          } else { // tdk pakai leave_date_in

            if (lastDate.length > 1) { // input data dari mobile (yyyy-mm-dd hh:mm:ss)
              if (
                new Date(el.leave_date.slice(0, 4), el.leave_date.slice(5, 7) - 1, el.leave_date.slice(8, 10), 0, 0, 0) <= new Date() &&
                new Date(el.leave_date.slice(0, 4), el.leave_date.slice(5, 7) - 1, Number(el.leave_date.slice(8, 10)) + (Number(el.leave_request) - 1), 23, 0, 0) >= new Date()
              ) {
                tempDataStaffSedangIjin.push(el)
              }
            } else { // input data dari web php (yyyy-mm-dd,yyy-mm-dd)
              if (
                new Date(el.leave_date.slice(0, 4), el.leave_date.slice(5, 7) - 1, el.leave_date.slice(8, 10), 0, 0, 0) <= new Date() &&
                new Date(el.leave_date.slice(el.leave_date.length - 10, el.leave_date.length - 6), el.leave_date.slice(el.leave_date.length - 5, el.leave_date.length - 3) - 1, el.leave_date.slice(el.leave_date.length - 2, el.leave_date.length), 23, 0, 0) >= new Date()
              ) {
                tempDataStaffSedangIjin.push(el)
              }
            }
          }
        }
      }

      if (el.date_imp) {
        if (new Date(el.date_imp) > new Date()) {
          if (el.status === 'approved') {
            tempDataIjinDisetujui.push(el)
          } else if (el.status === 'new' || el.status === 'new2') {
            tempDataPengajuanStaff.push(el)
          }
        } else {
          tempDataIjinSudahLewat.push(el)
        }
      } else if (el.date_ijin_absen_end) {
        if (new Date(el.date_ijin_absen_end) > new Date()) {
          if (el.status === 'approved') {
            tempDataIjinDisetujui.push(el)
          } else if (el.status === 'new' || el.status === 'new2') {
            tempDataPengajuanStaff.push(el)
          }
        } else {
          tempDataIjinSudahLewat.push(el)
        }
      } else if (el.leave_request) {
        if (new Date(el.leave_date_in.slice(0, 4), el.leave_date_in.slice(5, 7) - 1, el.leave_date_in.slice(8, 10), 0, 0, 0) > new Date()) {
          if (el.status === 'approved') {
            tempDataIjinDisetujui.push(el)
          } else if (el.status === 'new' || el.status === 'new2') {
            tempDataPengajuanStaff.push(el)
          }
        } else {
          tempDataIjinSudahLewat.push(el)
        }
      }
    })

    // console.log("tempDataPengajuan", tempDataPengajuan)
    // console.log("tempDataDisetujui", tempDataDisetujui)
    // console.log("tempDataPengajuanStaff", tempDataPengajuanStaff)
    // console.log("tempDataStaffSedangIjin", tempDataStaffSedangIjin)

    this.setState({
      proses: false,
      dataIjinSayaPengajuan: tempDataPengajuan,
      dataIjinSayaDisetujui: tempDataDisetujui,
      dataIjinPengajuanStaff: tempDataPengajuanStaff,
      dataIjinStaffSedangIjin: tempDataStaffSedangIjin,
      dataIjinStaffDisetujui: tempDataIjinDisetujui,
      dataIjinStaffSudahLewat: tempDataIjinSudahLewat
    })
  }

  handleChangeTabs = (event, newValue) => {
    if (newValue === 0) {
      this.setState({ ijinTabs: 0, ijinTab: 0 })
    } else {
      this.setState({ ijinTabs: 1, ijinTab: 4 })
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
    if (this.state.proses) return <Loading loading={this.state.proses} />;

    return (
      <>
        <Paper square style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <Grid item style={{}} lg={12} xs={12} sm={6} md={6} xl={6}>
            <p style={{ margin: 20, fontWeight: 'bold', fontSize: 20 }}>Siapa yang sedang ijin</p>
            {
              this.props.evaluator1 || this.props.firstHierarchy
                ? <>
                  <Grid style={{ border: '1px solid gray', borderRadius: 10, margin: 20, padding: 10, marginBottom: 10, maxWidth: 505 }}>
                    <Grid style={{ display: 'flex', margin: '5px 5px 5px 10px' }}>
                      <p style={{ margin: 0, fontSize: 15, width: 100 }}>Evaluator 1</p>
                      <p style={{ margin: 0, fontSize: 15 }}>: {this.props.evaluator1 ? this.props.evaluator1.name : '-'}</p>
                    </Grid>
                    {
                      this.props.evaluator2 && <Grid style={{ display: 'flex', margin: '5px 5px 5px 10px' }}>
                        <p style={{ margin: 0, fontSize: 15, width: 100 }}>Evaluator 2</p>
                        <p style={{ margin: 0, fontSize: 15 }}>: {this.props.evaluator2.name}</p>
                      </Grid>
                    }
                    <p style={{ margin: 0, fontSize: 12, color: 'gray', marginTop: 10, marginLeft: 10, fontStyle: 'italic' }}>* hubungi HRD untuk konfigurasi apabila evaluatornya berbeda</p>
                  </Grid>
                  <p style={{ margin: 20, marginTop: 5 }}>Sisa cuti anda sebanyak {this.props.sisaCuti}</p>

                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                    <Tabs
                      value={this.state.ijinTabs}
                      indicatorColor="secondary"
                      textColor="secondary"
                      onChange={this.handleChangeTabs}
                      style={{ margin: '0px 10px 0px 20px', width: 400 }}
                    >
                      {
                        this.props.bawahan.length > 0 && <Tab label="Ijin Staf" style={{ margin: '0px 10px 0px 20px' }} />
                      }
                      <Tab label="Ijin Saya" />
                    </Tabs>
                    {
                      (this.props.evaluator1 || this.props.firstHierarchy) && <Button variant="contained" color="secondary" style={{ height: 40, width: 200 }} onClick={this.handleOpenModal}  >
                        Pengajuan baru
                      </Button>
                    }
                  </Grid>
                  <Grid container>
                    {
                      this.state.ijinTabs === 0 && this.props.bawahan.length > 0
                        ? <>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 0 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(0)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinPengajuanStaff.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Ijin menunggu persetujuan</p>
                          </Grid>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 1 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(1)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinStaffSedangIjin.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Staff sedang ijin</p>
                          </Grid>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 2 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(2)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinStaffSudahLewat.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Ijin staff sudah lewat</p>
                          </Grid>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 3 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(3)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinStaffDisetujui.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Ijin staff disetujui</p>
                          </Grid>
                        </>
                        : <>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 4 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(4)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinSayaPengajuan.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Ijin dalam pengajuan</p>
                          </Grid>
                          <Grid style={{
                            width: 300,
                            height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid gray', backgroundColor: this.state.ijinTab === 5 ? '#ebebeb' : 'white', cursor: 'pointer'
                          }} onClick={() => this.changeIjinTab(5)}>
                            <p style={{ margin: 0, marginRight: 5, fontSize: 25 }}>{this.state.dataIjinSayaDisetujui.length}</p>
                            <p style={{ margin: 0, marginRight: 5 }}>Ijin sudah disetujui</p>
                          </Grid>
                        </>
                    }
                  </Grid >
                </>
                : <Grid style={{ display: 'flex', backgroundColor: 'red', color: 'white', fontWeight: 'bold', padding: 10, margin: 20, borderRadius: 20, width: 450 }}>

                  <p style={{ textAlign: 'center' }}>
                    Konfigurasi evaluator belum dilakukan harap hubungi HRD untuk menggunakan fitur ijin
                  </p>
                </Grid>
            }
          </Grid >
          <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={process.env.PUBLIC_URL + '/icon orang.png'} alt="Logo" style={{ width: 400, maxHeight: 250, }} />
          </Grid>
          {/* <img src="https://polaku.polagroup.co.id/uploads/logo.png" alt="Logo" /> */}

        </Paper >

        <Grid container>
          {
            this.props.userId === 1 && this.state.dataIjinPengajuanStaff.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={0} ijinTab={0} fetchData={this.fetchData} />
              </Grid>
            )
          }
          {
            this.state.ijinTab === 0 && this.props.userId !== 1 && this.state.dataIjinPengajuanStaff.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={0} ijinTab={0} fetchData={this.fetchData} />
              </Grid>
            )
          }
          {
            this.state.ijinTab === 1 && this.props.userId !== 1 && this.state.dataIjinStaffSedangIjin.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={0} ijinTab={1} fetchData={this.fetchData} />
              </Grid>
            )
          }
          {
            this.state.ijinTab === 2 && this.props.userId !== 1 && this.state.dataIjinStaffSudahLewat.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={0} ijinTab={2} fetchData={this.fetchData} />
              </Grid>
            )
          }
          {
            this.state.ijinTab === 3 && this.props.userId !== 1 && this.state.dataIjinStaffDisetujui.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={0} ijinTab={3} fetchData={this.fetchData} />
              </Grid>
            )
          }
          {
            this.state.ijinTab === 4 && this.props.userId !== 1 && this.state.dataIjinSayaPengajuan.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={1} ijinTab={4} fetchData={this.fetchData} />
              </Grid>
            )
          }
          {
            this.state.ijinTab === 5 && this.props.userId !== 1 && this.state.dataIjinSayaDisetujui.map((element, index) =>
              <Grid item md={3} sm={6} key={index} style={{ padding: 10 }}>
                <CardPermintaanHRD data={element} ijinTabs={1} ijinTab={5} fetchData={this.fetchData} />
              </Grid>
            )
          }
        </Grid>

        {
          this.state.openModal && <ModalCreateEditPermintaanHRD status={this.state.openModal} handleCloseModal={this.handleCloseModal} fetchData={this.fetchData} />
        }

      </>
    )
  }
}

const mapDispatchToProps = {
  fetchDataContactUs,
}

const mapStateToProps = ({ loading, userId, sisaCuti, dataContactUs, dataContactUsStaff, evaluator1, evaluator2, bawahan, firstHierarchy }) => {
  return {
    loading,
    userId,
    sisaCuti,
    dataContactUs,
    dataContactUsStaff,
    evaluator1,
    evaluator2,
    bawahan,
    firstHierarchy,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HR)