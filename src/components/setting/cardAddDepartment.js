import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Grid, Button, Select, MenuItem, Paper, InputLabel
} from '@material-ui/core';
import CreatableSelect from 'react-select/creatable';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import swal from 'sweetalert';

import { API } from '../../config/API';

const animatedComponents = makeAnimated();

class cardAddDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameDepartment: '',
      levelHirarki: '',
      partOfDepartment: '',
      position: [
        //   {
        //   position: '',
        //   user: ''
        // }
      ],
      userPosition: [''],
      team: [
        //   {
        //   nameTeam: '',
        //   teamPosition: [''],
        //   selectedTeamPosition: [''],
        //   user: [''],
        //   userSelected: [''],
        //   reportTo: '',
        // }
      ],
      listDepartment: [],
      listPosition: [],
      listUser: [],
      selectedDept: null,
      selectedPartDept: null,
      selectedPosition: [],
      selectedUserPosition: [],
      selectedTeamPosition: [],
      selectedReportTo: null,

      proses: false
    }
  }

  async componentDidMount() {
    await this.fetchOptionDepartment()
    await this.fetchOptionPosition()
    await this.fetchOptionUser()

    if (this.props.data) {
      await this.fetchDataForEdit()
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.statusSubmit !== prevProps.statusSubmit) {
      if (this.props.statusSubmit) this.submit()
      else this.setState({ proses: false })
    }

    if (this.props.proses !== prevProps.proses) {
      this.setState({ proses: this.props.proses })
    }

    if (this.props.dataDepartments !== prevProps.dataDepartments) {
      await this.fetchOptionDepartment()
      if (this.props.dataDepartments.length > 0 && this.props.dataPositions.length > 0 && this.props.data) {
        await this.fetchDataForEdit()
      }
    }

    if (this.props.dataPositions !== prevProps.dataPositions) {
      await this.fetchOptionPosition()
      if (this.props.dataDepartments.length > 0 && this.props.dataPositions.length > 0 && this.props.data) {
        await this.fetchDataForEdit()
      }
    }

    if (this.props.data !== prevProps.data) {
      if (this.props.dataDepartments.length > 0 && this.props.dataPositions.length > 0) {
        await this.fetchDataForEdit()
      }
    }
  }

  fetchOptionDepartment = async () => {
    let listDepartment = []
    await this.props.dataDepartments.forEach(department => {
      listDepartment.push({ value: department.departments_id, label: department.deptname })
    })
    this.setState({ listDepartment })
  }

  fetchOptionPosition = async () => {
    let listPosition = []

    this.props.dataPositions && this.props.dataPositions.length > 0 && await this.props.dataPositions.forEach(position => {
      listPosition.push({ value: position.position_id, label: position.position })
    })
    this.setState({ listPosition })
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
      // console.log(err)
      if (err.message.match('timeout') || err.message.match('exceeded') || err.message.match('Network') || err.message.match('network')) {
        swal('Gagal', 'Koneksi tidak stabil', 'error')
      }
    }
  }

  fetchDataForEdit = async () => {
    this.setState({ loading: true })
    let position = [], selectedPosition = [], teams = [], selectedUserPosition = []

    if (this.props.data.tbl_department_positions.length > 0) {
      await this.props.data.tbl_department_positions.forEach(element => {
        let selected = this.state.listPosition.find(el => el.value === element.position_id)
        let userSelect = this.state.listUser.find(el => el.value === element.user_id)

        selectedUserPosition.push(userSelect) //user in position
        position.push({ position: element.position_id, user: element.user_id })
        selectedPosition.push(selected)
      })
    } else {
      position = [{
        position: '',
        user: ''
      }]
    }

    // await this.props.data.tbl_department_teams[0].tbl_team_positions.forEach(element => {
    //   let selected = this.state.listPosition.find(el => el.value === element.position_id)
    //   teamPosition.push(element.position_id)
    //   selectedTeamPosition.push(selected)
    // })

    // TEAM
    if (this.props.data.tbl_department_teams.length > 0) {
      await this.props.data.tbl_department_teams.forEach(async (team) => {
        let teamPosition = [], selectedTeamPosition = [], userTeam = [], userSelectedTeam = []

        await team.tbl_team_positions.forEach(element => {
          let selected = this.state.listPosition.find(el => el.value === element.position_id)
          let userSelect = this.state.listUser.find(el => el.value === element.user_id)

          teamPosition.push(element.position_id)
          userTeam.push(element.user_id)
          selectedTeamPosition.push(selected)
          userSelectedTeam.push(userSelect)
        })

        let data = {
          nameTeam: team.name,
          teamPosition,
          selectedTeamPosition,
          user: userTeam,
          userSelected: userSelectedTeam,
          reportTo: team.report_to,
          selectedReportTo: this.state.listUser.find(el => el.value === team.report_to)
        }
        teams.push(data)
      })
    } else {
      teams = [{
        nameTeam: '',
        teamPosition: [''],
        selectedTeamPosition: [''],
        user: [''],
        userSelected: [''],
        reportTo: '',
      }]
    }

    this.setState({
      nameDepartment: this.props.data.departments_id,
      selectedDept: this.state.listDepartment.find(el => el.value === this.props.data.departments_id),
      partOfDepartment: this.props.data.department_section,
      selectedPartDept: this.state.listDepartment.find(el => el.value === this.props.data.department_section),
      levelHirarki: this.props.data.hierarchy,
      position,
      selectedPosition,
      selectedUserPosition,
      team: teams,
      nameTeam: this.props.data.tbl_department_teams[0] ? this.props.data.tbl_department_teams[0].name : '',
      reportTo: this.props.data.tbl_department_teams[0] ? this.props.data.tbl_department_teams[0].report_to : ''
    })
    this.setState({ loading: false })
  }

  handleChange = (name, index) => event => {
    if (index !== undefined) {
      let arrTeam = this.state.team
      arrTeam[index][name] = event.target.value
      this.setState({ team: arrTeam });
    } else {
      this.setState({ [name]: event.target.value });
    }
  };


  // HANDLE POSITION (START)
  handleChangePosition = (newValue, actionMeta) => {
    let newPosition = this.state.position
    newPosition[newValue.index][newValue.name] = newValue.value
    if (newValue !== null) {
      this.setState({
        position: newPosition
      })
    } else {
      this.setState({
        position: newPosition
      })
    }
    if (newValue.name === 'position') {
      this.setState({ selectedPosition: newValue })
    } else {
      this.setState({ selectedUserPosition: newValue })

    }
  };

  deletePosition = async (index) => {
    let newArray = this.state.position, selectedUserPosition = [], selectedPosition = [];
    await this.setState({
      position: []
    });
    newArray.splice(index, 1)

    newArray.forEach(element => {
      let selected = this.state.listPosition.find(el => el.value === element.position)
      let userSelect = this.state.listUser.find(el => el.value === element.user)

      selectedUserPosition.push(userSelect) //user in position
      selectedPosition.push(selected)
    })

    this.setState({
      position: newArray,
      selectedUserPosition,
      selectedPosition
    });
  }

  addPosition = index => {
    let newArray = this.state.position;

    newArray.push({
      position: '',
      user: ''
    });
    this.setState({
      position: newArray
    });
  }
  // HANDLE POSITION (END)


  // HANDLE TEAM  (START)
  deleteTeam = index => {
    let newArray = this.state.team;

    newArray.splice(index, 1);
    this.setState({
      team: newArray
    });
  }

  addTeam = index => {
    let newArray = this.state.team;

    newArray.push({
      nameTeam: '',
      teamPosition: [''],
      selectedTeamPosition: [''],
      user: [''],
      userSelected: [''],
      reportTo: '',
    });
    this.setState({
      team: newArray
    });
  }
  // HANDLE TEAM POSITION (END)


  // HANDLE TEAM POSITION (START)
  handleChangeTeamPosition = index => event => {
    let newArray = this.state.teamPosition

    newArray[index] = event.target.value

    this.setState({ newArray })
  }

  deleteTeamPosition = index => {
    let arrTeam = this.state.team

    arrTeam[index].teamPosition.splice(index, 1);
    this.setState({
      team: arrTeam
    });
  }

  addTeamPosition = index => {
    let arrTeam = this.state.team
    arrTeam[index].teamPosition.push('')

    this.setState({
      team: arrTeam
    });
  }
  // HANDLE TEAM POSITION (END)

  submit = async () => {
    if (this.state.nameDepartment === '' || this.state.levelHirarki === '') {
      swal("Data belum lengkap", "", "warning")
      this.props.cancelSubmit()
      this.setState({ proses: false })
    } else {
      let newData = {
        nameDepartment: this.state.nameDepartment,
        levelHirarki: this.state.levelHirarki,
        position: await this.validatePosition(),
        team: await this.validateTeam()
      }
      if (this.state.levelHirarki !== '1') newData.partOfDepartment = this.state.partOfDepartment

      if (this.props.data) newData.id = this.props.data.id
      this.props.sendData(newData)
    }
  }

  validatePosition = async () => {
    let tempPosition = []

    await this.state.position.forEach(position => {
      if (position.position || position.user) {
        tempPosition.push(position)
      }
    })

    return tempPosition
  }

  validateTeam = async () => {
    let tempTeam = []

    await this.state.team.forEach(team => {
      if (team.nameTeam || team.teamPosition[0] || team.user[0] || team.reportTo) {
        tempTeam.push(team)
      }
    })

    return tempTeam
  }

  handleChangeDepartment = (newValue, actionMeta) => {
    if (newValue !== null) {
      this.setState({
        nameDepartment: newValue.value,
        selectedDept: newValue
      })
    } else {
      this.setState({
        nameDepartment: "",
        selectedDept: null
      })
    }
  };

  handleInputChange = (inputValue, actionMeta) => {
    if (inputValue) {
      this.setState({
        nameDepartment: inputValue
      })
    }
  };

  handleChangePartOfDepartment = (newValue, actionMeta) => {
    if (newValue !== null) {
      this.setState({
        partOfDepartment: newValue.value,
        selectedPartDept: newValue
      })
    } else {
      this.setState({
        partOfDepartment: "",
        selectedPartDept: null
      })
    }
  };

  handleInputChangePosition = (inputValue, actionMeta) => {
    let newPosition = this.state.position
    newPosition[inputValue.index] = inputValue.value
    if (inputValue !== null) {
      this.setState({
        position: newPosition
      })
    } else {
      this.setState({
        position: newPosition
      })
    }
  };

  handleChangePartOfPosition = (newValue, actionMeta) => {
    let arrTeam = this.state.team

    arrTeam[newValue.index].teamPosition[newValue.indexPosition] = newValue.value
    arrTeam[newValue.index].selectedTeamPosition[newValue.indexPosition] = newValue

    if (newValue !== null) {
      this.setState({
        team: arrTeam
      })
    } else {
      this.setState({
        team: arrTeam
      })
    }
  };

  handleChangePartUserOfPosition = (newValue, actionMeta) => {
    let arrTeam = this.state.team
    arrTeam[newValue.index].user[newValue.indexPosition] = newValue.value
    arrTeam[newValue.index].userSelected[newValue.indexPosition] = newValue

    if (newValue !== null) {
      this.setState({
        team: arrTeam
      })
    } else {
      this.setState({
        team: arrTeam
      })
    }
  };

  handleInputChangePartOfPosition = (inputValue, actionMeta) => {
    let newPosition = this.state.teamPosition
    newPosition[inputValue.index] = inputValue.value
    if (inputValue !== null) {
      this.setState({
        teamPosition: newPosition
      })
    } else {
      this.setState({
        teamPosition: newPosition
      })
    }
  };

  handleChangeUser = (newValue, actionMeta) => {
    if (newValue !== null) {
      let arrTeam = this.state.team
      arrTeam[newValue.index].reportTo = newValue.value

      this.setState({
        team: arrTeam
      })
    } else {
      let arrTeam = this.state.team
      arrTeam[newValue.index].reportTo = ''

      this.setState({
        team: arrTeam
      })
    }
  };


  render() {

    return (
      <Paper style={{ backgroundColor: 'white', padding: 20, margin: '5px 0px 10px 0px' }}>

        <Grid id="name-division" style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }}>
          <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10, display: 'flex' }}>
            <b style={{ fontSize: 12, marginBottom: 5 }}>Nama Department</b>
            <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
          </Grid>

          <Grid style={{ width: '50%' }}>
            <Grid style={{ width: '50%', height: 40, margin: 5, minWidth: 300 }}>
              <CreatableSelect
                isClearable
                value={this.props.data && this.state.selectedDept}
                components={animatedComponents}
                options={this.state.listDepartment}
                onChange={this.handleChangeDepartment}
                onInputChange={this.handleInputChange}
                disabled={this.state.proses}
                placeholder="Select or Create new"
              />
            </Grid>
            <InputLabel style={{ fontStyle: 'italic', fontSize: 12, marginLeft: 5 }}>* apabila tidak ada pilihannya harap tulis dan create</InputLabel>
          </Grid>
        </Grid>

        <Grid id="level-hirarki" style={{ margin: '10px 0px', display: 'flex', alignItems: 'center' }}>
          <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10, display: 'flex' }}>
            <b style={{ fontSize: 12, marginBottom: 5 }}>Level Hirarki</b>
            <p style={{ margin: 0, color: 'red', marginLeft: 3 }}>*</p>
          </Grid>

          <Grid style={{ width: '50%', margin: 5, minWidth: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid style={{ height: 40 }}>
              <Select
                displayEmpty
                value={this.state.levelHirarki}
                onChange={this.handleChange('levelHirarki')}
                style={{ width: 80, marginRight: 10 }}
              >
                <MenuItem value="">
                  <em>Hirarki</em>
                </MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
                <MenuItem value="8">8</MenuItem>
                <MenuItem value="9">9</MenuItem>
                <MenuItem value="10">10</MenuItem>
              </Select>
            </Grid>

            {
              this.state.levelHirarki !== '1' && <Grid style={{}}>
                <Grid style={{ marginBottom: 5 }}>
                  <CreatableSelect
                    isClearable
                    placeholder="lapor kepada"
                    value={this.props.data && this.state.selectedPartDept}
                    components={animatedComponents}
                    options={this.state.listDepartment}
                    onChange={this.handleChangePartOfDepartment}
                    disabled={this.state.proses}
                  />
                </Grid>
                <InputLabel style={{ fontStyle: 'italic', fontSize: 12 }}>* apabila tidak ada pilihannya harap tulis dan create</InputLabel>
              </Grid>
            }

          </Grid>
        </Grid>

        <Grid id="position" style={{ margin: '10px 0px', display: 'flex', }}>
          <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10, marginTop: 13 }}>
            <b style={{ fontSize: 12, marginBottom: 5 }}>Posisi</b>
          </Grid>

          <Grid>
            {
              this.state.position.map((position, index) =>
                <Grid style={{ width: '50%', margin: 5, minWidth: 300, display: 'flex', alignItems: 'flex-start' }} key={"position" + index}>
                  <img src={require('../../Assets/dropdown.png').default} loading="lazy" alt="dropdown" style={{ width: 20, height: 20, marginRight: 10, marginTop: 10 }} />
                  <Grid style={{ width: 400 }}>
                    <Grid style={{ height: 40 }}>
                      <CreatableSelect
                        isClearable
                        placeholder="posisi"
                        value={this.props.data && this.state.selectedPosition[index]}
                        components={animatedComponents}
                        options={this.state.listPosition}
                        onChange={(newValue) => this.handleChangePosition({ ...newValue, index, name: 'position' })}
                        disabled={this.state.proses}
                      />
                    </Grid>
                    <InputLabel style={{ fontStyle: 'italic', fontSize: 12 }}>* apabila tidak ada pilihannya harap tulis dan create</InputLabel>
                  </Grid>
                  <Grid style={{ width: 400, height: 40, marginLeft: 5 }}>
                    <ReactSelect
                      isClearable
                      value={this.props.data && this.state.selectedUserPosition[index]}
                      components={animatedComponents}
                      options={this.state.listUser}
                      getOptionLabel={(option) => `${option.nik} - ${option.label}`}
                      onChange={(newValue) => this.handleChangePosition({ ...newValue, index, name: 'user' })}
                      disabled={this.state.proses}
                    />
                  </Grid>
                  {
                    this.state.position.length > 1 && <Button variant="outlined" style={{ backgroundColor: '#ff1919', minWidth: 30, color: 'white', marginTop: 3, marginLeft: 5 }} size='small' onClick={() => this.deletePosition(index)} disabled={this.state.proses}>X</Button>
                  }
                </Grid>
              )
            }
            {
              this.state.position[0] !== '' && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.addPosition} disabled={this.state.proses}>+ tambah posisi</p>

            }
          </Grid>
        </Grid>

        {/* <b style={{ fontSize: 14 }}>Tim</b>
        <p style={{ margin: 0, color: '#a5a5a5', fontSize: 10 }}>ini merupakan bagian dari department diatas</p>

        {
          this.state.team.map((team, index) =>
            <Grid key={"team" + index}>

              <Grid style={{ display: 'flex', alignItems: 'center' }}>
                <b>Team {index + 1}</b>
                <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, marginRight: 15, cursor: 'pointer', width: 15, height: 15 }} onClick={() => this.deleteTeam(index)} />
              </Grid>

              <Grid id="name-team" style={{ margin: '0px 0px 10px 0px', display: 'flex', alignItems: 'center' }}>
                <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10 }}>
                  <b style={{ fontSize: 12, marginBottom: 5 }}>Nama Tim</b>
                </Grid>

                <Grid style={{ width: '50%', height: 40, margin: 5, minWidth: 300 }}>
                  <OutlinedInput
                    value={team.nameTeam}
                    onChange={this.handleChange('nameTeam', index)}
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
                </Grid>
              </Grid>

              <Grid id="team-position" style={{ margin: '10px 0px', display: 'flex', }}>
                <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10, marginTop: 13 }}>
                  <b style={{ fontSize: 12, marginBottom: 5 }}>Posisi dalam Tim</b>
                </Grid>

                <Grid>
                  {
                    team.teamPosition.map((position, indexPosition) =>
                      <Grid style={{ width: '60%', margin: 5, minWidth: 300, display: 'flex', alignItems: 'center' }} key={"teamPosition" + indexPosition}>
                        <img src={require('../../Assets/dropdown.png').default} alt="dropdown" style={{ width: 20, height: 20, marginRight: 10 }} />
                        <Grid style={{ width: 400, height: 40 }}>
                          <CreatableSelect
                            isClearable
                            placeholder="posisi"
                            value={this.props.data && team.selectedTeamPosition && team.selectedTeamPosition[indexPosition]}
                            components={animatedComponents}
                            options={this.state.listPosition}
                            onChange={(newValue) => this.handleChangePartOfPosition({ ...newValue, index, indexPosition })}
                            disabled={this.state.proses}
                            placeholder="Select or Create new"
                          />
                        </Grid>
                        <Grid style={{ width: 400, height: 40, margin: 5 }}>
                          <CreatableSelect
                            isClearable
                            value={this.props.data && team.userSelected && team.userSelected[indexPosition]}
                            components={animatedComponents}
                            options={this.state.listUser}
                            onChange={(newValue) => this.handleChangePartUserOfPosition({ ...newValue, index, indexPosition })}
                            disabled={this.state.proses}
                          />
                        </Grid>
                        {
                          team.teamPosition.length > 1 && <Button variant="outlined" style={{ backgroundColor: '#ff1919', color: 'white', minWidth: 30, marginLeft: 10 }} size='small' onClick={() => this.deleteTeamPosition(index)} disabled={this.state.proses}>
                            <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, cursor: 'pointer', width: 20, height: 20 }} />
                          </Button>
                        }
                      </Grid>
                    )
                  }
                  {
                    team.teamPosition[0] !== '' && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={() => this.addTeamPosition(index)} disabled={this.state.proses}>+ tambah posisi dalam tim</p>

                  }
                </Grid>
              </Grid>

              <Grid id="reportTo" style={{ margin: '0px 0px 10px 0px', display: 'flex', alignItems: 'center' }}>
                <Grid style={{ width: '20%', minWidth: '200px', marginRight: 10 }}>
                  <b style={{ fontSize: 12, marginBottom: 5 }}>Lapor kepada</b>
                </Grid>

                <Grid style={{ width: '50%', height: 40, margin: 5, minWidth: 300 }}>
                  <CreatableSelect
                    isClearable
                    value={this.props.data && team.selectedReportTo}
                    components={animatedComponents}
                    options={this.state.listUser}
                    onChange={(newValue) => this.handleChangeUser({ ...newValue, index })}
                    disabled={this.state.proses}
                  />
                </Grid>
              </Grid>
            </Grid>)
        }
        <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.addTeam} disabled={this.state.proses}>+ tambah tim</p> */}
      </Paper>
    )
  }
}

const mapStateToProps = ({ dataDepartments, dataPositions }) => {
  return {
    dataDepartments,
    dataPositions
  }
}

export default connect(mapStateToProps)(cardAddDepartment)