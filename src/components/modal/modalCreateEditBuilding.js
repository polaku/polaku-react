import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import SelectOption from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { fetchDataBuildings } from '../../store/action';

import { API } from '../../config/API';

class modalCreateEditBuilding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proses: false,
      buildingName: '',
      company_id: '',
    }
  }

  componentDidMount() {
    if (!this.props.statusCreate) {
      this.setState({
        buildingName: this.props.data.building,
        company_id: this.props.data.company_id
      })
    }
  }

  save = () => {
    this.setState({
      proses: true
    })
    let token = localStorage.getItem('token')

    if (this.props.statusCreate) {
      let newData = {
        building: this.state.buildingName,
        company_id: this.state.company_id
      }

      API.post(`/bookingRoom/building`, newData, { headers: { token } })
        .then(() => {
          this.props.fetchDataBuildings()
          this.props.closeModal()
          this.setState({
            proses: false,
            buildingName: '',
            company_id: '',
          })
        })
        .catch(err => {
          console.log(err);
          this.setState({
            proses: false
          })
        })
    } else {
      let newData = {
        building: this.state.buildingName,
        company_id: this.state.company_id
      }

      API.put(`/bookingRoom/building/${this.props.data.building_id}`, newData, { headers: { token } })
        .then(() => {
          this.props.fetchDataBuildings()
          this.props.closeModal()
          this.setState({
            proses: false,
            buildingName: '',
            company_id: '',
          })
        })
        .catch(err => {
          console.log(err);
          this.setState({
            proses: false
          })
        })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  cancel = () => {
    this.props.closeModal()
  }

  render() {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={this.props.status}
        onClose={this.cancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <div style={{
            backgroundColor: 'white',
            boxShadow: 5,
            padding: 30,
            width: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {
              this.props.statusCreate
                ? <h2>Membuat gedung</h2>
                : <h2>Edit</h2>
            }
            <FormControl component="fieldset">
              <TextField
                id="buildingName"
                label="Nama gadung"
                value={this.state.buildingName}
                onChange={this.handleChange('buildingName')}
                margin="normal"
                variant="outlined"
                disabled={this.state.proses}
              />
            </FormControl>
            <FormControl component="fieldset" style={{ width: '50%' }}>
              <InputLabel htmlFor="room">Perusahaan</InputLabel>
              <SelectOption
                value={this.state.company_id}
                onChange={this.handleChange('company_id')}
                disabled={this.state.proses}
                style={{ width: '100%' }}
              >
                {
                  this.props.dataCompanies.map(el =>
                    (<MenuItem value={el.company_id} key={el.company_id}>{el.company_name}</MenuItem>)
                  )
                }
              </SelectOption>
            </FormControl>
            <div style={{ position: 'relative' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                style={{ margin: '20px 0', width: 100, alignSelf: 'center', marginRight: 30 }}
                data-testid='buttonSignin'
                disabled={this.state.proses}
                onClick={this.cancel}>
                Cancel
              {this.state.proses && <CircularProgress size={24} style={{
                  color: 'blue',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }} />}
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '20px 0', width: 100, alignSelf: 'center' }}
                data-testid='buttonSignin'
                disabled={this.state.proses}
                onClick={this.save}>
                Save
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
          </div>
        </Fade>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  fetchDataBuildings
}

const mapStateToProps = ({ loading, dataCompanies }) => {
  return {
    loading,
    dataCompanies,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(modalCreateEditBuilding)