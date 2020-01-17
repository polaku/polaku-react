import React, { Component } from 'react'

import { Modal, Fade, Grid, Backdrop, Typography, Button, TextField, Select as SelectOption, MenuItem } from '@material-ui/core';

import swal from 'sweetalert';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class modalSettingTargetKPIM extends Component {
  state = {
    tahun: [],
    tahunSelected: '',
    targetTahunan: '',
    unit: '',

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

    if (this.props.data) {
      this.setState({
        tahunSelected: this.props.data.year,
        targetTahunan: this.props.data.target,
        unit: this.props.data.unit,
        Jan: this.props.data.kpimScore[0].target_monthly,
        Feb: this.props.data.kpimScore[1].target_monthly,
        Mar: this.props.data.kpimScore[2].target_monthly,
        Apr: this.props.data.kpimScore[3].target_monthly,
        May: this.props.data.kpimScore[4].target_monthly,
        Jun: this.props.data.kpimScore[5].target_monthly,
        Jul: this.props.data.kpimScore[6].target_monthly,
        Aug: this.props.data.kpimScore[7].target_monthly,
        Sep: this.props.data.kpimScore[8].target_monthly,
        Oct: this.props.data.kpimScore[9].target_monthly,
        Nov: this.props.data.kpimScore[10].target_monthly,
        Dec: this.props.data.kpimScore[11].target_monthly
      })
    } else {
      let year = new Date().getFullYear(), newTahun = []
      for (let i = year; i < (year + 3); i++) {
        newTahun.push(i)
      }
      this.setState({ tahun: newTahun })
    }
  }

  closeModal = () => {
    this.props.closeModal()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submitForm = () => {
    let perbandingan = Number(this.state.Jan) + Number(this.state.Feb) + Number(this.state.Mar) + Number(this.state.Apr) + Number(this.state.May) + Number(this.state.Jun) + Number(this.state.Jul) + Number(this.state.Aug) + Number(this.state.Sep) + Number(this.state.Oct) + Number(this.state.Nov) + Number(this.state.Dec)

    if (Number(this.state.targetTahunan) === Number(perbandingan)) {
      let newData = {
        indicator_kpim: this.props.indicator,
        target: this.state.targetTahunan,
        unit: this.state.unit,
        year: this.state.tahunSelected,
        monthly: [
          this.state.Jan || 0,
          this.state.Feb || 0,
          this.state.Mar || 0,
          this.state.Apr || 0,
          this.state.May || 0,
          this.state.Jun || 0,
          this.state.Jul || 0,
          this.state.Aug || 0,
          this.state.Sep || 0,
          this.state.Oct || 0,
          this.state.Nov || 0,
          this.state.Dec || 0
        ]
      }

      this.props.submitForm(newData)

      this.setState({
        tahunSelected: '',
        targetTahunan: '',
        unit: '',
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
      })
    } else {
      swal("Total target bulanan tidak sesuai dengan target tahunan", "", "warning")
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
              <Typography style={{ alignSelf: 'center', fontSize: 35, fontWeight: 'bold', marginRight: 20 }}>Set target untuk</Typography>
              {
                this.props.data
                  ? <Typography style={{ alignSelf: 'center', fontSize: 35, fontWeight: 'bold', marginRight: 20 }}>{this.props.data.year}</Typography>
                  : <SelectOption
                    value={this.state.tahunSelected}
                    onChange={this.handleChange('tahunSelected')}
                    disabled={this.state.proses || this.props.data != null}
                    style={{ width: 100 }}
                    variant="outlined">
                    {
                      this.state.tahun.map(el =>
                        (<MenuItem value={el} key={el}>{el}</MenuItem>)
                      )
                    }
                  </SelectOption>
              }
            </Grid>

            <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '70%', margin: '0px auto' }}>
              <TextField
                label="Target tahunan"
                value={this.state.targetTahunan}
                onChange={this.handleChange('targetTahunan')}
                variant="outlined"
                style={{ width: '70%' }}
                disabled={this.state.tahunSelected === "" || this.props.data != null}
              />
              <TextField
                label="Unit"
                value={this.state.unit}
                onChange={this.handleChange('unit')}
                variant="outlined"
                style={{ width: '25%' }}
                disabled={this.state.tahunSelected === "" || this.props.data != null}
              />
            </Grid>

            <p style={{ marginBottom: 0 }}>Target bulanan</p>
            <Grid style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {
                months.map((el, index) =>
                  <TextField
                    key={index}
                    label={el}
                    type="number"
                    value={this.state[el]}
                    onChange={this.handleChange(el)}
                    variant="outlined"
                    style={{ width: '32%', marginTop: 13 }}
                    disabled={new Date().getMonth() >= index || this.state.targetTahunan === ""}

                  />
                )
              }
            </Grid>

            {/* <Grid style={{width:'100%'}} > */}
            <Button variant="outlined" color="secondary" style={{ margin: '30px auto 0px auto' }} onClick={this.submitForm} >
              Simpan
              </Button>
            {/* </Grid> */}
          </Grid>
        </Fade>
      </Modal>
    )
  }
}
