import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Paper, Grid, Typography } from '@material-ui/core';

import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import SupervisedUserCircleOutlinedIcon from '@material-ui/icons/SupervisedUserCircleOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
import SpeakerNotesOutlinedIcon from '@material-ui/icons/SpeakerNotesOutlined';
import ContactSupportOutlinedIcon from '@material-ui/icons/ContactSupportOutlined';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';

class cardSetting extends Component {

  navigate = () => {
    this.props.data.route !== "" && this.props.history.push(this.props.data.route)
  }

  render() {
    return (
      <Paper style={{ padding: 15, display: 'flex', minHeight: 120, height: 'auto', paddingRight: 10, cursor: 'pointer' }} onClick={this.navigate}>
        <> {/* Icon */}
          { // Meeting room
            this.props.data.icon === 'SupervisorAccountOutlinedIcon' && <SupervisorAccountOutlinedIcon style={{ marginLeft: 10, width: 50, height: 50 }} />
          }
          { // Pengumuman & Acara
            this.props.data.icon === 'SpeakerNotesOutlinedIcon' && <SpeakerNotesOutlinedIcon style={{ marginLeft: 10, width: 50, height: 50 }} />
          }
          { // Perusahaan
            this.props.data.icon === 'BusinessOutlinedIcon' && <BusinessOutlinedIcon style={{ marginLeft: 10, width: 50, height: 50 }} />
          }
          { // Keamanan
            this.props.data.icon === 'SecurityOutlinedIcon' && <SecurityOutlinedIcon style={{ marginLeft: 10, width: 50, height: 50 }} />
          }
          { // HR
            this.props.data.icon === 'SupervisedUserCircleOutlinedIcon' && <SupervisedUserCircleOutlinedIcon style={{ marginLeft: 10, width: 50, height: 50 }} />
          }
          { // Akses
            this.props.data.icon === 'VpnKeyOutlinedIcon' && <VpnKeyOutlinedIcon style={{ marginLeft: 10, width: 50, height: 50 }} />
          }
          { // Supporting
            this.props.data.icon === 'ContactSupportOutlinedIcon' && <ContactSupportOutlinedIcon style={{ marginLeft: 10, width: 50, height: 50 }} />
          }
          { // Menu
            this.props.data.icon === 'MenuOutlinedIcon' && <MenuOutlinedIcon style={{ marginLeft: 10, width: 50, height: 50 }} />
          }
          { // Acount
            this.props.data.icon === 'AccountCircleOutlinedIcon' && <AccountCircleOutlinedIcon style={{ marginLeft: 10, width: 50, height: 50 }} />
          }
        </>

        <Grid style={{ display: 'flex', flexDirection: 'column', marginLeft: 15, width: '100%' }}>
          <Typography variant="h5" component="h3" style={{ fontWeight: 'bold' }}>
            {this.props.data.title}
          </Typography>
          <Typography component="p">
            {this.props.data.information}
          </Typography>
        </Grid>
        <Grid style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Grid />
          <ArrowForwardIosOutlinedIcon style={{ width: 40, textAlign: 'center' }} />
          <Grid />
        </Grid>
      </Paper>
    )
  }
}

export default withRouter(cardSetting)