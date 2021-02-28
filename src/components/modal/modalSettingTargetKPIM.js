import React, { Component } from 'react'

import {
  Modal, Fade, Grid, Backdrop, Typography, Button, TextField, Select as SelectOption, MenuItem, Checkbox, FormControlLabel
} from '@material-ui/core';

import swal from 'sweetalert';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class modalSettingTargetKPIM extends Component {
  state = {
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
  }

  componentDidMount() {
    if (this.props.data) {
      let Jan = 0, Feb = 0, Mar = 0, Apr = 0, May = 0, Jun = 0, Jul = 0, Aug = 0, Sep = 0, Oct = 0, Nov = 0, Dec = 0

      this.props.data.tbl_kpim_scores.forEach(element => {
        if (element.month === 1) {
          Jan = element.target_monthly
        } else if (element.month === 2) {
          Feb = element.target_monthly
        } else if (element.month === 3) {
          Mar = element.target_monthly
        } else if (element.month === 4) {
          Apr = element.target_monthly
        } else if (element.month === 5) {
          May = element.target_monthly
        } else if (element.month === 6) {
          Jun = element.target_monthly
        } else if (element.month === 7) {
          Jul = element.target_monthly
        } else if (element.month === 8) {
          Aug = element.target_monthly
        } else if (element.month === 9) {
          Sep = element.target_monthly
        } else if (element.month === 10) {
          Oct = element.target_monthly
        } else if (element.month === 11) {
          Nov = element.target_monthly
        } else if (element.month === 12) {
          Dec = element.target_monthly
        }
      });

      this.setState({
        tahunSelected: this.props.data.year,
        targetTahunan: this.props.data.target,
        unit: this.props.data.unit,
        Jan, Feb, Mar, Apr, May, Jun,
        Jul, Aug, Sep, Oct, Nov, Dec
      })
    } else {
      let year = new Date().getFullYear(), newTahun = []
      for (let i = year; i < (year + 3); i++) {
        newTahun.push(i)
      }
      this.setState({ tahun: newTahun })
    }

    // let currentWeek = this.getNumberOfWeek(new Date())
    // let firstWeekInSelectedMonth = this.getNumberOfWeek(new Date(new Date().getFullYear(), this.props.month - 1, 1))


    // if (firstWeekInSelectedMonth + 1 >= currentWeek || this.props.KPIMLength === 0) {
    // if (firstWeekInSelectedMonth + 1 >= currentWeek ) {
    this.setState({
      batasBulan: this.props.month - 1
    })
    // } else {
    // this.setState({
    //   batasBulan: this.props.month
    // })
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.targetInverse !== prevState.targetInverse || this.state.targetTahunan !== prevState.targetTahunan) {
      this.fetchTargetInverse()
    }
  }

  fetchTargetInverse = () => {
    if (this.state.targetInverse) {
      let targetMonth = {}

      months.forEach((element, index) => {
        if (this.state.batasBulan <= index) {
          targetMonth[element] = this.state.targetTahunan
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
    let perbandingan

    if (this.state.unit === '%' || this.state.unit.toLowerCase() === "persen") {
      let pembagi = await this.checkMonthIsEmpty()
      perbandingan = (Number(this.state.Jan) + Number(this.state.Feb) + Number(this.state.Mar) + Number(this.state.Apr) + Number(this.state.May) + Number(this.state.Jun) + Number(this.state.Jul) + Number(this.state.Aug) + Number(this.state.Sep) + Number(this.state.Oct) + Number(this.state.Nov) + Number(this.state.Dec)) / pembagi

    } else {
      perbandingan = Number(this.state.Jan) + Number(this.state.Feb) + Number(this.state.Mar) + Number(this.state.Apr) + Number(this.state.May) + Number(this.state.Jun) + Number(this.state.Jul) + Number(this.state.Aug) + Number(this.state.Sep) + Number(this.state.Oct) + Number(this.state.Nov) + Number(this.state.Dec)
    }

    if (Number(this.state.targetTahunan) === Number(perbandingan) || this.state.targetInverse) {
      let newData = {
        indicator_kpim: this.props.indicator,
        target: this.state.targetTahunan,
        unit: this.state.unit,
        year: this.state.tahunSelected,
        is_inverse: this.state.targetInverse,
        monthly: [
          { month: 1, target_monthly: this.state.Jan || 0 },
          { month: 2, target_monthly: this.state.Feb || 0 },
          { month: 3, target_monthly: this.state.Mar || 0 },
          { month: 4, target_monthly: this.state.Apr || 0 },
          { month: 5, target_monthly: this.state.May || 0 },
          { month: 6, target_monthly: this.state.Jun || 0 },
          { month: 7, target_monthly: this.state.Jul || 0 },
          { month: 8, target_monthly: this.state.Aug || 0 },
          { month: 9, target_monthly: this.state.Sep || 0 },
          { month: 10, target_monthly: this.state.Oct || 0 },
          { month: 11, target_monthly: this.state.Nov || 0 },
          { month: 12, target_monthly: this.state.Dec || 0 }
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

  getNumberOfWeek = date => {
    let theDay = date
    var target = new Date(theDay);
    var dayNr = (new Date(theDay).getDay() + 6) % 7;

    target.setDate(target.getDate() - dayNr + 3);

    var reference = new Date(target.getFullYear(), 0, 4);
    var dayDiff = (target - reference) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

  // CALENDER GOOGLE
  // getNumberOfWeek = date => {
  //   //yyyy-mm-dd (first date in week)
  //   var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  //   var dayNum = d.getUTCDay() || 7;
  //   d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  //   var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  //   return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  // }

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
                    disabled={this.state.batasBulan > index || this.state.targetTahunan === "" || (this.props.data && this.state[el] === 0) || this.state.targetInverse}
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
