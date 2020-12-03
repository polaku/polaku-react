import React, { Component } from 'react';

import { Grid, OutlinedInput, Button, Divider, FormControlLabel, Checkbox, Select, MenuItem, Paper, InputLabel } from '@material-ui/core';
// import SeCreatableSelect from 'react-select/creatable';
import CreatableSelect from 'react-select/creatable';

import makeAnimated from 'react-select/animated';
import DragAndDrop from '../DragAndDrop';

const animatedComponents = makeAnimated();

export default class cardAddAddress extends Component {
  state = {
    building: '',
    address: '',
    phone: [''],
    fax: [''],
    files: [],
    operationSemua: false,
    operationSenin: false,
    operationSelasa: false,
    operationRabu: false,
    operationKamis: false,
    operationJumat: false,
    operationSabtu: false,
    operationMinggu: false,

    optionHours: ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'],
    operationHours: [
      {
        day: 'Setiap Hari',
        startHour: '',
        endHour: '',
      }
    ],
    optionRestHours: ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30'],
    operationRestHours: [
      {
        day: 'Setiap Hari',
        startRestHour: '',
        endRestHour: '',
      }
    ],
    optionCompanies: [],
    buildingId: null,
    listBuilding: [],
    selectedItem: '',
    disableAddress: false,
    hasEdit: false
  }

  async componentDidMount() {
    if (this.props.dataBuilding) {
      await this.fetchListBuilding()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.statusSubmit !== prevProps.statusSubmit && this.props.statusSubmit) {
      this.submit()
    }

    if (this.props.data !== prevProps.data) {
      let operationDay = this.props.data.operationDay.split(',')
      let operationHours = this.props.data.tbl_operation_hours, tempOperationHours = []
      operationHours.forEach(el => {
        el.endHour = el.end.slice(0, 5)
        el.startHour = el.start.slice(0, 5)
        if (el.day === "Setiap Hari") {
          tempOperationHours.unshift(el)
        } else {
          tempOperationHours.push(el)
        }
      })

      let restHour = this.props.data.tbl_recesses, tempRestHour = []
      restHour.forEach(el => {
        el.endRestHour = el.end.slice(0, 5)
        el.startRestHour = el.start.slice(0, 5)
        if (el.day === "Setiap Hari") {
          tempRestHour.unshift(el)
        } else {
          tempRestHour.push(el)
        }
      })

      let selected = this.state.listBuilding.find(el => el.value === this.props.data.building_id)

      this.setState({
        selectedItem: selected,
        addressId: this.props.data.id,
        building: this.props.data.building_id,
        address: this.props.data.address,
        phone: this.props.data.phone ? this.props.data.phone.split(',') : [],
        fax: this.props.data.fax ? this.props.data.fax.split(',') : [],
        operationSemua: operationDay.indexOf('Setiap Hari') >= 0 || operationDay.indexOf('Setiap hari') >= 0 || operationDay.indexOf('setiap hari') >= 0 ? true : false,
        operationSenin: operationDay.indexOf('Senin') >= 0 || operationDay.indexOf('senin') >= 0 ? true : false,
        operationSelasa: operationDay.indexOf('Selasa') >= 0 || operationDay.indexOf('selasa') >= 0 ? true : false,
        operationRabu: operationDay.indexOf('Rabu') >= 0 || operationDay.indexOf('rabu') >= 0 ? true : false,
        operationKamis: operationDay.indexOf('Kamis') >= 0 || operationDay.indexOf('kamis') >= 0 ? true : false,
        operationJumat: operationDay.indexOf('Jumat') >= 0 || operationDay.indexOf('jumat') >= 0 ? true : false,
        operationSabtu: operationDay.indexOf('Sabtu') >= 0 || operationDay.indexOf('sabtu') >= 0 ? true : false,
        operationMinggu: operationDay.indexOf('Minggu') >= 0 || operationDay.indexOf('minggu') >= 0 ? true : false,
        operationHours: tempOperationHours,
        operationRestHours: tempRestHour
      })
    }

    if (this.state.building !== prevState.building) {
      let data = this.props.dataBuilding.find(el => el.building_id === this.state.building)
      if (data) {
        this.setState({ address: data.address, disableAddress: true, buildingId: this.state.building })
      } else {
        this.setState({ address: "", disableAddress: false })
      }
    }

    if (this.props.proses !== prevProps.proses) {
      this.setState({ proses: this.props.proses })
    }

    if (this.props.dataBuilding !== prevProps.dataBuilding) {
      this.fetchListBuilding()
    }
  }

  fetchListBuilding = async () => {
    let listBuilding = []
    await this.props.dataBuilding.forEach(building => {
      listBuilding.push({ value: building.building_id, label: building.building })
    })
    this.setState({ listBuilding })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // HANDLE PHONE (START)
  handleChangePhone = index => event => {
    let newArray = this.state.phone

    newArray[index] = event.target.value

    this.setState({ newArray })
  }

  deletePhone = index => {
    let newArray = this.state.phone;

    newArray.splice(index, 1);
    this.setState({
      phone: newArray
    });
  }

  addPhone = index => {
    let newArray = this.state.phone;

    newArray.push('');
    this.setState({
      phone: newArray
    });
  }
  // HANDLE PHONE (END)


  // HANDLE FAX (START)
  handleChangeFax = index => event => {
    let newArray = this.state.fax

    newArray[index] = event.target.value

    this.setState({ newArray })
  }

  deleteFax = index => {
    let newArray = this.state.fax;

    newArray.splice(index, 1);
    this.setState({
      fax: newArray
    });
  }

  addFax = index => {
    let newArray = this.state.fax;

    newArray.push('');
    this.setState({
      fax: newArray
    });
  }
  // HANDLE PHONE (END)


  handleOperationalDay = event => {
    if (event.target.name === 'operationSemua') {
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
    } else {
      this.setState({
        [event.target.name]: event.target.checked
      })
      if (this.state.operationSemua) {
        this.setState({
          operationSemua: false
        })
      }
    }
  }

  // OPERATION HOUR (START)
  handleChangeOperationHour = (name, index) => event => {
    // this.setState({ [name]: event.target.value });
    let newArray = this.state.operationHours;

    newArray[index][name] = event.target.value

    this.setState({
      operationHours: newArray
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


  // OPERATION REST HOUR (START)
  handleChangeOperationRestHour = (name, index) => event => {
    // this.setState({ [name]: event.target.value });
    let newArray = this.state.operationRestHours;

    newArray[index][name] = event.target.value

    this.setState({
      operationRestHours: newArray
    });
  };

  addOperationRestHour = () => {
    let newArray = this.state.operationRestHours

    newArray.push({
      day: '',
      startRestHour: '',
      endRestHour: '',
    })

    this.setState({
      operationRestHours: newArray
    });
  }

  deleteOperationRestHour = index => {
    let newArray = this.state.operationRestHours;

    newArray.splice(index, 1);
    this.setState({
      operationRestHours: newArray
    });
  }
  // OPERATION REST HOUR (END)

  handleFiles = files => {
    this.setState({ files })
  }

  submit = () => {
    let operationalDay = []

    if (this.state.operationSemua) operationalDay.push('Setiap hari')
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

    newData.append("addressId", this.state.addressId)
    newData.append("building_id", this.state.buildingId)
    newData.append("companyId", this.props.companyId)
    newData.append("building", this.state.building)
    newData.append("address", this.state.address)
    newData.append("phone", this.state.phone.join(','))
    newData.append("fax", this.state.fax.join(','))
    newData.append("operationalDay", operationalDay.join(','))

    if (this.state.files.length > 0) this.state.files.forEach(file => {
      newData.append("files", file)
    })
    this.state.operationHours.forEach(operationHour => {
      newData.append("operationHours", JSON.stringify(operationHour))
    })
    this.state.operationRestHours.forEach(operationRestHour => {
      newData.append("operationRestHours", JSON.stringify(operationRestHour))
    })

    this.props.sendData(newData)
  }

  handleChangeBuilding = (newValue, actionMeta) => {
    if (newValue !== null) {
      this.setState({
        building: newValue.value
      })
      if (this.props.data) {
        let selected = this.state.listBuilding.find(el => el.value === newValue.value)
        this.setState({ selectedItem: selected })
      }
    } else {
      this.setState({
        building: "", selectedItem: null
      })
    }
  };

  handleInputChange = (inputValue, actionMeta) => {
    if (inputValue) {
      this.setState({
        building: inputValue
      })
    }
  };

  render() {
    return (
      <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>

        {/* FOTO LOKASI */}
        <>
          <p style={{ margin: 0, fontSize: 11, color: '#adadad' }}><b style={{ fontSize: 14, color: 'black' }}>Foto lokasi</b>harap masuki 1 gambar tampilan depan, tampilan dalam kantor, apabila dak ada dapat dikosongkan</p>
          {
            this.props.data && this.props.data.tbl_photo_addresses.length === 0 && <Grid style={{ backgroundColor: 'red', borderRadius: 5, padding: '3px 8px', width: 93 }}>
              <b style={{ margin: 0, color: 'white', fontSize: 10 }}>Foto belum ada</b>
            </Grid>
          }
          <DragAndDrop handleFiles={this.handleFiles} />
        </>

        {/* ALAMAT */}
        <Grid style={{ margin: '10px 0px' }}>
          <b style={{ fontSize: 14 }}>Alamat</b>
          <Grid style={{ display: 'flex' }}>
            <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>lokasi alamat</b>
              <p style={{ margin: 0, color: '#a5a5a5', fontSize: 10 }}>pastikan alamat tidak berulang, alamat ini akan digunakan sebagai Pusat</p>
            </Grid>

            <Grid style={{ width: '80%' }}>
              <Grid style={{ marginBottom: 10 }}>
                <Grid style={{ width: '30%', height: 40, margin: 5, minWidth: 200 }}>
                  <CreatableSelect
                    isClearable
                    value={this.props.data && this.state.selectedItem}
                    // value={this.props.data && !this.state.hasEdit && this.state.selectedItem}
                    components={animatedComponents}
                    options={this.state.listBuilding}
                    onChange={this.handleChangeBuilding}
                    onInputChange={this.handleInputChange}
                    disabled={this.state.proses}
                    placeholder="Pilih atau Tulis nama lokasi"
                  />
                </Grid>
                <InputLabel style={{ fontStyle: 'italic', fontSize: 12, marginLeft: 5 }}>* apabila tidak ada pilihannya harap tulis dan create</InputLabel>
              </Grid>
              <OutlinedInput
                placeholder="alamat"
                value={this.state.address}
                onChange={this.handleChange('address')}
                variant="outlined"
                style={{ width: '60%', height: 40, margin: 5, minWidth: 400 }}
                inputProps={{
                  style: {
                    padding: '5px 8px',
                    fontSize: 14
                  }
                }}
                disabled={this.state.proses || this.state.disableAddress}
              />

              <Grid style={{ display: 'flex', width: '100%', alignItems: 'start', margin: '10px 0px', flexWrap: 'wrap' }}>
                <Grid style={{ margin: 5 }}>
                  {
                    this.state.phone.map((phone, index) =>
                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, marginRight: 30, minWidth: 300 }} key={'phone' + index}>
                        <OutlinedInput
                          placeholder="no tel"
                          value={phone}
                          onChange={this.handleChangePhone(index)}
                          variant="outlined"
                          style={{ width: '75%', height: 40 }}
                          inputProps={{
                            style: {
                              padding: '5px 8px',
                              fontSize: 14
                            }
                          }}
                          disabled={this.state.proses}
                        />
                        {
                          index === this.state.phone.length - 1
                            ? <Button variant="outlined" style={{ minWidth: '20%' }} onClick={() => this.addPhone(index)} disabled={this.state.proses}>+</Button>
                            : <Button variant="outlined" style={{ backgroundColor: '#ff1919', minWidth: '20%', color: 'white', }} size='small' onClick={() => this.deletePhone(index)} disabled={this.state.proses}>X</Button>
                        }
                      </Grid>
                    )
                  }
                </Grid>

                <Grid style={{ margin: 5 }}>
                  {
                    this.state.fax.map((fax, index) =>
                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, marginRight: 30, minWidth: 300 }} key={'fax' + index}>
                        <OutlinedInput
                          placeholder="no fax"
                          value={fax}
                          onChange={this.handleChangeFax(index)}
                          variant="outlined"
                          style={{ width: '75%', height: 40 }}
                          inputProps={{
                            style: {
                              padding: '5px 8px',
                              fontSize: 14
                            }
                          }}
                          disabled={this.state.proses}
                        />
                        {
                          index === this.state.fax.length - 1
                            ? <Button variant="outlined" style={{ minWidth: '20%' }} onClick={() => this.addFax(index)} disabled={this.state.proses}>+</Button>
                            : <Button variant="outlined" style={{ backgroundColor: '#ff1919', minWidth: '20%', color: 'white', }} size='small' onClick={() => this.deleteFax(index)} disabled={this.state.proses}>X</Button>
                        }
                      </Grid>
                    )
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider style={{ backgroundColor: '#707070' }} />

        <Grid style={{ padding: '5px 0px' }}>
          {/* HARI KERJA */}
          <Grid style={{ display: 'flex', margin: '10px 0px' }}>
            <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>Hari Kerja</b>
              <p style={{ margin: 0, color: '#a5a5a5', fontSize: 10 }}>Pilih hari apa saja perushaaan beroperasi.</p>
            </Grid>
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

          {/* JAM OPERASI */}
          <Grid style={{ display: 'flex', margin: '10px 0px' }}>
            <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>Jam Operasi</b>
              <p style={{ margin: 0, color: '#a5a5a5', fontSize: 10 }}>Pilih jam operasi perusahaan.</p>
            </Grid>
            <Grid>
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
                      disabled={(!this.state.operationSemua &&
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
                    {
                      index !== 0 && <Button style={{ backgroundColor: '#ff1919', borderRadius: 30, minWidth: 30, color: 'white', marginLeft: '10px' }} size='small' onClick={() => this.deleteOperationHour(index)} disabled={this.state.proses}>X</Button>
                    }

                  </Grid>
                )
              }

              {
                this.state.operationHours[0].startHour && this.state.operationHours[0].endHour && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.addOperationHour} disabled={this.state.proses}>+ atur jam operasi berbeda</p>
              }

            </Grid>
          </Grid>

          {/* JAM ISTIRAHAT */}
          <Grid style={{ display: 'flex', margin: '10px 0px' }}>
            <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>Jam Istirahat</b>
            </Grid>
            <Grid>
              {
                this.state.operationRestHours.map((element, index) =>
                  <Grid style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }} key={'b' + index}>
                    {
                      index === 0
                        ? <b style={{ width: 80, marginRight: 10 }}>{element.day}</b>
                        : <Select
                          value={element.day}
                          onChange={this.handleChangeOperationRestHour('day', index)}
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
                      value={element.startRestHour}
                      onChange={this.handleChangeOperationRestHour('startRestHour', index)}
                      style={{ width: 80 }}
                      disabled={(!this.state.operationSemua &&
                        !this.state.operationSenin &&
                        !this.state.operationSelasa &&
                        !this.state.operationRabu &&
                        !this.state.operationKamis &&
                        !this.state.operationJumat &&
                        !this.state.operationSabtu &&
                        !this.state.operationMinggu) || this.state.proses}
                    >
                      {
                        this.state.optionRestHours.map((hours, index) =>
                          <MenuItem value={hours} key={index}>{hours}</MenuItem>
                        )
                      }
                    </Select>
                    <p style={{ margin: '0px 10px' }}>s/d</p>
                    <Select
                      value={element.endRestHour}
                      onChange={this.handleChangeOperationRestHour('endRestHour', index)}
                      style={{ width: 80 }}
                      disabled={!element.startRestHour || this.state.proses}
                    >
                      {
                        this.state.optionRestHours.map((hours, index) =>
                          (+element.startRestHour.slice(0, 2) < +hours.slice(0, 2)) &&
                          (<MenuItem value={hours} key={index}>{hours}</MenuItem>)
                        )
                      }

                    </Select>
                    {
                      index !== 0 && <Button style={{ backgroundColor: '#ff1919', borderRadius: 30, minWidth: 30, color: 'white', marginLeft: '10px' }} size='small' onClick={() => this.deleteOperationRestHour(index)} disabled={this.state.proses}>X</Button>
                    }
                  </Grid>
                )
              }

              {
                this.state.operationRestHours[0].startRestHour && this.state.operationRestHours[0].endRestHour && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.addOperationRestHour} disabled={this.state.proses}>+ tambah jam istirahat baru</p>
              }
            </Grid>
          </Grid>

        </Grid>
      </Paper>
    )
  }
}
