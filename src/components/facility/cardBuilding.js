import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import publicIp from 'public-ip';

import {
  Button, Accordion, AccordionDetails, AccordionSummary, AccordionActions, Divider, Typography, List
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CardRooms from './cardRoom';
import ModalCreateEditRoom from '../modal/modalCreateEditRoom';
import ModalCreateEditBuilding from '../modal/modalCreateEditBuilding';

import { fetchDataBuildings } from '../../store/action';

import { API } from '../../config/API';

class cardBuilding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      openModalRoom: false,
      openModalBuilding: false,
    }
  }

  fetchData = () => {
    this.props.fetchData()
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

  deleteBuilding = async () => {
    let token = Cookies.get('POLAGROUP')

    API.delete(`/bookingRoom/building/${this.props.data.building_id}`, {
      headers: {
        token,
        ip: await publicIp.v4()
      }
    })
      .then(() => {
        this.props.fetchDataBuildings()
      })
  }

  render() {
    return (
      <Accordion expanded={this.state.expanded === this.props.data.building} onChange={this.handleChange(this.props.data.building)}>
        <AccordionSummary
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
        </AccordionSummary>
        <AccordionDetails>
          <List component="nav" style={{ width: '100%' }}>
            {
              this.props.data.tbl_rooms.length !== 0
                ? this.props.data.tbl_rooms.map((el, index) => (
                  <CardRooms data={el} index={index} key={index} fetchData={this.fetchData} />
                ))
                : 'Belum ada ruangan'
            }
          </List>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          {/* <Button size="small" onClick={this.openModalBuilding}>
            Edit Building
            </Button> */}
          {/* <Button size="small" color="secondary" onClick={this.deleteBuilding}>
            Delete Building
            </Button> */}
          <Button size="small" color="primary" onClick={this.openModalRoom}>
            Create Room
            </Button>
        </AccordionActions>
        {
          this.state.openModalBuilding && <ModalCreateEditBuilding status={this.state.openModalBuilding} closeModal={this.closeModalBuilding} data={this.props.data} companies={this.props.dataCompanies} statusCreate={false} />
        }
        {
          this.state.openModalRoom && <ModalCreateEditRoom status={this.state.openModalRoom} closeModal={this.closeModalRoom} data={this.props.data} statusCreate={true} fetchData={this.fetchData} />
        }


      </Accordion>
    )
  }
}

const mapDispatchToProps = {
  fetchDataBuildings
}

export default connect(null, mapDispatchToProps)(cardBuilding)