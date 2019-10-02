import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CardBuilding from '../../components/cardBuilding';
import ModalCreateEditBuilding from '../../components/modal/modalCreateEditBuilding';

import { fetchDataBuildings, fetchDataRooms, fetchDataCompanies } from '../../store/action';

class Rooms extends Component {
  state = {
    dataBuildings: [],
    // dataCompanies: [],
    openModal: false,
  }

  async componentDidMount() {
    await this.props.fetchDataBuildings()
    await this.props.fetchDataRooms()
    await this.props.fetchDataCompanies()

    let tempBuildings = this.props.dataBuildings
    console.log(this.props.userId)
    tempBuildings.forEach(async element => {
      let tempListRoom = this.props.dataRooms.filter(el => element.building_id === el.building_id);
      element.tbl_rooms = tempListRoom
    });

    this.setState({
      dataBuildings: tempBuildings,
      // dataCompanies: this.props.dataCompanies
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.dataRooms !== this.props.dataRooms) || (prevProps.dataBuildings !== this.props.dataBuildings)) {

      let tempBuildings = this.props.dataBuildings

      tempBuildings.forEach(async element => {
        let tempListRoom = this.props.dataRooms.filter(el => element.building_id === el.building_id);
        element.tbl_rooms = tempListRoom
      });

      this.setState({
        dataBuildings: tempBuildings
      })
    }
  }

  openModal = () => {
    this.setState({ openModal: true })
  }

  closeModal = () => {
    this.setState({ openModal: false })
  }

  render() {
    return (
      <div style={{ width: '70%', margin: '30px auto' }}>
        <Button size="small" color="primary" onClick={this.openModal} style={{ marginBottom: 10 }}>
          Create Building
        </Button>
        {
          this.state.dataBuildings.map((building, index) => (
            <CardBuilding data={building} key={index} />
          ))
        }
        <ModalCreateEditBuilding status={this.state.openModal} closeModal={this.closeModal} companies={this.props.dataCompanies} statusCreate={true} />
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataBuildings,
  fetchDataRooms,
  fetchDataCompanies
}

const mapStateToProps = ({ loading, dataBuildings, dataRooms, dataCompanies, userId, error }) => {
  return {
    loading,
    dataBuildings,
    dataRooms,
    dataCompanies,
    userId,
    error
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms)