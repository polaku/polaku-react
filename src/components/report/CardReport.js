import React, { Component, lazy } from 'react'
import Cookies from 'js-cookie';

import { TableCell, TableRow, Checkbox, IconButton, Tooltip } from '@material-ui/core';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { API } from '../../config/API';

import swal from 'sweetalert';
import { connect } from 'react-redux';

const ModalDetailUser = lazy(() => import('../modal/modalDetailUser'));

class CardReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusIjin: '',
      tglMulai: '',
      timeImpMulai: '',
      tglSelesai: '',
      timeImpSelesai: '',
      lamaIjin: '',
      sisaCuti: '',

      //setting user
      isActive: false,
      openModalDetailUser: false,
    }
  }

  componentDidMount() {
    if (this.props.data.categori_id === 6) {
      let dateOut
      if (this.props.data.leave_date_in) {
        dateOut = `${this.props.data.leave_date_in.slice(8, 10)}/${this.props.data.leave_date_in.slice(5, 7)}/${this.props.data.leave_date_in.slice(0, 4)}`
      } else {
        // dateOut = new Date
        //   (this.props.data.leave_date.slice(this.props.data.leave_date.length - 10, this.props.data.leave_date.length - 6),
        //     this.props.data.leave_date.slice(this.props.data.leave_date.length - 5, this.props.data.leave_date.length - 3) - 1,
        //     this.props.data.leave_date.slice(this.props.data.leave_date.length - 2, this.props.data.leave_date.length))
        let leaveDate = this.props.data.leave_date.split(',')
        dateOut = `${leaveDate[leaveDate.length - 1].slice(8, 10)}/${leaveDate[leaveDate.length - 1].slice(5, 7)}/${leaveDate[leaveDate.length - 1].slice(0, 4)}`
      }

      this.setState({
        statusIjin: "Cuti",
        tglMulai: `${this.props.data.leave_date.slice(8, 10)}/${this.props.data.leave_date.slice(5, 7)}/${this.props.data.leave_date.slice(0, 4)}`,
        tglSelesai: dateOut,
        lamaIjin: `${this.props.data.leave_request} hari`
      })
    } else if (this.props.data.categori_id === 7) {
      this.setState({
        statusIjin: "IMP",
        tglMulai: `${this.props.data.date_imp.slice(8, 10)}/${this.props.data.date_imp.slice(5, 7)}/${this.props.data.date_imp.slice(0, 4)}`,
        tglSelesai: `${this.props.data.date_imp.slice(8, 10)}/${this.props.data.date_imp.slice(5, 7)}/${this.props.data.date_imp.slice(0, 4)}`,
        lamaIjin: `${Number(this.props.data.end_time_imp.slice(0, 2)) - Number(this.props.data.start_time_imp.slice(0, 2))} jam`,
        timeImpMulai: this.props.data.start_time_imp.slice(0, 5),
        timeImpSelesai: this.props.data.end_time_imp.slice(0, 5),
      })

    } else if (this.props.data.categori_id === 8) {
      let tglMulai, tglSelesai, lamaIjin, ijinAbsenDate = this.props.data.date_ijin_absen_start.split(',')

      if (this.props.data.date_ijin_absen_end) {
        tglMulai = `${ijinAbsenDate[0].slice(8, 10)}/${ijinAbsenDate[0].slice(5, 7)}/${ijinAbsenDate[0].slice(0, 4)}`
        tglSelesai = `${this.props.data.date_ijin_absen_end.slice(8, 10)}/${this.props.data.date_ijin_absen_end.slice(5, 7)}/${this.props.data.date_ijin_absen_end.slice(0, 4)}`
        lamaIjin = `${Number(this.props.data.date_ijin_absen_end.slice(8, 10)) - Number(this.props.data.date_ijin_absen_start.slice(8, 10)) + 1} hari`
      } else {
        tglMulai = `${ijinAbsenDate[0].slice(8, 10)}/${ijinAbsenDate[0].slice(5, 7)}/${ijinAbsenDate[0].slice(0, 4)}`
        tglSelesai = `${ijinAbsenDate[ijinAbsenDate.length - 1].slice(8, 10)}/${ijinAbsenDate[ijinAbsenDate.length - 1].slice(5, 7)}/${ijinAbsenDate[ijinAbsenDate.length - 1].slice(0, 4)}`
        lamaIjin = `${ijinAbsenDate.length} hari`
      }

      this.setState({
        statusIjin: "Ijin Absen",
        tglMulai,
        tglSelesai,
        lamaIjin
      })
    }

    if (this.props.data.tbl_user) {
      this.setState({
        sisaCuti: this.props.data.tbl_user.tbl_account_detail.leave
      })
    }

    if (this.props.data.nik) {
      this.setState({
        isActive: this.props.data.isActive
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.nik !== this.props.data.nik) {
      this.setState({
        isActive: this.props.data.isActive
      })
    }
  }

  handleChangeCheck = async (event) => {
    this.setState({
      isActive: event.target.checked
    })

    let token = Cookies.get('POLAGROUP')

    API.put(`/users/editUser/${this.props.data.userId}`, { isActive: event.target.checked }, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(() => {
        this.props.refresh()
      })
      .catch(err => {
        if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
          swal('Gagal', 'Koneksi tidak stabil', 'error')
        } else {
          swal('please try again')
        }
      })
  }

  handleModalDetailUser = () => {
    this.setState({
      openModalDetailUser: !this.state.openModalDetailUser
    })
  }

  render() {
    return (
      <>
        {
          this.props.data.statusIjin && <TableRow  >{/* Untuk report Ijin */}
            <TableCell component="th" scope="row" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 80 }}>
              <b style={{fontSize:15}}>{this.props.data.name}</b>
              <p style={{ margin: 0 }}>Keterangan: {this.props.data.message}</p>
              {
                this.props.data.doctor_letter && <a href={`${this.props.data.doctor_letter}`} style={{ margin: 0 }}>Lampiran</a>
              }
            </TableCell>
            <TableCell>{this.state.tglMulai}</TableCell>
            <TableCell>{this.state.tglSelesai}</TableCell>
            <TableCell>{this.state.lamaIjin}</TableCell>
            <TableCell>{this.state.statusIjin}</TableCell>
            <TableCell>{this.state.sisaCuti}</TableCell>
          </TableRow>
        }

        {
          this.props.data.kpim && <TableRow  >{/* Untuk report KPIM */}
            <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center', height: 80 }}>
              {this.props.data.name}
            </TableCell>
            <TableCell>{this.props.data.totalNilai}</TableCell>
            <TableCell>{this.props.data.tal}</TableCell>
            <TableCell>{this.props.data.kpim}</TableCell>
          </TableRow>
        }

        {
          this.props.data.nik && <>
            <TableRow  >{/* Untuk SETTING USER */}
              <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center', height: 80, padding: 13 }}>
                {this.props.data.company}
              </TableCell>
              <TableCell style={{ padding: 13 }}>{this.props.data.name}</TableCell>
              <TableCell style={{ padding: 13 }}>{this.props.data.username}</TableCell>
              <TableCell style={{ padding: 13 }}>{this.props.data.initial}</TableCell>
              <TableCell style={{ padding: 13 }}>{this.props.data.nik}</TableCell>
              <TableCell style={{ padding: 13 }}>{this.props.data.evaluator1}</TableCell>
              <TableCell style={{ padding: 13 }}>{this.props.data.evaluator2}</TableCell>
              <TableCell style={{ padding: 13 }}>
                <Tooltip title={this.state.isActive ? "Jadikan non aktif" : "Jadikan aktif"} placement="top-end">
                  <Checkbox
                    checked={this.state.isActive}
                    onChange={this.handleChangeCheck}
                    value="secondary"
                    color="secondary"
                  />
                </Tooltip>

              </TableCell>
              <TableCell style={{ padding: 13 }}>
                <IconButton aria-label="detail" onClick={this.handleModalDetailUser}>
                  <Tooltip title="detail user" placement="top-end">
                    <AccountCircleIcon />
                  </Tooltip>
                </IconButton>
              </TableCell>
            </TableRow>
            {
              this.state.openModalDetailUser && <ModalDetailUser status={this.state.openModalDetailUser} closeModal={this.handleModalDetailUser} data={this.props.data} refresh={this.props.refresh} />
            }
          </>
        }

      </>
    )
  }
}

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps)(CardReport)