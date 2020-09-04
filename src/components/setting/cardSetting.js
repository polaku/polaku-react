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
      <Paper style={{ padding: 15, display: 'flex', minHeight: 120, height: 'auto', paddingRight: 10, cursor: 'pointer', flexWrap: 'wrap' }} onClick={this.navigate}>
        <Grid style={{ width: '15%', textAlign: 'center' }}> {/* Icon */}
          { // Meeting room
            this.props.data.icon === 'SupervisorAccountOutlinedIcon' && <SupervisorAccountOutlinedIcon style={{ width: 50, height: 50 }} />
          }
          { // Pengumuman & Acara
            this.props.data.icon === 'SpeakerNotesOutlinedIcon' && <SpeakerNotesOutlinedIcon style={{ width: 50, height: 50 }} />
          }
          { // Perusahaan
            this.props.data.icon === 'BusinessOutlinedIcon' && <BusinessOutlinedIcon style={{ width: 50, height: 50 }} />
          }
          { // Keamanan
            this.props.data.icon === 'SecurityOutlinedIcon' && <SecurityOutlinedIcon style={{ width: 50, height: 50 }} />
          }
          { // HR
            this.props.data.icon === 'SupervisedUserCircleOutlinedIcon' && <SupervisedUserCircleOutlinedIcon style={{ width: 50, height: 50 }} />
          }
          { // Akses
            this.props.data.icon === 'VpnKeyOutlinedIcon' && <VpnKeyOutlinedIcon style={{ width: 50, height: 50 }} />
          }
          { // Supporting
            this.props.data.icon === 'ContactSupportOutlinedIcon' && <ContactSupportOutlinedIcon style={{ width: 50, height: 50 }} />
          }
          { // Menu
            this.props.data.icon === 'MenuOutlinedIcon' && <MenuOutlinedIcon style={{ width: 50, height: 50 }} />
          }
          { // Acount
            this.props.data.icon === 'AccountCircleOutlinedIcon' && <AccountCircleOutlinedIcon style={{ width: 50, height: 50 }} />
          }
        </Grid>

        <Grid style={{ display: 'flex', flexDirection: 'column', width: '75%', minWidth: 200 }}>
          <Typography variant="h5" component="h3" style={{ fontWeight: 'bold' }}>
            {this.props.data.title}
          </Typography>
          <Typography component="p">
            {this.props.data.information}
          </Typography>
        </Grid>
        <Grid style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '10%' }}>
          <Grid />
          <ArrowForwardIosOutlinedIcon style={{ width: 40, textAlign: 'center' }} />
          <Grid />
        </Grid>
      </Paper>
    )
  }
}

export default withRouter(cardSetting)