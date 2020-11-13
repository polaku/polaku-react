import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid, OutlinedInput,
  // Button, Divider, 
  FormControlLabel, Checkbox, Select, MenuItem, Paper, FormControl, TextField, Avatar
} from '@material-ui/core';
// import SeReactSelect from 'react-select/creatable';
import ReactSelect from 'react-select';

import makeAnimated from 'react-select/animated';
// import DragAndDrop from '../DragAndDrop';

import { fetchDataCompanies, fetchDataDepartment, fetchDataPosition, fetchDataUsers, fetchDataAddress } from '../../store/action';

const animatedComponents = makeAnimated();

class cardAddEmployee extends Component {
  state = {
    avatar: null,
    pathAvatar: '',
    name: '',
    nickname: '',
    initial: '',
    company: '',
    companyAddress: '',
    nik: '',
    divisi: '',
    peran: '',
    evaluator1: '',
    evaluator1Selected: null,
    evaluator2: '',
    evaluator2Selected: null,
    tanggalGabung: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
    dateOfBirth: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
    statusKaryawan: '',
    sisaCuti: '',
    tanggalMulaiCutiBesar: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
    sisaCutiBesar: '',
    nextFrame: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
    nextLensa: `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,

    companyDinas: '',
    companyDinasAddress: '',

    emailPribadi: '',
    emailKantor: '',
    telepon: '',
    alamat: '',

    listUser: [],
    dataAddress: [],
    dataAddressDinas: [],
    isDinas: false,

    password: '',
    optionCompany: []
  }

  async componentDidMount() {
    await this.props.fetchDataUsers()
    await this.props.fetchDataCompanies()
    await this.props.fetchDataDepartment()
    await this.props.fetchDataPosition()
    await this.props.fetchDataAddress()
    if (this.props.data) {
      console.log(this.props.data)
      await this.fetchDataEdit()
    }
    // console.log(this.props.location.state.index)
  }

  async componentDidUpdate(prevProps, prevState) {

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
      let dataAddress = [], idBuilding = []

      await this.props.dataAddress.forEach(address => {
        if (address.company_id === this.state.company) {
          if (idBuilding.indexOf(address.building_id) < 0) {
            idBuilding.push(address.building_id)
            dataAddress.push(address.tbl_building)
          }
        }
      });

      this.setState({ dataAddress })
    }

    if (this.state.companyDinas !== prevState.companyDinas) {
      let dataAddressDinas = [], idBuilding = []

      await this.props.dataAddress.forEach(address => {
        if (address.company_id === this.state.companyDinas) {
          if (idBuilding.indexOf(address.building_id) < 0) {
            idBuilding.push(address.building_id)
            dataAddressDinas.push(address.tbl_building)
          }
        }
      });

      this.setState({ dataAddressDinas })
    }

    if (this.props.statusSubmit !== prevProps.statusSubmit && this.props.statusSubmit) {
      this.submit()
    }

    if (this.props.dataCompanies !== prevProps.dataCompanies || this.props.dinas !== prevProps.dinas) {
      console.log(this.props.dataCompanies)
      console.log(this.props.dinas)
      let optionCompany = []
      this.props.dinas.forEach(el => {
        let check = this.props.dataCompanies.find(element => el.company_id === element.company_id)
        if (check) optionCompany.push(check)
      })

      this.setState({ optionCompany })
    }
  }

  fetchDataEdit = async () => {
    this.setState({
      pathAvatar: this.props.data.rawData.tbl_account_detail.avatar,
      name: this.props.data.rawData.tbl_account_detail.fullname,
      nickname: this.props.data.rawData.tbl_account_detail.nickname,
      initial: this.props.data.rawData.tbl_account_detail.initial,
      company: this.props.data.rawData.tbl_account_detail.company_id,
      companyAddress: this.props.data.rawData.tbl_account_detail.building_id,
      nik: this.props.data.rawData.tbl_account_detail.nik,
      divisi: this.props.data.rawData.tbl_account_detail.departments_id,
      peran: this.props.data.rawData.tbl_account_detail.position_id,
      evaluator1: this.props.data.rawData.tbl_account_detail.name_evaluator_1,
      evaluator1Selected: this.props.data.rawData.tbl_account_detail.name_evaluator_1 && this.state.listUser.find(user => user.value === +this.props.data.rawData.tbl_account_detail.name_evaluator_1),
      evaluator2: this.props.data.rawData.tbl_account_detail.name_evaluator_2,
      evaluator2Selected: this.props.data.rawData.tbl_account_detail.name_evaluator_2 && this.state.listUser.find(user => user.value === this.props.data.rawData.tbl_account_detail.name_evaluator_2),
      tanggalGabung: this.props.data.rawData.tbl_account_detail.join_date || null,
      dateOfBirth: this.props.data.rawData.tbl_account_detail.date_of_birth || null,
      statusKaryawan: this.props.data.rawData.tbl_account_detail.status_employee,
      sisaCuti: this.props.data.rawData.tbl_account_detail.leave,
      tanggalMulaiCutiBesar: this.props.data.rawData.tbl_account_detail.start_leave_big || null,
      sisaCutiBesar: this.props.data.rawData.tbl_account_detail.leave_big,
      nextFrame: this.props.data.rawData.tbl_account_detail.next_frame_date || null,
      nextLensa: this.props.data.rawData.tbl_account_detail.next_lensa_date || null,

      emailPribadi: this.props.data.rawData.email,
      emailKantor: this.props.data.rawData.tbl_account_detail.office_email,
      telepon: this.props.data.rawData.tbl_account_detail.phone,
      alamat: this.props.data.rawData.tbl_account_detail.address,

      isDinas: this.props.data.rawData.dinas.length > 0 ? true : false,
    })

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
    let newData = new FormData()

    if (this.props.data) newData.append("userId", this.props.data.userId)
    newData.append("username", this.state.nik)
    if (!this.props.data) newData.append("password", this.state.dateOfBirth.split('-').reverse().join(''))
    if (this.props.data && this.state.password) newData.append("password", this.state.password)
    newData.append("email", this.state.emailPribadi)
    newData.append("fullname", this.state.name)
    newData.append("initial", this.state.initial)
    newData.append("nik", this.state.nik)
    newData.append("address", this.state.alamat)
    if (this.state.dateOfBirth) newData.append("dateOfBirth", this.state.dateOfBirth)
    newData.append("leave", this.state.sisaCuti)
    newData.append("building_id", this.state.companyAddress)
    newData.append("company_id", this.state.company)
    newData.append("position_id", this.state.peran)
    newData.append("phone", this.state.telepon)
    newData.append("name_evaluator_1", this.state.evaluator1)
    newData.append("name_evaluator_2", this.state.evaluator2)
    newData.append("nickname", this.state.nickname)
    newData.append("departments_id", this.state.divisi)
    newData.append("statusEmployee", this.state.statusKaryawan)
    if (this.state.tanggalGabung) newData.append("joinDate", this.state.tanggalGabung)
    if (this.state.tanggalMulaiCutiBesar) newData.append("startLeaveBig", this.state.tanggalMulaiCutiBesar)
    newData.append("leaveBig", this.state.sisaCutiBesar)
    if (this.state.nextFrame) newData.append("nextFrameDate", this.state.nextFrame)
    if (this.state.nextLensa) newData.append("nextLensaDate", this.state.nextLensa)
    if (!this.props.data) newData.append("dinasId", this.state.isDinas ? this.state.companyDinas : '')
    if (!this.props.data) newData.append("dinasBuildingId", this.state.isDinas ? this.state.companyDinasAddress : '')
    newData.append("officeEmail", this.state.emailKantor)

    if (this.state.avatar) newData.append("avatar", this.state.avatar)

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

  handleFileSelect = (e, name) => {
    let file = e.target.files[0]

    if (file.size < 5000000) {
      let pathAvatar = URL.createObjectURL(file)
      this.setState({ pathAvatar })
      this.setState({ avatar: file, pathAvatar });
    } else {
      e.target.value = null;
      //   swal("Unggah File Gagal!", "Ukuran file lebih dari 5MB", "warning")
    }
  };

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

            <Grid style={{ width: '80%', display: 'flex', alignItems: 'center' }}>
              <input type="file" label="avatar" onChange={(e) => this.handleFileSelect(e)} disabled={this.props.proses}
                accept="image/png,image/jpeg"
                style={{ border: this.state.newImageIsError ? '1px solid red' : null }}
              />
              <Avatar alt="Avatar" src={this.state.pathAvatar} />
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
              disabled={this.props.proses}
            />
          </Grid>

          <Grid id="nama-panggilan" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Nama Panggilan</b>
            </Grid>

            <OutlinedInput
              value={this.state.nickname}
              onChange={this.handleChange('nickname')}
              variant="outlined"
              style={{ width: '28%', height: 40, margin: '5px 0px' }}
              inputProps={{
                style: {
                  padding: '5px 8px',
                  fontSize: 14
                }
              }}
              disabled={this.props.proses}
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
              disabled={this.props.proses}
            />
          </Grid>

          <Grid id="tanggal-lahir" style={{ display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>tanggal lahir</b>
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
              onChange={this.handleChange('dateOfBirth')}
              value={this.state.dateOfBirth}
              required
              disabled={this.props.proses}
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
                disabled={this.props.proses || this.state.disableCompanyId}
                style={{ width: '100%' }}
              >
                {
                  this.state.optionCompany.map((company, index) =>
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
              disabled={this.props.proses}
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
                disabled={this.props.proses}
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
                disabled={this.props.proses}
                style={{ width: '100%' }}
              >
                {
                  this.props.dataPositions.length > 0 && this.props.dataPositions.map((position, index) =>
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
              <ReactSelect
                isClearable
                value={this.props.data && this.state.evaluator1Selected}
                components={animatedComponents}
                options={this.state.listUser}
                onChange={(newValue) => this.handleChangeEvaluator({ ...newValue, eva1: true })}
                disabled={this.props.proses}
              />
            </Grid>

            <Grid style={{ width: '2%' }} />

            <Grid style={{ width: '20%', marginRight: 10 }}>
              <b style={{ marginBottom: 5 }}>Evaluator 2</b>
            </Grid>

            <Grid style={{ width: '28%', height: 40, margin: '5px 0px' }}>
              <ReactSelect
                isClearable
                value={this.props.data && this.state.evaluator2Selected}
                components={animatedComponents}
                options={this.state.listUser}
                onChange={(newValue) => this.handleChangeEvaluator({ ...newValue, eva1: false })}
                disabled={this.props.proses}
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
              disabled={this.props.proses}
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
                disabled={this.props.proses}
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
              disabled={this.props.proses}
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
              onChange={this.handleChange('tanggalMulaiCutiBesar')}
              value={this.state.tanggalMulaiCutiBesar}
              required
              disabled={this.props.proses}
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
              disabled={this.props.proses}
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
              disabled={this.props.proses}
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
              disabled={this.props.proses}
            />
          </Grid>
        </Paper>

        {/* 3 */}
        {
          !this.props.data && <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>
            <Grid style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox checked={this.state.isDinas} onChange={this.handleChecked} size="small" name="dinas" disabled={this.props.proses} />}
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
                  value={this.state.companyDinas}
                  onChange={this.handleChange('companyDinas')}
                  disabled={this.props.proses || !this.state.isDinas}
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
                  value={this.state.companyDinasAddress}
                  onChange={this.handleChange('companyDinasAddress')}
                  disabled={this.props.proses || !this.state.isDinas || !this.state.companyDinas}
                  style={{ width: '100%' }}
                >
                  {
                    this.state.dataAddressDinas.map((address, index) =>
                      <MenuItem value={address.building_id} key={"companyDinasAddress" + index}>{address.building}</MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            </Grid>
          </Paper>
        }

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
                disabled={this.props.proses || !this.state.company}
                style={{ width: '100%' }}
              >
                {
                  this.state.dataAddress.map((address, index) =>
                    <MenuItem value={address.building_id} key={"companyAddress" + index}>{address.building}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </Grid>

        </Paper>

        {/* 5 */}
        <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>

          {
            this.props.data &&
            <Grid id="password" style={{ display: 'flex', alignItems: 'center' }}>
              <Grid style={{ width: '20%', marginRight: 10 }}>
                <b style={{ marginBottom: 5 }}>Kata Sandi Baru</b>
              </Grid>

              <OutlinedInput
                type="password"
                value={this.state.password}
                onChange={this.handleChange('password')}
                variant="outlined"
                style={{ width: '75%', height: 40, margin: '5px 0px', minWidth: 150 }}
                inputProps={{
                  style: {
                    padding: '5px 8px',
                    fontSize: 14
                  }
                }}
                disabled={this.props.proses}
              />
            </Grid>
          }
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
              disabled={this.props.proses}
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
              disabled={this.props.proses}
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
              disabled={this.props.proses}
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
              disabled={this.props.proses}
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

const mapStateToProps = ({ dataCompanies, dataDepartments, dataPositions, dataUsers, dataAddress, dinas }) => {
  return {
    dataCompanies,
    dataDepartments,
    dataPositions,
    dataUsers,
    dataAddress,
    dinas
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(cardAddEmployee)