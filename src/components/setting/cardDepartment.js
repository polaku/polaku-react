import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import {
  Paper, Grid, Tooltip
  // Checkbox, 
} from '@material-ui/core';

import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined';
import DeleteIcon from '@material-ui/icons/Delete';

import { fetchDataStructure } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

class cardDepartment extends Component {
  state = {
    emptyPositionInDept: 0,
    emptyPositionInTeam: 0,
  }

  async componentDidMount() {
    let counterPosition = 0, counterTeamPosition = 0
    if (this.props.data.tbl_department_positions.length > 0) {
      await this.props.data.tbl_department_positions.forEach(element => {
        if (!element.user_id) counterPosition++
      });
    }

    if (this.props.data.tbl_department_teams.length > 0) {
      await this.props.data.tbl_department_teams.forEach(async (element) => {
        await element.tbl_team_positions.forEach(el => {
          if (!el.user_id) counterTeamPosition++
        })
      });
    }

    if (this.props.data.tbl_department_positions.length === 0) counterPosition++

    if (this.props.data.tbl_department_teams.length === 0) counterTeamPosition++

    this.setState({ emptyPositionInDept: counterPosition, emptyPositionInTeam: counterTeamPosition })
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
            await API.delete(`/structure/${this.props.data.id}`, { headers: { token } })
            swal("Hapus divisi sukses", "", "success")
            await this.props.fetchDataStructure()
            await this.props.fetchData()
          } catch (err) {
            swal("Hapus divisi gagal", "", "error")
          }
        }
      });
  }

  render() {
    return (
      <Paper style={{ display: 'flex', padding: '15px 20px', margin: 1, borderRadius: 0, alignItems: 'center' }}>
        <p style={{ margin: 0, width: '30%' }}>{this.props.data.department.deptname}</p>
        <b style={{ margin: 0, width: '10%', textAlign: 'center' }}>{this.props.data.hierarchy}</b>
        <p style={{ margin: 0, width: '15%', textAlign: 'center' }}>{this.props.data.section.deptname}</p>
        <p style={{ margin: 0, width: '10%', textAlign: 'center' }}>{this.props.data.tbl_department_positions.length}</p>
        <p style={{ margin: 0, width: '10%', textAlign: 'center' }}>{this.props.data.tbl_department_teams.length}</p>
        <Grid style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid style={{ width: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            {
              (this.state.emptyPositionInDept > 0 || this.state.emptyPositionInTeam > 0)
                ? <Tooltip title={
                  (this.state.emptyPositionInDept > 0 && this.state.emptyPositionInTeam > 0)
                    ? `${this.state.emptyPositionInDept} Peran di Divisi, ${this.state.emptyPositionInTeam} Peran di Seluruh Tim`
                    : this.state.emptyPositionInDept > 0
                      ? `${this.state.emptyPositionInDept} Peran di Divisi`
                      : `${this.state.emptyPositionInTeam} Peran di Seluruh Tim`
                } aria-label="lengkapi-data">
                  <ErrorOutlinedIcon style={{ color: 'red' }} />
                </Tooltip>
                : <Grid style={{ width: 24 }} />
            }
            <Tooltip title="Edit divisi" aria-label="edit-data">
              <img src={process.env.PUBLIC_URL + '/edit.png'} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center', cursor: 'pointer' }} onClick={() => this.props.history.push('/setting/setting-perusahaan/add-department', { data: this.props.data, index: this.props.location.state.index })} />
            </Tooltip>
            <Tooltip title="Hapus divisi" aria-label="delete-data">
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

export default connect(null, mapDispatchToProps)(withRouter(cardDepartment))