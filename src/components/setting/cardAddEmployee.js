import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, OutlinedInput, 
  // Button, Divider, 
  FormControlLabel, Checkbox, Select, MenuItem, Paper, FormControl, TextField } from '@material-ui/core';
// import SeCreatableSelect from 'react-select/creatable';
import CreatableSelect from 'react-select/creatable';

import makeAnimated from 'react-select/animated';
// import DragAndDrop from '../DragAndDrop';

import { fetchDataCompanies, fetchDataDepartment, fetchDataPosition, fetchDataUsers, fetchDataAddress } from '../../store/action';

const animatedComponents = makeAnimated();

class cardAddEmployee extends Component {
  state = {
    image: '',
    name: '',
    nickName: '',
    initial: '',
    company: '',
    companyAddress: '',
    nik: '',
    divisi: '',
    peran: '',
    evaluator1: '',
    evaluator2: '',
    tanggalGabung: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
    statusKaryawan: '',
    sisaCuti: '',
    tanggalMulaiCuti: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
    sisaCutiBesar: '',
    nextFrame: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
    nextLensa: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,

    companyService: '',
    companyServiceAddress: '',

    emailPribadi: '',
    emailKantor: '',
    telepon: '',
    alamat: '',

    listUser: [],
    dataAddress: [],
    isDinas: false,


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
    addressId: null,
    listAddress: [],
    selectedItem: ''
  }

  async componentDidMount() {
    await this.props.fetchDataCompanies()
    await this.props.fetchDataDepartment()
    await this.props.fetchDataPosition()
    await this.props.fetchDataUsers()
    await this.props.fetchDataAddress()
  }

  async componentDidUpdate(prevProps, prevState) {
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

      let selected = this.state.listAddress.find(el => el.value === this.props.data.address)

      this.setState({
        selectedItem: selected,
        addressId: this.props.data.id,
        newAddress: this.props.data.address,
        initial: this.props.data.acronym,
        phone: this.props.data.phone.split(','),
        fax: this.props.data.fax.split(','),
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

    if (this.props.proses !== prevProps.proses) {
      this.setState({ proses: this.props.proses })
    }

    if (this.props.dataUsers !== prevProps.dataUsers) {
      let listUser = []
      await this.props.dataUsers.forEach(user => {
        listUser.push({ value: user.user_id, label: user.tbl_account_detail.fullname })
      })
      this.setState({ listUser })
    }

    if (this.props.dataAddress !== prevProps.dataAddress) {
      this.setState({ dataAddress: this.props.dataAddress })
    }

    if (this.state.company !== prevState.company) {
      console.log(this.state.company, "MASUK")
      console.log(this.props.dataAddress)
      let dataAddress = await this.props.dataAddress.filter(address => address.company_id === this.state.company)
      this.setState({ dataAddress })
    }
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
    newData.append("companyId", this.props.companyId)
    newData.append("address", this.state.newAddress)
    newData.append("initial", this.state.initial)
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

  handleChangeAddress = (newValue, actionMeta) => {
    if (newValue !== null) {
      this.setState({
        newAddress: newValue.value
      })
    } else {
      this.setState({
        newAddress: ""
      })
    }
  };

  handleInputChange = (inputValue, actionMeta) => {
    if (inputValue) {
      this.setState({
        newAddress: inputValue
      })
    }
  };

  handleChangeEvaluator = (newValue, actionMeta) => {
    if (newValue.eva1) {
      if (newValue !== null) {
        this.setState({
          evaluator1: newValue.value
        })
      } else {
        this.setState({
          partOfDepartment: ""
        })
      }
    } else {
      if (newValue !== null) {
        this.setState({
          evaluator2: newValue.value
        })
      } else {
        this.setState({
          partOfDepartment: ""
        })
      }
    }
  };

  handleChecked = event => {
    this.setState({
      isDinas: event.target.checked
    })
  }

  render() {
    return (
      <>
        {/* 1 */}
        <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>

          {/* <h3 style={{ margin: 0, marginBottom: 5 }}><b>A. Data Karyawan</b></h3> */}

          <Grid id="foto-karyawan" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Foto Karyawan</b>
            </Grid>

            <Grid style={{ width: '80%' }}>
              <OutlinedInput
                placeholder="tambah foto baru"
                value={this.state.initial}
                onChange={this.handleChange('initial')}
                variant="outlined"
                style={{ width: '30%', height: 40, margin: '5px 0px', minWidth: 150 }}
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

          <Grid id="nama-karyawan" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Nama</b>
            </Grid>

            <OutlinedInput
              placeholder="sesuai KTP"
              value={this.state.name}
              onChange={this.handleChange('name')}
              variant="outlined"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="nama-panggilan" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Nama Panggilan</b>
            </Grid>

            <OutlinedInput
              value={this.state.nickName}
              onChange={this.handleChange('nickName')}
              variant="outlined"
              style={{ width: '28%', height: 40, margin: '5px 0px' }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
            <Grid style={{ width: '2%' }} />
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Akronim</b>
            </Grid>

            <OutlinedInput
              value={this.state.initial}
              onChange={this.handleChange('initial')}
              variant="outlined"
              style={{ width: '28%', height: 40, margin: '5px 0px' }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="pt" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>PT</b>
            </Grid>

            <FormControl variant="outlined" size="small" style={{ width: '28%', height: 40, margin: '5px 0px' }}>
              <Select
                value={this.state.company}
                onChange={this.handleChange('company')}
                disabled={this.state.proses || this.state.disableCompanyId}
                style={{ width: '100%' }}
              >
                {
                  this.props.dataCompanies.map((company, index) =>
                    <MenuItem value={company.company_id} key={index}>{company.company_name}</MenuItem>
                  )
                }
              </Select>
            </FormControl>

            <Grid style={{ width: '2%' }} />

            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>NIK</b>
            </Grid>

            <OutlinedInput
              value={this.state.nik}
              onChange={this.handleChange('nik')}
              variant="outlined"
              style={{ width: '28%', height: 40, margin: '5px 0px' }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="divisi" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Divisi</b>
            </Grid>

            <FormControl variant="outlined" size="small" style={{ width: '28%', height: 40, margin: '5px 0px' }}>
              <Select
                value={this.state.divisi}
                onChange={this.handleChange('divisi')}
                disabled={this.state.proses}
                style={{ width: '100%' }}
              >
                {
                  this.props.dataDepartments.map((department, index) =>
                    <MenuItem value={department.departments_id} key={"department" + index}>{department.deptname}</MenuItem>
                  )
                }
              </Select>
            </FormControl>

            <Grid style={{ width: '2%' }} />

            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Peran</b>
            </Grid>

            <FormControl variant="outlined" size="small" style={{ width: '28%', height: 40, margin: '5px 0px' }}>
              <Select
                value={this.state.peran}
                onChange={this.handleChange('peran')}
                disabled={this.state.proses}
                style={{ width: '100%' }}
              >
                {
                  this.props.dataPositions.map((position, index) =>
                    <MenuItem value={position.position_id} key={"department" + index}>{position.position}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </Grid>

          <Grid id="evaluator" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Evaluator 1</b>
            </Grid>
            <Grid style={{ width: '28%', height: 40, margin: '5px 0px' }}>
              <CreatableSelect
                isClearable
                // placeholder="bagian dari divisi"
                // value={this.props.data && this.state.selectedPartDept}
                components={animatedComponents}
                options={this.state.listUser}
                onChange={(newValue) => this.handleChangeEvaluator({ ...newValue, eva1: true })}
                disabled={this.state.proses}
              />
            </Grid>

            <Grid style={{ width: '2%' }} />

            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Evaluator 2</b>
            </Grid>

            <Grid style={{ width: '28%', height: 40, margin: '5px 0px' }}>
              <CreatableSelect
                isClearable
                // placeholder="bagian dari divisi"
                // value={this.props.data && this.state.selectedPartDept}
                components={animatedComponents}
                options={this.state.listUser}
                onChange={(newValue) => this.handleChangeEvaluator({ ...newValue, eva1: false })}
                disabled={this.state.proses}
              />
            </Grid>
          </Grid>

        </Paper>

        {/* 2 */}
        <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>

          <Grid id="tanggal-bergabung" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>tanggal bergabung</b>
            </Grid>
            <TextField
              id="date"
              type="date"
              margin="normal"
              variant="outlined"
              format="dd/MM/yyyy"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              InputLabelProps={{
                shrink: true,
                required: true
              }}
              size="small"
              onChange={this.handleChange('tanggalGabung')}
              value={this.state.tanggalGabung}
              required
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="status-karyawan" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Status karyawan</b>
            </Grid>

            <FormControl variant="outlined" size="small" style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}>
              <Select
                value={this.state.statusKaryawan}
                onChange={this.handleChange('statusKaryawan')}
                disabled={this.state.proses}
                style={{ width: '100%' }}
              >
                <MenuItem value="Tetap" >Tetap</MenuItem>
                <MenuItem value="Kontrak" >Kontrak</MenuItem>
                <MenuItem value="Probation" >Probation</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid id="sisa-cuti" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Sisa Cuti</b>
            </Grid>

            <OutlinedInput
              value={this.state.sisaCuti}
              onChange={this.handleChange('sisaCuti')}
              variant="outlined"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="tanggal-mulai-cuti" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Tanggal Mulai Cuti Besar</b>
            </Grid>
            <TextField
              id="date"
              type="date"
              margin="normal"
              variant="outlined"
              format="dd/MM/yyyy"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              InputLabelProps={{
                shrink: true,
                required: true
              }}
              size="small"
              onChange={this.handleChange('tanggalMulaiCuti')}
              value={this.state.tanggalMulaiCuti}
              required
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="sisa-cuti-besar" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Sisa Cuti Besar</b>
            </Grid>

            <OutlinedInput
              value={this.state.sisaCutiBesar}
              onChange={this.handleChange('sisaCutiBesar')}
              variant="outlined"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="next-frame" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Kacamata Frame berikutnya</b>
            </Grid>
            <TextField
              id="date"
              type="date"
              margin="normal"
              variant="outlined"
              format="dd/MM/yyyy"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              InputLabelProps={{
                shrink: true,
                required: true
              }}
              size="small"
              onChange={this.handleChange('nextFrame')}
              value={this.state.nextFrame}
              required
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="next-lensa" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Kacamata Lensa berikutnya</b>
            </Grid>
            <TextField
              id="date"
              type="date"
              margin="normal"
              variant="outlined"
              format="dd/MM/yyyy"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              InputLabelProps={{
                shrink: true,
                required: true
              }}
              size="small"
              onChange={this.handleChange('nextLensa')}
              value={this.state.nextLensa}
              required
              disabled={this.state.proses}
            />
          </Grid>
        </Paper>

        {/* 3 */}
        <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>
          <Grid style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={<Checkbox checked={this.state.isDinas} onChange={this.handleChecked} size="small" name="dinas" disabled={this.state.proses} />}
              label={<b style={{ margin: 0 }}>Dinas</b>}
            />
            <p style={{ margin: 0 }}>diabaikan apabila dak dinas</p>
          </Grid>

          <Grid id="pt-dinas" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>PT</b>
            </Grid>

            <FormControl variant="outlined" size="small" style={{ width: '28%', height: 40, margin: '5px 0px' }}>
              <Select
                value={this.state.companyService}
                onChange={this.handleChange('companyService')}
                disabled={this.state.proses || !this.state.isDinas}
                style={{ width: '100%' }}
              >
                {
                  this.props.dataCompanies.map((company, index) =>
                    <MenuItem value={company.company_id} key={index}>{company.company_name}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </Grid>

          <Grid id="alamat-pt-dinas" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Alamat</b>
            </Grid>

            <FormControl variant="outlined" size="small" style={{ width: '50%', height: 40, margin: '5px 0px' }}>
              <Select
                value={this.state.companyServiceAddress}
                onChange={this.handleChange('companyServiceAddress')}
                disabled={this.state.proses || !this.state.isDinas}
                style={{ width: '100%' }}
              >
                {
                  this.props.dataAddress.map((address, index) =>
                    address.company_id === this.state.companyService && <MenuItem value={address.id} key={"companyServiceAddress" + index}>{address.address}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </Grid>
        </Paper>

        {/* 4 */}
        <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>

          <Grid id="alamat-pt" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Lokasi</b>
            </Grid>

            <FormControl variant="outlined" size="small" style={{ width: '50%', height: 40, margin: '5px 0px' }}>
              <Select
                value={this.state.companyAddress}
                onChange={this.handleChange('companyAddress')}
                disabled={this.state.proses}
                style={{ width: '100%' }}
              >
                {
                  this.state.dataAddress.map((address, index) =>
                    <MenuItem value={address.id} key={"companyAddress" + index}>{address.address}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </Grid>

        </Paper>

        {/* 5 */}
        <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>

          <Grid id="email-pribadi" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Email Pribadi</b>
            </Grid>

            <OutlinedInput
              type="email"
              value={this.state.emailPribadi}
              onChange={this.handleChange('emailPribadi')}
              variant="outlined"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="email-kantor" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Email Kantor</b>
            </Grid>

            <OutlinedInput
              type="email"
              value={this.state.emailKantor}
              onChange={this.handleChange('emailKantor')}
              variant="outlined"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="telpon" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>No Telpon</b>
            </Grid>

            <OutlinedInput
              value={this.state.telepon}
              onChange={this.handleChange('telepon')}
              variant="outlined"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>

          <Grid id="alamat" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Alamat</b>
            </Grid>

            <OutlinedInput
              value={this.state.alamat}
              onChange={this.handleChange('alamat')}
              variant="outlined"
              style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.state.proses}
            />
          </Grid>
        </Paper>
      </>
    )
  }
}


const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataDepartment,
  fetchDataPosition,
  fetchDataUsers,
  fetchDataAddress
}

const mapStateToProps = ({ dataCompanies, dataDepartments, dataPositions, dataUsers, dataAddress }) => {
  return {
    dataCompanies,
    dataDepartments,
    dataPositions,
    dataUsers,
    dataAddress
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(cardAddEmployee)