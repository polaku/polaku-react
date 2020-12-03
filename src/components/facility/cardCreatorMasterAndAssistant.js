import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import publicIp from 'public-ip';

import {
  TableRow, TableCell, IconButton,
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

import { fetchDataCreatorMasterAndAssistant } from '../../store/action';
import { API } from '../../config/API';

import swal from 'sweetalert';

class cardCreatorMasterAndAssistant extends Component {
  delete = async () => {
    let token = Cookies.get('POLAGROUP')

    API.delete(`/events/masterCreator/${this.props.data.master_creator_id}`, {
      headers: {
        token,
        ip: await publicIp.v4()
      }
    })
      .then(() => {
        this.props.refresh()
      })
      .catch(err => {
        swal('please try again')
      })
  }
  render() {
    return (
      <TableRow>
        <TableCell align="center" >{this.props.index}</TableCell>
        <TableCell>{this.props.data.tbl_user.tbl_account_detail.fullname}</TableCell>
        <TableCell align="center">
          <IconButton aria-label="delete" onClick={this.delete}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }
}

const mapDispatchToProps = {
  fetchDataCreatorMasterAndAssistant,
}

export default connect(null, mapDispatchToProps)(cardCreatorMasterAndAssistant)
