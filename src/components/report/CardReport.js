import React, { Component } from 'react'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export default class CardReport extends Component {
  state = {
    statusIjin: '',
    tglMulai: '',
    timeImpMulai: '',
    tglSelesai: '',
    timeImpSelesai: '',
    lamaIjin: '',
    sisaCuti: ''
  }

  componentDidMount() {
    if (this.props.data.categori_id === 6) {
      this.setState({
        statusIjin: "Cuti",
        tglMulai: `${this.props.data.leave_date.slice(8, 10)}/${this.props.data.leave_date.slice(5, 7)}/${this.props.data.leave_date.slice(0, 4)}`,
        tglSelesai: `${this.props.data.leave_date_in.slice(8, 10)}/${this.props.data.leave_date_in.slice(5, 7)}/${this.props.data.leave_date_in.slice(0, 4)}`,
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
      this.setState({
        statusIjin: "Ijin Absen",
        tglMulai: `${this.props.data.date_ijin_absen_start.slice(8, 10)}/${this.props.data.date_ijin_absen_start.slice(5, 7)}/${this.props.data.date_ijin_absen_start.slice(0, 4)}`,
        tglSelesai: `${this.props.data.date_ijin_absen_end.slice(8, 10)}/${this.props.data.date_ijin_absen_end.slice(5, 7)}/${this.props.data.date_ijin_absen_end.slice(0, 4)}`,
        lamaIjin: `${Number(this.props.data.date_ijin_absen_end.slice(8, 10)) - Number(this.props.data.date_ijin_absen_start.slice(8, 10)) + 1} hari`
      })
    }

    if (this.props.data.tbl_user) {
      this.setState({
        sisaCuti: this.props.data.tbl_user.tbl_account_detail.leave
      })
    }
  }

  render() {
    return (
      <>
        {
          this.props.data.statusIjin && <TableRow  >{/* Untuk report Ijin */}
            <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center', height: 80 }}>
              {this.props.data.name}
            </TableCell>
            <TableCell>{this.props.data.tglMulai}</TableCell>
            <TableCell>{this.props.data.tglSelesai}</TableCell>
            <TableCell>{this.props.data.lamaIjin}</TableCell>
            <TableCell>{this.props.data.statusIjin}</TableCell>
            <TableCell>{this.props.data.sisaCuti}</TableCell>
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

      </>
    )
  }
}
