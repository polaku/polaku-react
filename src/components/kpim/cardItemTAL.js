import React, { Component } from 'react';

import { TableCell, TableRow, Grid, TextField } from '@material-ui/core';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default class cardTAL extends Component {
  state = {
    isPencapaianNull: false,
    isLinkNull: false,
    pencapaian: '',
    link: ''
  }

  componentDidMount() {
    if (!this.props.data.pencapaian) {
      this.setState({
        isPencapaianNull: true
      })
    } else {
      this.setState({
        pencapaian: this.props.data.pencapaian
      })
    }
    if (!this.props.data.link) {
      this.setState({
        isLinkNull: true
      })
    } else {
      this.setState({
        link: this.props.data.link
      })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submitData = args => event => {
    event.preventDefault()
    if (args === 'pencapaian') {
      this.setState({
        isPencapaianNull: false
      })
    } else if (args === "link") {
      this.setState({
        isLinkNull: false
      })
    }
  }

  render() {
    return (
      <>
        <TableRow >
          <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center' }}>
            {this.props.data.item}
          </TableCell>
          <TableCell align="center" >{this.props.data.weight}</TableCell>
          <TableCell>{this.props.data.when}</TableCell>
          <TableCell align="center" style={{ padding: '0px 10px' }} >
            <Grid style={{ width: 40, margin: 0, textAlign: 'center' }}>
              <CircularProgressbar value={this.props.data.load || 0} text={`${this.props.data.load || 0}%`} styles={buildStyles({
                textSize: 33,
              })} />
            </Grid>
          </TableCell>
          <TableCell align="center" style={{ padding: '0px 10px' }} >{
            this.state.isPencapaianNull
              ? <form onSubmit={this.submitData('pencapaian')}>
                <TextField
                  value={this.state.pencapaian}
                  onChange={this.handleChange('pencapaian')}
                  variant="outlined"
                  InputProps={{
                    style: { height: 35, padding: 0 }
                  }}
                />
              </form>
              : this.state.pencapaian
          }</TableCell>
          <TableCell align="center" style={{ padding: '0px 10px' }} >{
            this.state.isLinkNull
              ? <form onSubmit={this.submitData('link')}>
                <TextField
                  value={this.state.link}
                  onChange={this.handleChange('link')}
                  variant="outlined"
                  InputProps={{
                    style: { height: 35, padding: 0 }
                  }}
                />
              </form>
              : this.state.link
          }</TableCell>
        </TableRow>
      </>
    )
  }
}
