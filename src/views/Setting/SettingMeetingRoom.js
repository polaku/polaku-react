import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';

import {
  Grid, CircularProgress, Paper, Tabs, Tab, Divider, TextField, Button, TablePagination
} from '@material-ui/core';

import { fetchDataRooms } from '../../store/action';

const CardRoom = lazy(() => import('../../components/setting/cardRoom'));

class SettingMeetingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelTab: ['Semua'],
      search: '',
      value: 0,
      index: 0,
      selectAll: false,
      check: false,
      data: [],
      dataForDisplay: [],
      dataForEdit: [],
      proses: true,
      openModalLogSetting: false,
      page: 0,
      rowsPerPage: 10,
      optionBuilding: []
    }
  }

  async componentDidMount() {
    await this.props.fetchDataRooms()
    await this.fetchData()
    await this.fetchDataForDisplay()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search && !this.state.search) {
      this.fetchDataForDisplay()
    }

    if (this.props.dataRooms !== prevProps.dataRooms) {
      await this.fetchData()
      await this.fetchDataForDisplay()
    }
  }


  fetchData = async () => {
    let dataBuilding = [{ acronym: 'Semua' }], idBuilding = ['-'], counter = 0

    await this.props.dataRooms.forEach(element => {
      if (element.tbl_building) {
        if (idBuilding.indexOf(element.tbl_building.building_id) === -1) { //KALAU TIDAK ADA
          let newData = element.tbl_building
          newData.counter = 1
          counter++
          idBuilding.push(element.tbl_building.building_id)
          dataBuilding.push(newData)
        } else {
          counter++
          let index = idBuilding.indexOf(element.tbl_building.building_id)
          dataBuilding[index].counter = dataBuilding[index].counter + 1
        }
      }
    });
    dataBuilding[0].counter = counter
    this.setState({ optionBuilding: dataBuilding })
  }

  fetchDataForDisplay = async () => {
    if (this.state.value === 0) {
      this.setState({ dataForDisplay: this.props.dataRooms })
    } else {
      let buildingSelected = this.state.optionBuilding[this.state.value]
      let data = await this.props.dataRooms.filter(room => room.building_id === buildingSelected.building_id)

      this.setState({ dataForDisplay: data })
    }
  }

  handleSearch = async () => {
    let data = await this.state.dataForDisplay.filter(el => el.room.toLowerCase().match(new RegExp(this.state.search.toLowerCase())))

    this.setState({ dataForDisplay: data })
  }

  handleChangeTab = async (event, newValue) => {
    await this.setState({ value: newValue, page: 0 })
    this.fetchDataForDisplay()
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
    })
  }

  refresh = async () => {
    this.setState({ page: 0 })
    await this.props.fetchDataRooms()
    await this.fetchData()
    await this.fetchDataForDisplay()
  }

  render() {
    return (
      <div style={{ width: '100%', paddingTop: 0 }}>
        {
          this.state.loading
            ? <div style={{ textAlign: 'center' }}>
              <CircularProgress color="secondary" style={{ marginTop: 20 }} />
            </div>
            : <Grid>
              <p style={{ fontSize: 20, fontWeight: 'bold' }}>Ruang meeting</p>
              <Grid style={{ display: 'flex', margin: 10 }}>
                <Grid style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => this.props.history.push('/setting/setting-meeting-room/add-meeting-room')}>
                  <img src={require('../../Assets/add-address.png').default} alt="Logo" style={{ width: 23, maxHeight: 23, alignSelf: 'center' }} />
                  <p style={{ margin: '0px 0px 0px 5px' }}>Tambah ruang</p>
                </Grid>
              </Grid>

              <Paper id="search" style={{ padding: 10, paddingLeft: 20, paddingBottom: 20, marginBottom: 20 }}>
                <Tabs
                  value={this.state.value}
                  indicatorColor="secondary"
                  textColor="secondary"
                  onChange={this.handleChangeTab}
                >
                  {
                    this.state.optionBuilding.map((el, index) =>
                      <Tab key={index} label={`${el.acronym} (${el.counter})`} style={{ marginRight: 10, minWidth: 80 }} />
                    )
                  }
                </Tabs>
                <Divider />
                <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <TextField
                    id="pencarian"
                    placeholder="cari berdasarkan nama ruang"
                    variant="outlined"
                    value={this.state.search}
                    onChange={this.handleChange('search')}
                    style={{ width: '100%', marginRight: 15, marginTop: 3 }}
                    InputProps={{
                      style: {
                        height: 35
                      }
                    }}
                  />
                  <Button onClick={this.handleSearch} variant="contained" style={{ width: 150 }}>
                    Cari
                </Button>
                </Grid>
              </Paper>

              <Paper id="header" style={{ display: 'flex', padding: '15px 20px', margin: 3, borderRadius: 0, alignItems: 'center' }}>
                <Grid style={{ display: 'flex', alignItems: 'center', width: '35%' }}>
                  <p style={{ margin: 0 }}>Ruangan</p>
                </Grid>
                <p style={{ margin: 0, width: '30%' }}>Lokasi</p>
                <p style={{ margin: 0, width: '15%' }}>Admin</p>
                <p style={{ margin: 0, width: '20%', textAlign: 'center' }}>Aksi</p>
              </Paper>


              {
                this.state.dataForDisplay.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((room, index) =>
                  <CardRoom data={room} key={'room' + index} refresh={this.refresh} />
                )
              }
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={this.state.dataForDisplay.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                backIconButtonProps={{
                  'aria-label': 'previous page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'next page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Grid>
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataRooms
}

const mapStateToProps = ({ dataRooms, dataBuilding, dataCompanies, dinas, isAdminsuper }) => {
  return {
    dataRooms,
    dataCompanies,
    dinas,
    isAdminsuper
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingMeetingRoom)