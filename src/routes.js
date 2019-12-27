import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Login from "./views/Login";
import BookingRoom from "./views/Facility/BookingRoom";
import CreateBookingRoom from "./views/Facility/CreateBookingRoom";
import AssignRoomMaster from "./views/Facility/AssignRoomMaster";
import RoomAssistant from "./views/Facility/RoomAssistant";
import RoomMaster from "./views/Facility/RoomMaster";
import Rooms from "./views/Facility/Rooms";
import Event from "./views/Event/Event";
import ApprovalEvent from "./views/Event/ApprovalEvent";
import CreatorMasterAndAssistant from "./views/Event/CreatorMasterAndAssistant";
import DetailEvent from "./views/Event/DetailEvent";
import Setting from './views/Setting/Setting';
import SettingPerusahaan from './views/Setting/SettingPerusahaan';
import HR from './views/HR/HR';
import ReportIjin from './views/HR/ReportIjin';

const useStyles = makeStyles(theme => ({
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

function Routes(){
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
        <Route path="/login" component={Login} />
        <AuthenticatedRoute path="/bookingRoom/roomMaster/assignRoomMaster" component={AssignRoomMaster} />
        <AuthenticatedRoute path="/bookingRoom/roomMaster" component={RoomMaster} />
        <AuthenticatedRoute path="/bookingRoom/roomAssistant" component={RoomAssistant} />
        <AuthenticatedRoute path="/bookingRoom/createbookingRoom" component={CreateBookingRoom} />
        <AuthenticatedRoute path="/bookingRoom/rooms" component={Rooms} />
        <AuthenticatedRoute path="/bookingRoom" component={BookingRoom} />
        <AuthenticatedRoute path="/event/detailEvent/:id" component={DetailEvent} />
        <AuthenticatedRoute path="/event/creatorMasterAndAssistant" component={CreatorMasterAndAssistant} />
        <AuthenticatedRoute path="/event/approvalEvent" component={ApprovalEvent} />
        <AuthenticatedRoute path="/event" component={Event} />
        <AuthenticatedRoute path="/setting/settingPerusahaan" component={SettingPerusahaan} />
        <AuthenticatedRoute path="/setting" component={Setting} />
        <AuthenticatedRoute path="/hr/reportIjin" component={ReportIjin} />
        <AuthenticatedRoute path="/hr" component={HR} />
        <Redirect from="/" to="/login" />
      </Switch>
    </main>
  );
}

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("token") ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: "/",
            state: { from: props.location }
          }} />
        )
    }
  />
)

export default Routes;
