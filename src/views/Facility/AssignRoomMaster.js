import 'date-fns';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import {
  Typography, Button, CircularProgress, FormControl, Grid, FormControlLabel, Checkbox, FormLabel, FormGroup
} from '@material-ui/core';

import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import { fetchDataCompanies, fetchDataUsers } from '../../store/action';
import { API } from '../../config/API';

import swal from 'sweetalert';

const animatedComponents = makeAnimated();

class AssignRoomMaster extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false
    this.state = {
      allCheck: false,
      company: [],
      user: {},
      users: [],
      proses: false,
      editableInput: true,
    }
  }

  async componentDidMount() {
    this._isMounted = true

    if (this._isMounted) {
      let temp = [], tempComp = []
      await this.props.fetchDataCompanies()
      await this.props.fetchDataUsers()

      tempComp = this.props.dataCompanies

      tempComp.forEach(element => {
        element.status = false
      });

      this.props.dataUsers.forEach(element => {
        let newData = {
          user_id: element.user_id,
        }
        if (element.tbl_account_detail) newData.fullname = element.tbl_account_detail.fullname

        temp.push(newData)
      });

      this._isMounted && this.setState({
        users: temp,
        company: tempComp
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }


  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeChecked = index => event => {
    let datas = this.state.company

    datas[index].status = event.target.checked

    this.setState({
      company: datas,
    });
  };

  handleChangeAllCheck = () => event => {
    let temp = this.state.company
    this.setState({
      allCheck: event.target.checked
    })
    if (event.target.checked) {
      temp.forEach(element => {
        element.status = true
      });
      this.setState({
        company: temp
      })
    } else {
      temp.forEach(element => {
        element.status = false
      });
      this.setState({
        company: temp
      })
    }
  };

  send = async e => {
    e.preventDefault();
    this.setState({
      proses: true,
      editableInput: false
    })
    let newData, companyId = [], token = Cookies.get('POLAGROUP')

    this.state.company.forEach(el => {
      if (el.status === true) {
        companyId.push(el.company_id)
      }
    })

    newData = {
      user_id: this.state.user.user_id,
      company_id: companyId.join()
    }

    API.post('/bookingRoom/roomMaster', newData, {
      headers: {
        token,
        ip: this.props.ip
      }
    })
      .then(() => {
        this.props.history.goBack();
      })
      .catch(err => {
        swal('please try again')
      })
  }

  handleChangePartisipan = (newValue, actionMeta) => {
    this.setState({
      user: newValue
    })
  };

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '5% 0 0 auto' }}>
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', width: '70%' }}>
          <Typography style={{ margin: 10, fontSize: 17 }}>Assign Room Master</Typography>
          <form noValidate autoComplete="off" onSubmit={this.send} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

            <FormControl style={{ margin: '10px 0 10px 0' }}>
              <SeCreatableSelect
                components={animatedComponents}
                options={this.state.users}
                onChange={this.handleChangePartisipan}
                getOptionLabel={(option) => option.fullname}
                getOptionValue={(option) => option.user_id}
                disabled={this.state.proses}
              />
            </FormControl>

            <FormControl component="fieldset" style={{ margin: '10px 0 10px 0' }}>
              <FormLabel component="legend">Perusahaan</FormLabel>
              <FormGroup style={{ display: 'flex', flexDirection: 'row', textAlign: 'left', paddingLeft: 10 }}>
                <Grid item md={12} xs={12} style={{ marginLeft: -10 }}>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.allCheck} onChange={this.handleChangeAllCheck()} />}
                    label="All"
                  />
                </Grid>
                {
                  this.state.company.map((element, index) => (
                    <Grid item md={3} xs={12} key={index}>
                      <FormControlLabel
                        control={<Checkbox checked={element.status} onChange={this.handleChangeChecked(index)} value={element.company_id} />}
                        label={element.company_name}
                      />
                    </Grid>
                  ))
                }
              </FormGroup>
            </FormControl>

            <div style={{ position: 'relative' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '20px 0', width: 100, alignSelf: 'center' }}
                data-testid='buttonSignin'
                disabled={this.state.proses}>
                Sign In
              {this.state.proses && <CircularProgress size={24} style={{
                  color: 'blue',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }} />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers,
  fetchDataCompanies,
}

const mapStateToProps = ({ loading, dataUsers, dataCompanies, ip }) => {
  return {
    loading,
    dataUsers,
    dataCompanies,
    ip
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignRoomMaster)