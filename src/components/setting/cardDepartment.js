import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  Paper, Grid, Tooltip
} from '@material-ui/core';

import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined';
import DeleteIcon from '@material-ui/icons/Delete';

import { fetchDataStructure } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

class cardDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusEmpty: ''
    }
  }

  async componentDidMount() {
    let counterPosition = 0, emptyPosition = false
    // counterTeamPosition = 0, emptyTeamPosition = 0

    if (this.props.data.tbl_department_positions.length === 0) emptyPosition = true
    if (this.props.data.tbl_department_positions.length > 0) {
      await this.props.data.tbl_department_positions.forEach(element => {
        if (!element.user_id) counterPosition++
      });
    }

    // if (this.props.data.tbl_department_teams.length > 0) {
    //   await this.props.data.tbl_department_teams.forEach(async (element) => {
    //     if (element.tbl_team_positions.length === 0) emptyTeamPosition++
    //     await element.tbl_team_positions.forEach(el => {
    //       if (!el.user_id) counterTeamPosition++
    //     })
    //   });
    // }

    let status = []
    if (emptyPosition) status.push('Department Tanpa Posisi')
    if (!emptyPosition && counterPosition > 0) status.push(`${counterPosition} Posisi di Department`)
    // if (emptyTeamPosition > 0) status.push(`${emptyTeamPosition} Team Tanpa Posisi`)
    // if (counterTeamPosition > 0) status.push(`${counterTeamPosition} Posisi di Seluruh Tim`)

    this.setState({ statusEmpty: status.join(',') })
  }

  handleChangeCheck = event => {
    this.setState({
      check: event.target.checked
    })
    this.props.handleCheck(this.props.data.id)
  }

  delete = () => {
    swal({
      title: "Apa anda yakin ingin menghapusnya?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (yesAnswer) => {
        if (yesAnswer) {
          try {
            let token = Cookies.get('POLAGROUP')
            await API.delete(`/structure/${this.props.data.id}`, {
              headers: {
                token,
                ip: this.props.ip
              }
            })
            swal("Hapus department sukses", "", "success")
            await this.props.refresh()
          } catch (err) {
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else {
              swal("Hapus department gagal", "", "error")
            }
          }
        }
      });
  }

  render() {
    return (
      <Paper style={{ display: 'flex', padding: '15px 20px', margin: 1, borderRadius: 0, alignItems: 'center' }}>
        <p style={{ margin: 0, width: '30%' }}>{this.props.data.department.deptname}</p>
        <b style={{ margin: 0, width: '10%', textAlign: 'center' }}>{this.props.data.hierarchy}</b>
        {/* <p style={{ margin: 0, width: '15%', textAlign: 'center' }}>{this.props.data.section.deptname}</p> */}
        <p style={{ margin: 0, width: '25%', textAlign: 'center' }}>{this.props.data.section ? this.props.data.section.deptname : '-'}</p>
        <p style={{ margin: 0, width: '10%', textAlign: 'center' }}>{this.props.data.tbl_department_positions.length}</p>
        {/* <p style={{ margin: 0, width: '10%', textAlign: 'center' }}>{this.props.data.tbl_department_teams.length}</p> */}
        <Grid style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid style={{ width: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            {
              this.state.statusEmpty
                ? <Tooltip title={this.state.statusEmpty} aria-label="lengkapi-data">
                  <ErrorOutlinedIcon style={{ color: 'red' }} />
                </Tooltip>
                : <Grid style={{ width: 24 }} />
            }
            <Tooltip title="Edit department" aria-label="edit-data">
              <img src={require('../../Assets/edit.png').default} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-department', { data: this.props.data, index: this.props.index })} />
            </Tooltip>
            <Tooltip title="Hapus department" aria-label="delete-data">
              <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={this.delete} />
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

const mapDispatchToProps = {
  fetchDataStructure
}

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(cardDepartment))