import React, { Component } from 'react'
import Cookies from 'js-cookie';

import {
  Grid, TextField
} from '@material-ui/core';

import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

import { API } from '../../config/API';

import swal from 'sweetalert';

export default class pencapaianKPIM extends Component {
  state = {
    open: false,
    anchorEl: null,
    persenBefore: 0,
    persenNow: 0,
    newInput: "",
    pencapaian: 0,
    editIndicator: false,
    fullname: "",
  }

  componentDidMount() {
    this.setState({
      pencapaian: this.props.data.pencapaian_monthly
    })

    if (this.props.data.indicator_kpim) {
      if (this.props.data.indicator_kpim.toLowerCase() === "tal team") {
        // this.setState({
        //   this.props.data.tal
        // })
        let tempScore = 0
        this.props.data.tal.forEach(el => {
          tempScore += el.score_tal
        })
        this.setState({
          persenNow: tempScore
        })
      }
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  addCapaian = kpim_score_id => event => {
    event.preventDefault()

    let token = Cookies.get('POLAGROUP')
    API.put(`/kpim/${kpim_score_id}?update=month`, { pencapaian_monthly: this.state.pencapaian }, { headers: { token } })
      .then(data => {
        this.props.refresh()
      })
      .catch(err => {
        swal('please try again')
      })
  }

  editIndicator = () => {
    this.props.index === 1 && this.setState({
      editIndicator: !this.state.editIndicator
    })
  }

  render() {
    function getMonth(args) {
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
      return months[Number(args) - 1]
    }

    function formatRupiah(args) {
      let number_string = args.toString(),
        sisa = number_string.length % 3,
        rupiah = number_string.substr(0, sisa),
        ribuan = number_string.substr(sisa).match(/\d{3}/g), separator

      if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
      }

      return rupiah
    }


    return (
      <Grid style={{ marginBottom: 10 }}>
        {
          this.props.data.indicator_kpim && (
            this.props.data.indicator_kpim.toLowerCase() === "tal" || this.props.data.indicator_kpim.toLowerCase() === "kpim team"
              ? <Grid style={{ display: 'flex', justifyContent: 'space-between' }} >
                <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>{getMonth(this.props.data.month)}{this.props.data.year.slice(2, 4)}</p>
                <p style={{ margin: 0, fontSize: 13 }}>{isNaN(this.props.data.score_kpim_monthly) ? 0 : Math.ceil(this.props.data.score_kpim_monthly)} %</p>
              </Grid>

              : this.props.data.indicator_kpim.toLowerCase() === "tal team"
                ? <Grid style={{ display: 'flex', justifyContent: 'space-between' }} >
                  <p style={{ margin: 0, fontSize: 13, color: 'gray', maxWidth: '75%' }}>{this.props.data.tal[0].fullname}</p>
                  {/* <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>{this.props.data.tal[0].fullname}</p>
                    <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>{getMonth(this.props.data.month)}{this.props.data.year.slice(2, 4)}</p> */}
                  <p style={{ margin: 0, fontSize: 13 }}>{isNaN(this.state.persenNow) ? 0 : Math.ceil(this.state.persenNow)} %</p>
                </Grid>
                : this.props.data.pencapaian_monthly
                  ? this.state.editIndicator
                    ? <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                      <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>{getMonth(this.props.data.month)}{this.props.data.year.slice(2, 4)}</p>
                      <Grid style={{ display: 'flex', alignItems: 'center' }}>
                        <form onSubmit={this.addCapaian(this.props.data.kpim_score_id)}>
                          <TextField
                            id="pencapaian"
                            type="number"
                            value={this.state.pencapaian}
                            onChange={this.handleChange('pencapaian')}
                            disabled={this.state.proses}
                            style={{ width: 80 }}
                          />
                        </form>
                        <CancelPresentationIcon style={{ color: 'red', cursor: 'pointer', marginLeft: 5 }} onClick={this.editIndicator} />
                      </Grid>
                    </Grid>
                    : <Grid style={{ display: 'flex', justifyContent: 'space-between', cursor: this.props.index === 1 && 'pointer' }} onClick={this.editIndicator}>
                      <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>{getMonth(this.props.data.month)}{this.props.data.year.slice(2, 4)}</p>
                      {
                        this.props.data.unit === "Rp"
                          ? <p style={{ margin: 0, fontSize: 13 }}>{this.props.data.unit} {formatRupiah(this.props.data.pencapaian_monthly)}</p>
                          : <p style={{ margin: 0, fontSize: 13 }}>{this.props.data.pencapaian_monthly} {this.props.data.unit}</p>
                      }
                    </Grid>
                  : <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                    <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>{getMonth(this.props.data.month)}{this.props.data.year.slice(2, 4)}</p>
                    <form onSubmit={this.addCapaian(this.props.data.kpim_score_id)}>
                      <TextField
                        id="pencapaian"
                        type="number"
                        value={this.state.pencapaian}
                        onChange={this.handleChange('pencapaian')}
                        disabled={this.state.proses}
                        style={{ width: 100 }}
                      />
                    </form>
                  </Grid>
          )
        }
      </Grid>
    )
  }
}
