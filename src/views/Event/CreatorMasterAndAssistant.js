import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Grid, TablePagination, Button
} from '@material-ui/core';

import CardCreatorMasterAndAssistant from '../../components/facility/cardCreatorMasterAndAssistant';
import ModalCreatorMasterAndAssistant from '../../components/modal/modalCreatorMasterAndAssistant';

import { fetchDataCreatorMasterAndAssistant, fetchDataUsers } from '../../store/action';

class CreatorMasterAndAssistant extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      proses: false,
      page: 0,
      rowsPerPage: 5,
      openModal: false,
      data: []
    }
  }

  async componentDidMount() {
    this._isMounted = true
    if (this._isMounted && this.props.userId) {
      this.fetchData()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      this._isMounted && this.fetchData()
    }
  }

  fetchData = async () => {
    await this.props.fetchDataCreatorMasterAndAssistant()

    let data = await this.props.dataCreatorMasterAndAssistant.filter(el => el.chief === this.props.userId)

    this._isMounted && this.setState({ data })
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

  refresh = async () => {
    await this.fetchData()
    this.setState({
      openModal: false
    })
  }

  closeModal = () => {
    this.setState({
      openModal: false
    })
  }

  openModal = () => {
    this.setState({
      openModal: true
    })
  }

  render() {
    return (
      <Grid>
        {
          this.props.isAdmin
            ? <Button color="primary" onClick={this.openModal} >
              Assign Creator Master
              </Button>
            : <Button color="primary" onClick={this.openModal} >
              Assign Creator Assistant
              </Button>
        }
        <Paper style={{
          width: '90%',
          margin: '10px auto',
          overflowX: 'auto',
        }}>
          <Table style={{ minWidth: '650' }} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ width: '10%' }}>No</TableCell>
                <TableCell align="center" style={{ width: '40%' }}>Name</TableCell>
                <TableCell align="center" style={{ width: '20%' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.data.length > 0 && this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((element, index) => (
                  <CardCreatorMasterAndAssistant key={index} data={element} index={index + 1} refresh={this.refresh} />
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
          this.state.openModal && <ModalCreatorMasterAndAssistant status={this.state.openModal} refresh={this.refresh} closeModal={this.closeModal} />
        }

      </Grid>
    )
  }
}

const mapDispatchToProps = {
  fetchDataCreatorMasterAndAssistant,
  fetchDataUsers,
}

const mapStateToProps = ({ loading, userId, dataCreatorMasterAndAssistant, dataUsers, isAdmin, error }) => {
  return {
    loading,
    userId,
    dataCreatorMasterAndAssistant,
    dataUsers,
    isAdmin,
    error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatorMasterAndAssistant)
