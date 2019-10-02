import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { fetchDataCreatorMasterAndAssistant } from '../store/action';
import { API } from '../config/API';

class cardCreatorMasterAndAssistant extends Component {
  delete = () => {
    let token = localStorage.getItem('token')

    API.delete(`/events/masterCreator/${this.props.data.master_creator_id}`, { headers: { token } })
      .then(() => {
        this.props.fetchDataCreatorMasterAndAssistant()
      })
      .catch(err => {
        console.log(err);
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
