import React, { Component, lazy } from 'react'

import {
  Grid, CircularProgress, Paper, Tabs, Tab, Divider, TextField, Button,
  // TablePagination, 
  Select, MenuItem, FormControl, FormControlLabel, Checkbox, Switch
  // Checkbox
} from '@material-ui/core';

const CardKeamanan = lazy(() => import('../../components/setting/cardKeamanan'));
const CardAktifitas = lazy(() => import('../../components/setting/cardAktifitas'));

export default class SettingKeamanan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelTab: ['Semua'],
      indexMenu: 0,
      search: '',
      value: 0,
      limitError: '',
      timesError: '',
      waktuError: '',
      limit: '',
      times: '',
      waktu: '',
      otomatisLogout: false,
      resetPassword: false,
      oneBrowser: false,
      onePhone: false,
      otomatisLogout2: false,
      totalIP: '',
    }
  }


  handleSearch = async () => {
    let data = await this.state.dataForDisplay.filter(el => el.room.toLowerCase().match(new RegExp(this.state.search.toLowerCase())))

    this.setState({ dataForDisplay: data })
  }

  handleChangeTab = async (event, newValue) => {
    await this.setState({ value: newValue, page: 0 })
    // this.fetchDataForDisplay()
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
    })
  }

  handleChangeCheck = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    return (
      <div style={{ width: '100%', paddingTop: 0 }}>
        {
          this.state.loading
            ? <div style={{ textAlign: 'center' }}>
              <CircularProgress color="secondary" style={{ marginTop: 20 }} />
            </div>
            : <Grid>
              <Grid style={{ display: 'flex', margin: '20px 0px 20px 10px' }}>
                <p style={{ fontSize: 20, fontWeight: this.state.indexMenu === 0 ? 'bold' : null, margin: 0, cursor: 'pointer' }} onClick={() => this.setState({ indexMenu: 0 })}>Keamanan</p>
                <p style={{ fontSize: 20, margin: '0px 30px' }}>|</p>
                <p style={{ fontSize: 20, fontWeight: this.state.indexMenu === 1 ? 'bold' : null, margin: 0, cursor: 'pointer' }} onClick={() => this.setState({ indexMenu: 1 })}>Aktifitas</p>
                <p style={{ fontSize: 20, margin: '0px 30px' }}>|</p>
                <p style={{ fontSize: 20, fontWeight: this.state.indexMenu === 2 ? 'bold' : null, margin: 0, cursor: 'pointer' }} onClick={() => this.setState({ indexMenu: 2 })}>Pengaturan</p>
              </Grid>

              {
                this.state.indexMenu !== 2 && <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                  {
                    this.state.indexMenu === 0 && <>
                      <Tabs
                        value={this.state.value}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={this.handleChangeTab}
                      >
                        <Tab label="Semua" style={{ marginRight: 10, minWidth: 80 }} />
                        <Tab label="Aktif" style={{ marginRight: 10, minWidth: 80 }} />
                        <Tab label="Tidak Aktif" style={{ minWidth: 80 }} />
                      </Tabs>
                      <Divider />
                    </>
                  }
                  <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    {/* <form style={{ width: '100%', marginRight: 15, marginTop: 3 }}> */}
                    <TextField
                      id="pencarian"
                      placeholder="cari berdasarkan nama ruang"
                      variant="outlined"
                      value={this.state.search}
                      onChange={this.handleChange('search')}
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
              }

              {
                this.state.indexMenu === 0 && <>
                  <Paper id="header" style={{ display: 'flex', padding: '15px 20px', borderRadius: 0, alignItems: 'center' }}>
                    <Grid style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                      <p style={{ margin: 0 }}>Karyawan</p>
                    </Grid>
                    <p style={{ margin: 0, width: '15%' }}>perangkat</p>
                    <p style={{ margin: 0, width: '15%' }}>log in</p>
                    <p style={{ margin: 0, width: '20%' }}>aktifitas terakhir</p>
                    <p style={{ margin: 0, width: '20%', textAlign: 'center' }}>Aksi</p>
                  </Paper>
                  <CardKeamanan />
                </>
              }

              {
                this.state.indexMenu === 1 && <>
                  <Paper id="header" style={{ display: 'flex', padding: '15px 20px', borderRadius: 0, alignItems: 'center' }}>
                    <Grid style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                      <p style={{ margin: 0 }}>Karyawan</p>
                    </Grid>
                    <p style={{ margin: 0, width: '15%' }}>page</p>
                    <p style={{ margin: 0, width: '15%' }}>action</p>
                    <p style={{ margin: 0, width: '20%' }}>datetime</p>
                  </Paper>
                  <CardAktifitas />
                </>
              }

              {
                this.state.indexMenu === 2 && <Grid>
                  <p style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 17 }}>Ambang batas masuk</p>
                  <p style={{ margin: 0, marginBottom: 10 }}>Pengaturan jumlah user dapat salah input password sehingga perlu verifikasi melalui email.</p>

                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                    <p style={{ margin: 0 }}>Mengijinkan kesalahan hingga</p>
                    <TextField
                      value={this.state.limitError}
                      onChange={this.handleChange('limitError')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, width: 80, padding: 0, margin: '0px 5px' }
                      }}
                      disabled={this.state.proses}
                    />
                    <p style={{ margin: 0 }}>kali dalam jangka waktu</p>
                    <TextField
                      value={this.state.limitError}
                      onChange={this.handleChange('limitError')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, width: 80, padding: 0, margin: '0px 5px' }
                      }}
                      disabled={this.state.proses}
                    />
                    <FormControl variant="outlined" style={{ margin: '0px 5px' }}>
                      <Select
                        value={this.state.waktuError}
                        onChange={this.handleChange('waktuError')}
                        style={{ width: 100, marginRight: 10, height: 35 }}
                        disabled={this.state.proses}
                      >
                        <MenuItem value="Menit" >Menit</MenuItem>
                        <MenuItem value="Jam" >Jam</MenuItem>
                        <MenuItem value="Hari" >Hari</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.otomatisLogout}
                          onChange={this.handleChangeCheck}
                          name="otomatisLogout"
                          style={{ marginRight: 0 }}
                        />
                      }
                      size="small"
                      style={{ marginRight: 0 }}
                    />
                    <p style={{ margin: 0, marginRight: 5 }}>otomatis keluar semua perangkat {'&'} </p>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.CheckboxresetPassword}
                          onChange={this.handleChangeCheck}
                          name="CheckboxresetPassword"
                          style={{ marginRight: 0 }}
                        />
                      }
                      size="small"
                      style={{ marginRight: 0 }}
                    />
                    <p style={{ margin: 0 }}>reset password apabila salah masuk hingga </p>
                    <TextField
                      value={this.state.limit}
                      onChange={this.handleChange('limit')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, width: 80, padding: 0, margin: '0px 5px' }
                      }}
                      disabled={this.state.proses}
                    />
                    <p style={{ margin: 0 }}>kali dalam jangka waktu</p>
                    <TextField
                      value={this.state.limit}
                      onChange={this.handleChange('limit')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, width: 80, padding: 0, margin: '0px 5px' }
                      }}
                      disabled={this.state.proses}
                    />
                    <FormControl variant="outlined" style={{ margin: '0px 5px' }}>
                      <Select
                        value={this.state.waktu}
                        onChange={this.handleChange('waktu')}
                        style={{ width: 100, marginRight: 10, height: 35 }}
                        disabled={this.state.proses}
                      >
                        <MenuItem value="Menit" >Menit</MenuItem>
                        <MenuItem value="Jam" >Jam</MenuItem>
                        <MenuItem value="Hari" >Hari</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Button color="secondary" variant="contained">
                    Simpan
                  </Button>


                  <p style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 17 }}>Deteksi IP berdasarkan ID perangkat.</p>
                  <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 630 }}>
                    <p style={{ margin: 0, marginBottom: 10 }}>1 user hanya dapat masuk ke 1 perangkat browser</p>
                    <Switch
                      checked={this.state.oneBrowser}
                      onChange={this.handleChangeCheck}
                      name="oneBrowser"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </Grid>

                  <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 630 }}>
                    <p style={{ margin: 0, marginBottom: 10 }}>1 user hanya dapat masuk ke 1 perangkat handphone</p>
                    <Switch
                      checked={this.state.onePhone}
                      onChange={this.handleChangeCheck}
                      name="onePhone"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </Grid>

                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.otomatisLogout2}
                          onChange={this.handleChangeCheck}
                          name="otomatisLogout2"
                          style={{ marginRight: 0 }}
                        />
                      }
                      size="small"
                      style={{ marginRight: 0 }}
                    />
                    <p style={{ margin: 0, marginRight: 5 }}>otomatis keluar semua perangkat apabila terdeteksi</p>
                    <TextField
                      value={this.state.totalIP}
                      onChange={this.handleChange('totalIP')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, width: 80, padding: 0, margin: '0px 5px' }
                      }}
                      disabled={this.state.proses}
                    />
                    <p style={{ margin: 0 }}>ip address berbeda tercatat masuk bersamaan</p>

                  </Grid>
                </Grid>
              }
              {/* {
                this.state.dataForDisplay.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((room, index) =>
                  <CardRoom data={room} key={'room' + index} refresh={this.refresh} />
                )
              } */}
              {/* <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={this.state.dataForDisplay.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'next page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              /> */}
            </Grid>
        }
      </div>
    )
  }
}
