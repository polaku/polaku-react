import React, { useEffect } from "react";
import clsx from "clsx";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import PropTypes from 'prop-types';

import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Menu,
  Grid,
  Tab,
  Tabs,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SwipeableViews from 'react-swipeable-views';
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MeetingRoomOutlinedIcon from "@material-ui/icons/MeetingRoomOutlined";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import BarChartIcon from "@material-ui/icons/BarChart";
import ImportContactsRoundedIcon from "@material-ui/icons/ImportContactsRounded";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
// import ModalPemberitahuan from './modal/modalPemberitahuan';

import { setUser, fetchDataNotification, userLogout } from "../store/action";
import { API, BaseURL } from "../config/API";

import TimeAgo from "react-timeago";

import swal from "sweetalert";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#d71149",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    backgroundColor: "#d71149",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    backgroundColor: "#d71149",
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}));

const MaterialIcon = ({ icon }) => {
  switch (icon) {
    case "PersonOutlineOutlinedIcon":
      return <PersonOutlineOutlinedIcon />;
    default:
      return null;
  }
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box pt={2} style={{ padding: 0 }}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function Navsidebar(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openChildBookingRoom, setOpenChildBookingRoom] = React.useState(false);
  const [openChildEvent, setOpenChildEvent] = React.useState(false);
  const [openChildHR, setOpenChildHR] = React.useState(false);
  const [openChildKPIM, setOpenChildKPIM] = React.useState(false);
  const [isAtasan, setIsAtasan] = React.useState(false);
  // const [openModalPemberitahuan, setOpenModalPemberitahuan] = React.useState(true);

  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tabNotif, setTabNotif] = React.useState(0);
  // const [prosesNotif, setProsesNotif] = React.useState(false);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
    setOpenChildBookingRoom(false);
    setOpenChildEvent(false);
    setOpenChildHR(false);
    setOpenChildKPIM(false);
  }

  function handleClick(event, state) {
    if (state === "openChildBookingRoom") {
      setOpenChildBookingRoom(!openChildBookingRoom);
    } else if (state === "openChildEvent") {
      setOpenChildEvent(!openChildEvent);
    } else if (state === "openChildHR") {
      setOpenChildHR(!openChildHR);
    } else if (state === "openChildKPIM") {
      setOpenChildKPIM(!openChildKPIM);
    }
  }

  function handleListItemClick(event, index) {
    setSelectedIndex(index);
  }

  useEffect(() => {
    async function fetchData() {
      let token = Cookies.get("POLAGROUP");
      if (token) {
        API.get("/users/check-token", {
          headers: {
            token,
          },
        })
          .then(async ({ data }) => {
            let newData = {
              user_id: data.user_id,
              isRoomMaster: data.isRoomMaster,
              isCreatorMaster: data.isCreatorMaster,
              isCreatorAssistant: data.isCreatorAssistant,
              sisaCuti: data.sisaCuti,
              evaluator1: data.evaluator1,
              evaluator2: data.evaluator2,
              bawahan: data.bawahan,
              admin: data.admin,
              nickname: data.nickname,
              fullname: data.fullname,
              firstHierarchy: data.firstHierarchy,
              dinas: data.dinas,
              statusEmployee: data.status_employee
            };

            let checkPIC = data.admin.find((el) => el.PIC);
            let PIC = checkPIC ? true : false;
            newData.isPIC = PIC;
            let isAdminNews = false,
              isAdminAddress = false,
              isAdminStructure = false,
              isAdminEmployee = false,
              isAdminAdmin = false,
              isAdminRoom = false,
              isAdminKPIM = false,
              isAdminHR = false,
              isAdminHelpdesk = false,
              isAdminNotification = false;

            await data.admin.forEach((admin) => {
              if (admin.tbl_designation) {
                let checkNews = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 1
                );
                if (checkNews) isAdminNews = true;

                let checkAddress = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 2
                );
                if (checkAddress) isAdminAddress = true;

                let checkStructure = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 3
                );
                if (checkStructure) isAdminStructure = true;

                let checkEmployee = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 4
                );
                if (checkEmployee) isAdminEmployee = true;

                let checkAdmin = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 5
                );
                if (checkAdmin) isAdminAdmin = true;

                let checkRoom = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 6
                );
                if (checkRoom) isAdminRoom = true;

                let checkKPIM = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 7
                );
                if (checkKPIM) isAdminKPIM = true;

                let checkHR = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 8
                );
                if (checkHR) isAdminHR = true;

                let checkHelpdesk = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 9
                );
                if (checkHelpdesk) isAdminHelpdesk = true;

                let checkNotification = admin.tbl_designation.tbl_user_roles.find(
                  (menu) => menu.menu_id === 10
                );
                if (checkNotification) isAdminNotification = true;

              }
            });

            newData.isAdminNews = isAdminNews;
            newData.isAdminAddress = isAdminAddress;
            newData.isAdminStructure = isAdminStructure;
            newData.isAdminEmployee = isAdminEmployee;
            newData.isAdminAdmin = isAdminAdmin;
            newData.isAdminRoom = isAdminRoom;
            newData.isAdminKPIM = isAdminKPIM;
            newData.isAdminHR = isAdminHR;
            newData.isAdminHelpdesk = isAdminHelpdesk;
            newData.isAdminNotification = isAdminNotification;

            if (data.role_id === 1) {
              newData.isAdminsuper = true;
            } else {
              newData.isAdminsuper = false;
            }

            if (data.adminContactCategori) {
              newData.adminContactCategori = data.adminContactCategori;
            }
            await props.setUser(newData);
            await props.fetchDataNotification({ page: 0, limit: 10, "is-notif-polaku": 1 });
          })
          .catch((err) => {
            Cookies.remove("POLAGROUP");
            props.history.push("/login");
          });
      } else {
        if (!props.location.pathname.match('/reset-password')) {
          props.history.push("/login");
        }
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let checkAdmin = null;

    if (props.location.pathname === "/polanews") {
      setSelectedIndex(0);
    } else if (props.location.pathname === "/booking-room") {
      setSelectedIndex(1);
    } else if (props.location.pathname === "/booking-room/room-master") {
      if (props.isAdminsuper) {
        setSelectedIndex(1.1);
      } else {
        props.history.push("/booking-room");
      }
    } else if (props.location.pathname === "/booking-room/room-assistant") {
      if (props.isRoomMaster) {
        setSelectedIndex(1.2);
      } else {
        props.history.push("/booking-room");
      }
    } else if (props.location.pathname === "/booking-room/rooms") {
      if (props.isAdminsuper || props.isRoomMaster || checkAdmin) {
        setSelectedIndex(1.3);
      } else {
        props.history.push("/booking-room");
      }
    } else if (props.location.pathname === "/event") {
      setSelectedIndex(2.1);
    } else if (props.location.pathname === "/event/approval-event") {
      setSelectedIndex(2.2);
    } else if (
      props.location.pathname === "/event/creator-master-and-assistant"
    ) {
      setSelectedIndex(2.3);
    } else if (props.location.pathname === "/hr") {
      setSelectedIndex(3);
    } else if (props.location.pathname === "/hr/report") {
      if (props.isAdminHR || props.isAdminsuper) {
        setSelectedIndex(3.1);
      } else {
        props.history.goBack();
      }
    } else if (props.location.pathname === "/kpim") {
      setSelectedIndex(4);
    } else if (props.location.pathname === "/kpim/tal") {
      setSelectedIndex(4.1);
    } else if (props.location.pathname === "/kpim/report") {
      if (props.isAdminKPIM || props.isAdminsuper || isAtasan) {
        setSelectedIndex(4.2);
      } else {
        props.history.goBack();
      }
    } else if (props.location.pathname === "/kpim/setting") {
      setSelectedIndex(4.3);
    } else if (props.location.pathname === "/helpdesk") {
      setSelectedIndex(5);
    } else if (
      props.location.pathname === "/setting" ||
      props.location.pathname === "/setting/setting-user" ||
      props.location.pathname === "/setting/setting-perusahaan" ||
      props.location.pathname ===
      "/setting/setting-perusahaan/stepper-onboarding" ||
      props.location.pathname ===
      "/setting/setting-perusahaan/add-department" ||
      props.location.pathname === "/setting/setting-perusahaan/add-employee" ||
      props.location.pathname === "/setting/setting-perusahaan/add-service" ||
      props.location.pathname === "/setting/setting-perusahaan/add-address" ||
      props.location.pathname === "/setting/setting-perusahaan/add-admin" ||
      props.location.pathname === "/setting/setting-meeting-room" ||
      props.location.pathname ===
      "/setting/setting-meeting-room/add-meeting-room"
      //  ||
      // props.location.pathname === '/setting/setting-keamanan'
    ) {
      if (
        props.location.pathname === "/setting/setting-perusahaan/add-address"
      ) {
        //admin alamat
        if (props.isAdminAddress || props.isAdminsuper || props.isPIC) {
          setSelectedIndex(99);
        } else {
          props.history.goBack();
        }
      } else if (
        props.location.pathname === "/setting/setting-perusahaan/add-department"
      ) {
        //admin struktur
        if (props.isAdminStructure || props.isAdminsuper || props.isPIC) {
          setSelectedIndex(99);
        } else {
          props.history.goBack();
        }
      } else if (
        props.location.pathname ===
        "/setting/setting-perusahaan/add-employee" ||
        props.location.pathname === "/setting/setting-perusahaan/add-service"
      ) {
        //admin karyawan
        if (props.isAdminEmployee || props.isAdminsuper || props.isPIC) {
          setSelectedIndex(99);
        } else {
          props.history.goBack();
        }
      } else if (
        props.location.pathname === "/setting/setting-perusahaan/add-admin"
      ) {
        //admin admin
        if (props.isAdminAdmin || props.isAdminsuper || props.isPIC) {
          setSelectedIndex(99);
        } else {
          props.history.goBack();
        }
      } else if (
        props.location.pathname === "/setting/setting-meeting-room" ||
        props.location.pathname ===
        "/setting/setting-meeting-room/add-meeting-room"
      ) {
        //admin meeting room
        if (props.isAdminRoom || props.isAdminsuper || props.isPIC) {
          setSelectedIndex(99);
        } else {
          props.history.goBack();
        }
      } else if (props.location.pathname === "/setting/setting-keamanan") {
        //admin keamanan
        if (props.isAdminsuper) {
          setSelectedIndex(99);
        } else {
          props.history.goBack();
        }
      } else if (
        props.isAdminsuper ||
        props.isPIC ||
        props.isAdminNews ||
        props.isAdminAddress ||
        props.isAdminStructure ||
        props.isAdminEmployee ||
        props.isAdminAdmin ||
        props.isAdminRoom ||
        props.isAdminKPIM ||
        props.isAdminHR
      ) {
        setSelectedIndex(99);
      } else {
        props.history.goBack();
      }
    } else if (props.location.pathname === "/profil") {
      setSelectedIndex(100);
    }
  }, [
    props.location.pathname,
    props.isAdminsuper,
    props.userId,
    props.adminContactCategori,
    props.history,
    props.isRoomMaster,
    props.designation,
    props.admin,
    props.isPIC,
    props.isAdminNews,
    props.isAdminAddress,
    props.isAdminStructure,
    props.isAdminEmployee,
    props.isAdminAdmin,
    props.isAdminRoom,
    props.isAdminKPIM,
    props.isAdminHR,
    isAtasan,
  ]);

  useEffect(() => {
    setOpen(false);
    setOpenChildBookingRoom(false);
    setOpenChildEvent(false);
    setOpenChildHR(false);
    setOpenChildKPIM(false);
    setIsAtasan(false);
    if (props.bawahan.length > 0) {
      setIsAtasan(true);
    } else {
      setIsAtasan(false);
    }
  }, [props.bawahan]);

  const handleClickNotif = async (event) => {
    let newData = [],
      token = Cookies.get("POLAGROUP");

    setAnchorEl(event.currentTarget);
    props.dataNewNotif.forEach((element) => {
      newData.push(element.notifications_id);
    });

    API.put(
      "/notification",
      { notifications_id: newData },
      {
        headers: {
          token,
          ip: props.ip,
        },
      }
    )
      .then(async (data) => {
        await props.fetchDataNotification({ page: 0, limit: 10, "is-notif-polaku": tabNotif === 0 ? '1' : '0' });
      })
      .catch((err) => {
        swal("please try again");
      });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateStatus = async (id) => {
    let token = Cookies.get("POLAGROUP");

    API.put(
      `/notification/${id}`,
      { read: 1 },
      {
        headers: {
          token,
          ip: props.ip,
        },
      }
    )
      .then(async () => {
        props.fetchDataNotification({ page: 0, limit: 10, "is-notif-polaku": tabNotif === 0 ? '1' : '0' });
      })
      .catch((err) => {
        swal("please try again");
      });
  };

  const _handleTabNotif = async (args) => {
    setTabNotif(args)
    await props.fetchDataNotification({ page: 0, limit: 10, "is-notif-polaku": args === 0 ? '1' : '0' });
  }

  const _handleMarkAllHasRead = () => {
    let newData = [],
      token = Cookies.get("POLAGROUP");

    props.dataNotification.forEach((element) => {
      newData.push(element.notifications_id);
    });

    API.put(
      "/notification",
      { notifications_id: newData },
      {
        headers: {
          token,
          ip: props.ip,
        },
      }
    )
      .then(async (data) => {
        await props.fetchDataNotification({ page: 0, limit: 10, "is-notif-polaku": tabNotif === 0 ? '1' : '0' });
      })
      .catch((err) => {
        // console.log(err)
        swal("please try again");
      });
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      {Cookies.get("POLAGROUP") && !props.location.pathname.match('/reset-password') && (
        <>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <div className={classes.grow}>
                <IconButton aria-label="open-drawer"
                  color="inherit"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, {
                    [classes.hide]: open,
                  })}
                >
                  <MenuIcon />
                </IconButton>
                <img
                  src={require('../Assets/polagroup.png').default}
                  alt="Logo"
                  width={175}
                  height={50}
                />
              </div>
              <IconButton aria-label="notif" color="inherit" onClick={handleClickNotif}>
                {props.dataNewNotif.length !== 0 ? (
                  <Badge
                    badgeContent={props.dataNewNotif.length}
                    color="primary"
                  >
                    <NotificationsIcon />
                  </Badge>
                ) : (
                  <NotificationsNoneIcon />
                )}
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    // maxHeight: 48 * 4.5,
                    maxHeight: 360,
                    width: 350,
                    marginTop: 40,
                    borderRadius: 5
                  },
                }}
              >
                <Grid style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 15px 10px 15px', alignItems: 'center' }}>
                  <Grid style={{ display: 'flex', alignItems: 'center' }}>
                    <b style={{ fontSize: 18 }}>Notifikasi</b>
                    {
                      (props.isAdminNotification || props.isAdminsuper) &&
                      <img src={require('../Assets/plus.png').default} loading="lazy" alt="address" width={25} maxHeight={25} style={{ alignSelf: 'center', marginLeft: 10, cursor: 'pointer' }} onClick={() => {
                        handleClose()
                        props.history.push('/notifikasi/create')
                      }} />
                    }
                  </Grid>
                  {
                    (props.isAdminNotification || props.isAdminsuper) && <img src={require('../Assets/settings.png').default} loading="lazy" alt="address" width={25} maxHeight={25} style={{ alignSelf: 'center', cursor: 'pointer' }} onClick={() => {
                      handleClose()
                      props.history.push('/notifikasi/setting')
                    }} />
                  }

                </Grid>
                <Divider />

                <Tabs
                  value={tabNotif}
                  indicatorColor="secondary"
                  textColor="secondary"
                  onChange={(event, newValue) => {
                    _handleTabNotif(newValue)
                  }}
                >
                  <Tab label="Polaku" style={{ color: '#d71149', width: '50%' }} />
                  <Tab label="Update" style={{ color: '#d71149', width: '50%' }} />
                </Tabs>
                <Divider />
                <SwipeableViews
                  index={tabNotif}
                  onChangeIndex={index => _handleTabNotif(index)}
                  style={{ height: '100%' }}>

                  {/* POLAKU */}
                  <TabPanel value={tabNotif} index={0} style={{ height: 200, overflowX: 'auto' }}>
                    {
                      props.dataNotification.length > 0 &&
                      props.dataNotification.map((notif, index) =>
                        <Grid key={'notif' + index}>
                          <Grid style={{
                            padding: '10px 15px', backgroundColor: !notif.read
                              ? "#ffebeb"
                              : "white",
                            cursor: 'pointer'
                          }}
                            onClick={() => updateStatus(notif.notifications_id)}>
                            <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <p style={{ margin: 0, marginRight: 5 }}>{notif.tbl_notification_category ? notif.tbl_notification_category.name : (notif.title || notif.value)}</p>
                              {
                                notif.tbl_notification_category && notif.tbl_notification_category.icon
                                  ? <img
                                    src={`${BaseURL}/${notif.tbl_notification_category.icon}`}
                                    alt="Logo"
                                    width={10}
                                    height={10}
                                    style={{ marginBottom: 5, marginRight: 5 }}
                                  />
                                  : null
                              }
                              <TimeAgo
                                date={notif.created_at}
                                style={{ fontSize: 12, color: 'gray' }}
                              />
                            </Grid>
                            <b style={{ fontSize: 15, margin: '5px 0px' }}>{notif.title || notif.value}</b>
                            <p style={{ margin: 0, fontSize: 13 }}>{notif.description.replace(/<[^>]*>?/gm, '').replace('&nbsp;', '')}</p>
                            {/* <Grid dangerouslySetInnerHTML={{ __html: this.state.questionSelected.answer }} /> */}
                          </Grid>
                          <Divider />
                        </Grid>
                      )
                    }
                  </TabPanel>

                  {/* UPDATE */}
                  <TabPanel value={tabNotif} index={1} style={{ height: 200, overflowX: 'auto' }}>
                    {
                      props.dataNotification.length > 0 &&
                      props.dataNotification.map((notif, index) =>
                        <Grid key={'notif-update' + index}>
                          <Grid style={{
                            padding: '10px 15px', backgroundColor: !notif.read
                              ? "#ffebeb"
                              : "white",
                            cursor: 'pointer'
                          }}
                            onClick={() => updateStatus(notif.notifications_id)}>
                            <Grid style={{ display: 'flex', alignItems: 'flex-end' }}>
                              <p style={{ margin: 0, marginRight: 5 }}>{notif.tbl_notification_category ? notif.tbl_notification_category.name : (notif.title || notif.value)}</p>
                              <TimeAgo
                                date={notif.created_at}
                                style={{ fontSize: 12, color: 'gray' }}
                              />
                            </Grid>
                            <b style={{ fontSize: 15, margin: '5px 0px' }}>{notif.title || notif.value}</b>
                            <p style={{ margin: 0, fontSize: 13 }}>{notif.description.replace(/<[^>]*>?/gm, '').replace('&nbsp;', '')}</p>
                            {/* <Grid dangerouslySetInnerHTML={{ __html: this.state.questionSelected.answer }} /> */}
                          </Grid>
                          <Divider />
                        </Grid>
                      )
                    }
                  </TabPanel>
                </SwipeableViews>


                <Divider />
                <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Grid style={{ color: '#d71149', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40, cursor: 'pointer' }} onClick={_handleMarkAllHasRead}>
                    Tandai semua dibaca
                  </Grid>
                  <Grid style={{ color: '#d71149', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40, cursor: 'pointer' }} onClick={() => {
                    handleClose()
                    props.history.push('/notifikasi')
                  }}>
                    Lihat selengkapnya
                  </Grid>
                </Grid>
                {/* {props.dataNotification.length > 0 &&
                  props.dataNotification.map((notif, index) => {
                    return (
                      notif.link && (
                        <Link
                          to={notif.link}
                          key={index}
                          style={{ textDecoration: "none", color: "black" }}
                          onClick={() => updateStatus(notif.notifications_id)}
                        >
                          <MenuItem
                            onClick={handleClose}
                            style={{
                              backgroundColor: !notif.read
                                ? "#e9e9e9"
                                : "white",
                            }}
                          >
                            <ListItemIcon>
                              {notif.value === "Meeting" ? (
                                <MeetingRoomIcon />
                              ) : notif.value === "Event" ? (
                                <EventIcon />
                              ) : (
                                    <SendIcon />
                                  )}
                            </ListItemIcon>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="body1">
                                New {notif.value} - {notif.description}
                              </Typography>
                              <TimeAgo
                                date={notif.created_at}
                                style={{ fontSize: 12 }}
                              />
                            </div>
                            <Divider />
                          </MenuItem>
                        </Link>
                      )
                    );
                  })} */}
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
              <IconButton onClick={handleDrawerClose} aria-label="close-drawer">
                <ChevronLeftIcon style={{ color: "white" }} />
              </IconButton>
            </div>

            <Divider />

            <List>
              {/* Polanews */}
              <>
                {open ? (
                  <Link
                    to="/polanews"
                    onClick={(event) => handleListItemClick(event, 0)}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <ListItem
                      aria-label="Polanews"
                      button
                      key="Polanews"
                      selected={selectedIndex === 0}
                    >
                      <ListItemIcon>
                        <ImportContactsRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Berita Pola" />
                    </ListItem>
                  </Link>
                ) : (
                  <Link
                    to="/polanews"
                    onClick={(event) => handleListItemClick(event, 0)}
                  >
                    <ListItem
                      aria-label="Polanews"
                      button
                      key="Polanews"
                      selected={selectedIndex === 0}
                    >
                      <ListItemIcon style={{ marginLeft: 8 }}>
                        <ImportContactsRoundedIcon />
                      </ListItemIcon>
                    </ListItem>
                  </Link>
                )}
              </>

              {/* Booking Room */}
              <>
                {open ? (
                  <Link
                    to="/booking-room"
                    onClick={(event) => handleListItemClick(event, 1)}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <ListItem
                      aria-label="Booking Room"
                      button
                      key="Booking Room"
                      selected={
                        selectedIndex === 1 ||
                        selectedIndex === 1.1 ||
                        selectedIndex === 1.2 ||
                        selectedIndex === 1.3
                      }
                    >
                      <ListItemIcon>
                        <MeetingRoomOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Booking Room" />
                    </ListItem>
                  </Link>
                ) : (
                  <Link
                    to="/booking-room"
                    onClick={(event) => handleListItemClick(event, 1)}
                    style={{ textDecoration: "none", fontWeight: "bold" }}
                  >
                    <ListItem
                      aria-label="Booking Room"
                      button
                      key="Booking Room"
                      selected={
                        selectedIndex === 1 ||
                        selectedIndex === 1.1 ||
                        selectedIndex === 1.2 ||
                        selectedIndex === 1.3
                      }
                    >
                      <ListItemIcon style={{ marginLeft: 8 }}>
                        <MeetingRoomOutlinedIcon />
                      </ListItemIcon>
                    </ListItem>
                  </Link>
                )}

                <Collapse
                  in={openChildBookingRoom}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <Link
                      to="/booking-room"
                      onClick={(event) => handleListItemClick(event, 1)}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem
                        aria-label="Daftar pesan ruangan"
                        button
                        className={classes.nested}
                        selected={selectedIndex === 1}
                      >
                        <ListItemText primary="Daftar pesan ruangan" />
                      </ListItem>
                    </Link>
                    {props.isAdminsuper ? (
                      <Link
                        to="/booking-room/room-master"
                        onClick={(event) => handleListItemClick(event, 1.1)}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <ListItem
                          aria-label="Room Master"
                          button
                          className={classes.nested}
                          selected={selectedIndex === 1.1}
                        >
                          <ListItemText primary="Room Master" />
                        </ListItem>
                      </Link>
                    ) : (
                      props.isRoomMaster && (
                        <Link
                          to="/booking-room/room-assistant"
                          onClick={(event) => handleListItemClick(event, 1.2)}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <ListItem
                            aria-label="Room Assistant"
                            button
                            className={classes.nested}
                            selected={selectedIndex === 1.2}
                          >
                            <ListItemText primary="Room Assistant" />
                          </ListItem>
                        </Link>
                      )
                    )}

                    <Link
                      to="/booking-room/rooms"
                      onClick={(event) => handleListItemClick(event, 1.3)}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem
                        aria-label="Gedung"
                        button
                        className={classes.nested}
                        selected={selectedIndex === 1.3}
                      >
                        <ListItemText primary="Gedung & Ruangan" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>
              </>

              {/* Menu Event */}
              <>
                {open ? (
                  props.isAdminsuper ||
                    props.isCreatorMaster ||
                    props.isCreatorAssistant ? (
                    <ListItem
                      aria-label="Event"
                      button
                      key="Event"
                      onClick={(event) => handleClick(event, "openChildEvent")}
                      selected={
                        selectedIndex === 2 ||
                        selectedIndex === 2.1 ||
                        selectedIndex === 2.2 ||
                        selectedIndex === 2.3
                      }
                    >
                      <ListItemIcon>
                        <EventOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Acara" />
                      {openChildEvent ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                  ) : (
                    <Link
                      to="/event"
                      onClick={(event) => handleListItemClick(event, 2)}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem
                        aria-label="Event"
                        button
                        key="Event"
                        selected={
                          selectedIndex === 2 ||
                          selectedIndex === 2.1 ||
                          selectedIndex === 2.2 ||
                          selectedIndex === 2.3
                        }
                      >
                        <ListItemIcon>
                          <EventOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Acara" />
                      </ListItem>
                    </Link>
                  )
                ) : (
                  <Link
                    to="/event"
                    onClick={(event) => handleListItemClick(event, 2)}
                  >
                    <ListItem
                      aria-label="Event"
                      button
                      key="Event"
                      selected={
                        selectedIndex === 2 ||
                        selectedIndex === 2.1 ||
                        selectedIndex === 2.2 ||
                        selectedIndex === 2.3
                      }
                    >
                      <ListItemIcon style={{ marginLeft: 8 }}>
                        <EventOutlinedIcon />
                      </ListItemIcon>
                    </ListItem>
                  </Link>
                )}

                <Collapse in={openChildEvent} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <Link
                      to="/event"
                      onClick={(event) => handleListItemClick(event, 2.1)}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem
                        aria-label="Acara"
                        button
                        className={classes.nested}
                        selected={selectedIndex === 2.1}
                      >
                        <ListItemText primary="Acara" />
                      </ListItem>
                    </Link>
                    {(props.isAdminsuper ||
                      props.isCreatorMaster ||
                      props.isCreatorAssistant) && (
                        <Link
                          to="/event/approval-event"
                          onClick={(event) => handleListItemClick(event, 2.2)}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <ListItem
                            aria-label="Acara disetujui"
                            button
                            className={classes.nested}
                            selected={selectedIndex === 2.2}
                          >
                            <ListItemText primary="Acara disetujui" />
                          </ListItem>
                        </Link>
                      )}
                    {props.isAdminsuper ? (
                      <Link
                        to="/event/creator-master-and-assistant"
                        onClick={(event) => handleListItemClick(event, 2.3)}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <ListItem
                          aria-label="Creator Master"
                          button
                          className={classes.nested}
                          selected={selectedIndex === 2.3}
                        >
                          <ListItemText primary="Creator Master" />
                        </ListItem>
                      </Link>
                    ) : (
                      props.isCreatorMaster && (
                        <Link
                          to="/event/creator-master-and-assistant"
                          onClick={(event) => handleListItemClick(event, 2.3)}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <ListItem
                            aria-label="Creator Assistant"
                            button
                            className={classes.nested}
                            selected={selectedIndex === 2.3}
                          >
                            <ListItemText primary="Creator Assistant" />
                          </ListItem>
                        </Link>
                      )
                    )}
                  </List>
                </Collapse>
              </>

              {/* HR */}
              <>
                {open ? (
                  props.isAdminHR || props.userId === 1 ? (
                    <ListItem
                      aria-label="HR"
                      button
                      key="HR"
                      onClick={(event) => handleClick(event, "openChildHR")}
                      selected={selectedIndex === 3 || selectedIndex === 3.1}
                    >
                      <ListItemIcon>
                        <SupervisorAccountIcon />
                      </ListItemIcon>
                      <ListItemText primary="HR" />
                      {openChildHR ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                  ) : (
                    <Link
                      to="/hr"
                      onClick={(event) => handleListItemClick(event, 3)}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem
                        aria-label="HR"
                        button
                        key="HR"
                        selected={selectedIndex === 3 || selectedIndex === 3.1}
                      >
                        <ListItemIcon>
                          <SupervisorAccountIcon />
                        </ListItemIcon>
                        <ListItemText primary="HR" />
                      </ListItem>
                    </Link>
                  )
                ) : (
                  <Link
                    to="/hr"
                    onClick={(event) => handleListItemClick(event, 3)}
                  >
                    <ListItem
                      aria-label="HR"
                      button
                      key="HR"
                      selected={selectedIndex === 3 || selectedIndex === 3.1}
                    >
                      <ListItemIcon style={{ marginLeft: 8 }}>
                        <SupervisorAccountIcon />
                      </ListItemIcon>
                    </ListItem>
                  </Link>
                )}

                <Collapse in={openChildHR} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <Link
                      to="/hr"
                      onClick={(event) => handleListItemClick(event, 3)}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem
                        aria-label="Pengajuan"
                        button
                        className={classes.nested}
                        selected={selectedIndex === 3}
                      >
                        <ListItemText primary="Pengajuan" />
                      </ListItem>
                    </Link>
                    <Link
                      to="/hr/report"
                      onClick={(event) => handleListItemClick(event, 3.1)}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem
                        aria-label="Report"
                        button
                        className={classes.nested}
                        selected={selectedIndex === 3.1}
                      >
                        <ListItemText primary="Report" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>
              </>

              {/* KPIM */}
              <>
                {open ? (
                  <ListItem
                    aria-label="KPIM"
                    button
                    key="KPIM"
                    onClick={(event) => handleClick(event, "openChildKPIM")}
                    selected={
                      selectedIndex === 4 ||
                      selectedIndex === 4.1 ||
                      selectedIndex === 4.2 ||
                      selectedIndex === 4.3
                    }
                  >
                    <ListItemIcon>
                      <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="KPIM" />
                    {openChildKPIM ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                ) : (
                  <Link
                    to="/kpim"
                    onClick={(event) => handleListItemClick(event, 4)}
                  >
                    <ListItem
                      aria-label="KPIM"
                      button
                      key="KPIM"
                      selected={
                        selectedIndex === 4 ||
                        selectedIndex === 4.1 ||
                        selectedIndex === 4.2 ||
                        selectedIndex === 4.3
                      }
                    >
                      <ListItemIcon style={{ marginLeft: 8 }}>
                        <BarChartIcon />
                      </ListItemIcon>
                    </ListItem>
                  </Link>
                )}
                <Collapse in={openChildKPIM} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <Link
                      to="/kpim"
                      onClick={(event) => handleListItemClick(event, 4)}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem
                        aria-label="Tugasku"
                        button
                        className={classes.nested}
                        selected={selectedIndex === 4}
                      >
                        <ListItemText primary="Tugasku" />
                      </ListItem>
                    </Link>
                    {(isAtasan || props.isAdminsuper || props.isAdminKPIM) && (
                      <>
                        {(isAtasan ||
                          props.isAdminKPIM ||
                          props.isAdminsuper) && (
                            <Link
                              to="/kpim/report"
                              onClick={(event) => handleListItemClick(event, 4.2)}
                              style={{ textDecoration: "none", color: "black" }}
                            >
                              <ListItem
                                aria-label="Laporan"
                                button
                                className={classes.nested}
                                selected={selectedIndex === 4.2}
                              >
                                <ListItemText primary="Laporan" />
                              </ListItem>
                            </Link>
                          )}
                        {isAtasan && (
                          <Link
                            to="/kpim/setting"
                            onClick={(event) => handleListItemClick(event, 4.3)}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <ListItem
                              aria-label="Timku"
                              button
                              className={classes.nested}
                              selected={selectedIndex === 4.3}
                            >
                              <ListItemText primary="Timku" />
                            </ListItem>
                          </Link>
                        )}
                      </>
                    )}
                  </List>
                </Collapse>
              </>

              {/* Menu Helpdesk */}
              <>
                {open ? (
                  <Link
                    to="/helpdesk"
                    onClick={(event) => handleListItemClick(event, 5)}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <ListItem
                      aria-label="Helpdesk"
                      button
                      key="Helpdesk"
                      selected={selectedIndex === 5}
                    >
                      <ListItemIcon>
                        <ContactSupportIcon />
                      </ListItemIcon>
                      <ListItemText primary="Helpdesk" />
                    </ListItem>
                  </Link>
                ) : (
                  <Link
                    to="/helpdesk"
                    onClick={(event) => handleListItemClick(event, 5)}
                  >
                    <ListItem
                      aria-label="Helpdesk"
                      button
                      key="Helpdesk"
                      selected={selectedIndex === 5}
                    >
                      <ListItemIcon style={{ marginLeft: 8 }}>
                        <ContactSupportIcon />
                      </ListItemIcon>
                    </ListItem>
                  </Link>
                )}
              </>

              {/* Menu Setting */}
              <>
                {(props.isAdminsuper ||
                  props.isPIC ||
                  props.isAdminAddress ||
                  props.isAdminStructure ||
                  props.isAdminEmployee ||
                  props.isAdminAdmin) && (
                    <>
                      {open ? (
                        <Link
                          to="/setting"
                          onClick={(event) => handleListItemClick(event, 99)}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <ListItem
                            aria-label="Setting"
                            button
                            key="Setting"
                            selected={selectedIndex === 99}
                          >
                            <ListItemIcon>
                              <SettingsOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Pengaturan" />
                          </ListItem>
                        </Link>
                      ) : (
                        <Link
                          to="/setting"
                          onClick={(event) => handleListItemClick(event, 99)}
                        >
                          <ListItem
                            aria-label="Setting"
                            button
                            key="Setting"
                            selected={selectedIndex === 99}
                          >
                            <ListItemIcon style={{ marginLeft: 8 }}>
                              <SettingsOutlinedIcon />
                            </ListItemIcon>
                          </ListItem>
                        </Link>
                      )}
                    </>
                  )}
              </>
            </List>

            <Divider />

            {/* PROFIL */}
            <>
              {open ? (
                <List>
                  <Link
                    to="/profil"
                    onClick={(event) => handleListItemClick(event, 100)}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <ListItem
                      aria-label="Profil"
                      button
                      key="Profil"
                      selected={selectedIndex === 100}
                    >
                      <ListItemIcon>
                        <PersonOutlineOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Profil" />
                    </ListItem>
                  </Link>
                </List>
              ) : (
                <List>
                  <Link
                    to="/profil"
                    onClick={(event) => handleListItemClick(event, 100)}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <ListItem
                      aria-label="Profil"
                      button
                      key="Profil"
                      selected={selectedIndex === 100}
                    >
                      <ListItemIcon style={{ marginLeft: 8 }}>
                        <MaterialIcon icon="PersonOutlineOutlinedIcon" />
                      </ListItemIcon>
                    </ListItem>
                  </Link>
                </List>
              )}
            </>
          </Drawer>
        </>
      )}
      {/* {
        openModalPemberitahuan && <ModalPemberitahuan open={openModalPemberitahuan} close={() => setOpenModalPemberitahuan(false)} history={props.history} />
      } */}
    </div>
  );
}

const mapDispatchToProps = {
  setUser,
  fetchDataNotification,
  userLogout,
};

const mapStateToProps = ({
  isAdminsuper,
  isRoomMaster,
  isCreatorMaster,
  isCreatorAssistant,
  dataNotification,
  userId,
  dataNewNotif,
  bawahan,
  adminContactCategori,
  ip,
  isPIC,
  isAdminNews,
  isAdminAddress,
  isAdminStructure,
  isAdminEmployee,
  isAdminAdmin,
  isAdminRoom,
  isAdminKPIM,
  isAdminHR,
  isAdminNotification,
}) => {
  return {
    isAdminsuper,
    isRoomMaster,
    isCreatorMaster,
    isCreatorAssistant,
    dataNotification,
    userId,
    dataNewNotif,
    bawahan,
    adminContactCategori,
    ip,
    isPIC,
    isAdminNews,
    isAdminAddress,
    isAdminStructure,
    isAdminEmployee,
    isAdminAdmin,
    isAdminRoom,
    isAdminKPIM,
    isAdminHR,
    isAdminNotification,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Navsidebar));
