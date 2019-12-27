import React, { Component } from 'react';
import { connect } from 'react-redux';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BusinessOutlinedIcon from '@material-ui/icons/BusinessOutlined';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PowerInputIcon from '@material-ui/icons/PowerInput';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

import SeCreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import { fetchDataUsers } from '../../store/action';

const animatedComponents = makeAnimated();

class panelOnBoarding extends Component {
  state = {
    expanded: false,
    openPopOver: false,
    anchorEl: null,
    data: [
      {
        pt: 'PIP',
        pic: 'Febri',
        statusIcon1: true,
        statusIcon2: true,
        statusIcon3: true,
        statusIcon4: true,
      }, {
        pt: 'BPW',
        pic: 'Steven',
        statusIcon1: false,
        statusIcon2: true,
        statusIcon3: false,
        statusIcon4: false,
      }
    ]
  }

  async componentDidMount() {
    let temp = []
    await this.props.fetchDataUsers()
    this.props.dataUsers.forEach(element => {
      let newData = {
        user_id: element.user_id,
      }
      if (element.tbl_account_detail) newData.fullname = element.tbl_account_detail.fullname
      temp.push(newData)
    });

    this.setState({
      users: temp,
    })
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget, openPopOver: true })
  };

  handleClose = () => {
    this.setState({ anchorEl: null, openPopOver: false })
  };

  handleChangeSelect = (name, newValue, actionMeta) => {
    this.setState({
      [name]: newValue
    })
  };

  handleChange = panel => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false })
  };

  handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({ openPopOver: false })
    }
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        {
          this.state.data.map(el =>
            <ExpansionPanel square expanded={this.state.expanded === el.pt} onChange={this.handleChange(el.pt)}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions1-content"
                id="additional-actions1-header"
              >
                <FormControlLabel
                  onClick={event => event.stopPropagation()}
                  onFocus={event => event.stopPropagation()}
                  control={<Checkbox />}
                />
                <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <Grid style={{ display: 'flex', width: 150 }}>
                    <BusinessOutlinedIcon style={{ color: el.statusIcon1 ? '#d71149' : '#b4b4b4', minWidth: 40, height: 40, marginRight: 10 }} />
                    <Typography style={{ fontWeight: 'bold', fontSize: 21 }}>{el.pt}</Typography>
                  </Grid>
                  <Grid style={{ display: 'flex', width: 150 }}>
                    <AssignmentIndIcon style={{ color: el.statusIcon2 ? '#d71149' : '#b4b4b4', minWidth: 40, height: 40, marginRight: 10 }} />
                    <Typography style={{ fontWeight: 'bold', fontSize: 21 }}>{el.pic}</Typography>
                  </Grid>
                  <Grid style={{ display: 'flex', width: 100 }}>
                    <PowerInputIcon style={{ color: el.statusIcon3 ? '#d71149' : '#b4b4b4', minWidth: 40, height: 40 }} />
                  </Grid>
                  <Grid style={{ display: 'flex', width: 100 }}>
                    <PeopleOutlineIcon style={{ color: el.statusIcon4 ? '#d71149' : '#b4b4b4', minWidth: 40, height: 40 }} />
                  </Grid>
                </Grid>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f2f2f2', padding: 20 }}>
                <div style={{ display: 'flex', width: '100%', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <div style={{ width: '100%', paddingRight: 20 }}>
                    <SeCreatableSelect
                      isMulti
                      components={animatedComponents}
                      options={this.state.users}
                      onChange={value => this.handleChangeSelect('user', value)}
                      getOptionLabel={(option) => option.fullname}
                      getOptionValue={(option) => option.user_id}
                      placeholder="tambah PIC"
                      style={{ width: '90%' }}
                    />
                  </div>
                  <Button variant="contained" onClick={this.handleClick}>
                    Pengaturan
                  </Button>

                  <Popover
                    open={this.state.openPopOver}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <Paper style={{ width: 200 }}>
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList autoFocusItem={this.state.openPopOver} id="menu-list-grow" onKeyDown={this.handleListKeyDown}>
                          <MenuItem onClick={this.handleClose}>Ubah data</MenuItem>
                          <MenuItem onClick={this.handleClose}>Ubah PIC</MenuItem>
                          <MenuItem onClick={this.handleClose}>Non-aktifkan</MenuItem>
                          <MenuItem onClick={this.handleClose}>Hapus</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Popover>
                </div>
                <Grid container>
                  <Grid item sm={3} style={{ paddingRight: 5 }}>
                    <Grid style={{ backgroundColor: 'white', width:'100%', border: '1px solid #e3e3e3',  }}>
                      Status Alamat
                  </Grid>
                  </Grid>
                  <Grid item sm={3} style={{ backgroundColor: 'white', border: '1px solid #e3e3e3' }}>
                    Status Struktur
                  </Grid>
                  <Grid item sm={3} style={{ backgroundColor: 'white', border: '1px solid #e3e3e3' }}>
                    Status Karyawan
                  </Grid>
                  <Grid item sm={3} style={{ backgroundColor: 'white', border: '1px solid #e3e3e3' }}>
                    Status Admin
                  </Grid>
                </Grid>
                <Typography color="textSecondary">
                  isi test
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchDataUsers
}

const mapStateToProps = ({ loading, dataUsers, }) => {
  return {
    loading,
    dataUsers,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(panelOnBoarding)