import React, { Component } from 'react'

import {
  Modal, Fade, Grid, Backdrop, Typography, Button, TextField, Select as SelectOption, MenuItem, Checkbox, FormControlLabel
} from '@material-ui/core';

// import swal from 'sweetalert';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class modalSettingTargetKPIM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batasBulan: 0,
      tahun: [],
      tahunSelected: new Date().getFullYear(),
      targetTahunan: '',
      unit: '',
      targetInverse: false,

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
      Dec: '',

      KPIMBulanPertama: 12
    }
  }

  async componentDidMount() {
    if (this.props.data) {
      let Jan = null, Feb = null, Mar = null, Apr = null, May = null, Jun = null, Jul = null, Aug = null, Sep = null, Oct = null, Nov = null, Dec = null, limit = 11

      this.props.data.tbl_kpim_scores.forEach(element => {
        if (element.month === 1) {
          Jan = element.target_monthly
          if (limit > 0) limit = 0
        } else if (element.month === 2) {
          Feb = element.target_monthly
          if (limit > 1) limit = 1
        } else if (element.month === 3) {
          Mar = element.target_monthly
          if (limit > 2) limit = 2
        } else if (element.month === 4) {
          Apr = element.target_monthly
          if (limit > 3) limit = 3
        } else if (element.month === 5) {
          May = element.target_monthly
          if (limit > 4) limit = 4
        } else if (element.month === 6) {
          Jun = element.target_monthly
          if (limit > 5) limit = 5
        } else if (element.month === 7) {
          Jul = element.target_monthly
          if (limit > 6) limit = 6
        } else if (element.month === 8) {
          Aug = element.target_monthly
          if (limit > 7) limit = 7
        } else if (element.month === 9) {
          Sep = element.target_monthly
          if (limit > 8) limit = 8
        } else if (element.month === 10) {
          Oct = element.target_monthly
          if (limit > 9) limit = 9
        } else if (element.month === 11) {
          Nov = element.target_monthly
          if (limit > 10) limit = 10
        } else if (element.month === 12) {
          Dec = element.target_monthly
        }
      });
      await this.setState({
        tahunSelected: this.props.data.year,
        targetTahunan: +this.props.data.target,
        unit: this.props.data.unit,
        Jan, Feb, Mar, Apr, May, Jun,
        Jul, Aug, Sep, Oct, Nov, Dec,
        targetInverse: this.props.data.is_inverse,
        KPIMBulanPertama: limit,
        batasBulan: this.props.month - 1 && this.props.month - 1 > limit ? this.props.month - 1 : limit,
      })
    } else {
      let year = new Date().getFullYear(), newTahun = []
      for (let i = year; i < (year + 3); i++) {
        newTahun.push(i)
      }
      this.setState({ tahun: newTahun, batasBulan: this.props.month - 1 })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.state.targetInverse !== prevState.targetInverse || (this.state.targetTahunan !== prevState.targetTahunan && !this.state.targetInverse)) && !this.props.data) {
      this.fetchTargetInverse()
    }

    if (
      ((this.state.targetTahunan !== prevState.targetTahunan && (this.state.unit === '%' || this.state.unit.toLowerCase() === "persen")) ||
        (this.state.unit !== prevState.unit && (this.state.unit === '%' || this.state.unit.toLowerCase() === "persen") && this.state.targetTahunan)) && !this.props.data) {
      this.fetchTargetInverse(true)
    }
  }

  fetchTargetInverse = (args) => {
    if (!this.props.data) {
      if (this.state.targetInverse || args) {
        let targetMonth = {}
        months.forEach((element, index) => {
          if (this.state.batasBulan <= index) {
            targetMonth[element] = +this.state.targetTahunan
          }
        });

        this.setState({
          ...targetMonth
        })
      } else {
        this.setState({
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
          Dec: '',
        })
      }
    }
  }

  closeModal = () => {
    this.props.closeModal()
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleCheck = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  submitForm = async () => {
    // if (this.state.unit === '%' || this.state.unit.toLowerCase() === "persen") {
    //   let pembagi = await this.checkMonthIsEmpty()
    //   perbandingan = (Number(this.state.Jan) + Number(this.state.Feb) + Number(this.state.Mar) + Number(this.state.Apr) + Number(this.state.May) + Number(this.state.Jun) + Number(this.state.Jul) + Number(this.state.Aug) + Number(this.state.Sep) + Number(this.state.Oct) + Number(this.state.Nov) + Number(this.state.Dec)) / pembagi

    // } else {
    //   perbandingan = Number(this.state.Jan) + Number(this.state.Feb) + Number(this.state.Mar) + Number(this.state.Apr) + Number(this.state.May) + Number(this.state.Jun) + Number(this.state.Jul) + Number(this.state.Aug) + Number(this.state.Sep) + Number(this.state.Oct) + Number(this.state.Nov) + Number(this.state.Dec)
    // }

    // if (Number(this.state.targetTahunan) === Number(perbandingan) || this.state.targetInverse) {
    let data = [], limit = this.state.KPIMBulanPertama < this.state.batasBulan ? this.state.KPIMBulanPertama : this.state.batasBulan

    await months.forEach((element, index) => {
      if (limit <= index) {

        data.push({ month: index + 1, target_monthly: this.state[element] || 0 })

      }
    });

    let newData = {
      indicator_kpim: this.props.indicator,
      target: +this.state.targetTahunan,
      unit: this.state.unit,
      year: this.state.tahunSelected,
      is_inverse: this.state.targetInverse,
      monthly: data
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
    // } else {
    //   swal("Total target bulanan tidak sesuai dengan target tahunan", "", "warning")
    // }
  }

  // CALENDER GOOGLE

  checkMonthIsEmpty = () => {
    let counter = 0
    if (this.state.Jan !== '' || this.state.Jan) {
      counter++
    }
    if (this.state.Feb !== '' || this.state.Feb) {
      counter++
    }
    if (this.state.Mar !== '' || this.state.Mar) {
      counter++
    }
    if (this.state.Apr !== '' || this.state.Apr) {
      counter++
    }
    if (this.state.May !== '' || this.state.May) {
      counter++
    }
    if (this.state.Jun !== '' || this.state.Jun) {
      counter++
    }
    if (this.state.Jul !== '' || this.state.Jul) {
      counter++
    }
    if (this.state.Aug !== '' || this.state.Aug) {
      counter++
    }
    if (this.state.Sep !== '' || this.state.Sep) {
      counter++
    }
    if (this.state.Oct !== '' || this.state.Oct) {
      counter++
    }
    if (this.state.Nov !== '' || this.state.Nov) {
      counter++
    }
    if (this.state.Dec !== '' || this.state.Dec) {
      counter++
    }

    return counter
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
            width: 700,
            maxHeight: '90%',
            display: 'flex',
            flexDirection: 'column',
            padding: '30px',
            overflowY: 'auto'
          }}>
            <Grid style={{ display: 'flex', margin: '10px auto 20px auto' }}>
              <Typography style={{ alignSelf: 'center', fontSize: 35, fontWeight: 'bold', marginRight: 15 }}>Set target untuk</Typography>
              {
                this.props.data
                  ? <Typography style={{ alignSelf: 'center', fontSize: 35, fontWeight: 'bold' }}>{this.props.data.year}</Typography>
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
                label={this.state.targetInverse ? "Target bulanan" : "Target tahunan"}
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
            <Grid style={{ width: '70%', margin: '0px auto' }}>
              <FormControlLabel
                control={<Checkbox checked={this.state.targetInverse} onChange={this.handleCheck} name="targetInverse" />}
                label="Target Inverse (seperti keluhan, reject, kerugian, dll)"
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
                    // disabled={this.state.batasBulan > index || this.state.targetTahunan === "" || (this.props.data && this.state[el] === 0) || this.state.targetInverse || this.state.unit === '%' || this.state.unit.toLowerCase() === "persen"}
                    disabled={
                      this.state.batasBulan > index
                      || this.state.targetTahunan === ""
                      || (this.props.data && this.state[el] === 0)
                      || this.state.targetInverse
                      || (new Date().getMonth() >= index && new Date().getDate() > 5
                        && new Date().getMonth() !== 0 && this.state.KPIMBulanPertama !== new Date().getMonth()
                      )
                    }
                  />
                )
              }
            </Grid>
            {
              this.state.targetInverse
                ? <p style={{ fontStyle: 'italic', color: 'red' }}>* Untuk target inverse apabila melebihi target nilai dianggap 0</p>
                : <p style={{ fontStyle: 'italic', color: 'red' }}>* Apabila disetting menjadi 0, maka kedepannya tidak bisa diubah kembali</p>

            }
            {/* <Grid style={{width:'100%'}} > */}
            <Button variant="outlined" color="secondary" style={{ margin: '2  0px auto 0px auto' }} onClick={this.submitForm} >
              Simpan
            </Button>
            {/* </Grid> */}
          </Grid>
        </Fade>
      </Modal>
    )
  }
}
