import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import store from './store'

// core components
import Navsidebar from "./components/navsidebar";

import Login from "./views/Login";
import BookingRoom from "./views/BookingRoom/BookingRoom";
import CreateBookingRoom from "./views/BookingRoom/CreateBookingRoom";
import AssignRoomMaster from "./views/BookingRoom/AssignRoomMaster";
import RoomAssistant from "./views/BookingRoom/RoomAssistant";
import RoomMaster from "./views/BookingRoom/RoomMaster";
import Rooms from "./views/BookingRoom/Rooms";
import Event from "./views/Event/Event";
import ApprovalEvent from "./views/Event/ApprovalEvent";
import CreatorMasterAndAssistant from "./views/Event/CreatorMasterAndAssistant";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <Router>
        <div className={classes.root}>
          <Navsidebar />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/bookingRoom/roomMaster/assignRoomMaster" component={AssignRoomMaster} />
              <Route path="/bookingRoom/roomMaster" component={RoomMaster} />
              <Route path="/bookingRoom/roomAssistant" component={RoomAssistant} />
              <Route path="/bookingRoom/createbookingRoom" component={CreateBookingRoom} />
              <Route path="/bookingRoom/rooms" component={Rooms} />
              <Route path="/bookingRoom" component={BookingRoom} />
              <Route path="/event/CreatorMasterAndAssistant" component={CreatorMasterAndAssistant} />
              <Route path="/event/approvalEvent" component={ApprovalEvent} />
              <Route path="/event" component={Event} />
              <Redirect from="/" to="/bookingRoom" />
            </Switch>
          </main>
        </div>
      </Router>
    </Provider>
  )
}

export default App;
