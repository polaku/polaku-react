import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import Cookies from 'js-cookie';

import {
  Grid, CircularProgress, Paper, Tabs, Tab, Divider, TextField, Button,
  // Checkbox
} from '@material-ui/core';

import CardAddress from './cardAddress';
// import SeCreatableSelect from 'react-select/creatable';
// import makeAnimated from 'react-select/animated';

import { fetchDataUsers, fetchDataAddress } from '../../store/action';

import ModalLogAddress from '../modal/modalLogAddress';

class panelAddress extends Component {
  state = {
    labelTab: ['Semua'],
    search: '',
    value: 0,
    index: 0,
    selectAll: false,
    check: false,
    data: [],
    dataForDisplay: [],
    dataForEdit: [],

    openModalLogAddress: false
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

    if (this.state.dataForEdit !== prevState.dataForEdit) {
      console.log(this.state.dataForEdit)
    }
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

  handleChangeTab = (event, newValue) => {
    this.setState({ value: newValue })
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

  handleModalLogAddress = () => {
    this.setState({
      openModalLogAddress: !this.state.openModalLogAddress
    })
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
              <Grid style={{ display: 'flex', margin: 10 }}>
                {/* <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={process.env.PUBLIC_URL + '/edit-address.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Ubah banyak</p>
                </Grid> */}
                {/* <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={process.env.PUBLIC_URL + '/add-address.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Tambah banyak</p>
                </Grid> */}
                <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-address')}>
                  <img src={process.env.PUBLIC_URL + '/add-address.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Tambah alamat</p>
                </Grid>
                <p style={{ color: '#d71149', margin: 0 }} onClick={this.handleModalLogAddress}>Lihat riwayat perubahan</p>
              </Grid>

              <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                <Tabs
                  value={this.state.value}
                  indicatorColor="secondary"
                  textColor="secondary"
                  onChange={this.handleChangeTab}
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
                    placeholder="cari berdasarkan nama jalan"
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
                <Grid style={{ display: 'flex', alignItems: 'center', width: '40%' }}>
                  {/* <Checkbox
                    checked={this.state.check}
                    onChange={this.handleChangeCheck}
                    value="secondary"
                    color="secondary"
                    size="small"
                  /><p style={{ margin: 0 }}>pilih untuk lakukan aksi</p> */}
                  <p style={{ margin: 0 }}>Alamat</p>
                </Grid>
                <p style={{ margin: 0, width: '20%' }}>Perusahaan</p>
                <p style={{ margin: 0, width: '20%' }}>Karyawan</p>
                <p style={{ margin: 0, width: '20%', textAlign: 'center' }}>Aksi</p>
              </Paper>

              {
                this.state.dataForDisplay.map((address, index) =>
                  <CardAddress key={index} data={address} selectAll={this.state.selectAll} handleCheck={this.handleCheck} fetchData={this.fetchData} />
                )
              }

            </Grid>
        }
        {
          this.state.openModalLogAddress && <ModalLogAddress status={this.state.openModalLogAddress} close={this.handleModalLogAddress} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(panelAddress))