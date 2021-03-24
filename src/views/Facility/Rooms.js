import React, { Component, lazy } from 'react';
import { connect } from 'react-redux';

import { fetchDataBuildings, fetchDataRooms, fetchDataCompanies } from '../../store/action';

const ModalCreateEditBuilding = lazy(() => import('../../components/modal/modalCreateEditBuilding'));
const CardBuilding = lazy(() => import('../../components/facility/cardBuilding'));

class Rooms extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      dataBuildings: [],
      openModal: false,
    }
  }

  async componentDidMount() {
    this._isMounted = true
    this._isMounted && this.fetchData()
  }

  componentWillUnmount() {
    this._isMounted = false
  }


  fetchData = async () => {
    await this.props.fetchDataBuildings()
    await this.props.fetchDataRooms()
    await this.props.fetchDataCompanies()

    let tempBuildings = this.props.dataBuildings
    tempBuildings.forEach(async element => {
      let tempListRoom = this.props.dataRooms.filter(el => element.building_id === el.building_id);
      element.tbl_rooms = tempListRoom
    });

    this._isMounted && this.setState({
      dataBuildings: tempBuildings,
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
        dataBuildings: tempBuildings,
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
        <h2>List Gedung</h2>
        {
          this.state.dataBuildings.map((building, index) => (
            <CardBuilding data={building} key={index} fetchData={this.fetchData} />
          ))
        }
        {
          this.state.openModal && <ModalCreateEditBuilding status={this.state.openModal} closeModal={this.closeModal} companies={this.props.dataCompanies} statusCreate={true} fetchData={this.fetchData} />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataBuildings,
  fetchDataRooms,
  fetchDataCompanies
}

const mapStateToProps = ({ loading, dataBuildings, dataRooms, dataCompanies, userId, error, dataNotification }) => {
  return {
    loading,
    dataBuildings,
    dataRooms,
    dataCompanies,
    userId,
    error,
    dataNotification
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms)