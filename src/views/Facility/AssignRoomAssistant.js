import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, TablePagination
} from '@material-ui/core';

import ModalCreateEditRoomAssistant from '../../components/modal/modalCreateEditRoomAssistant';
import CardRoomAssistant from '../../components/facility/cardRoomAssistant';

import { fetchDataRoomMaster, fetchDataRooms } from '../../store/action';

class AssignRoomAssistant extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      data: [],
      openModal: false,
      page: 0,
      rowsPerPage: 5,
    }
  }

  componentDidMount() {
    this._isMounted = true
    this._isMounted && this.fetchData()
  }

  componentWillUnmount() {
    this._isMounted = false
  }
  

  fetchData = async () => {
    await this.props.fetchDataRoomMaster()
    await this.props.fetchDataRooms()

    let dataRoomMaster = this.props.dataRoomMaster.filter(element => element.chief === this.props.userId);

    dataRoomMaster.forEach(element => {
      let temp = element.room_id.split(',')

      let tempListRoom = []

      if (temp[0] !== "0") {
        temp.forEach(room => {
          let tmp = this.props.dataRooms.find(el => el.room_id === Number(room))
          tempListRoom.push(tmp)
        })
      }

      element.tbl_rooms = tempListRoom
    });

    this._isMounted && this.setState({
      data: dataRoomMaster
    })
  }

  openModal = () => {
    this.setState({ openModal: true })
  }

  closeModal = () => {
    this.fetchData()
    this.setState({ openModal: false })
  }

  refresh = () => {
    this.fetchData()
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
      <div style={{ width: '70%', margin: '30px auto' }}>
        <Button size="small" color="primary" onClick={this.openModal} style={{ marginBottom: 10 }}>
          Create Assistant
        </Button>
        <Paper style={{
          overflowX: 'auto',
        }}>
          <Table style={{ minWidth: '650' }} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ width: '40%' }}>Name</TableCell>
                <TableCell align="center" style={{ width: '30%' }}>Mengelola Ruangan</TableCell>
                <TableCell align="center" style={{ width: '20%' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((element, index) => (
                  <CardRoomAssistant key={index} data={element} index={index} refresh={this.refresh} />
                ))
              }
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
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
        </Paper>
        {
          this.state.openModal && <ModalCreateEditRoomAssistant status={this.state.openModal} closeModal={this.closeModal} statusCreate={true} />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataRoomMaster,
  fetchDataRooms,
}

const mapStateToProps = ({ loading, dataRoomMaster, userId, dataRooms, error }) => {
  return {
    loading,
    dataRoomMaster,
    userId,
    dataRooms,
    error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignRoomAssistant)
