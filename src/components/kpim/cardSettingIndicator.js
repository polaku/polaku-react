import React, { Component } from 'react'

import {
  Grid, Button, Paper, Popover, Typography, MenuList, MenuItem, ListItemIcon
} from '@material-ui/core';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SubdirectoryArrowRightOutlinedIcon from '@material-ui/icons/SubdirectoryArrowRightOutlined';

import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined';
// import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default class cardSettingIndicator extends Component {
  state = {
    open: false,
    anchorEl: null,
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget, open: true })
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false,
    })
  };

  render() {
    return (
      <>
        {
          this.props.status === "TAL"
            ? <Grid style={{ display: 'flex', alignItems: 'center' }}>
              <SubdirectoryArrowRightOutlinedIcon style={{ color: '#e3e3e3', margin: '0px 5px' }} />
              <Paper style={{ marginBottom: 2, marginTop: 2, padding: '5px 20px', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>w10</p>
                  <p style={{ margin: 0 }}>What 1</p>
                </Grid>
                <Grid style={{ display: 'flex', alignItems: 'center' }}>
                  <p style={{ margin: '0px 10px 0px 0px', width: 130 }}>Senin</p>
                  <Grid style={{ display: 'flex', flexDirection: 'column', width: 50, marginRight: 10 }}>
                    <CircularProgressbarWithChildren value={80}>
                      <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>{80}%</p>
                      <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>bulan</p>
                    </CircularProgressbarWithChildren>
                  </Grid>
                  <p style={{ margin: '0px 10px 0px 0px' }}>Rp. 4,500,000</p>
                  <Button style={{ borderRadius: 5, minWidth: 40, padding: 0 }} onClick={this.handleClick}>
                    <MoreHorizIcon />
                  </Button>
                </Grid>
              </Paper>
            </Grid>

            : <Paper style={{ marginBottom: 2, marginTop: 2, padding: '5px 20px', display: 'flex', justifyContent: 'space-between' }}>
              <Grid style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ margin: '0px 10px 0px 0px', fontSize: 13, color: '#d71149' }}>Feb</p>
                <p style={{ margin: 0 }}>KPIM Indicator 1</p>
              </Grid>
              <Grid style={{ display: 'flex', alignItems: 'center' }}>
                <Grid style={{ display: 'flex', flexDirection: 'column', width: 50, marginRight: 10 }}>
                  <CircularProgressbarWithChildren value={80}>
                    <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>{80}%</p>
                    <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>bulan</p>
                  </CircularProgressbarWithChildren>
                </Grid>
                <Grid style={{ display: 'flex', flexDirection: 'column', width: 50, marginRight: 10 }}>
                  <CircularProgressbarWithChildren value={30}>
                    <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>{30}%</p>
                    <p style={{ margin: 0, fontSize: 10, color: '#3e98c7' }}>tahun</p>
                  </CircularProgressbarWithChildren>
                </Grid>
                <Grid style={{ display: 'flex', alignItems:'flex-end' }}>
                  <p style={{ margin: '0px 3px 0px 0px' }}>Rp. 4,500,000</p>
                  <p style={{ margin: '0px 10px 4px 0px', fontSize: 10 }}>/ Rp. 7,500,000</p>
                </Grid>
                <Button style={{ borderRadius: 5, minWidth: 40, padding: 0 }} onClick={this.handleClick}>
                  <MoreHorizIcon />
                </Button>
              </Grid>
            </Paper>
        }
        <Popover
          open={this.state.open}
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

          <MenuList style={{ width: 330 }} >
            <MenuItem>
              <ListItemIcon style={{ marginLeft: 5, width: 30 }}>
                <CreateRoundedIcon />
              </ListItemIcon>
              <Typography >ubah indicator</Typography>
            </MenuItem>
            <MenuItem>
              <ListItemIcon style={{ marginLeft: 5 }}>
                <FileCopyOutlinedIcon />
              </ListItemIcon>
              <Typography >duplikat indikator ke user lain</Typography>
            </MenuItem>
            <MenuItem>
              <ListItemIcon style={{ marginLeft: 5 }}>
                <SyncOutlinedIcon />
              </ListItemIcon>
              <Typography >atur pengulangan</Typography>
            </MenuItem>
            {/* <MenuItem>
              <ListItemIcon style={{ marginLeft: 5 }}>
                <ArchiveOutlinedIcon />
              </ListItemIcon>
              <Typography >arsipkan indikator</Typography>
            </MenuItem> */}
          </MenuList>
        </Popover>
      </>
    )
  }
}

// import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
// import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
// import SyncOutlinedIcon from '@material-ui/icons/SyncOutlined';
// import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';