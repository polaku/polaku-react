import React, { Component } from 'react'

import {
  Paper, Typography, Grid, Button,
  Popover, MenuList, MenuItem, ListItemIcon,
  Table, TableHead, TableRow, TableCell, TableBody, Checkbox
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';


import Download from '../exportToExcel';

export default class cardReport extends Component {
  state = {
    openDetail: false,
    unduhLaporan: ["semua", "KPIM", "TAL"],
    openTAL: false,
    isSelected: false,
    anchorElMenu: null,
    anchorElSubMenu: null,
    openMenu: false,
    openSubMenu: false,
    labelValueReportNilai: [
      {
        label: "NIK",
        value: "nik"
      }, {
        label: "Nama",
        value: "nama"
      }, {
        label: "KPIM1",
        value: "kpim1"
      }, {
        label: "KPIM2",
        value: "kpim2"
      }, {
        label: "KPIM3",
        value: "kpim3"
      }, {
        label: "KPIM4",
        value: "kpim4"
      }, {
        label: "KPIM5",
        value: "kpim5"
      }, {
        label: "TAL",
        value: "TAL"
      }, {
        label: "Total Nilai",
        value: "totalNilai"
      }, {
        label: "NIK Evaluator",
        value: "nikEvaluator"
      }, {
        label: "Nama Evaluator",
        value: "namaEvaluator"
      },
    ],
    labelValueKPIM: [
      {
        label: "NIK",
        value: "nik"
      }, {
        label: "Nama",
        value: "nama"
      }, {
        label: "Indikator",
        value: "indikator"
      }, {
        label: "Nilai",
        value: "nilai"
      }, {
        label: "NIK Evaluator",
        value: "nikEvaluator"
      }, {
        label: "Nama Evaluator",
        value: "namaEvaluator"
      },
    ],
    labelValueTAL: [
      {
        label: "NIK",
        value: "nik"
      }, {
        label: "Nama",
        value: "nama"
      }, {
        label: "TAL",
        value: "tal"
      }, {
        label: "Minggu",
        value: "minggu"
      }, {
        label: "Nilai",
        value: "nilai"
      }, {
        label: "NIK Evaluator",
        value: "nikEvaluator"
      }, {
        label: "Nama Evaluator",
        value: "namaEvaluator"
      },
    ],
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.allSelected !== prevProps.allSelected) {
      this.setState({
        isSelected: this.props.allSelected
      })
    }

    if (this.state.isSelected !== prevState.isSelected) {
      // if (this.state.isVisible) {
      this.props.handleCheck(this.props.data.userId, this.state.isSelected)
      // }
    }

    if (this.props.data !== prevProps.data) {
      this.setState({
        openDetail: false,
        openTAL: false,
      })
    }
  }

  handleOpenCloseDetail = () => {
    this.setState({
      openDetail: !this.state.openDetail
    })
    if (this.state.openDetail) {
      this.setState({
        openTAL: false
      })
    }
  }

  handleOpenCloseTAL = () => {
    this.setState({
      openTAL: !this.state.openTAL
    })
  }

  handleChangeCheck = event => {
    this.setState({
      isSelected: event.target.checked
    })
  }

  handleClickMenu = event => {
    this.setState({
      anchorElMenu: event.currentTarget,
      openMenu: true
    })
  };

  handleCloseMenu = () => {
    this.setState({
      anchorElMenu: null,
      openMenu: false
    })
  };

  handleClickSubMenu = event => {
    this.setState({
      anchorElSubMenu: event.currentTarget,
      openSubMenu: true
    })
  };

  handleCloseSubMenu = () => {
    this.setState({
      anchorElSubMenu: null,
      openSubMenu: false,
      anchorElMenu: null,
      openMenu: false
    })
  };

  render() {
    return (
      <Grid>
        {
          this.props.data.isVisible && <>
            {
              this.state.openDetail
                ? <Paper id="header" style={{ backgroundColor: '#e5e5e5', height: '100%', paddingBottom: '10px', margin: '20px 0px' }}>
                  <Grid style={{ display: 'flex', padding: '10px 20px', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Grid style={{ display: 'flex', width: '60%', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Grid style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          checked={this.state.isSelected}
                          onChange={this.handleChangeCheck}
                          value="secondary"
                          color="secondary"
                        />
                        <Typography>NIK : {this.props.data.fullname}</Typography>
                      </Grid>
                      <Grid style={{ display: 'flex', alignItems: 'center', paddingRight: 30 }}>
                        <Grid style={{ width: 50, textAlign: 'center' }}>
                          <Typography>{this.props.data.nilaiKPI}</Typography>
                        </Grid>
                        <Grid style={{ width: 50, textAlign: 'center' }}>
                          <Typography>{this.props.data.nilaiTAL}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid style={{ width: '25%', display: 'flex', alignItems: 'center' }} >
                      <Typography>{this.props.data.evaluator}</Typography>
                    </Grid>
                    <Grid style={{ width: '15%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button variant="contained" style={{ borderRadius: 5, padding: 0 }} onClick={this.handleClickMenu}>
                        <p style={{ margin: 0 }}>Menu</p>
                      </Button>
                      <Button onClick={this.handleOpenCloseDetail}
                        style={{ borderRadius: 15, minWidth: 24, padding: 0 }} >
                        <ExpandLessIcon />
                      </Button>
                    </Grid>
                  </Grid>

                  <Paper style={{ margin: '15px 40px' }}>
                    <Table>
                      <TableHead style={{ backgroundColor: '#f8f8f8' }}>
                        <TableRow >
                          <TableCell style={{ alignItems: 'center', width: '40%', fontSize: 14, fontWeight: 'bold' }}>
                            KPIM
                      </TableCell>
                          <TableCell style={{ width: '15%', fontSize: 14, fontWeight: 'bold' }}>target</TableCell>
                          <TableCell style={{ width: '15%', fontSize: 14, fontWeight: 'bold' }}>actual</TableCell>
                          <TableCell style={{ width: '10%', fontSize: 14, fontWeight: 'bold' }}>%ach</TableCell>
                          <TableCell style={{ width: '5%', fontSize: 14, fontWeight: 'bold' }}>weight</TableCell>
                          <TableCell style={{ width: '5%', fontSize: 14, fontWeight: 'bold' }}>score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          this.props.data.kpim && this.props.data.kpim.map((el, index) => <TableRow key={index}>
                            <TableCell component="th" scope="row" style={{ alignItems: 'center', width: '40%' }}>
                              {el.indicator_kpim}
                            </TableCell>
                            <TableCell style={{ width: '15%' }}>{el.target_monthly}</TableCell>
                            <TableCell style={{ width: '15%' }}>{el.pencapaian_monthly}</TableCell>
                            <TableCell style={{ width: '10%' }}>{isNaN((Number(el.pencapaian_monthly) / Number(el.target_monthly)) * 100) ? 0 : (Math.round((Number(el.pencapaian_monthly) / Number(el.target_monthly)) * 100))}%</TableCell>
                            <TableCell style={{ width: '5%' }}>{el.bobot}%</TableCell>
                            <TableCell style={{ width: '5%' }}>{isNaN(Number(el.score_kpim_monthly) * (Number(el.bobot) / 100)) ? 0 : (Math.round(Number(el.score_kpim_monthly) * (Number(el.bobot) / 100)))}</TableCell>
                          </TableRow>)
                        }
                        { //KHUSUS TAL
                          this.props.data.tal && this.props.data.tal.dataTAL.length > 0 && <TableRow>
                            {/* {
                              this.props.data.tal.dataTAL.length > 0
                                ? <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center', width: '40%', cursor: 'pointer' }} onClick={this.handleOpenCloseTAL}>
                                  TAL
                              {
                                    this.state.openTAL
                                      ? <ExpandLessIcon />
                                      : <ExpandMoreIcon />
                                  }
                                </TableCell>
                                : <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center', width: '40%' }}>
                                  TAL
                            </TableCell>
                            } */}
                            <TableCell component="th" scope="row" style={{ display: 'flex', alignItems: 'center', width: '40%' }}>
                              TAL
                            </TableCell>

                            <TableCell style={{ width: '15%' }} />
                            <TableCell style={{ width: '15%' }} />
                            <TableCell style={{ width: '10%' }} />
                            <TableCell style={{ width: '5%' }}>{this.props.data.tal.bobot}%</TableCell>
                            <TableCell style={{ width: '5%' }}>{isNaN(Number(this.props.data.tal.score_kpim_monthly) * (Number(this.props.data.tal.bobot) / 100)) ? 0 : (Math.round(Number(this.props.data.tal.score_kpim_monthly) * (Number(this.props.data.tal.bobot) / 100)))}</TableCell>
                          </TableRow>
                        }
                      </TableBody>
                    </Table>
                  </Paper>

                  { //TAL
                    this.state.openTAL && <Paper style={{ margin: '15px 40px' }}>
                      <Table>
                        <TableHead style={{ backgroundColor: '#f8f8f8' }}>
                          <TableRow >
                            <TableCell style={{ alignItems: 'center', width: '40%', fontSize: 14, fontWeight: 'bold' }}>
                              TAL
                      </TableCell>
                            <TableCell style={{ width: '15%', fontSize: 14, fontWeight: 'bold' }}>when</TableCell>
                            <TableCell style={{ width: '15%', fontSize: 14, fontWeight: 'bold' }}>week</TableCell>
                            <TableCell style={{ width: '10%', fontSize: 14, fontWeight: 'bold' }}>%ach</TableCell>
                            <TableCell style={{ width: '5%', fontSize: 14, fontWeight: 'bold' }}>weight</TableCell>
                            <TableCell style={{ width: '5%', fontSize: 14, fontWeight: 'bold' }}>score</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            this.props.data.tal.dataTAL.map((el, index) => <TableRow key={index}>
                              <TableCell component="th" scope="row" style={{ alignItems: 'center', width: '40%' }}>
                                {el.indicator_tal}
                              </TableCell>
                              <TableCell style={{ width: '15%' }}>{
                                el.when_day
                                  ? `${el.when_day}`
                                  : `Tgl ${el.when_date}`
                              }</TableCell>
                              <TableCell style={{ width: '15%' }}>{el.week}</TableCell>
                              <TableCell style={{ width: '10%' }}>{el.achievement || 0}%</TableCell>
                              <TableCell style={{ width: '5%' }}>{el.weight}%</TableCell>
                              <TableCell style={{ width: '5%' }}>{el.score_tal || 0}</TableCell>
                            </TableRow>)
                          }
                        </TableBody>
                      </Table>
                    </Paper>
                  }

                </Paper>
                : <Paper id="header" style={{ display: 'flex', padding: '10px 20px', justifyContent: 'space-between', marginBottom: 5, marginTop: 10 }} >
                  <Grid style={{ display: 'flex', width: '60%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={this.state.isSelected}
                        onChange={this.handleChangeCheck}
                        value="secondary"
                        color="secondary"
                      />
                      <Typography>NIK : {this.props.data.fullname}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', alignItems: 'center', paddingRight: 30 }}>
                      <Grid style={{ width: 50, textAlign: 'center' }}>
                        <Typography>{this.props.data.nilaiKPI}</Typography>
                      </Grid>
                      <Grid style={{ width: 50, textAlign: 'center' }}>
                        <Typography>{this.props.data.nilaiTAL}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid style={{ width: '25%', display: 'flex', alignItems: 'center' }} >
                    <Typography>{this.props.data.evaluator}</Typography>
                  </Grid>
                  <Grid style={{ width: '15%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button variant="contained" style={{ borderRadius: 5, padding: 0 }} onClick={this.handleClickMenu}>
                      <p style={{ margin: 0 }}>Menu</p>
                    </Button>
                    <Button onClick={this.handleOpenCloseDetail}
                      style={{ borderRadius: 15, minWidth: 24, padding: 0 }} >
                      <ExpandMoreIcon />
                    </Button>
                  </Grid>
                </Paper>
            }
          </>
        }

        <Popover id="menu unduhan"
          open={this.state.openMenu}
          anchorEl={this.state.anchorElMenu}
          onClose={this.handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuList style={{ width: 175 }} >
            <MenuItem onClick={this.handleClickSubMenu}>
              <p style={{ margin: 0 }}>unduh laporan</p>
              <ListItemIcon style={{ marginLeft: 20 }}>
                <ChevronRightOutlinedIcon />
              </ListItemIcon>
            </MenuItem>
          </MenuList>
        </Popover>

        <Popover id="Sub menu unduh"
          open={this.state.openSubMenu}
          anchorEl={this.state.anchorElSubMenu}
          onClose={this.handleCloseSubMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuList style={{ width: 100 }} >
            {/* {
              this.state.unduhLaporan.map((el, index) =>
                <MenuItem key={index}>
                  <Download
                    title={el}
                    report="kpim"
                    labelValueReportNilai={this.state.labelValueReportNilai}
                    data={this.props.data.dataNilaiReport}
                    labelValueKPIM={this.state.labelValueKPIM}
                    dataKPIM={this.props.data.dataNilaiKPIM}
                    labelValueTAL={this.state.labelValueTAL}
                    dataTAL={this.props.data.dataNilaiTAL} />
                </MenuItem>
              )
            } */}
            <MenuItem>
              <Download
                title="semua"
                report="kpim"
                labelValueReportNilai={this.state.labelValueReportNilai}
                data={this.props.data.dataNilaiReport}
                labelValueKPIM={this.state.labelValueKPIM}
                dataKPIM={this.props.data.dataNilaiKPIM}
                labelValueTAL={this.state.labelValueTAL}
                dataTAL={this.props.data.dataNilaiTAL} />
            </MenuItem>
          </MenuList>
        </Popover>

      </Grid >
    )
  }
}
