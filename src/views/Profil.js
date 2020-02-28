import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie'

import { userLogout } from '../store/action';

class Profil extends Component {

  logout = () => {
    Cookies.remove('POLAGROUP')
    this.props.history.push('/login')
    this.props.userLogout()
  }

  render() {
    return (
      <div>
        <p onClick={this.logout} style={{ cursor: "pointer", width:50 }}>Logout</p>
      </div>
    )
  }
}

const mapDispatchToProps = {
  userLogout
}

export default connect(null, mapDispatchToProps)(Profil)