import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import Cookies from 'js-cookie';

import {
  Grid, CircularProgress, Paper, Tabs, Tab, Divider, TextField, Button,
  // Checkbox
} from '@material-ui/core';

// import CardAddress from './cardAddress';
// import SeCreatableSelect from 'react-select/creatable';
// import makeAnimated from 'react-select/animated';

import { fetchDataUsers, fetchDataAddress } from '../../store/action';

import ModalCreateEditMuchEmployee from '../modal/modalCreateEditMuchEmployee';

class panelEmployee extends Component {
  state = {
    labelTab: ['Semua'],
    search: '',
    valueA: 0,
    valueB: 0,
    index: 0,
    selectAll: false,
    check: false,
    data: [],
    dataForDisplay: [],
    dataForEdit: [],

    openModalCreateEditMuchEmployee: false,
    isCreate: false
  }

  async componentDidMount() {
    await this.props.fetchDataAddress()
    await this.fetchData()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search && this.state.search === "") {
      this.setState({ dataForDisplay: this.state.data })
    }

    if (this.state.value !== prevState.value) {
      if (this.state.value === 0) {
        this.setState({ dataForDisplay: this.state.data })
      } else {
        let data = await this.state.data.filter(el => el.tbl_company.acronym === this.state.label[this.state.value])

        this.setState({ dataForDisplay: data })
      }
    }

    // if (this.state.dataForEdit !== prevState.dataForEdit) {
    //   console.log(this.state.dataForEdit)
    // }
  }

  fetchData = () => {
    let label = this.state.labelTab

    this.props.dataAddress.forEach(element => {
      if (label.indexOf(element.tbl_company.acronym) < 0) {
        label.push(element.tbl_company.acronym)
      }
    });

    this.setState({ data: this.props.dataAddress, dataForDisplay: this.props.dataAddress, label })
  }

  handleChangeTabA = (event, newValue) => {
    this.setState({ valueA: newValue })
  };

  handleChangeTabB = (event, newValue) => {
    this.setState({ valueB: newValue })
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, openPopOver: false })
  };

  handleChangeCheck = event => {
    this.setState({
      selectAll: event.target.checked,
      check: event.target.checked
    })
  }

  handleSearch = async () => {
    let hasilSearch = await this.state.data.filter(el => el.address.toLowerCase().match(new RegExp(this.state.search.toLowerCase())))
    this.setState({ dataForDisplay: hasilSearch })
  }

  handleModalCreateEditMuchEmployee = (args) => {
    if (!this.state.openModalCreateEditMuchEmployee) {
      let isCreate = args === "create" ? true : false;
      this.setState({
        openModalCreateEditMuchEmployee: !this.state.openModalCreateEditMuchEmployee,
        isCreate
      })
    } else {
      this.setState({
        openModalCreateEditMuchEmployee: !this.state.openModalCreateEditMuchEmployee
      })
    }

  }

  // handleCheck = async (addressId) => {
  //   let checkSelected = this.state.dataForEdit.find(el => el.id === addressId)
  //   if (checkSelected) {
  //     console.log("SUDAH ADA")
  //     let data = await this.state.dataForEdit.filter(el => el.id !== addressId)
  //     this.setState({ dataForEdit: data, check: false })
  //   } else {
  //     console.log("BELUM ADA")
  //     let selected = this.state.data.find(el => el.id === addressId)
  //     let data = this.state.dataForEdit
  //     data.push(selected)
  //     console.log(data)
  //     this.setState({ dataForEdit: data })
  //     if (data.length === this.state.dataForDisplay.length) {
  //       this.setState({ selectAll: true, check: true })
  //     }
  //   }
  // }

  render() {
    return (
      <div style={{ width: '100%', paddingTop: 0 }}>
        {
          this.state.loading
            ? <div style={{ textAlign: 'center' }}>
              <CircularProgress color="secondary" style={{ marginTop: 20 }} />
            </div>
            : <Grid>
              <Paper square style={{ padding: 10, paddingLeft: 20 }}>
                <Tabs
                  value={this.state.valueA}
                  indicatorColor="secondary"
                  textColor="secondary"
                  onChange={this.handleChangeTabA}
                >
                  <Tab label="Karyawan" style={{ marginRight: 30 }} />
                  <Tab label="Dinas" style={{ marginRight: 30 }} />
                </Tabs>
                <Divider />
              </Paper>

              {
                this.state.valueA === 0
                  // Karyawan
                  ? <>
                    <Grid style={{ display: 'flex', margin: '20px 15px' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.handleModalCreateEditMuchEmployee('edit')}>
                        <img src={process.env.PUBLIC_URL + '/edit-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Ubah banyak</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.handleModalCreateEditMuchEmployee('create')}>
                        <img src={process.env.PUBLIC_URL + '/add-much-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah banyak</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-employee')}>
                        <img src={process.env.PUBLIC_URL + '/add-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah karyawan</p>
                      </Grid>
                    </Grid>

                    <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                      <Tabs
                        value={this.state.valueB}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={this.handleChangeTabB}
                      >
                        {
                          this.state.labelTab.map((el, index) =>
                            <Tab key={index} label={el} style={{ marginRight: 10, minWidth: 80 }} />
                          )
                        }
                      </Tabs>
                      <Divider />
                      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        {/* <form style={{ width: '100%', marginRight: 15, marginTop: 3 }}> */}
                        <TextField
                          id="pencarian"
                          placeholder="Cari berdasarkan nama/nik/email"
                          variant="outlined"
                          value={this.state.search}
                          onChange={this.handleChange('search')}
                          disabled={this.state.proses}
                          style={{ width: '100%', marginRight: 15, marginTop: 3 }}
                          InputProps={{
                            style: {
                              height: 35
                            }
                          }}
                        />
                        {/* </form> */}
                        <Button onClick={this.handleSearch} variant="contained" style={{ width: 150 }}>
                          Cari
                </Button>
                      </Grid>
                    </Paper>

                    <Paper id="header" style={{ display: 'flex', padding: '15px 20px', margin: 3, borderRadius: 0, alignItems: 'center' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '25%' }}>
                        {/* <Checkbox
                    checked={this.state.check}
                    onChange={this.handleChangeCheck}
                    value="secondary"
                    color="secondary"
                    size="small"
                  /><p style={{ margin: 0 }}>pilih untuk lakukan aksi</p> */}
                        <p style={{ margin: 0 }}>Karyawan</p>
                      </Grid>
                      <p style={{ margin: 0, width: '20%' }}>Divisi</p>
                      <p style={{ margin: 0, width: '15%' }}>Evaluator 1</p>
                      <p style={{ margin: 0, width: '15%' }}>Evaluator 2</p>
                      <p style={{ margin: 0, width: '5%' }}>Status</p>
                      <p style={{ margin: 0, width: '20%', textAlign: 'center' }}>Aksi</p>
                    </Paper>

                  </>
                  // Dinas
                  : <>
                    <Grid style={{ display: 'flex', margin: '20px 15px' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }}>
                        <img src={process.env.PUBLIC_URL + '/edit-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Ubah banyak</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }}>
                        <img src={process.env.PUBLIC_URL + '/add-much-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah banyak karyawan dinas</p>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-service')}>
                        <img src={process.env.PUBLIC_URL + '/add-employee.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                        <p style={{ margin: '0px 0px 0px 5px' }}>Tambah karyawan dinas</p>
                      </Grid>
                    </Grid>

                    <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                      <Tabs
                        value={this.state.valueB}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={this.handleChangeTabB}
                      >
                        {
                          this.state.labelTab.map((el, index) =>
                            <Tab key={index} label={el} style={{ marginRight: 10, minWidth: 80 }} />
                          )
                        }
                      </Tabs>
                      <Divider />
                      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        {/* <form style={{ width: '100%', marginRight: 15, marginTop: 3 }}> */}
                        <TextField
                          id="pencarian"
                          placeholder="Cari berdasarkan nama/nik/email"
                          variant="outlined"
                          value={this.state.search}
                          onChange={this.handleChange('search')}
                          disabled={this.state.proses}
                          style={{ width: '100%', marginRight: 15, marginTop: 3 }}
                          InputProps={{
                            style: {
                              height: 35
                            }
                          }}
                        />
                        {/* </form> */}
                        <Button onClick={this.handleSearch} variant="contained" style={{ width: 150 }}>
                          Cari
              </Button>
                      </Grid>
                    </Paper>

                    <Paper id="header" style={{ display: 'flex', padding: '15px 20px', margin: 3, borderRadius: 0, alignItems: 'center' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                        {/* <Checkbox
                  checked={this.state.check}
                  onChange={this.handleChangeCheck}
                  value="secondary"
                  color="secondary"
                  size="small"
                /><p style={{ margin: 0 }}>pilih untuk lakukan aksi</p> */}
                        <p style={{ margin: 0 }}>Karyawan</p>
                      </Grid>
                      <p style={{ margin: 0, width: '25%' }}>Dinas ke perusahaan</p>
                      <p style={{ margin: 0, textAlign: 'center' }}>Aksi</p>
                    </Paper>
                  </>

              }

              {/* {
                this.state.dataForDisplay.map((address, index) =>
                  <CardAddress key={index} data={address} selectAll={this.state.selectAll} handleCheck={this.handleCheck} fetchData={this.fetchData} />
                )
              } */}

            </Grid>
        }
        {
          this.state.openModalCreateEditMuchEmployee && <ModalCreateEditMuchEmployee status={this.state.openModalCreateEditMuchEmployee} close={this.handleModalCreateEditMuchEmployee} isCreate={this.state.isCreate} />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataAddress,

}

const mapStateToProps = ({ loading, dataUsers, dataAddress }) => {
  return {
    loading,
    dataUsers,
    dataAddress
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(panelEmployee))