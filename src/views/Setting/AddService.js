import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Grid, Select, MenuItem, Paper, InputLabel, Button
} from '@material-ui/core';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import Loading from '../../components/Loading';

import CloseIcon from '@material-ui/icons/Close';

import swal from 'sweetalert';

import { fetchDataCompanies, fetchDataUsers, fetchDataAddress, fetchDataDinas } from '../../store/action';

import { API } from '../../config/API';

const animatedComponents = makeAnimated();

class AddService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proses: false,
      dinasId: null,
      employee: null,
      employeeSelected: null,
      companyKPI: null,
      companyKPISelected: null,
      companyHRD: null,
      companyHRDSelected: null,
      optionCompanyKPInHRD: [],

      // Perusahaan Asal
      coreCompany: null,
      coreAddressCompany: null,
      evaluator1: null,
      evaluator2: null,
      positions: [{
        department: null,
        position: null,
      }],

      evaluatorSelected: null,
      company: null,
      addressCompany: '',
      listCompany: [],
      listAddressCompany: [],
      listUser: [],

      dinas: [
        // {
        //   dinasId: null,
        //   company: null,
        //   location: null,
        //   positions: [{
        //     department: null,
        //     departmentSelected: null,
        //     departmentPositionId: null,
        //     position: null,
        //     positionSelected: null
        //   }]
        //   optionPosition: [],
        //   optionDepart: [],
        //   evaluator: null,
        //   evaluatorSelected: null,
        // }
      ],

      optionCompany: [],
    }
  }

  async componentDidMount() {
    this.setState({ proses: true })
    await this.props.fetchDataCompanies()
    await this.props.fetchDataAddress()
    await this.fetchOptionUser()

    if (this.props.location.state.user_id) {
      let userSelected = this.state.listUser.find(user => user.value === this.props.location.state.user_id)
      await this.setState({ employee: this.props.location.state.user_id, employeeSelected: userSelected })
    }
    this.setState({ proses: false })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.coreCompany !== prevState.coreCompany) {
      let listAddressCompany = [], idBuilding = []

      await this.props.dataAddress.forEach(address => {
        if (address.company_id === this.state.coreCompany) {
          if (idBuilding.indexOf(address.building_id) < 0) {
            idBuilding.push(address.building_id)
            listAddressCompany.push(address.tbl_building)
          }
        }
      });

      this.setState({ listAddressCompany })
    }

    if (this.state.employee !== prevState.employee) {
      this.setState({ dinas: [], companyKPI: null, companyKPISelected: null, companyHRD: null, companyHRDSelected: null })
      await this.fetchDataUser()
    }
  }

  fetchOptionUser = async () => {
    try {
      let token = Cookies.get('POLAGROUP')

      let getData = await API.get(`/users/for-option`, { headers: { token } })

      let listUser = []
      await getData.data.data.forEach(user => {
        listUser.push({ value: user.user_id, label: user.tbl_account_detail.fullname, nik: user.tbl_account_detail.nik })
      })

      this.setState({ listUser })
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      }
    }
  }

  fetchDataUser = async () => {
    try {
      let token = Cookies.get('POLAGROUP'), optionCompanyKPInHRD = [], positions = []

      let getData = await API.get(`/dinas/${this.state.employee}`, { headers: { token } })

      let positionDepartment = getData.data.data.tbl_department_positions.filter(user =>
        user.tbl_structure_department.company_id === getData.data.data.tbl_account_detail.company_id
      )

      let getDataStructure = await API.get(`/structure?company=${getData.data.data.tbl_account_detail.company_id}`, { headers: { token } })

      // Select Department and Position Core Company
      if (positionDepartment.length > 0) {
        getDataStructure.data.data.forEach(async stucture => {
          await positionDepartment.forEach(element => {
            let tempPosition = stucture.tbl_department_positions.find(el => el.position_id === +element.position_id)

            if (stucture.departments_id === +element.tbl_structure_department.departments_id && tempPosition) {
              positions.push({
                department: stucture.department.deptname,
                position: tempPosition.tbl_position.position
              })
            }
          })
        })
      }

      //  == START == Fetch optionCompanyKPI dan optionCompanyHRD
      let idCompany = []
      let check = this.props.dataCompanies.find(element => getData.data.data.tbl_account_detail.company_id === element.company_id)
      idCompany.push(getData.data.data.tbl_account_detail.company_id)
      optionCompanyKPInHRD.push({ value: check.company_id, label: check.company_name })

      await getData.data.data.dinas.forEach(async (dinas) => {
        if (idCompany.indexOf(dinas.company_id) === -1) {
          let check = this.props.dataCompanies.find(element => dinas.company_id === element.company_id)
          if (check) {
            idCompany.push(dinas.company_id)
            optionCompanyKPInHRD.push({ value: check.company_id, label: check.company_name })
          }
        }
      })
      // == END == Fetch optionCompanyKPI dan optionCompanyHRD

      await this.fetchDataDinasUser(getData.data.data)

      this.setState({
        coreCompany: getData.data.data.tbl_account_detail.company_id,
        coreAddressCompany: getData.data.data.tbl_account_detail.building_id,
        evaluator1: +getData.data.data.tbl_account_detail.name_evaluator_1 ? this.state.listUser.find(user => user.value === +getData.data.data.tbl_account_detail.name_evaluator_1) : null,
        evaluator2: +getData.data.data.tbl_account_detail.name_evaluator_2 ? this.state.listUser.find(user => user.value === +getData.data.data.tbl_account_detail.name_evaluator_2) : null,
        positions,
        optionCompanyKPInHRD,
        companyHRD: getData.data.data.tbl_account_detail.company_HRD,
        companyHRDSelected: optionCompanyKPInHRD.find(el => el.value === getData.data.data.tbl_account_detail.company_HRD) || null,
        companyKPI: getData.data.data.tbl_account_detail.company_KPI,
        companyKPISelected: optionCompanyKPInHRD.find(el => el.value === getData.data.data.tbl_account_detail.company_KPI) || null
      })
    } catch (err) {
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      }
    }
  }

  fetchDataDinasUser = async (getData) => {
    let token = Cookies.get('POLAGROUP')

    await getData.dinas.forEach(async (dinas) => {
      let optionPosition = [], optionDepart = [], idDepart = [], positions = []

      // === START === FETCH STRUCTURE (DEPARTMENT AND POSITION) DINAS
      API.get(`/structure?company=${dinas.company_id}`, { headers: { token } })
        .then(({ data }) => {
          let newDinas = this.state.dinas || []

          let positionDepartment = getData.tbl_department_positions.filter(user =>
            user.tbl_structure_department.company_id === dinas.company_id
          )

          // FETCH OPTION DEPART AND POSITION IN DINAS

          //Looping depart
          data.data.forEach(async structure => {
            structure.tbl_department_positions.forEach(el => {
              let checkPosition = positionDepartment.find(position => el.position_id === +position.position_id && position.tbl_structure_department.departments_id === structure.departments_id)

              if (el.user_id === null || checkPosition) {
                optionPosition.push({ value: el.position_id, label: el.tbl_position.position, departments_id: structure.departments_id, departmentPositionId: el.id })

                let checkDepart = idDepart.find(id => id === structure.departments_id)

                if (!checkDepart) {
                  optionDepart.push({ value: structure.departments_id, label: structure.department.deptname })
                  idDepart.push(structure.departments_id)
                }

                if (checkPosition) {
                  positions.push({
                    department: structure.departments_id,
                    departmentSelected: { value: structure.departments_id, label: structure.department.deptname },
                    departmentPositionId: el.id,
                    position: el.position_id,
                    positionSelected: { value: el.position_id, label: el.tbl_position.position, departments_id: structure.departments_id }
                  })
                }
              }

            })
          })

          if (positions.length === 0) {
            positions.push({
              department: null,
              departmentSelected: null,
              departmentPositionId: null,
              position: null,
              positionSelected: null
            })
          }

          newDinas.push({
            dinasId: dinas.id,
            company: dinas.company_id,
            location: dinas.building_id,
            positions,
            optionPosition,
            optionDepart,
            evaluator: dinas.evaluator_id,
            evaluatorSelected: +dinas.evaluator_id ? this.state.listUser.find(user => user.value === +dinas.evaluator_id) : null,
          })

          this.setState({ dinas: newDinas })

        })
        .catch(err => {
          if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
            swal('Gagal', 'Koneksi tidak stabil', 'error')
          }
        })
      // == END == FETCH STRUCTURE (DEPARTMENT AND POSITION) DINAS 
    })
    this.setState({ proses: false })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  navigateBack = () => {
    this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index, indexTab: 1 })
  }

  handleChangeDinas = (name, index) => async (event) => {
    let newDinas = this.state.dinas

    if (name === 'company') {
      let optionCompanyKPInHRD = this.state.optionCompanyKPInHRD, token = Cookies.get('POLAGROUP')
      let companySelected = this.props.dataCompanies.find(el => el.company_id === event.target.value)

      optionCompanyKPInHRD = optionCompanyKPInHRD.filter(el => el.value !== newDinas[index][name])
      optionCompanyKPInHRD.push({ value: companySelected.company_id, label: companySelected.company_name })

      this.setState({ optionCompanyKPInHRD })


      API.get(`/structure?company=${event.target.value}`, { headers: { token } })
        .then(async ({ data }) => {
          let optionPosition = [], idDepart = [], optionDepart = [], positions = []


          let getData = await API.get(`/dinas/${this.state.employee}`, { headers: { token } })

          let positionDepartment = await getData.data.data.tbl_department_positions.filter(user =>
            user.tbl_structure_department.company_id === event.target.value
          )

          //Looping depart
          await data.data.forEach(async structure => {
            await structure.tbl_department_positions.forEach(el => {

              let checkPosition = positionDepartment.find(position => +el.position_id === +position.position_id && +position.tbl_structure_department.departments_id === +structure.departments_id)

              let checkAvailableBefore = positions.find(position => position.department === structure.departments_id && position.position === el.position_id)

              if ((el.user_id === null || checkPosition) && !checkAvailableBefore) {
                optionPosition.push({ value: el.position_id, label: el.tbl_position.position, departments_id: structure.departments_id, departmentPositionId: el.id })

                let checkDepart = idDepart.find(id => id === structure.departments_id)

                if (!checkDepart) {
                  optionDepart.push({ value: structure.departments_id, label: structure.department.deptname })
                  idDepart.push(structure.departments_id)
                }

                if (checkPosition) {
                  positions.push({
                    department: structure.departments_id,
                    departmentSelected: { value: structure.departments_id, label: structure.department.deptname },
                    departmentPositionId: el.id,
                    position: el.position_id,
                    positionSelected: { value: el.position_id, label: el.tbl_position.position, departments_id: structure.departments_id }
                  })
                }
              }

            })
          })

          newDinas[index].optionPosition = optionPosition
          newDinas[index].optionDepart = optionDepart

          if (positions.length === 0) {
            newDinas[index].positions = [{
              department: null,
              departmentSelected: null,
              departmentPositionId: null,
              position: null,
              positionSelected: null
            }]
          } else {
            newDinas[index].positions = positions
          }

          this.setState({ dinas: newDinas });
        })
        .catch(err => {
          if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
            swal('Gagal', 'Koneksi tidak stabil', 'error')
          }
        })
    }

    newDinas[index][name] = event.target.value

    this.setState({ dinas: newDinas });
  };

  handleChangePositionsDinas = (name, indexDinas, indexPositions) => async (event) => {
    let newDinas = this.state.dinas
    newDinas[indexDinas].positions[indexPositions][name] = event.target.value

    if (name === 'position') {
      let positionSelected = newDinas[indexDinas].optionPosition.find(option => option.value === event.target.value)

      newDinas[indexDinas].positions[indexPositions].departmentPositionId = positionSelected.departmentPositionId
    }

    this.setState({ dinas: newDinas });
  };

  handleChangeSelect = (name, newValue, actionMeta) => {
    let argsSelected = `${name}Selected`
    if (newValue) {
      this.setState({
        [name]: newValue.value,
        [argsSelected]: newValue
      })
    } else {
      this.setState({
        [name]: null,
        [argsSelected]: null
      })
    }
  };

  handleChangeSelectDinas = (name, index, newValue, actionMeta) => {
    let newDinas = this.state.dinas

    let argsSelected = `${name}Selected`
    if (newValue) {
      newDinas[index][name] = newValue.value
      newDinas[index][argsSelected] = newValue
    } else {
      newDinas[index][name] = null
      newDinas[index][argsSelected] = null
    }

    this.setState({ dinas: newDinas })
  };


  addDinas = () => {
    let dinas = this.state.dinas

    dinas.push(
      {
        dinasId: null,
        company: null,
        location: null,
        positions: [{
          department: null,
          departmentSelected: null,
          departmentPositionId: null,
          position: null,
          positionSelected: null
        }],
        optionPosition: [],
        optionDepart: [],
        evaluator: null,
        evaluatorSelected: null,
      }
    )

    this.setState({ dinas })
  }

  deleteDinas = (index) => {
    let listDinas = this.state.dinas

    if (listDinas[index].dinasId) {
      swal({
        title: "Apa anda yakin ingin menghapus dinas ini?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (yesAnswer) => {
          if (yesAnswer) {
            this.setState({
              proses: true
            })
            let listDinas = this.state.dinas,
              token = Cookies.get('POLAGROUP'),
              optionCompanyKPInHRD = this.state.optionCompanyKPInHRD

            API.delete(`/dinas/${listDinas[index].dinasId}`,
              {
                headers: {
                  token
                }
              })
              .then(async () => {
                swal("Pesanan berhasil dihapus !", "", "success")
                optionCompanyKPInHRD = optionCompanyKPInHRD.filter(el => el.value !== this.state.dinas[index].company)

                listDinas.splice(index, 1);
                this.setState({
                  optionCompanyKPInHRD,
                  dinas: listDinas,
                  proses: false
                });
              })
              .catch(err => {
                if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
                  swal('Gagal', 'Koneksi tidak stabil', 'error')
                } else {
                  swal("Pesanan gagal dihapus !", "", "error")
                }

                this.setState({
                  proses: false
                })
              })
          }
        });
    } else {
      let optionCompanyKPInHRD = this.state.optionCompanyKPInHRD

      optionCompanyKPInHRD = optionCompanyKPInHRD.filter(el => el.value !== this.state.dinas[index].company)

      listDinas.splice(index, 1);
      this.setState({
        optionCompanyKPInHRD,
        dinas: listDinas
      });
    }
  }

  addPosisiDinas = (index) => {
    let newDinas = this.state.dinas

    newDinas[index].positions.push({
      department: null,
      departmentSelected: null,
      departmentPositionId: null,
      position: null,
      positionSelected: null
    })

    this.setState({ dinas: newDinas })
  }

  deletePosisiDinas = (index, positionIndex) => {
    let newDinas = this.state.dinas
    newDinas[index].positions.splice(positionIndex, 1);

    if (newDinas[index].positions.length === 0) newDinas[index].positions.push({
      department: null,
      departmentSelected: null,
      departmentPositionId: null,
      position: null,
      positionSelected: null
    })

    this.setState({ dinas: newDinas })
  }





  submit = async (args) => {
    let promises = [], token = Cookies.get('POLAGROUP');

    await this.state.dinas.forEach(async (dinas) => {
      let positions = []
      let newData = {
        userId: this.state.employee,
        companyId: dinas.company,
        buildingId: dinas.location,
        evaluatorId: dinas.evaluator,
        companyKPI: this.state.companyKPI,
        companyHRD: this.state.companyHRD
      }

      if (dinas.positions.length > 0) {
        await dinas.positions.forEach(position => {
          positions.push({
            departmentId: position.department,
            departmentPositionId: position.departmentPositionId,
            positionId: position.position
          })
        })
        newData.positions = positions
      }

      if (dinas.dinasId) {
        promises.push(
          API.put(`/dinas/${dinas.dinasId}`, newData, { headers: { token } })
        )
      } else {
        promises.push(
          API.post(`/dinas`, newData, { headers: { token } })
        )
      }
    })


    Promise.all(promises)
      .then(async ({ data }) => {
        swal('Simpan data dinas sukses', '', 'success')
        await this.props.fetchDataDinas({ limit: 10, page: 0 })
        this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index, indexTab: 1 })
      })
      .catch(err => {
        this.setState({ proses: false, statusSubmit: false })
        if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
          swal('Gagal', 'Koneksi tidak stabil', 'error')
        } else {
          swal('Simpan dinas gagal', '', 'error')
        }
      })
  }

  render() {
    if (this.state.proses) return <Loading loading={this.state.proses} />;

    return (
      <Grid>
        <Grid style={{ display: 'flex' }}>
          <Grid style={{ display: 'flex', flexDirection: 'column' }}>
            <b style={{ fontSize: 20 }}>Dinas</b>
            <p style={{ margin: 0, fontSize: 12, color: '#d71149', cursor: 'pointer' }} onClick={this.navigateBack}>{'<'} kembali ke pengaturan</p>
          </Grid>
        </Grid>

        <Grid style={{ padding: '10px 20px' }}>
          <Grid id="employee" style={{ margin: '20px 0px', display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>Karyawan *</b>
            </Grid>

            <Grid style={{ width: '50%', height: 40, maxWidth: 500, zIndex: 4 }}>
              <ReactSelect
                isClearable
                value={this.state.employeeSelected}
                components={animatedComponents}
                options={this.state.listUser}
                onChange={value => this.handleChangeSelect('employee', value)}
                getOptionLabel={(option) => `${option.nik} - ${option.label}`}
                disabled={this.state.proses}
              />
            </Grid>
          </Grid>

          <Grid id="lapor-kpi" style={{ margin: '20px 0px', display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>Lapor KPI *</b>
            </Grid>

            <Grid style={{ width: '50%', height: 40, maxWidth: 500, zIndex: 3 }}>
              <ReactSelect
                isClearable
                value={this.state.companyKPISelected}
                components={animatedComponents}
                options={this.state.optionCompanyKPInHRD}
                onChange={value => this.handleChangeSelect('companyKPI', value)}
              />
              <InputLabel style={{ fontSize: 11 }}>evaluator yang dapat memberikan tugas KPI karyawan</InputLabel>
            </Grid>
          </Grid>

          <Grid id="lapor-hrd" style={{ margin: '20px 0px', display: 'flex', alignItems: 'center' }}>
            <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
              <b style={{ fontSize: 12, marginBottom: 5 }}>Report HRD *</b>
            </Grid>

            <Grid style={{ width: '50%', height: 40, maxWidth: 500, zIndex: 2 }}>
              <ReactSelect
                isClearable
                value={this.state.companyHRDSelected}
                components={animatedComponents}
                options={this.state.optionCompanyKPInHRD}
                onChange={value => this.handleChangeSelect('companyHRD', value)}
              />
              <InputLabel style={{ fontSize: 11 }}>hasil dan ijin akan dilapor kepada perusahaan</InputLabel>
            </Grid>
          </Grid>
        </Grid>

        {
          this.state.employee &&
          <>
            <Paper style={{ backgroundColor: 'white', padding: '10px 20px', margin: '5px 0px 10px 0px', position: 'relative' }}>
              <Grid style={{ position: 'absolute', height: '100%', width: '100%', zIndex: 1 }} />

              <b>Perusahaan Asal</b>
              <Grid id="company-core" style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }}>
                <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
                  <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Perusahaan</p>
                </Grid>

                <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                  <Select
                    value={this.state.coreCompany}
                    onChange={this.handleChange('coreCompany')}
                    style={{ width: '80%', marginRight: 10 }}
                    disabled
                  >
                    {
                      this.props.dataCompanies.map((el, index) =>
                        <MenuItem value={el.company_id} key={"company" + index}>{el.company_name}</MenuItem>
                      )
                    }
                  </Select>
                </Grid>


                <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
                  <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Lokasi Perusahaan</p>
                </Grid>

                <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                  <Select
                    displayEmpty
                    value={this.state.coreAddressCompany}
                    onChange={this.handleChange('codeAddressCompany')}
                    style={{ width: '80%', marginRight: 10 }}
                    disabled
                  >
                    {
                      this.state.listAddressCompany.map((el, index) => (
                        <MenuItem value={el.building_id} key={"address" + index}>{el.building}</MenuItem>
                      ))
                    }
                  </Select>
                </Grid>
              </Grid>

              <Grid id="evaluator-core" style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }}>
                <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
                  <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Evaluator 1</p>
                </Grid>
                <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                  <Grid style={{ width: '80%' }} disabled>
                    <ReactSelect
                      isClearable
                      value={this.state.evaluator1}
                      components={animatedComponents}
                      options={this.state.listUser}
                      getOptionLabel={(option) => `${option.nik} - ${option.label}`}
                    />
                  </Grid>
                </Grid>


                <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
                  <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Evaluator 2</p>
                </Grid>
                <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                  <Grid style={{ width: '80%' }}>
                    <ReactSelect
                      isClearable
                      value={this.state.evaluator2}
                      components={animatedComponents}
                      options={this.state.listUser}
                      getOptionLabel={(option) => `${option.nik} - ${option.label}`}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {
                this.state.positions.map((positions, index) =>
                  <Grid id={'divisi' + index} style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }} key={'divisi' + index}>
                    <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10, display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Divisi</p>
                      {
                        this.state.positions.length > 1 && <p style={{ margin: 0, fontSize: 8, marginBottom: 5, marginLeft: 3 }}>{index + 1}</p>
                      }
                    </Grid>

                    <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                      <Grid style={{ width: '80%', display: 'flex', alignItems: 'center', paddingLeft: 3, overflowX: 'hidden', borderBottom: '1px solid #cacaca' }}>
                        <p style={{ margin: '6px 0px', color: '#9e9e9e' }}>{positions.department || '-'}</p>
                      </Grid>
                    </Grid>


                    <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10, display: 'flex', alignItems: 'flex-end' }}>
                      <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Posisi</p>
                      {
                        this.state.positions.length > 1 && <p style={{ margin: 0, fontSize: 8, marginBottom: 5, marginLeft: 3 }}>{index + 1}</p>
                      }
                    </Grid>

                    <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                      <Grid style={{ width: '80%', display: 'flex', alignItems: 'center', paddingLeft: 3, overflowX: 'hidden', borderBottom: '1px solid #cacaca' }}>
                        <p style={{ margin: '6px 0px', color: '#9e9e9e' }}>{positions.position || '-'}</p>
                      </Grid>
                    </Grid>
                  </Grid>
                )
              }
            </Paper>

            {
              this.state.dinas.map((dinas, index) =>
                <Paper style={{ backgroundColor: 'white', padding: '10px 20px', margin: '5px 0px 10px 0px' }} key={"dinas" + index}>
                  <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <b>Perusahaan Dinas {index + 1}</b>
                    <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, marginRight: 15, cursor: 'pointer' }} onClick={() => this.deleteDinas(index)} />
                  </Grid>

                  <Grid id={"company" + index} style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }}>
                    <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
                      <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Perusahaan</p>
                    </Grid>

                    <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                      <Select
                        value={dinas.company}
                        onChange={this.handleChangeDinas('company', index)}
                        style={{ width: '80%', marginRight: 10 }}
                        disabled={this.state.proses}
                      >
                        {
                          this.props.dataCompanies.map((el, index) =>
                            <MenuItem value={el.company_id} key={"company" + index}>{el.company_name}</MenuItem>
                          )
                        }
                      </Select>
                    </Grid>


                    <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
                      <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Lokasi Perusahaan</p>
                    </Grid>

                    <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                      <Select
                        displayEmpty
                        value={dinas.location}
                        onChange={this.handleChangeDinas('location', index)}
                        style={{ width: '80%', marginRight: 10 }}
                        disabled={this.state.proses}
                      >
                        {
                          this.props.dataAddress.map((el, index) => (
                            el.company_id === dinas.company && <MenuItem value={el.tbl_building.building_id} key={"location" + index}>{el.tbl_building.building}</MenuItem>
                          ))
                        }
                      </Select>
                    </Grid>
                  </Grid>

                  <Grid id={"evaluator" + index} style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }}>
                    <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
                      <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Evaluator</p>
                    </Grid>

                    <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                      <Grid style={{ width: '80%' }}>
                        <ReactSelect
                          isClearable
                          value={dinas.evaluatorSelected}
                          components={animatedComponents}
                          options={this.state.listUser}
                          onChange={value => this.handleChangeSelectDinas('evaluator', index, value)}
                          getOptionLabel={(option) => `${option.nik} - ${option.label}`}
                          disabled={this.state.proses}
                        />
                      </Grid>
                    </Grid>


                    {/* <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10 }}>
                      <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Evaluator 2</p>
                    </Grid>

                    <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                      <Grid style={{ width: '80%' }}>
                        <ReactSelect
                          isClearable
                          value={this.props.data && this.state.evaluatorSelected}
                          components={animatedComponents}
                          options={this.state.listUser}
                          onChange={value => this.handleChangeSelect('evaluator', value)}
                          getOptionLabel={(option) => `${option.nik} - ${option.label}`}
                          disabled={this.state.proses}
                        />
                      </Grid>
                    </Grid> */}

                  </Grid>

                  {
                    dinas.positions.map((positions, positionIndex) =>
                      <Grid id={'divisi' + positionIndex} style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }} key={'divisi' + positionIndex}>
                        <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10, display: 'flex', alignItems: 'flex-end' }}>
                          <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Divisi</p>
                          {
                            dinas.positions.length > 1 && <p style={{ margin: 0, fontSize: 8, marginBottom: 5, marginLeft: 3 }}>{positionIndex + 1}</p>
                          }
                        </Grid>

                        <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                          <Select
                            value={positions.department}
                            onChange={this.handleChangePositionsDinas('department', index, positionIndex)}
                            style={{ width: '80%', marginRight: 10 }}
                            disabled={this.state.proses}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {
                              dinas.optionDepart.map((el, optionDepartIndex) =>
                                <MenuItem value={el.value} key={"department" + optionDepartIndex}>{el.label}</MenuItem>
                              )
                            }
                          </Select>
                        </Grid>

                        <Grid style={{ width: '15%', minWidth: '150px', marginRight: 10, display: 'flex', alignItems: 'flex-end' }}>
                          <p style={{ margin: 0, fontSize: 12, marginBottom: 5 }}>Posisi</p>
                          {
                            dinas.positions.length > 1 && <p style={{ margin: 0, fontSize: 8, marginBottom: 5, marginLeft: 3 }}>{positionIndex + 1}</p>
                          }
                        </Grid>

                        <Grid style={{ width: '35%', height: 40, margin: 5, minWidth: 300 }}>
                          <Select
                            value={positions.position}
                            onChange={this.handleChangePositionsDinas('position', index, positionIndex)}
                            style={{ width: '80%', marginRight: 10 }}
                            disabled={this.state.proses}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {
                              dinas.optionPosition.map((el, optionPositionIndex) =>
                                positions.department === el.departments_id && <MenuItem value={el.value} key={"position" + optionPositionIndex}>{el.label}</MenuItem>
                              )
                            }
                          </Select>
                          <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, marginRight: 15, cursor: 'pointer' }} onClick={() => this.deletePosisiDinas(index, positionIndex)} />
                        </Grid>
                      </Grid>
                    )
                  }
                  <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={() => this.addPosisiDinas(index)} disabled={this.state.proses}>+ divisi/posisi baru</p>

                </Paper>
              )
            }

            <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.addDinas} disabled={this.state.proses}>+ lokasi dinas lain</p>
          </>
        }

        <Button variant="outlined" color="secondary" style={{ width: 150, margin: 10 }} onClick={() => this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })} disabled={this.state.proses}>batalkan</Button>
        <Button variant="contained" color="secondary" style={{ width: 150, margin: 10 }} onClick={this.submit} disabled={this.state.proses}>simpan</Button>
      </Grid>
    )
  }
}



const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataUsers,
  fetchDataAddress,
  fetchDataDinas
}

const mapStateToProps = ({ dataCompanies, dataAddress, ip }) => {
  return {
    dataCompanies,
    dataAddress,
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddService)