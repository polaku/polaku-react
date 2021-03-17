import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';

import {
  Modal, Fade, Grid, Backdrop, Typography, Button, TextField, RadioGroup, FormControlLabel, Radio
} from '@material-ui/core';

import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import PlaceholderImg from '../../Assets/placeholder.png';

import swal from 'sweetalert';

import { API } from '../../config/API';

class modalCreateEditPolanews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      status: "1",
      attachmentPdf: null,
      thumbnail: null,
      imgPreview: null
    }
  }

  componentDidMount() {
    if (this.props.data) {
      this.setState({
        title: this.props.data.title,
        description: this.props.data.description || "",
        status: "" + this.props.data.status,
      })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleUploadFile = args => (e) => {
    if (args === "thumbnail") {
      if (e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png") {
        this.setState({ thumbnail: e.target.files[0], imgPreview: URL.createObjectURL(e.target.files[0]) })
      } else {
        swal('Format file harus jpg/jpeg, png')
      }
    } else if (args === "attach") {
      if (e.target.files[0].type === "application/pdf") {
        this.setState({ attachmentPdf: e.target.files[0] })
      } else {
        swal('Format file harus pdf')
      }
    }
  }

  submit = async () => {
    if (this.props.data) { //Edit
      let token = Cookies.get('POLAGROUP')

      var formData1 = new FormData();

      formData1.append("title", this.state.title)
      formData1.append("description", this.state.description)
      formData1.append("status", this.state.status)
      this.state.attachmentPdf && formData1.append("files", this.state.attachmentPdf)
      this.state.thumbnail && formData1.append("files", this.state.thumbnail)

      API.put(`/news/${this.props.data.polanews_id}`, formData1, {
        headers: {
          token,
          ip: this.props.ip
        }
      })
        .then(data => {
          swal("Edit berita pola sukses", "", "success")
          this.props.refresh()
          this.props.closeModal()
        })
        .catch(err => {
          if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
            swal('Gagal', 'Koneksi tidak stabil', 'error')
          } else {
            swal("please try again")
          }
        })
    } else {
      if (this.state.title === '' || this.state.thumbnail === null || this.state.attachmentPdf === null) {
        swal('form belum lengkap')
      } else {
        let token = Cookies.get('POLAGROUP')

        var formData2 = new FormData();

        formData2.append("title", this.state.title)
        formData2.append("description", this.state.description)
        formData2.append("status", this.state.status)
        formData2.append("files", this.state.attachmentPdf)
        formData2.append("files", this.state.thumbnail)

        API.post('/news', formData2, {
          headers: {
            token,
            ip: this.props.ip
          }
        })
          .then(data => {
            swal("Tambah berita pola sukses", "", "success")
            this.props.refresh()
            this.props.closeModal()
          })
          .catch(err => {
            if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
              swal('Gagal', 'Koneksi tidak stabil', 'error')
            } else {
              swal("please try again")
            }
          })
      }
    }
  }

  cancelSelect = args => () => {
    if (args === "thumbnail") {
      this.setState({
        thumbnail: null,
        imgPreview: null
      })
    } else {
      this.setState({ attachmentPdf: null })
    }
  }

  render() {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={this.props.status}
        onClose={this.props.closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <Grid style={{
            backgroundColor: 'white',
            boxShadow: 5,
            width: 750,
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 30px',
            alignItems: 'center'
          }}>
            <Typography style={{ margin: '10px 10px 15px 10px', fontSize: 20, fontWeight: 'bold' }}>Buat Berita Pola</Typography>
            <form onSubmit={this.submit} style={{ width: '100%' }}>
              <Grid id="title" container style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                <Grid item sm={3} style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 20 }}>
                  <p style={{ margin: 0, }}>Title</p>
                  <p style={{ margin: 0, color: 'red' }}>*</p>
                </Grid>
                <Grid item sm={9}>
                  <TextField
                    value={this.state.title}
                    onChange={this.handleChange('title')}
                    variant="outlined"
                    InputProps={{
                      style: { height: 35, padding: 0 }
                    }}
                    style={{ width: '90%' }}
                  />
                </Grid>
              </Grid>
              <Grid id="description" container style={{ display: 'flex', marginBottom: 15 }}>
                <Grid item sm={3}>
                  <p style={{ margin: 0, textAlign: 'right', paddingRight: 20 }}>Description</p>
                </Grid>
                <Grid item sm={9}>
                  <TextField
                    multiline
                    rows="2"
                    value={this.state.description}
                    onChange={this.handleChange('description')}
                    variant="outlined"
                    style={{ width: '80%' }}
                  />
                </Grid>
              </Grid>
              <Grid id="status" container style={{ display: 'flex', marginBottom: 15 }}>
                <Grid item sm={3}>
                  <p style={{ margin: '10px 0px', textAlign: 'right', paddingRight: 20 }}>Status</p>
                </Grid>
                <Grid item sm={9} >
                  <RadioGroup aria-label="undangan" name="undangan2" value={this.state.status} onChange={this.handleChange('status')} >
                    <FormControlLabel
                      value="1"
                      control={<Radio color="primary" />}
                      label="Active" />
                    <FormControlLabel
                      value="0"
                      control={<Radio color="primary" />}
                      label="Inactive" />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Grid id="thumbnail" container style={{ display: 'flex', marginBottom: 15 }}>
                <Grid item sm={3} style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 20 }}>
                  <p style={{ margin: 0 }}>Thumbnail</p>
                  <p style={{ margin: 0, color: 'red' }}>*</p>
                </Grid>
                <Grid item sm={9}>
                  <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      variant="contained"
                      component="label"
                      style={{ marginBottom: 5, padding: '3px 5px' }}
                    >
                      {
                        this.state.thumbnail || this.props.data
                          ? "Change File"
                          : "Select File"
                      }
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={this.handleUploadFile("thumbnail")}
                      />
                    </Button>
                    {
                      this.props.data && !this.state.thumbnail
                        ? <p style={{ margin: '0px 10px' }}>{this.props.data.thumbnail}</p>
                        : this.state.thumbnail && <Grid style={{ display: 'flex' }}>
                          <p style={{ margin: '0px 10px' }}>{this.state.thumbnail.name}</p>
                          <CancelPresentationIcon fontSize="small" onClick={this.cancelSelect("thumbnail")} style={{ cursor: 'pointer' }} />
                        </Grid>
                    }
                  </Grid>
                  <Grid style={{ marginTop: 10 }}>
                    {
                      this.props.data && !this.state.imgPreview
                        ? <img src={this.props.data.thumbnail} alt="thumbnail" style={{ width: 150, height: 180 }} />
                        : this.state.imgPreview
                          ? <img src={this.state.imgPreview} alt="thumbnail" style={{ width: 150, height: 180 }} />
                          : <img src={PlaceholderImg} alt="Logo" style={{ width: 150, height: 150 }} />
                    }
                  </Grid>
                </Grid>
              </Grid>
              <Grid id="attachment" container style={{ display: 'flex', alignItems: 'center', marginTop: 10, marginBottom: 15 }}>
                <Grid item sm={3} style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 20 }}>
                  <p style={{ margin: 0 }}>Attachment</p>
                  <p style={{ margin: 0, color: 'red' }}>*</p>
                </Grid>
                <Grid item sm={9} style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    component="label"
                    style={{ marginBottom: 5, padding: '3px 5px' }}
                  >
                    {
                      this.state.attachmentPdf || this.props.data
                        ? "Change File"
                        : "Select File"
                    }
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={this.handleUploadFile("attach")}
                    />
                  </Button>
                  {
                    this.props.data && !this.state.attachmentPdf
                      ? <p style={{ margin: '0px 10px' }}>{this.props.data.attachments}</p>
                      : this.state.attachmentPdf && <Grid style={{ display: 'flex' }}>
                        <p style={{ margin: '0px 10px' }}>{this.state.attachmentPdf.name}</p>
                        <CancelPresentationIcon fontSize="small" onClick={this.cancelSelect("attachment")} style={{ cursor: 'pointer' }} />
                      </Grid>
                  }
                </Grid>
              </Grid>
            </form>
            <Grid style={{ display: 'flex', marginTop: 20 }}>
              <Button onClick={this.props.closeModal} style={{ marginRight: 10 }}>
                cancel
            </Button>
              <Button variant="contained" color="secondary" onClick={this.submit}>
                Save
            </Button>
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    )
  }
}

const mapStateToProps = ({ ip }) => {
  return {
    ip
  }
}
export default connect(mapStateToProps)(modalCreateEditPolanews)