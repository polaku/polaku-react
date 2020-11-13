import React, { Component } from 'react';
import Cookies from 'js-cookie';

import {
  Modal, Fade, Grid, Backdrop, Typography, Button, Table, TableCell, TableRow, TableBody, TableHead, TablePagination, Select, MenuItem

} from '@material-ui/core';

import { API } from '../../config/API';

import swal from 'sweetalert';

export default class modalLogSetting
  extends Component {
  state = {
    data: [],
    page: 0,
    rowsPerPage: 5,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    optionMonth: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    optionYear: [new Date().getFullYear() - 1, new Date().getFullYear()]
  }

  async componentDidMount() {
    await this.fetchData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.month !== prevState.month) {
      this.setState({ page: 0 })
      this.fetchData()
    }

    if (this.state.year !== prevState.year) {
      this.setState({ page: 0 })
      this.fetchData()
    }
  }

  fetchData = async () => {
    try {
      let year = this.state.year, month = this.state.month, date;

      if (month < 10) {
        month = `0${month}`
      }

      date = `${year}-${month}-01`
      let token = Cookies.get('POLAGROUP')
      let { data } = await API.get(`/${this.props.type}/log?date=${date}`, { headers: { token } })
      this.setState({ data: data.data })
    } catch (err) {
      console.log(err)
      swal("Pengambilan data gagal", "Silahkan coba lagi", "warning")
    }
  }

  handleChange = name => async event => {
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
            width: this.props.type === "designation" ? 850 : 750,
            maxHeight: '90%',
            display: 'flex',
            flexDirection: 'column',
            padding: '30px 20px',
            overflowY: 'auto'
          }}>
            <Typography style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 15 }}>Riwayat Perubahan {
              this.props.type === "address"
                ? "Alamat"
                : this.props.type === "structure"
                  ? "Struktur"
                  : this.props.type === "users"
                    ? "Karyawan"
                    : this.props.type === "dinas"
                      ? "Dinas"
                      : this.props.type === "designation" && "Admin"
            }</Typography>
            <Grid style={{ marginBottom: 10, textAlign: 'right' }}>
              <Select
                value={this.state.month}
                onChange={this.handleChange('month')}
                style={{ width: 'auto', marginRight: 10 }}
              >
                {
                  this.state.optionMonth.map((month, index) =>
                    <MenuItem value={index + 1} key={index}>{month}</MenuItem>
                  )
                }
              </Select>
              <Select
                value={this.state.year}
                onChange={this.handleChange('year')}
                style={{ width: 'auto' }}
              >
                {
                  this.state.optionYear.map((year, index) =>
                    <MenuItem value={year} key={index}>{year}</MenuItem>
                  )
                }
              </Select>
            </Grid>
            {
              this.props.type === 'designation'
                ? <Table style={{ padding: '14px 16px 14px 16px', }}>
                  <TableHead style={{ backgroundColor: '#f8f8f8' }}>
                    <TableRow>
                      <TableCell align="center" style={{ width: '5%', padding: '14px 16px 14px 16px' }}>
                        No
                      </TableCell>
                      <TableCell align="center" style={{ width: '20%', padding: '14px 16px 14px 16px' }} >
                        Pengguna
                      </TableCell>
                      <TableCell align="center" style={{ width: '20%', padding: '14px 16px 14px 16px' }} >
                        Perusahaan
                      </TableCell>
                      <TableCell align="center" style={{ width: '15%', padding: '14px 16px 14px 16px' }}>
                        Karyawan
                      </TableCell>
                      <TableCell align="center" style={{ width: '15%', padding: '14px 16px 14px 16px' }}>
                        Admin
                      </TableCell>
                      <TableCell align="center" style={{ width: '10%', padding: '14px 16px 14px 16px' }} >
                        Aksi
                      </TableCell>
                      <TableCell align="center" style={{ width: '15%', padding: '14px 16px 14px 16px' }}>
                        Tanggal
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((element, index) => (
                        <TableRow key={index}>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center" >{(index + 1) + (5 * this.state.page)}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center">{element.action_by.split('-')[1]}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center">{element.company}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }}>{element.employee}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }}>{element.admin}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center">{element.action}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center">{element.createdAt.slice(0, 10)}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>

                : <Table style={{ padding: '14px 16px 14px 16px', }}>
                  <TableHead style={{ backgroundColor: '#f8f8f8' }}>
                    <TableRow>
                      <TableCell align="center" style={{ width: '5%', padding: '14px 16px 14px 16px' }}>
                        No
                    </TableCell>
                      <TableCell align="center" style={{ width: '20%', padding: '14px 16px 14px 16px' }} >
                        Pengguna
                    </TableCell>
                      <TableCell align="center" style={{ width: '20%', padding: '14px 16px 14px 16px' }} >
                        Perusahaan
                    </TableCell>
                      <TableCell align="center" style={{ width: '30%', padding: '14px 16px 14px 16px' }}>
                        {
                          this.props.type === "address"
                            ? "Alamat"
                            : this.props.type === "structure"
                              ? "Departemen"
                              : (this.props.type === "users" || this.props.type === "dinas")
                              && "Karyawan"
                        }
                      </TableCell>
                      <TableCell align="center" style={{ width: '10%', padding: '14px 16px 14px 16px' }} >
                        Aksi
                    </TableCell>
                      <TableCell align="center" style={{ width: '15%', padding: '14px 16px 14px 16px' }}>
                        Tanggal
                    </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((element, index) => (
                        <TableRow key={index}>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center" >{(index + 1) + (5 * this.state.page)}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center">{element.action_by.split('-')[1]}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center">{element.company}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }}>
                            {
                              this.props.type === "address"
                                ? element.address
                                : this.props.type === "structure"
                                  ? element.department
                                  : (this.props.type === "users" || this.props.type === "dinas")
                                  && element.employee
                            }</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center">{element.action}</TableCell>
                          <TableCell style={{ padding: '10px 15px 10px 15px' }} align="center">{element.createdAt.slice(0, 10)}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
            }

            <TablePagination
              rowsPerPageOptions={5}
              component="div"
              count={this.state.data.length}
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
            />
            <Button variant="contained" color="secondary" style={{ margin: '0px auto 0px auto', width: 100 }} onClick={this.props.close}>
              Kembali
            </Button>
          </Grid>
        </Fade>
      </Modal>
    )
  }
}
