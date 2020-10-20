import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel, Typography, Grid, Button, Popover, Paper, ClickAwayListener, MenuItem, MenuList, Divider, CircularProgress
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PowerInputIcon from '@material-ui/icons/PowerInput';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import { fetchDataUsers, fetchDataPIC, fetchDataAddress } from '../../store/action';

import { API } from '../../config/API';

import swal from 'sweetalert';

const animatedComponents = makeAnimated();

class panelOnBoarding extends Component {
  state = {
    loading: true,
    expanded: false,
    openPopOver: false,
    anchorEl: null,
    data: [],
    pic: []
  }

  async componentDidMount() {
    let temp = []
    await this.props.fetchDataUsers()
    this.props.dataUsers.forEach(element => {
      let newData = {
        user_id: element.user_id,
        nik: element.tbl_account_detail.nik
      }
      if (element.tbl_account_detail) newData.fullname = element.tbl_account_detail.fullname
      temp.push(newData)
    });

    this.setState({
      users: temp,
    })
    await this.props.fetchDataPIC()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.dataPIC !== prevProps.dataPIC) {
      await this.fetchData()
    }
  }

  fetchData = async () => {
    this.setState({ loading: true })
    await this.props.fetchDataAddress()

    let data = this.props.dataPIC

    data.length > 0 && data.forEach(async (element) => {
      let notComplete = 0
      let address = await this.props.dataAddress.filter(el => el.company_id === element.company_id)

      if (address.length > 0) {
        let firstCreate = address[0].createdAt, lastUpdate = address[0].updatedAt

        await address.forEach((el) => {
          if (firstCreate > el.createdAt) firstCreate = el.createdAt
          if (lastUpdate < el.updatedAt) firstCreate = el.updatedAt

          if (!el.acronym ||
            !el.address ||
            !el.fax ||
            !el.phone ||
            !el.operationDay ||
            el.tbl_operation_hours.length === 0 ||
            el.tbl_photo_addresses.length === 0 ||
            el.tbl_recesses.length === 0
          ) {
            notComplete++
          }
        })

        element.firstCreate = firstCreate
        element.lastUpdate = lastUpdate
      }
      element.totalAddress = address.length
      element.notComplete = notComplete
    })

    this.props.dataPIC.length > 0 && await this.props.dataPIC.forEach(async (company) => {
      let listPICSelected = []

      await company.tbl_PICs.forEach(pic => {
        let newData = {
          user_id: pic.user_id,
          nik: pic.tbl_user.tbl_account_detail.nik
        }
        if (pic.tbl_user.tbl_account_detail) newData.fullname = pic.tbl_user.tbl_account_detail.fullname
        listPICSelected.push(newData)
      })
      company.pic = listPICSelected
    })

    this.setState({ data, loading: false })
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget, openPopOver: true })
  };

  handleClose = () => {
    this.setState({ anchorEl: null, openPopOver: false })
  };

  handleChangeSelect = async (idCompany, newValue, actionMeta) => {
    try {
      let token = Cookies.get('POLAGROUP')
      await API.put(`/pic/${idCompany}`, { pic: newValue }, { headers: { token } })
      await this.props.fetchDataPIC()
    } catch (err) {
      swal("Edit PIC gagal", "", "warning")
    }
  };

  handleChange = panel => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false })
  };

  handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({ openPopOver: false })
    }
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        {
          this.state.loading
            ? <div style={{ textAlign: 'center' }}>
              <CircularProgress color="secondary" style={{ marginTop: 20 }} />
            </div>
            : this.state.data.map((el, index) =>
              <Accordion square expanded={this.state.expanded === el.acronym} onChange={this.handleChange(el.acronym)} key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-label="Expand"
                  aria-controls="additional-actions1-content"
                  id="additional-actions1-header"
                >
                  <FormControlLabel
                    onClick={event => event.stopPropagation()}
                    onFocus={event => event.stopPropagation()}
                    control={<Checkbox />}
                  />
                  <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <Grid style={{ display: 'flex', width: 150, marginRight: 10 }}>
                      <BusinessOutlinedIcon style={{ color: el.statusIcon1 ? '#d71149' : '#b4b4b4', minWidth: 40, height: 40, marginRight: 10 }} />
                      <Typography style={{ fontWeight: 'bold', fontSize: 21 }}>{el.acronym}</Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', width: 200, marginRight: 10 }}>
                      <AssignmentIndIcon style={{ color: el.tbl_PICs.length > 0 ? '#d71149' : '#b4b4b4', minWidth: 40, height: 40, marginRight: 10 }} />
                      <Grid style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {
                          el.tbl_PICs.map((pic, index) => <Typography key={'pic' + index} style={{ fontWeight: 'bold', fontSize: 21 }}>{pic.tbl_user.tbl_account_detail.initial || pic.tbl_user.tbl_account_detail.nik}{(el.tbl_PICs.length > 1 && index !== el.tbl_PICs.length - 1) && ','}</Typography>)
                        }
                      </Grid>
                    </Grid>
                    <Grid style={{ display: 'flex', width: 100, marginRight: 10 }}>
                      <PowerInputIcon style={{ color: el.statusIcon3 ? '#d71149' : '#b4b4b4', minWidth: 40, height: 40 }} />
                    </Grid>
                    <Grid style={{ display: 'flex', width: 100 }}>
                      <PeopleOutlineIcon style={{ color: el.statusIcon4 ? '#d71149' : '#b4b4b4', minWidth: 40, height: 40 }} />
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <Divider />
                <AccordionDetails style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f2f2f2', padding: 20 }}>
                  <div style={{ display: 'flex', width: '100%', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ width: '100%', paddingRight: 20 }}>
                      <SeCreatableSelect
                        isMulti
                        components={animatedComponents}
                        options={this.state.users}
                        value={el.pic}
                        onChange={value => this.handleChangeSelect(el.company_id, value)}
                        getOptionLabel={(option) => option.nik + ' - ' + option.fullname}
                        getOptionValue={(option) => option.user_id}
                        placeholder="tambah PIC"
                        style={{ width: '90%' }}
                      />
                    </div>
                    <Button variant="contained" onClick={this.handleClick}>
                      Pengaturan
                  </Button>

                    <Popover
                      open={this.state.openPopOver}
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
                      <Paper style={{ width: 200 }}>
                        <ClickAwayListener onClickAway={this.handleClose}>
                          <MenuList autoFocusItem={this.state.openPopOver} id="menu-list-grow" onKeyDown={this.handleListKeyDown}>
                            <MenuItem onClick={this.handleClose}>Ubah data</MenuItem>
                            {/* <MenuItem onClick={this.handleClose}>Ubah PIC</MenuItem> */}
                            <MenuItem onClick={this.handleClose}>Non-aktifkan</MenuItem>
                            <MenuItem onClick={this.handleClose}>Hapus</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Popover>
                  </div>
                  <Grid container>
                    <Grid item sm={3} style={{ padding: 5 }}>
                      <Grid style={{ backgroundColor: 'white', border: '1px solid #e3e3e3', padding: 10, minHeight: 138 }}>
                        <b style={{ margin: 0 }}>Status Alamat</b>
                        <Grid style={{ display: "flex", flexWrap: 'wrap' }}>
                          <p style={{ margin: 0, fontSize: 12, width: 84 }}>Diisi tanggal</p>
                          <p style={{ margin: 0, fontSize: 12 }}>: {el.firstCreate && el.firstCreate.slice(0, 10)}</p>
                        </Grid>
                        <Grid style={{ display: "flex", flexWrap: 'wrap' }}>
                          <p style={{ margin: 0, fontSize: 12, width: 84 }}>Diubah terakhir</p>
                          <p style={{ margin: 0, fontSize: 12 }}>: {el.lastUpdate && el.lastUpdate.slice(0, 10)}</p>
                        </Grid>
                        <p style={{ margin: 0, fontSize: 12 }}>{el.totalAddress} alamat terdaftar</p>
                        {
                          el.notComplete !== 0 && <p style={{ margin: 0, fontSize: 12 }}>{el.notComplete} Alamat tidak lengkap</p>
                        }
                      </Grid>
                    </Grid>
                    {/* <Grid item sm={3} style={{ padding: 5 }}>
                      <Grid style={{ backgroundColor: 'white', border: '1px solid #e3e3e3', padding: 10, minHeight: 138 }}>
                        <b style={{ margin: 0 }}>Status Struktur</b>
                        <p style={{ margin: 0, fontSize: 12 }}>Surat Keputusan SO:</p>
                        <p style={{ margin: 0, fontSize: 12 }}>Diubah terakhir</p>
                        <p style={{ margin: 0, fontSize: 12 }}>Ubah data struktur</p>
                        <p style={{ margin: 0, fontSize: 12 }}>3 Peran kosong</p>
                      </Grid>
                    </Grid>
                    <Grid item sm={3} style={{ padding: 5 }}>
                      <Grid style={{ backgroundColor: 'white', border: '1px solid #e3e3e3', padding: 10, minHeight: 138 }}>
                        <b style={{ margin: 0 }}>Status Karyawan</b>
                        <p style={{ margin: 0, fontSize: 12 }}>Diubah terakhir</p>
                        <p style={{ margin: 0, fontSize: 12 }}>Ubah data karyawan</p>
                        <p style={{ margin: 0, fontSize: 12 }}>20 Data karyawan tidak lengkap</p>
                      </Grid>
                    </Grid>
                    <Grid item sm={3} style={{ padding: 5 }}>
                      <Grid style={{ backgroundColor: 'white', border: '1px solid #e3e3e3', padding: 10, minHeight: 138 }}>
                        <b style={{ margin: 0 }}>Status Admin</b>
                        <p style={{ margin: 0, fontSize: 12 }}>Alamat</p>
                        <p style={{ margin: 0, fontSize: 12 }}>Struktur</p>
                        <p style={{ margin: 0, fontSize: 12 }}>Karyawan</p>
                        <p style={{ margin: 0, fontSize: 12 }}>Ubah data admin</p>
                        <p style={{ margin: 0, fontSize: 12 }}>2 Admin belum log in</p>
                      </Grid>
                    </Grid> */}
                  </Grid >
                </AccordionDetails >
              </Accordion >
            )
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataPIC,
  fetchDataAddress
}

const mapStateToProps = ({ loading, dataUsers, dataPIC, dataAddress }) => {
  return {
    loading,
    dataUsers,
    dataPIC,
    dataAddress
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(panelOnBoarding)