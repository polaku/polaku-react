import React, { Component } from 'react';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';

import CardRooms from './cardRoom';
import ModalCreateEditRoom from './modal/modalCreateEditRoom';
import ModalCreateEditBuilding from './modal/modalCreateEditBuilding';

import { fetchDataBuildings } from '../store/action';

import { API } from '../config/API';

class cardBuilding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      openModalRoom: false,
      openModalBuilding: false,
    }
  }

  handleChange = panel => (event, isExpanded) => {
    isExpanded ? this.setState({ expanded: panel }) : this.setState({ expanded: false })
  };

  openModalRoom = () => {
    this.setState({ openModalRoom: true })
  }

  closeModalRoom = () => {
    this.setState({ openModalRoom: false })
  }

  openModalBuilding = () => {
    this.setState({ openModalBuilding: true })
  }

  closeModalBuilding = () => {
    this.setState({ openModalBuilding: false })
  }

  deleteBuilding = () => {
    let token = localStorage.getItem('token')

    API.delete(`/bookingRoom/building/${this.props.data.building_id}`, { headers: { token } })
    .then(()=>{
      this.props.fetchDataBuildings()
    })
  }

  render() {
    return (
      <ExpansionPanel expanded={this.state.expanded === this.props.data.building} onChange={this.handleChange(this.props.data.building)}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          style={{
            backgroundColor: '#E4E3E3'
          }}
        >
          <Typography style={{
            fontSize: 15,
            flexBasis: '33.33%',
            flexShrink: 0,
          }}>{this.props.data.building}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List component="nav" style={{ width: '100%' }}>
            {
              this.props.data.tbl_rooms.length !== 0
                ? this.props.data.tbl_rooms.map((el, index) => (
                  <CardRooms data={el} index={index} key={index} />
                ))
                : 'Belum ada ruangan'
            }
          </List>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button size="small" onClick={this.openModalBuilding}>
            Edit Building
            </Button>
          <Button size="small" color="secondary" onClick={this.deleteBuilding}>
            Delete Building
            </Button>
          <Button size="small" color="primary" onClick={this.openModalRoom}>
            Create Room
            </Button>
        </ExpansionPanelActions>
        <ModalCreateEditBuilding status={this.state.openModalBuilding} closeModal={this.closeModalBuilding} data={this.props.data} companies={this.props.dataCompanies} statusCreate={false} />
        <ModalCreateEditRoom status={this.state.openModalRoom} closeModal={this.closeModalRoom} data={this.props.data} statusCreate={true} />
      </ExpansionPanel>
    )
  }
}

const mapDispatchToProps = {
  fetchDataBuildings
}

export default connect(null, mapDispatchToProps)(cardBuilding)