import React, { Component, lazy } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper, TablePagination
} from '@material-ui/core';

import { fetchDataRoomMaster } from '../../store/action';

const CardRoomMaster = lazy(() => import('../../components/facility/cardRoomMaster'));

class RoomMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
    }
  }

  componentDidMount() {
    this.props.fetchDataRoomMaster()
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: this.state.rowsPerPage + event.target.value,
      page: 0
    })
  }

  render() {
    return (
      <div>
        <Link to="/booking-room/room-master/assign-room-master">
          Assign Room Master</Link>

        <Paper style={{
          width: '70%',
          margin: '30px auto',
          overflowX: 'auto',
        }}>
          <Table style={{ minWidth: '650' }} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ width: '10%' }}>No</TableCell>
                <TableCell align="center" style={{ width: '40%' }}>Name</TableCell>
                <TableCell align="center" style={{ width: '30%' }}>Perusahaan</TableCell>
                <TableCell align="center" style={{ width: '20%' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.props.dataRoomMaster.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((element, index) => (
                  <CardRoomMaster key={index} data={element} index={index} />
                ))
              }
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={this.props.dataRoomMaster.length}
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
        </Paper>
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataRoomMaster,
}

const mapStateToProps = ({ loading, dataRoomMaster, error }) => {
  return {
    loading,
    dataRoomMaster,
    error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomMaster)
