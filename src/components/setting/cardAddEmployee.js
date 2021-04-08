import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Grid, OutlinedInput, FormControlLabel, Checkbox, Select, MenuItem, Paper, FormControl, Avatar
} from '@material-ui/core';
import ReactSelect from 'react-select';

import makeAnimated from 'react-select/animated';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { fetchDataCompanies, fetchDataDepartment, fetchDataPosition, fetchDataUsers, fetchDataAddress, fetchDataStructure } from '../../store/action';

import swal from 'sweetalert';

const animatedComponents = makeAnimated();

class cardAddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: null,
      pathAvatar: '',
      name: '',
      nickname: '',
      initial: '',
      company: '',
      companyAddress: '',
      nik: '',
      evaluator1: '',
      evaluator1Selected: null,
      evaluator2: '',
      evaluator2Selected: null,
      tanggalGabung: null,
      dateOfBirth: null,
      statusKaryawan: '',
      sisaCuti: '',
      tanggalMulaiCutiBesar: null,
      sisaCutiBesar: '',
      nextFrame: null,
      nextLensa: null,

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

      optionCompany: [],
    }
  }

  async componentDidMount() {
    await this.props.fetchDataCompanies()
    await this.props.fetchDataStructure({ forOption: true })
    await this.props.fetchDataPosition()
    await this.props.fetchDataAddress({ forOption: true })
    if (this.props.data) {
      await this.fetchDataEdit()
    }
  }

  async componentDidUpdate(prevProps, prevState) {

    if (this.props.proses !== prevProps.proses) {
      this.setState({ proses: this.props.proses })
    }

    if (this.state.company !== prevState.company) {
      let dataAddress = [], idBuilding = []

      await this.props.dataAddress.forEach(address => {
        if ((address.company_id === this.state.company) || (this.props.data && address.company_id === this.props.data.companyId)) {
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

    if (this.props.dataCompanies !== prevProps.dataCompanies || this.props.admin !== prevProps.admin) {
      let optionCompany = []
      if (this.props.isAdminsuper) {
        this.setState({ optionCompany: [...optionCompany, ...this.props.dataCompanies] })
      } else {
        let idCompany = []
        await this.props.admin.forEach(el => {
          if (idCompany.indexOf(el.company_id) === -1) {
            let check = this.props.dataCompanies.find(element => el.company_id === element.company_id)
            if (check) {
              idCompany.push(el.company_id)
              optionCompany.push(check)
            }
          }
        })
        this.setState({ optionCompany })
      }
      if (optionCompany.length === 1) {
        this.setState({ company: optionCompany[0].company_id })
      }
    }

    if (this.props.data !== prevProps.data && this.props.optionUser !== prevProps.optionUser) {
      await this.fetchDataEdit()
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
      evaluator1: this.props.data.rawData.tbl_account_detail.name_evaluator_1,
      evaluator1Selected: this.props.data.rawData.tbl_account_detail.name_evaluator_1 && this.props.optionUser.find(user => user.value === +this.props.data.rawData.tbl_account_detail.name_evaluator_1),
      evaluator2: this.props.data.rawData.tbl_account_detail.name_evaluator_2,
      evaluator2Selected: this.props.data.rawData.tbl_account_detail.name_evaluator_2 && this.props.optionUser.find(user => user.value === +this.props.data.rawData.tbl_account_detail.name_evaluator_2),
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

  handleFiles = files => {
    this.setState({ files })
  }

  submit = async () => {
    let newData = new FormData()

    if (this.props.data) newData.append("userId", this.props.data.userId)

    // if (this.props.data && this.state.password) newData.append("password", this.state.password)
    newData.append("email", this.state.emailPribadi)
    newData.append("username", this.state.username || this.state.nik)    
    newData.append("fullname", this.state.name)
    newData.append("initial", this.state.initial)
    newData.append("nik", this.state.nik)
    newData.append("address", this.state.alamat)
    if (this.state.dateOfBirth && new Date(this.state.dateOfBirth) !== 'Invalid Date' && new Date(this.state.dateOfBirth) !== 'Invalid date' && new Date(this.state.dateOfBirth) !== 'invalid date') newData.append("dateOfBirth", this.state.dateOfBirth)
    if (this.state.sisaCuti) newData.append("leave", this.state.sisaCuti)
    if (this.state.companyAddress) newData.append("building_id", this.state.companyAddress)
    if (this.state.company) newData.append("company_id", this.state.company)
    newData.append("phone", this.state.telepon)
    newData.append("name_evaluator_1", this.state.evaluator1)
    newData.append("name_evaluator_2", this.state.evaluator2)
    newData.append("nickname", this.state.nickname)
    newData.append("statusEmployee", this.state.statusKaryawan)
    if (this.state.tanggalGabung) newData.append("joinDate", this.state.tanggalGabung)
    if (this.state.tanggalMulaiCutiBesar) newData.append("startLeaveBig", this.state.tanggalMulaiCutiBesar)
    if (this.state.sisaCutiBesar) newData.append("leaveBig", this.state.sisaCutiBesar)
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
          evaluator1: newValue.value,
          evaluator1Selected: newValue
        })
      } else {
        this.setState({
          partOfDepartment: "",
          evaluator1Selected: null
        })
      }
    } else {
      if (newValue !== null) {
        this.setState({
          evaluator2: newValue.value,
          evaluator2Selected: newValue
        })
      } else {
        this.setState({
          partOfDepartment: "",
          evaluator2Selected: null
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
      swal("Unggah File Gagal!", "Ukuran file lebih dari 5MB", "warning")
    }
  };

  handleDateChange = (name, date) => {
    this.setState({ [name]: date })
  }

  render() {
    return (
      <>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>

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
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Nama</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Nama Panggilan</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Akronim</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>tanggal lahir</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
              </Grid>
              <FormControl style={{ width: '75%', margin: 0, marginBottom: 5 }}>
                <KeyboardDatePicker
                  margin="normal"
                  id="dateOfBirth"
                  format="dd/MM/yyyy"
                  inputVariant="outlined"
                  style={{ margin: 0, minWidth: 150, padding: 0 }}
                  value={this.state.dateOfBirth}
                  onChange={(date) => this.handleDateChange('dateOfBirth', date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  inputProps={{
                    style: {
                      height: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }
                  }}
                  disabled={this.state.proses}
                />
              </FormControl>
            </Grid>

            <Grid id="pt" style={{ display: 'flex', alignItems: 'center' }}>
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>PT</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
                      <MenuItem value={company.company_id} key={'companies' + index}>{company.company_name}</MenuItem>
                    )
                  }
                </Select>
              </FormControl>

              <Grid style={{ width: '2%' }} />

              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>NIK</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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

            <Grid id="evaluator" style={{ display: 'flex', alignItems: 'center' }}>
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Evaluator 1</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
              </Grid>
              <Grid style={{ width: '28%', height: 40, margin: '5px 0px' }}>
                <ReactSelect
                  isClearable
                  value={this.props.data && this.state.evaluator1Selected}
                  components={animatedComponents}
                  options={this.props.optionUser}
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
                  options={this.props.optionUser}
                  onChange={(newValue) => this.handleChangeEvaluator({ ...newValue, eva1: false })}
                  disabled={this.props.proses}
                />
              </Grid>
            </Grid>

          </Paper>

          {/* 2 */}
          <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>

            <Grid id="tanggal-bergabung" style={{ display: 'flex', alignItems: 'center' }}>
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>tanggal bergabung</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
              </Grid>
              <FormControl style={{ margin: 0, marginBottom: 5 }}>
                <KeyboardDatePicker
                  margin="normal"
                  id="tanggalGabung"
                  format="dd/MM/yyyy"
                  inputVariant="outlined"
                  style={{ width: 300, margin: 0, minWidth: 150, padding: 0 }}
                  value={this.state.tanggalGabung}
                  onChange={(date) => this.handleDateChange('tanggalGabung', date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  inputProps={{
                    style: {
                      height: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }
                  }}
                  disabled={this.state.proses}
                />
              </FormControl>
            </Grid>

            <Grid id="status-karyawan" style={{ display: 'flex', alignItems: 'center' }}>
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Status karyawan</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
                  <MenuItem value="Berhenti" >Berhenti</MenuItem>
                  <MenuItem value="Intern">Intern</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid id="sisa-cuti" style={{ display: 'flex', alignItems: 'center' }}>
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Sisa Cuti</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
              <FormControl style={{ margin: 0, marginBottom: 5 }}>
                <KeyboardDatePicker
                  margin="normal"
                  id="tanggalMulaiCutiBesar"
                  format="dd/MM/yyyy"
                  inputVariant="outlined"
                  style={{ width: 300, margin: 0, minWidth: 150, padding: 0 }}
                  value={this.state.tanggalMulaiCutiBesar}
                  onChange={(date) => this.handleDateChange('tanggalMulaiCutiBesar', date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  inputProps={{
                    style: {
                      height: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }
                  }}
                  disabled={this.state.proses}
                />
              </FormControl>
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
              <FormControl style={{ margin: 0, marginBottom: 5 }}>
                <KeyboardDatePicker
                  margin="normal"
                  id="nextFrame"
                  format="dd/MM/yyyy"
                  inputVariant="outlined"
                  style={{ width: 300, margin: 0, minWidth: 150, padding: 0 }}
                  value={this.state.nextFrame}
                  onChange={(date) => this.handleDateChange('nextFrame', date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  inputProps={{
                    style: {
                      height: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }
                  }}
                  required
                  disabled={this.state.proses}
                />
              </FormControl>
            </Grid>

            <Grid id="next-lensa" style={{ display: 'flex', alignItems: 'center' }}>
              <Grid style={{ width: '20%', marginRight: 10 }}>
                <b style={{ marginBottom: 5 }}>Kacamata Lensa berikutnya</b>
              </Grid>
              <FormControl style={{ margin: 0, marginBottom: 5 }}>
                <KeyboardDatePicker
                  margin="normal"
                  id="nextLensa"
                  format="dd/MM/yyyy"
                  inputVariant="outlined"
                  style={{ width: 300, margin: 0, minWidth: 150, padding: 0 }}
                  value={this.state.nextLensa}
                  onChange={(date) => this.handleDateChange('nextLensa', date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  inputProps={{
                    style: {
                      height: 20,
                      paddingTop: 10,
                      paddingBottom: 10
                    }
                  }}
                  required
                  disabled={this.state.proses}
                />
              </FormControl>
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
                <p style={{ margin: 0 }}>diabaikan apabila tidak dinas</p>
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
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Lokasi</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
              !this.props.data && <>
                <Grid id="username" style={{ display: 'flex', alignItems: 'center' }}>
                  <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                    <b style={{ margin: 0 }}>Username</b>
                    <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
                  </Grid>

                  <OutlinedInput
                    value={this.state.username}
                    onChange={this.handleChange('username')}
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

                {/* <Grid id="password" style={{ display: 'flex', alignItems: 'center' }}>
                  <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                    <b style={{ margin: 0 }}>Kata Sandi Baru</b>
                    <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
                </Grid> */}
              </>
            }
            <Grid id="email-pribadi" style={{ display: 'flex', alignItems: 'center' }}>
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Email Pribadi</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Email Kantor</b>
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
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>No Telpon</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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
              <Grid style={{ width: '20%', marginRight: 10, display: 'flex' }}>
                <b style={{ margin: 0 }}>Alamat</b>
                <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
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

        </MuiPickersUtilsProvider>
      </>
    )
  }
}


const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataDepartment,
  fetchDataPosition,
  fetchDataUsers,
  fetchDataAddress,
  fetchDataStructure
}

const mapStateToProps = ({ dataCompanies, dataDepartments, dataPositions, dataUsers, dataAddress, isAdminsuper, dataStructure, admin }) => {
  return {
    dataCompanies,
    dataDepartments,
    dataPositions,
    dataUsers,
    dataAddress,
    isAdminsuper,
    dataStructure,
    admin
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(cardAddEmployee)