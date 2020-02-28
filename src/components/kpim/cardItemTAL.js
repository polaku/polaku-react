import React, { Component } from 'react';
import Cookies from 'js-cookie';

import {
  TableCell, TableRow, Grid, TextField
} from '@material-ui/core';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

import { API } from '../../config/API';

import swal from 'sweetalert';

export default class cardTAL extends Component {
  state = {
    load: 0,
    achievement: 0,
    link: '',
    editAchievement: false,
    editLoad: false,
  }

  componentDidMount() {
    this.setState({
      editAchievement: false,
      editLoad: false,
      achievement: this.props.data.achievement || 0,
      load: this.props.data.load || 0
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.tal_score_id !== this.props.data.tal_score_id) {
      this.setState({
        editAchievement: false,
        editLoad: false,
        achievement: this.props.data.achievement || 0,
        load: this.props.data.load || 0
      })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submitData = args => event => {
    event.preventDefault()
    let token = Cookies.get('POLAGROUP'), newData
    if (this.state.load > 10 || this.state.achievement > 100) {
      if (args === 'load') {
        swal('load melebihi 10')
      }
      if (args === 'achievement') {
        swal('achievement melebihi 100')
      }
    } else {
      if (args === 'load') newData = { load: this.state.load }
      else if (args === 'achievement') newData = { achievement: this.state.achievement }
      else if (args === 'link') newData = { link: this.state.link }

      API.put(`/tal/${this.props.data.tal_score_id}`, newData, { headers: { token } })
        .then(() => {
          this.setState({
            editAchievement: false,
            editLoad: false,
          })
          this.props.refresh()
        })
        .catch(err => {
          console.log(err)
          swal('please try again')
        })
    }
  }

  editAchievement = () => {
    if (Number(this.props.data.week) >= Number(this.props.weekCurrent)) {
      this.setState({
        editAchievement: !this.state.editAchievement
      })
    }
  }

  editLoad = () => {
    this.setState({
      editLoad: !this.state.editLoad
    })
  }

  render() {
    return (
      <>
        <TableRow >
          <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center', padding: '0px 10px', height: 60 }}>
            {this.props.data.indicator_tal}
          </TableCell>
          <TableCell align="center" style={{ padding: '0px 10px' }}>
            {
              this.props.data.load
                ? this.state.editLoad
                  ? <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <form onSubmit={this.submitData('load')}>
                      <TextField
                        value={this.state.load}
                        onChange={this.handleChange('load')}
                        variant="outlined"
                        InputProps={{
                          style: { height: 35, padding: 0 }
                        }}
                        error={this.state.load > 10}
                      />
                    </form>
                    <CancelPresentationIcon style={{ color: 'red', cursor: 'pointer', marginLeft: 5 }} onClick={this.editLoad} />
                  </Grid>
                  : <p style={{ margin: 0, cursor: 'pointer' }} onClick={this.editLoad}>{this.props.data.load}</p>
                : <form onSubmit={this.submitData('load')}>
                  <TextField
                    value={this.state.load}
                    onChange={this.handleChange('load')}
                    variant="outlined"
                    InputProps={{
                      style: { height: 35, padding: 0 }
                    }}
                    error={this.state.load > 10}
                  />
                </form>
            }
          </TableCell>
          <TableCell style={{ padding: '0px 10px' }}>
            {this.props.data.when_day || `Tanggal ${this.props.data.when_date}`}
          </TableCell>
          <TableCell align="center" style={{ padding: '0px 10px' }} >
            <Grid style={{ width: 40, margin: 0, textAlign: 'center' }}>
              <CircularProgressbar value={this.props.data.weight || 0} text={`${this.props.data.weight || 0}%`} styles={buildStyles({
                textSize: 33,
              })} />
            </Grid>
          </TableCell>
          <TableCell align="center" style={{ padding: '0px 10px' }} >{
            this.props.data.achievement
              ? this.state.editAchievement
                ? <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <form onSubmit={this.submitData('achievement')}>
                    <TextField
                      value={this.state.achievement}
                      onChange={this.handleChange('achievement')}
                      variant="outlined"
                      InputProps={{
                        style: { height: 35, padding: 0 }
                      }}
                      error={this.state.achievement > 100}
                    />
                  </form>
                  <CancelPresentationIcon style={{ color: 'red', cursor: 'pointer', marginLeft: 5 }} onClick={this.editAchievement} />
                </Grid>
                : <p style={{ margin: 0, cursor: 'pointer' }} onClick={this.editAchievement}>{this.props.data.achievement}</p>
              : <form onSubmit={this.submitData('achievement')}>
                <TextField
                  value={this.state.achievement}
                  onChange={this.handleChange('achievement')}
                  variant="outlined"
                  InputProps={{
                    style: { height: 35, padding: 0 }
                  }}
                  error={this.state.achievement > 100}
                />
              </form>
          }</TableCell>
          <TableCell align="center" style={{ padding: '0px 10px' }} >{
            this.props.data.link
              ? this.props.data.link
              : <form onSubmit={this.submitData('link')}>
                <TextField
                  value={this.state.link}
                  onChange={this.handleChange('link')}
                  variant="outlined"
                  InputProps={{
                    style: { height: 35, padding: 0 }
                  }}
                />
              </form>
          }</TableCell>
        </TableRow>
      </>
    )
  }
}
