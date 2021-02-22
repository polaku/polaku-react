import React, { useEffect } from "react";
import clsx from "clsx";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Cookies from "js-cookie";

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
  MenuItem,
  // Icon
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MeetingRoomOutlinedIcon from "@material-ui/icons/MeetingRoomOutlined";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import SendIcon from "@material-ui/icons/Send";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import EventIcon from "@material-ui/icons/Event";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import BarChartIcon from "@material-ui/icons/BarChart";
import ImportContactsRoundedIcon from "@material-ui/icons/ImportContactsRounded";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";

import { setUser, fetchDataNotification, userLogout } from "../store/action";
import { API } from "../config/API";

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

function Navsidebar(props) {
  // const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openChildBookingRoom, setOpenChildBookingRoom] = React.useState(false);
  const [openChildEvent, setOpenChildEvent] = React.useState(false);
  const [openChildHR, setOpenChildHR] = React.useState(false);
  const [openChildKPIM, setOpenChildKPIM] = React.useState(false);
  const [isAtasan, setIsAtasan] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

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
            // ip: ip || null
          },
        })
          .then(async ({ data }) => {
            // console.log(data)
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
              // ip: props.ip
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
              isAdminHelpdesk = false;

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

            if (data.role_id === 1) {
              newData.isAdminsuper = true;
            } else {
              newData.isAdminsuper = false;
            }

            if (data.adminContactCategori) {
              newData.adminContactCategori = data.adminContactCategori;
            }
            await props.setUser(newData);
            await props.fetchDataNotification();
          })
          .catch((err) => {
            // console.log(err)
            Cookies.remove("POLAGROUP");
            // props.userLogout()
            props.history.push("/login");
          });
      } else {
        props.history.push("/login");
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
      if (props.isAdminKPIM || props.isAdminsuper) {
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
        await props.fetchDataNotification();
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
      .then(async (data) => {})
      .catch((err) => {
        swal("please try again");
      });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      {Cookies.get("POLAGROUP") && (
        <>
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
                <img
                  src={process.env.PUBLIC_URL + "/polagroup.png"}
                  alt="Logo"
                  style={{ width: 175, maxHeight: 50 }}
                />
              </div>
              <IconButton color="inherit" onClick={handleClickNotif}>
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
                    maxHeight: 48 * 4.5,
                    width: 350,
                    marginTop: 50,
                    borderRadius: 5,
                  },
                }}
              >
                {props.dataNotification.length > 0 &&
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
                  })}
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
                  // (props.isAdminsuper || props.isRoomMaster || props.isAdminRoom)
                  //   ? <ListItem button key="Facility"
                  //     onClick={event => handleClick(event, 'openChildBookingRoom')} selected={selectedIndex === 1 || selectedIndex === 1.1 || selectedIndex === 1.2 || selectedIndex === 1.3}>
                  //     <ListItemIcon>
                  //       <MeetingRoomOutlinedIcon />
                  //     </ListItemIcon>
                  //     <ListItemText primary="Fasilitas" />
                  //     {openChildBookingRoom ? <ExpandLess /> : <ExpandMore />}
                  //   </ListItem>
                  //   : <Link to="/booking-room" onClick={event => handleListItemClick(event, 1)} style={{ textDecoration: "none", color: 'black' }}>
                  //     <ListItem button key="Booking Room" selected={selectedIndex === 1 || selectedIndex === 1.1 || selectedIndex === 1.2 || selectedIndex === 1.3}>
                  //       <ListItemIcon>
                  //         <MeetingRoomOutlinedIcon />
                  //       </ListItemIcon>
                  //       <ListItemText primary="Booking Room" />
                  //     </ListItem>
                  //   </Link>

                  <Link
                    to="/booking-room"
                    onClick={(event) => handleListItemClick(event, 1)}
                    style={{ textDecoration: "none", fontWeight: "bold" }}
                  >
                    <ListItem
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
                  // ? Number(props.adminContactCategori) === 4 || props.userId === 1
                  props.isAdminHR || props.userId === 1 ? (
                    <ListItem
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
                        button
                        className={classes.nested}
                        selected={selectedIndex === 4}
                      >
                        <ListItemText primary="Tugasku" />
                      </ListItem>
                    </Link>
                    <Link
                      to="/kpim/tal"
                      onClick={(event) => handleListItemClick(event, 4.1)}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem
                        button
                        className={classes.nested}
                        selected={selectedIndex === 4.1}
                      >
                        <ListItemText primary="Timku" />
                      </ListItem>
                    </Link>
                    {(isAtasan || props.isAdminsuper) && (
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
                              button
                              className={classes.nested}
                              selected={selectedIndex === 4.2}
                            >
                              <ListItemText primary="Laporan" />
                            </ListItem>
                          </Link>
                        )}
                        {!props.isAdminsuper && (
                          <Link
                            to="/kpim/setting"
                            onClick={(event) => handleListItemClick(event, 4.3)}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <ListItem
                              button
                              className={classes.nested}
                              selected={selectedIndex === 4.3}
                            >
                              <ListItemText primary="Pengaturan KPIM" />
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
                      button
                      key="Profil"
                      selected={selectedIndex === 100}
                    >
                      <ListItemIcon style={{ marginLeft: 8 }}>
                        <MaterialIcon icon="PersonOutlineOutlinedIcon" />
                        {/* <PersonOutlineOutlinedIcon /> */}
                      </ListItemIcon>
                    </ListItem>
                  </Link>
                </List>
              )}
            </>
          </Drawer>
        </>
      )}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Navsidebar));
