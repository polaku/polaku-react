import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Typography, Paper, Button } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import swal from 'sweetalert';

import { API } from '../../config/API'

const ModalCreateEditPolanews = lazy(() => import('../modal/modalCreateEditPolanews'));

class cardPolanews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  handleDelete = () => {
    swal({
      title: "Apa kamu yakin?",
      text: "Menghapus tidak akan bisa dikembalikan lagi!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          let token = Cookies.get('POLAGROUP')

          API.delete(`/news/${this.props.data.polanews_id}`, {
            headers: {
              token,
              ip: this.props.ip
            }
          })
            .then(data => {
              this.props.refresh()
            })
            .catch(err => {
              if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
                swal('Gagal', 'Koneksi tidak stabil', 'error')
              } else {
                swal('please try again')
              }
            })
        }
      });
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

  refresh = () => {
    this.props.refresh()
  }

  render() {
    function getDate(args) {
      let month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

      return `${month[new Date(args).getMonth()]} ${new Date(args).getDate()}, ${new Date(args).getFullYear()}`
    }

    return (
      <>
        <Paper style={{ padding: 15 }}>
          <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Typography>{this.props.data.title}</Typography>
            { // BUTTON EDIT AND DELETE
              (this.props.userId === 1 || this.props.userId === 30 || this.props.userId === 33 || this.props.userId === 44) &&
              <Grid>
                <Button variant="contained" style={{ width: 10, minWidth: 40, padding: '3px 0px', marginRight: 10 }} onClick={this.handleOpenModal}>
                  <EditIcon />
                </Button>
                <Button variant="contained" color="secondary" style={{ width: 10, minWidth: 40, padding: '3px 0px' }} onClick={this.handleDelete}>
                  <DeleteIcon />
                </Button>
              </Grid>
            }
          </Grid>
          <Grid style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <a href={this.props.data.attachments} target="_blank" rel="noopener noreferrer">
              <img src={this.props.data.thumbnail} alt="thumbnail" style={{ width: 120, height: 150, minHeight: 150 }} />
            </a>
          </Grid>
          <Grid style={{ display: 'flex', alignItems: "center", marginBottom: 10 }}>
            <img src={this.props.data.tbl_user.tbl_account_detail.avatar} alt="avatar" style={{ width: 35, height: 35, borderRadius: 20, marginRight: 10 }} />
            <Grid>
              <p style={{ margin: 0 }}>{this.props.data.tbl_user.tbl_account_detail.fullname}</p>
              <p style={{ margin: 0, color: 'gray', fontSize: 11 }}>{getDate(this.props.data.created_at)}</p>
            </Grid>
          </Grid>
        </Paper>

        {
          this.state.open && <ModalCreateEditPolanews status={this.state.open} data={this.props.data} refresh={this.refresh} closeModal={this.handleCloseModal} />
        }

      </>
    )
  }
}

const mapStateToProps = ({ userId, ip }) => {
  return {
    userId,
    ip
  }
}

export default connect(mapStateToProps)(cardPolanews)