import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Grid, LinearProgress, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, MenuItem } from '@material-ui/core';
import SelectOption from '@material-ui/core/Select';

import BarChartIcon from '@material-ui/icons/BarChart';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import CardIndicator from '../../components/kpim/cardIndicatorKPIM';
import CardItemTAL from '../../components/kpim/cardItemTAL';

class DashboardKPIM extends Component {
  state = {
    dataIndicator: [
      {
        title: 'TAL',
        persen: '80',
        persenPembanding: '10',
      },
      {
        title: 'Indicator 1',
        persen: '78',
        persenPembanding: '23',
      },
      {
        title: 'Indicator 2',
        persen: '90',
        persenPembanding: '15',
      },
      {
        title: 'Indicator 3',
        persen: '85',
        persenPembanding: '20',
      },
      {
        title: 'Indicator 4',
        persen: '80',
        persenPembanding: '21',
      }
    ],
    dataTAL: [
      {
        item: 'item 1',
        weight: 8,
        when: 'Daily',
        load: '50',
        pencapaian: null,
        link: null
      }, {
        item: 'item 2',
        weight: 10,
        when: 'Wednesday',
        load: '80',
        pencapaian: 80,
        link: null
      }
    ],
    statusAddNewTal: false,
    chooseWhen: ['Daily', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

    item: '',
    weight: '',
    when: '',
    load: '',
    pencapaian: '',
    link: ''
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  addNewTal = () => {
    this.setState({
      statusAddNewTal: true
    })
  }

  saveNewTal = () => {
    let newData = {
      item: this.state.item,
      weight: this.state.weight,
      when: this.state.when,
      load: this.state.load,
      pencapaian: this.state.pencapaian,
      link: this.state.link
    }

    this.setState({
      dataTAL: [...this.state.dataTAL, newData],
      item: "",
      weight: "",
      when: "",
      load: "",
      pencapaian: "",
      link: "",
      statusAddNewTal: false
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid>
        <Grid container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
            <BarChartIcon />
            <p style={{ margin: 0, fontSize: 20 }}>KEY PERFORMANCE INDICATOR MATRIX</p>
          </Grid>
          <Grid item>
            Apr 2019
          </Grid>
        </Grid>
        <Grid container style={{ display: 'flex', marginBottom: 10, border: '1px solid black', borderRadius: 5 }}>
          <Grid item xs={12} md={8} style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid black', padding: 10 }}>
            <p style={{ margin: '0px 0px 5px 0px', fontSize: 18 }}>Performa KPIM</p>
            <p style={{ margin: 0, fontSize: 12 }}>performa minggu ini</p>
            <LinearProgress variant="determinate" value={90}
              classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
            />
            <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: 12 }}>statistik minggu ini</p>
              <p style={{ margin: 0, fontSize: 15 }}>90/100</p>
            </Grid>
          </Grid>
          <Grid item style={{ padding: 10 }}>
            <p style={{ margin: 0, fontSize: 18 }}>Reward & Cosequences :</p>
          </Grid>
        </Grid>
        <Grid style={{ display: 'flex', border: '1px solid black', borderRight: 0 }}>
          {
            this.state.dataIndicator.map((element, index) =>
              <CardIndicator data={element} key={index} />)
          }
        </Grid>
        <Grid style={{ marginTop: 10, border: '1px solid black' }}>
          <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#d71149', padding: 10 }}>
            <p style={{ margin: 0, color: 'white' }}>TAL week 32</p>
            <Button style={{ backgroundColor: 'white', color: '#d71149', height: 30, padding: '0px 10px' }} onClick={() => this.props.history.push('/kpim/tal')}>
              lihat minggu lainnya
            </Button>
          </Grid>
          <Grid style={{ display: 'flex' }}>
            <Grid style={{ width: '18%', padding: 15, borderRight: '1px solid black' }}>
              <CircularProgressbar value={66} text={`66%`} />
            </Grid>
            <Grid style={{ width: '90%' }}>
              <Table style={{ padding: '14px 16px 14px 16px' }}>
                <TableHead style={{ backgroundColor: '#f8f8f8' }}>
                  <TableRow>
                    <TableCell style={{ width: '30%', padding: '14px 16px 14px 16px' }}>
                      Item
                    </TableCell>
                    <TableCell style={{ width: '10%', padding: '14px 16px 14px 16px' }} align="center">
                      Weight
                    </TableCell>
                    <TableCell style={{ width: '15%', padding: '14px 16px 14px 16px' }} align="center">
                      When
                    </TableCell>
                    <TableCell align="center" style={{ width: '10%', padding: '14px 16px 14px 16px' }}>
                      Load
                    </TableCell>
                    <TableCell align="center" style={{ width: '15%', padding: '14px 16px 14px 16px' }} >
                      Pencapaian
                    </TableCell>
                    <TableCell align="center" style={{ width: '20%', padding: '14px 16px 14px 16px' }}>
                      Link
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    this.state.dataTAL.map((el, index) => (
                      <CardItemTAL data={el} key={index} />
                    ))
                  }
                  {
                    this.state.statusAddNewTal && <TableRow style={{ height: 50 }}>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <TextField
                          value={this.state.item}
                          onChange={this.handleChange('item')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <TextField
                          type="number"
                          value={this.state.weight}
                          onChange={this.handleChange('weight')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <SelectOption
                          value={this.state.when}
                          onChange={this.handleChange('when')}
                          disabled={this.state.proses}
                          style={{ width: '100%' }}
                        >
                          {
                            this.state.chooseWhen.map((el, index) =>
                              (<MenuItem value={el} key={index}>{el}</MenuItem>)
                            )
                          }
                        </SelectOption>
                      </TableCell>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <TextField
                          type="number"
                          value={this.state.load}
                          onChange={this.handleChange('load')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <TextField
                          value={this.state.pencapaian}
                          onChange={this.handleChange('pencapaian')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" style={{ padding: '0px 10px' }} >
                        <TextField
                          value={this.state.link}
                          onChange={this.handleChange('link')}
                          variant="outlined"
                          InputProps={{
                            style: { height: 35, padding: 0 }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  }


                </TableBody>
              </Table>
              {
                this.state.statusAddNewTal
                  ? <Grid style={{ display: 'flex', justifyContent: 'flex-end', margin: '15px' }}>
                    <Button color="secondary" onClick={() => this.setState({ statusAddNewTal: false })} style={{ height: 40, marginRight: 15 }}>batal</Button>
                    <Button color="primary" onClick={this.saveNewTal} style={{ height: 40 }}>simpan</Button>
                  </Grid>
                  : <p style={{ margin: '10px 0px 30px 10px', fontWeight: 'bold', cursor: 'pointer' }} onClick={this.addNewTal}>+ tal baru</p>
              }

            </Grid>
          </Grid>
        </Grid>
      </Grid >
    )
  }
}

const styles = () => ({
  colorPrimary: {
    backgroundColor: '#d6d6d6',
  },
  barColorPrimary: {
    backgroundColor: '#3e98c7',
  }
});


export default withStyles(styles)(DashboardKPIM);
