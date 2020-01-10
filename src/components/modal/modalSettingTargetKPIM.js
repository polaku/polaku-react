import React, { Component } from 'react'

import { Modal, Fade, Grid, Backdrop, Typography, Button, TextField, Select as SelectOption, MenuItem } from '@material-ui/core';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class modalSettingTargetKPIM extends Component {
  state = {
    tahun: [2019, 2020, 2021],
    tahunSelected: '',
    targetTahunan: '',
    unit: '',
    targetPerBulan: [],


    Jan: '',
    Feb: '',
    Mar: '',
    Apr: '',
    May: '',
    Jun: '',
    Jul: '',
    Aug: '',
    Sep: '',
    Oct: '',
    Nov: '',
    Dec: ''
  }

  componentDidMount() {
    let year = new Date().getFullYear() + 1, newTahun = []
    for (let i = year; i < (year + 3); i++) {
      newTahun.push(i)
    }
    this.setState({ tahun: newTahun })
  }


  closeModal = () => {
    this.props.closeModal()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };


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
        onClose={this.closeModal}
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
            width: 700,
            minHeight: 450,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 30px'
          }}>
            <Grid style={{ display: 'flex', margin: '10px auto 20px auto' }}>
              <Typography style={{ alignSelf: 'center', fontSize: 35, fontWeight: 'bold', marginRight: 20 }}>Set target untuk </Typography>
              <SelectOption
                value={this.state.tahunSelected}
                onChange={this.handleChange('tahunSelected')}
                disabled={this.state.proses}
                style={{ width: 100 }}
                variant="outlined">
                {
                  this.state.tahun.map(el =>
                    (<MenuItem value={el} key={el}>{el}</MenuItem>)
                  )
                }
              </SelectOption>
            </Grid>

            <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '70%', margin: '0px auto' }}>
              <TextField
                label="Target tahunan"
                value={this.state.targetTahunan}
                onChange={this.handleChange('targetTahunan')}
                variant="outlined"
                style={{ width: '70%' }}
                disabled={this.state.tahunSelected === ""}
              />
              <TextField
                label="Unit"
                value={this.state.unit}
                onChange={this.handleChange('unit')}
                variant="outlined"
                style={{ width: '25%' }}
                disabled={this.state.tahunSelected === ""}
              />
            </Grid>

            <p style={{ marginBottom: 0 }}>Target bulanan</p>
            <Grid style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {
                months.map((el, index) =>
                  <TextField
                    key={index}
                    label={el}
                    value={this.state[el]}
                    onChange={this.handleChange(el)}
                    variant="outlined"
                    style={{ width: '32%', marginTop: 13 }}
                    // disabled={new Date().getMonth() >= index ||  (new Date().getMonth() < index && this.state.targetTahunan === "")}
                    disabled={new Date().getMonth() >= index || this.state.targetTahunan === ""}

                  />
                )
              }
            </Grid>

            {/* <Grid style={{width:'100%'}} > */}
            <Button variant="outlined" color="secondary" style={{ margin: '30px auto 0px auto' }} >
              Simpan
              </Button>
            {/* </Grid> */}
          </Grid>
        </Fade>
      </Modal>
    )
  }
}
