import React, { Component } from 'react'

import { Grid, Popover, TextField } from '@material-ui/core';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

export default class cardIndicator extends Component {
  state = {
    open: false,
    anchorEl: null,
    newInput: "",
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget, open: true })
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false,
    })
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    return (
      <>
        <Grid style={{ width: '20%', borderRight: '1px solid black', padding: 10, cursor: 'pointer' }} onClick={this.handleClick}>
          <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: 14 }}>{this.props.data.title}</p>
            {
              this.state.open
                ? <ArrowDropUpIcon />
                : <ArrowDropDownIcon />
            }
          </Grid>
          <p style={{ margin: 0, fontSize: 30 }}>{this.props.data.persen}%</p>
          <p style={{ margin: '3px 0px 0px 0px', fontSize: 10 }}>{this.props.data.persenPembanding}% dari periode sebelumnya</p>
        </Grid>

        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {/* <Grid style={{ maxHeight: 90, overflow: 'auto', width:200, padding:'0px 10px 0px 10px' }}> */}
          <Grid style={{ width: 200, padding: 10 }}>
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>Jan19</p>
              <p style={{ margin: 0, fontSize: 13 }}>Rp 1,300,000</p>
            </Grid>
            <Grid style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>Feb19</p>
              <p style={{ margin: 0, fontSize: 13 }}>Rp 1,300,000</p>
            </Grid>
            <Grid style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>Mar19</p>
              <p style={{ margin: 0, fontSize: 13 }}>Rp 1,300,000</p>
            </Grid>
            <Grid style={{ marginTop: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>Apr19</p>
              <TextField
                id="newInput"
                value={this.state.newInput}
                onChange={this.handleChange('newInput')}
                disabled={this.state.proses}
                style={{ marginLeft: 20, width: 100 }}
              />
            </Grid>
          </Grid>
        </Popover>

      </>
    )
  }
}
