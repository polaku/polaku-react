import React, { Component, lazy } from 'react'
import { connect } from 'react-redux';

import {
  Paper, Typography, Button, Grid
} from '@material-ui/core'

import { fetchDataPolanews } from '../../store/action';

const ModalCreateEditPolanews = lazy(() => import('../../components/modal/modalCreateEditPolanews'));
const CardPolanews = lazy(() => import('../../components/polanews/cardPolanews'));

class Polanews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  async componentDidMount() {
    await this.props.fetchDataPolanews()
  }

  refresh = () => {
    this.props.fetchDataPolanews()
  }

  handleOpenModal = () => {
    this.setState({
      open: true
    })
  }

  handleCloseModal = () => {
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <>
        <p style={{ margin: 10, fontSize: 30 }}>Berita Pola</p>
        <Paper square style={{ padding: '10px 20px 10px 20px', margin: '10px 0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60 }}>
          <Typography style={{ marginLeft: 5 }}>Semua Berita Pola</Typography>
          { // BUTTON CREATE NEWS
            (this.props.userId === 1 || this.props.userId === 30 || this.props.userId === 33 || this.props.userId === 44) && <Button variant="contained" color="primary" onClick={this.handleOpenModal}>
              Buat Berita Baru
            </Button>
          }
        </Paper>

        <Grid container style={{ display: 'flex' }} spacing={2}>
          {
            this.props.dataPolanews && this.props.dataPolanews.map(berita =>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={berita.polanews_id} style={{ width: '100%' }}>
                <CardPolanews data={berita} refresh={this.refresh} />
              </Grid>
            )
          }
        </Grid>

        {
          this.state.open && <ModalCreateEditPolanews status={this.state.open} closeModal={this.handleCloseModal} refresh={this.refresh} />
        }
      </>
    )
  }
}

const mapDispatchToProps = {
  fetchDataPolanews
}

const mapStateToProps = ({ loading, error, dataPolanews, userId }) => {
  return {
    loading,
    error,
    dataPolanews,
    userId
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Polanews)