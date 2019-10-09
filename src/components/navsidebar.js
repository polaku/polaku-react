import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Badge from '@material-ui/core/Badge';

import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MeetingRoomOutlinedIcon from '@material-ui/icons/MeetingRoomOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import SendIcon from '@material-ui/icons/Send';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import EventIcon from '@material-ui/icons/Event';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { setUser, fetchDataNotification } from '../store/action';
import { API } from '../config/API';

import TimeAgo from 'react-timeago'

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#A6250F'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: '#A6250F'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    backgroundColor: '#A6250F',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(7),
  },
  grow: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
}));

function MiniDrawer(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openChildBookingRoom, setOpenChildBookingRoom] = React.useState(false);
  const [openChildEvent, setOpenChildEvent] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
    setOpenChildBookingRoom(false);
    setOpenChildEvent(false);
  }

  function handleClick(event, state) {
    if (state === 'openChildBookingRoom') {
      setOpenChildBookingRoom(!openChildBookingRoom);
    } else if (state === 'openChildEvent') {
      setOpenChildEvent(!openChildEvent);
    }
  }

  function handleListItemClick(event, index) {
    setSelectedIndex(index);
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token')
      API.get('/users/checkToken', { headers: { token } })
        .then(({ data }) => {
          let newData = {
            user_id: data.user_id,
            isRoomMaster: data.isRoomMaster,
            isCreatorMaster: data.isCreatorMaster,
            isCreatorAssistant: data.isCreatorAssistant
          }
          if (data.role_id === 1) {
            newData.isAdmin = true
          } else {
            newData.isAdmin = false
          }
          props.setUser(newData)
          props.fetchDataNotification()
        })
    }
    // eslint-disable-next-line
  }, [])

  const handleClickNotif = event => {
    let newData = [], token = localStorage.getItem('token')
    setAnchorEl(event.currentTarget);
    props.dataNewNotif.forEach(element => {
      newData.push(element.notifications_id)
    });

    API.put('/notification', { notifications_id: newData }, { headers: { token } })
      .then(async data => {
        await props.fetchDataNotification()
      })
      .catch(err => {
        console.log(err)
      })
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateStatus = id => {
    let token = localStorage.getItem('token')

    API.put(`/notification/${id}`, { read: 1 }, { headers: { token } })
      .then(async data => {
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <div className={classes.grow}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Polaku
          </Typography>
          </div>
          <IconButton color="inherit" onClick={handleClickNotif}>
            {
              props.dataNewNotif.length !== 0
                ? <Badge badgeContent={props.dataNewNotif.length} color="primary">
                  <NotificationsIcon />
                </Badge>
                : <NotificationsNoneIcon />
            }
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: 350,
                marginTop: 50,
                borderRadius: 5,
              },
            }}
          >
            {
              props.dataNotification && props.dataNotification.map((notif, index) => {
                return notif.link && <Link to={notif.link} key={index} style={{ textDecoration: 'none', color: 'black' }} onClick={() => updateStatus(notif.notifications_id)}>
                  <MenuItem onClick={handleClose} style={{ backgroundColor: !notif.read ? '#e9e9e9' : 'white' }}>
                    <ListItemIcon>
                      {
                        notif.value === "Meeting" ? <MeetingRoomIcon />
                          : notif.value === "Event" ? <EventIcon />
                            : <SendIcon />
                      }
                    </ListItemIcon>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1" >New {notif.value} - {notif.description}</Typography>
                      <TimeAgo date={notif.created_at} style={{ fontSize: 12 }} />
                    </div>
                    <Divider />
                  </MenuItem>
                </Link>
              })
            }
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon style={{ color: 'white' }} />
          </IconButton>
        </div>
        <Divider />
        <List>
          {
            open
              ? <ListItem button key="Booking Room"
                onClick={event => handleClick(event, 'openChildBookingRoom')}>
                <ListItemIcon>
                  <MeetingRoomOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Booking Room" />
                {openChildBookingRoom ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              : <Link to="/bookingRoom" onClick={event => handleListItemClick(event, 0)}>
                <ListItem button key="Booking Room" selected={selectedIndex === 0 || selectedIndex === 0.1}>
                  <ListItemIcon>
                    <MeetingRoomOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Booking Room" />
                </ListItem>
              </Link>
          }

          <Collapse in={openChildBookingRoom} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link to="/bookingRoom" onClick={event => handleListItemClick(event, 0)} style={{ textDecoration: 'none', color: 'black' }}>
                <ListItem button className={classes.nested} selected={selectedIndex === 0}>
                  <ListItemText primary="List Booking Room" />
                </ListItem>
              </Link>
              {
                props.isAdmin
                  ? <Link to="/bookingRoom/roomMaster" onClick={event => handleListItemClick(event, 0.1)} style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button className={classes.nested} selected={selectedIndex === 0.1}>
                      <ListItemText primary="Room Master" />
                    </ListItem>
                  </Link>
                  : props.isRoomMaster && <Link to="/bookingRoom/roomAssistant" onClick={event => handleListItemClick(event, 0.2)} style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button className={classes.nested} selected={selectedIndex === 0.2}>
                      <ListItemText primary="Room Assistant" />
                    </ListItem>
                  </Link>
              }


              <Link to="/bookingRoom/rooms" onClick={event => handleListItemClick(event, 0.3)} style={{ textDecoration: 'none', color: 'black' }}>
                <ListItem button className={classes.nested} selected={selectedIndex === 0.3}>
                  <ListItemText primary="Building & Room" />
                </ListItem>
              </Link>
            </List>
          </Collapse>

          {
            open
              ? <ListItem button key="Event"
                onClick={event => handleClick(event, 'openChildEvent')}>
                <ListItemIcon>
                  <EventOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Event" />
                {openChildEvent ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              : <Link to="/event" onClick={event => handleListItemClick(event, 1)}>
                <ListItem button key="Event" selected={selectedIndex === 1 || selectedIndex === 1.1} >
                  <ListItemIcon>
                    <EventOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Event" />
                </ListItem>
              </Link>
          }

          <Collapse in={openChildEvent} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link to="/event" onClick={event => handleListItemClick(event, 1.1)} style={{ textDecoration: 'none', color: 'black' }}>
                <ListItem button className={classes.nested} selected={selectedIndex === 1.1}>
                  <ListItemText primary="Event" />
                </ListItem>
              </Link>
              {
                (props.isAdmin || props.isCreatorMaster || props.isCreatorAssistant) && <Link to="/event/approvalEvent" onClick={event => handleListItemClick(event, 1.2)} style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItem button className={classes.nested} selected={selectedIndex === 1.2}>
                    <ListItemText primary="Approval Event" />
                  </ListItem>
                </Link>
              }
              {
                props.isAdmin
                  ? <Link to="/event/creatorMasterAndAssistant" onClick={event => handleListItemClick(event, 1.3)} style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button className={classes.nested} selected={selectedIndex === 1.3}>
                      <ListItemText primary="Creator Master" />
                    </ListItem>
                  </Link>
                  : props.isCreatorMaster && <Link to="/event/creatorMasterAndAssistant" onClick={event => handleListItemClick(event, 1.3)} style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button className={classes.nested} selected={selectedIndex === 1.3}>
                      <ListItemText primary="Creator Assistant" />
                    </ListItem>
                  </Link>
              }
            </List>
          </Collapse>


        </List>
        <Divider />
        <List>
          <ListItem button key="Profil" selected={selectedIndex === 2} onClick={event => handleListItemClick(event, 2)}>
            <ListItemIcon>
              <PersonOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Profil" />
          </ListItem>
        </List>
      </Drawer>
    </div >
  );
}

const mapDispatchToProps = {
  setUser,
  fetchDataNotification
}

const mapStateToProps = ({ isAdmin, isRoomMaster, isCreatorMaster, isCreatorAssistant, dataNotification, userId, dataNewNotif }) => {
  return {
    isAdmin,
    isRoomMaster,
    isCreatorMaster,
    isCreatorAssistant,
    dataNotification,
    userId,
    dataNewNotif
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MiniDrawer)