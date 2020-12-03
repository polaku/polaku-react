import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import publicIp from 'public-ip';
import {
  Grid, OutlinedInput, Button,
  // Divider, 
  FormControlLabel, Checkbox, Select, MenuItem, Paper, FormControl
} from '@material-ui/core';
// import CreatableSelect from 'react-select/creatable';

// import makeAnimated from 'react-select/animated';
import DragAndDrop from '../../components/DragAndDrop';

import { fetchDataBuildings, fetchDataUsers } from '../../store/action';

import { API } from '../../config/API';
import { fetchDataRooms } from '../../store/action';
import swal from 'sweetalert';

// const animatedComponents = makeAnimated();

class AddMeetingRoom extends Component {
  state = {
    roomName: '',
    location: '',
    files: [],
    followOprationalBuilding: false,
    operationSemua: false,
    operationSenin: false,
    operationSelasa: false,
    operationRabu: false,
    operationKamis: false,
    operationJumat: false,
    operationSabtu: false,
    operationMinggu: false,

    startHour: '',
    endHour: '',
    optionHours: ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'],
    // operationHours: [
    //   {
    //     day: 'Setiap Hari',
    //     startHour: '',
    //     endHour: '',
    //   }
    // ],
    accessAll: false,
    accessInBuilding: false,
    accessSameCompany: false,

    seat: '',
    facility: '',

    buildingId: null,
    listBuilding: [],
    selectedItem: '',
    disableAddress: false,
    hasEdit: false,
    people: []

  }

  async componentDidMount() {
    if (this.props.location.state) {
      if (this.props.location.state.data) {
        let operationDay = this.props.location.state.data.operational_day ? this.props.location.state.data.operational_day.split(',') : []
        let access = this.props.location.state.data.access_by ? this.props.location.state.data.access_by.split(',') : []


        this.setState({
          roomName: this.props.location.state.data.room,
          location: this.props.location.state.data.building_id,
          followOprationalBuilding: operationDay.indexOf('Mengikuti operasional gedung') >= 0 ? true : false,
          operationSemua: operationDay.indexOf('Setiap hari') >= 0 ? true : false,
          operationSenin: operationDay.indexOf('Senin') >= 0 || operationDay.indexOf('senin') >= 0 ? true : false,
          operationSelasa: operationDay.indexOf('Selasa') >= 0 || operationDay.indexOf('selasa') >= 0 ? true : false,
          operationRabu: operationDay.indexOf('Rabu') >= 0 || operationDay.indexOf('rabu') >= 0 ? true : false,
          operationKamis: operationDay.indexOf('Kamis') >= 0 || operationDay.indexOf('kamis') >= 0 ? true : false,
          operationJumat: operationDay.indexOf('Jumat') >= 0 || operationDay.indexOf('jumat') >= 0 ? true : false,
          operationSabtu: operationDay.indexOf('Sabtu') >= 0 || operationDay.indexOf('sabtu') >= 0 ? true : false,
          operationMinggu: operationDay.indexOf('Minggu') >= 0 || operationDay.indexOf('minggu') >= 0 ? true : false,
          startHour: this.props.location.state.data.open_gate.slice(0, 5),
          endHour: this.props.location.state.data.close_gate.slice(0, 5),
          seat: this.props.location.state.data.max,
          facility: this.props.location.state.data.facilities,
          accessAll: access.indexOf('Semua') >= 0 || access.indexOf('Semua') >= 0 ? true : false,
          accessInBuilding: access.indexOf('Sama gedung') >= 0 || access.indexOf('Sama gedung') >= 0 ? true : false,
          accessSameCompany: access.indexOf('Sama perusahaan') >= 0 || access.indexOf('Sama perusahaan') >= 0 ? true : false,
        })
      }
    }

    if (!this.props.dataBuilding) {
      await this.props.fetchDataBuildings()
    }

    if (this.props.dataUsers) {
      await this.props.fetchDataUsers()
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleOperationalDay = event => {
    if (event.target.name === 'followOprationalBuilding') {
      this.setState({
        followOprationalBuilding: event.target.checked,
      })

      if (event.target.checked) {
        this.setState({
          operationSemua: false,
          operationSenin: false,
          operationSelasa: false,
          operationRabu: false,
          operationKamis: false,
          operationJumat: false,
          operationSabtu: false,
          operationMinggu: false
        })
      }
    } else if (event.target.name === 'operationSemua') {
      this.setState({
        operationSemua: event.target.checked,
        operationSenin: event.target.checked,
        operationSelasa: event.target.checked,
        operationRabu: event.target.checked,
        operationKamis: event.target.checked,
        operationJumat: event.target.checked,
        operationSabtu: event.target.checked,
        operationMinggu: event.target.checked
      })
      if (event.target.checked) {
        this.setState({
          followOprationalBuilding: false,
        })
      }
    } else {
      this.setState({
        [event.target.name]: event.target.checked,
        followOprationalBuilding: false
      })
      if (this.state.operationSemua) {
        this.setState({
          operationSemua: false,
        })
      }
    }
  }

  handleAccess = event => {
    if (event.target.name === 'accessAll') {
      this.setState({
        accessAll: event.target.checked,
        accessInBuilding: event.target.checked,
        accessSameCompany: event.target.checked,
      })
    } else {
      this.setState({
        [event.target.name]: event.target.checked,
      })
      if (this.state.accessAll) {
        this.setState({
          accessAll: false,
        })
      }
    }
  }

  // OPERATION HOUR (START)
  handleChangeOperationHour = (name, index) => event => {
    // let newArray = this.state.operationHours;

    // newArray[index][name] = event.target.value

    // this.setState({
    //   operationHours: newArray
    // });

    this.setState({
      [name]: event.target.value
    });
  };

  addOperationHour = () => {
    let newArray = this.state.operationHours

    newArray.push({
      day: '',
      startHour: '',
      endHour: '',
    })

    this.setState({
      operationHours: newArray
    });
  }

  deleteOperationHour = index => {
    let newArray = this.state.operationHours;

    newArray.splice(index, 1);
    this.setState({
      operationHours: newArray
    });
  }
  // OPERATION HOUR (END)

  handleFiles = files => {
    this.setState({ files })
  }

  submit = async () => {
    let operationalDay = []

    if (this.state.followOprationalBuilding) operationalDay.push('Mengikuti operasional gedung')
    else if (this.state.operationSemua) operationalDay.push('Setiap hari')
    else {
      if (this.state.operationSenin) operationalDay.push('Senin')
      if (this.state.operationSelasa) operationalDay.push('Selasa')
      if (this.state.operationRabu) operationalDay.push('Rabu')
      if (this.state.operationKamis) operationalDay.push('Kamis')
      if (this.state.operationJumat) operationalDay.push('Jumat')
      if (this.state.operationSabtu) operationalDay.push('Sabtu')
      if (this.state.operationMinggu) operationalDay.push('Minggu')
    }

    let newData = new FormData()

    newData.append("room", this.state.roomName)
    newData.append("max", this.state.seat)
    newData.append("facilities", this.state.facility)
    newData.append("building_id", this.state.location)
    newData.append("operational_day", operationalDay.join(', '))
    newData.append("start_hour", this.state.startHour)
    newData.append("end_hour", this.state.endHour)

    if (this.state.files.length > 0) this.state.files.forEach(file => {
      newData.append("thumbnail", file)
    })

    if (this.state.accessAll || (this.state.accessInBuilding && this.state.accessSameCompany)) {
      newData.append("access_by", "Semua")
    } else if (this.state.accessInBuilding) {
      newData.append("access_by", "Sama gedung")
    } else if (this.state.accessSameCompany) {
      newData.append("access_by", "Sama perusahaan")
    }

    try {
      let token = Cookies.get('POLAGROUP')
      if (this.props.location.state.data) {
        await API.put(`/bookingRoom/rooms/${this.props.location.state.data.room_id}`, newData, {
          headers: {
            token,
            ip: await publicIp.v4()
          }
        })

        swal('Ubah ruang meeting berhasil', '', 'success')
      } else {
        await API.post(`/bookingRoom/rooms`, newData, {
          headers: {
            token,
            ip: await publicIp.v4()
          }
        })
        swal('Tambah ruang meeting berhasil', '', 'success')
      }

      await this.props.fetchDataRooms()
      this.props.history.goBack()
    } catch (err) {
      if (this.props.location.state.data) {
        swal('Ubah ruang meeting gagal', '', 'error')
      } else {
        swal('Tambah ruang meeting gagal', '', 'error')
      }
    }


    //thumbnail //
    //nama //
    //location //
    //operational day //
    //operational hour //
    //accessby
    //seat //
    //fasilitas //

  }

  render() {
    return (
      <>
        <Grid style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px' }}>
          <b style={{ fontSize: 20 }}>Tambah ruang</b>
          <p style={{ margin: 0, fontSize: 12, color: '#d71149', cursor: 'pointer' }} onClick={() => this.props.history.goBack()}>{'<'} kembali ke booking room</p>
        </Grid>
        <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>

          {/* FOTO LOKASI */}
          <Grid style={{ marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#adadad' }}><b style={{ fontSize: 14, color: 'black', marginRight: 5 }}>Gambar Ruang</b>harap masuki 1 gambar</p>
            {/* {
              this.props.data && this.props.data.tbl_photo_addresses.length === 0 && <Grid style={{ backgroundColor: 'red', borderRadius: 5, padding: '3px 8px', width: 93 }}>
                <b style={{ margin: 0, color: 'white', fontSize: 10 }}>Foto belum ada</b>
              </Grid>
            } */}

            <DragAndDrop handleFiles={this.handleFiles} status="room" />
          </Grid>

          {/* NAMA RUANG */}
          <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <b style={{ fontSize: 12, marginBottom: 5, width: '20%', minWidth: '200px', marginRight: 10 }}>Nama Ruang</b>
            <Grid style={{ width: '80%' }}>
              <OutlinedInput
                placeholder="alamat"
                value={this.state.roomName}
                onChange={this.handleChange('roomName')}
                variant="outlined"
                style={{ width: '60%', height: 40, margin: 5, minWidth: 400 }}
                inputProps={{
                  style: {
                    padding: '5px 8px',
                    fontSize: 14
                  }
                }}
                disabled={this.state.proses || this.state.disableRoomName}
              />
            </Grid>
          </Grid>

          {/* LOKASI */}
          <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <b style={{ fontSize: 12, marginBottom: 5, width: '20%', minWidth: '200px', marginRight: 10 }}>Lokasi Ruang</b>
            {/* <Grid > */}
            <FormControl variant="outlined" style={{ width: '80%', margin: 5 }}>
              <Select
                value={this.state.location}
                onChange={this.handleChange('location')}
                style={{ marginRight: 10, width: '50%', height: 40 }}
                disabled={this.state.proses}
              >
                {
                  this.props.dataBuildings.map((building, index) =>
                    <MenuItem value={building.building_id} key={'building' + index}>{building.building}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
            {/* </Grid> */}
          </Grid>

          {/* HARI KERJA */}
          <Grid style={{ display: 'flex' }}>
            <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10, marginTop: 8 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>Hari Kerja</b>
              <p style={{ margin: 0, color: '#a5a5a5', fontSize: 10 }}>Pilih hari apa saja ruang dapat digunakan</p>
            </Grid>

            <Grid>
              <FormControlLabel
                control={<Checkbox checked={this.state.followOprationalBuilding} onChange={this.handleOperationalDay} size="small" name="followOprationalBuilding" disabled={this.state.proses} />}
                label={<p style={{ margin: 0, fontSize: 13 }}>Mengikuti hari operasional gedung </p>}
              />
              <Grid>
                <FormControlLabel
                  control={<Checkbox checked={this.state.operationSemua} onChange={this.handleOperationalDay} size="small" name="operationSemua" disabled={this.state.proses} />}
                  label={<p style={{ margin: 0, fontSize: 13 }}>Setiap hari</p>}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.operationSenin} onChange={this.handleOperationalDay} size="small" name="operationSenin" disabled={this.state.proses} />}
                  label={<p style={{ margin: 0, fontSize: 13 }}>Senin</p>}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.operationSelasa} onChange={this.handleOperationalDay} size="small" name="operationSelasa" disabled={this.state.proses} />}
                  label={<p style={{ margin: 0, fontSize: 13 }}>Selasa</p>}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.operationRabu} onChange={this.handleOperationalDay} size="small" name="operationRabu" disabled={this.state.proses} />}
                  label={<p style={{ margin: 0, fontSize: 13 }}>Rabu</p>}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.operationKamis} onChange={this.handleOperationalDay} size="small" name="operationKamis" disabled={this.state.proses} />}
                  label={<p style={{ margin: 0, fontSize: 13 }}>Kamis</p>}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.operationJumat} onChange={this.handleOperationalDay} size="small" name="operationJumat" disabled={this.state.proses} />}
                  label={<p style={{ margin: 0, fontSize: 13 }}>Jumat</p>}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.operationSabtu} onChange={this.handleOperationalDay} size="small" name="operationSabtu" disabled={this.state.proses} />}
                  label={<p style={{ margin: 0, fontSize: 13 }}>Sabtu</p>}
                />
                <FormControlLabel
                  control={<Checkbox checked={this.state.operationMinggu} onChange={this.handleOperationalDay} size="small" name="operationMinggu" disabled={this.state.proses} />}
                  label={<p style={{ margin: 0, fontSize: 13 }}>Minggu</p>}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* JAM OPERASI */}
          <Grid style={{ display: 'flex', margin: '10px 0px' }}>
            <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>Jam Operasi</b>
              <p style={{ margin: 0, color: '#a5a5a5', fontSize: 10 }}>Pilih jam operasi ruang</p>
            </Grid>
            {/*<Grid>
              {
                this.state.operationHours.map((element, index) =>
                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }} key={'a' + index}>
                     {
                      index === 0
                        ? <b style={{ width: 80, marginRight: 10 }}>{element.day}</b>
                        : <Select
                          value={element.day}
                          onChange={this.handleChangeOperationHour('day', index)}
                          style={{ width: 80, marginRight: 10 }}
                          disabled={this.state.proses}
                        >
                          {(this.state.operationSenin || this.state.operationSemua) && <MenuItem value="Senin">Senin</MenuItem>}
                          {(this.state.operationSelasa || this.state.operationSemua) && <MenuItem value="Selasa">Selasa</MenuItem>}
                          {(this.state.operationRabu || this.state.operationSemua) && <MenuItem value="Rabu">Rabu</MenuItem>}
                          {(this.state.operationKamis || this.state.operationSemua) && <MenuItem value="Kamis">Kamis</MenuItem>}
                          {(this.state.operationJumat || this.state.operationSemua) && <MenuItem value="Jumat">Jumat</MenuItem>}
                          {(this.state.operationSabtu || this.state.operationSemua) && <MenuItem value="Sabtu">Sabtu</MenuItem>}
                          {(this.state.operationMinggu || this.state.operationSemua) && <MenuItem value="Minggu">Minggu</MenuItem>}
                        </Select>
                    }
                    <Select
                      value={element.startHour}
                      onChange={this.handleChangeOperationHour('startHour', index)}
                      style={{ width: 80 }}
                      disabled={(!this.state.followOprationalBuilding &&
                        !this.state.operationSemua &&
                        !this.state.operationSenin &&
                        !this.state.operationSelasa &&
                        !this.state.operationRabu &&
                        !this.state.operationKamis &&
                        !this.state.operationJumat &&
                        !this.state.operationSabtu &&
                        !this.state.operationMinggu) || this.state.proses}
                    >
                      {
                        this.state.optionHours.map((hours, index) =>
                          <MenuItem value={hours} key={index}>{hours}</MenuItem>
                        )
                      }
                    </Select>
                    <p style={{ margin: '0px 10px' }}>s/d</p>
                    <Select
                      value={element.endHour}
                      onChange={this.handleChangeOperationHour('endHour', index)}
                      style={{ width: 80 }}
                      disabled={!element.startHour || this.state.proses}
                    >
                      {
                        this.state.optionHours.map((hours, index) =>
                          (+(element.startHour.slice(0, 2)) < +hours.slice(0, 2)) &&
                          (<MenuItem value={hours} key={index}>{hours}</MenuItem>)
                        )
                      }
                    </Select>
                    {/* {
                      index !== 0 && <Button style={{ backgroundColor: '#ff1919', borderRadius: 30, minWidth: 30, color: 'white', marginLeft: '10px' }} size='small' onClick={() => this.deleteOperationHour(index)} disabled={this.state.proses}>X</Button>
                    }

                  </Grid>
                )
              } 

              {
                this.state.operationHours[0].startHour && this.state.operationHours[0].endHour && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.addOperationHour} disabled={this.state.proses}>+ atur jam operasi berbeda</p>
              } 
              
            </Grid> */}
            <Grid style={{ display: 'flex', alignItems: 'center' }}>
              <Select
                value={this.state.startHour}
                onChange={this.handleChangeOperationHour('startHour')}
                style={{ width: 80 }}
                disabled={(!this.state.followOprationalBuilding &&
                  !this.state.operationSemua &&
                  !this.state.operationSenin &&
                  !this.state.operationSelasa &&
                  !this.state.operationRabu &&
                  !this.state.operationKamis &&
                  !this.state.operationJumat &&
                  !this.state.operationSabtu &&
                  !this.state.operationMinggu) || this.state.proses}
              >
                {
                  this.state.optionHours.map((hours, index) =>
                    <MenuItem value={hours} key={index}>{hours}</MenuItem>
                  )
                }
              </Select>
              <p style={{ margin: '0px 10px' }}>s/d</p>
              <Select
                value={this.state.endHour}
                onChange={this.handleChangeOperationHour('endHour')}
                style={{ width: 80 }}
                disabled={!this.state.startHour || this.state.proses}
              >
                {
                  this.state.optionHours.map((hours, index) =>
                    (+(this.state.startHour.slice(0, 2)) < +hours.slice(0, 2)) &&
                    (<MenuItem value={hours} key={index}>{hours}</MenuItem>)
                  )
                }
              </Select>
            </Grid>
          </Grid>

          <p style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 0 }}>Akses</p>

          {/* DAPAT DIPESAN OLEH */}
          <Grid style={{ display: 'flex' }}>
            <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10, marginTop: 8 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>Dapat dipesan oleh</b>
            </Grid>

            <Grid>
              <FormControlLabel
                control={<Checkbox checked={this.state.accessAll} onChange={this.handleAccess} size="small" name="accessAll" disabled={this.state.proses} />}
                label={<p style={{ margin: 0, fontSize: 13 }}>Semua</p>}
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.accessInBuilding} onChange={this.handleAccess} size="small" name="accessInBuilding" disabled={this.state.proses} />}
                label={<p style={{ margin: 0, fontSize: 13 }}>semua di gedung</p>}
              />



              <FormControlLabel
                control={<Checkbox checked={this.state.accessSameCompany} onChange={this.handleAccess} size="small" name="accessSameCompany" disabled={this.state.proses} />}
                label={<p style={{ margin: 0, fontSize: 13 }}>1 perusahaan sama</p>}
              />
            </Grid>
          </Grid>

          {/* ORANG BISA AKSES */}
          {/* <Grid style={{ display: 'flex' }}>
            <p style={{ fontSize: 12, width: '20%', minWidth: '200px', margin: 0, marginRight: 10 }}>daftar orang yang dapat akses ruangan</p>
            <Grid style={{ width: 700, minWidth: 300 }}>
              <CreatableSelect
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={this.state.people}
                onChange={this.handleChangePartisipan}
                getOptionLabel={(option) => option.fullname}
                getOptionValue={(option) => option.user_id}
                disabled={this.state.proses}
              />
            </Grid>
          </Grid> */}

          <p style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 0 }}>Fasilitas</p>

          {/* JUMLAH KURSI */}
          <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <b style={{ fontSize: 12, marginBottom: 5, width: '20%', minWidth: '200px', marginRight: 10 }}>Jumlah kursi tersedia</b>
            <Grid style={{ width: '80%' }}>
              <OutlinedInput
                value={this.state.seat}
                onChange={this.handleChange('seat')}
                variant="outlined"
                style={{ width: '60%', height: 40, margin: 5, minWidth: 400 }}
                inputProps={{
                  style: {
                    padding: '5px 8px',
                    fontSize: 14
                  }
                }}
                disabled={this.state.proses}
              />
            </Grid>
          </Grid>

          {/* FASILITAS */}
          <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <b style={{ fontSize: 12, marginBottom: 5, width: '20%', minWidth: '200px', marginRight: 10 }}>Fasilitas</b>
            <Grid style={{ width: '80%' }}>
              <OutlinedInput
                value={this.state.facility}
                onChange={this.handleChange('facility')}
                variant="outlined"
                style={{ width: '60%', height: 40, margin: 5, minWidth: 400 }}
                inputProps={{
                  style: {
                    padding: '5px 8px',
                    fontSize: 14
                  }
                }}
                disabled={this.state.proses}
              />
            </Grid>
          </Grid>

          <Button color="secondary" variant="outlined" style={{ marginTop: 20 }} onClick={this.submit}>Tambahkan</Button>

        </Paper>
      </>
    )
  }
}

const mapDispatchToProps = {
  fetchDataBuildings,
  fetchDataUsers,
  fetchDataRooms
}

const mapStateToProps = ({ dataBuildings, dataUsers }) => {
  return {
    dataBuildings,
    dataUsers
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMeetingRoom)