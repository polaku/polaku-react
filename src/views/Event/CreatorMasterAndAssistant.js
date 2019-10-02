import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import CardCreatorMasterAndAssistant from '../../components/cardCreatorMasterAndAssistant';
import { fetchDataCreatorMasterAndAssistant, fetchDataUsers } from '../../store/action';

import ModalCreatorMasterAndAssistant from '../../components/modal/modalCreatorMasterAndAssistant';

class CreatorMasterAndAssistant extends Component {
  state = {
    proses: false,
    page: 0,
    rowsPerPage: 5,
    openModal: false,
  }

  async componentDidMount() {
    await this.props.fetchDataCreatorMasterAndAssistant()
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

  refresh = () => {
    this.props.fetchDataCreatorMasterAndAssistant()
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
                this.props.dataCreatorMasterAndAssistant.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((element, index) => (
                  <CardCreatorMasterAndAssistant key={index} data={element} index={index + 1} />
                ))
              }
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={this.props.dataCreatorMasterAndAssistant.length}
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
        <ModalCreatorMasterAndAssistant status={this.state.openModal} refresh={this.refresh} closeModal={this.closeModal} />
      </Grid>
    )
  }
}

const mapDispatchToProps = {
  fetchDataCreatorMasterAndAssistant,
  fetchDataUsers,
}

const mapStateToProps = ({ loading, dataCreatorMasterAndAssistant, dataUsers, isAdmin, error }) => {
  return {
    loading,
    dataCreatorMasterAndAssistant,
    dataUsers,
    isAdmin,
    error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatorMasterAndAssistant)
