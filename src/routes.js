import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';

import Login from "./views/Login";
import BookingRoom from "./views/Facility/BookingRoom";
import CreateBookingRoom from "./views/Facility/CreateBookingRoom";
import AssignRoomMaster from "./views/Facility/AssignRoomMaster";
import AssignRoomAssistant from "./views/Facility/AssignRoomAssistant";
import RoomMaster from "./views/Facility/RoomMaster";
import Rooms from "./views/Facility/Rooms";
import Event from "./views/Event/Event";
import ApprovalEvent from "./views/Event/ApprovalEvent";
import CreatorMasterAndAssistant from "./views/Event/CreatorMasterAndAssistant";
import DetailEvent from "./views/Event/DetailEvent";
import Setting from './views/Setting/Setting';
import SettingPerusahaan from './views/Setting/SettingPerusahaan';
import StepperOnboarding from './views/Setting/StepperOnboarding';
import SettingUser from './views/Setting/SettingUser';
import SettingMeetingRoom from './views/Setting/SettingMeetingRoom';
import AddMeetingRoom from './views/Setting/AddMeetingRoom';
import AddAddress from './views/Setting/AddAddress';
import AddDepartment from './views/Setting/AddDepartment';
import AddEmployee from './views/Setting/AddEmployee';
import AddService from './views/Setting/AddService';
import AddAdmin from './views/Setting/AddAdmin';
import SettingKeamanan from './views/Setting/SettingKeamanan';
import HR from './views/HR/HR';
import ReportIjin from './views/HR/ReportIjin';
import KPIM from './views/KPIM/DashboardKPIM';
import TAL from './views/KPIM/TAL';
import ReportKPIM from './views/KPIM/ReportKPIM';
import SettingKPIM from './views/KPIM/SettingKPIM';
import Profil from './views/Profil';
import Polanews from './views/Polanews/Polanews';
import Helpdesk from './views/Helpdesk/Index';
import DetailTopics from './views/Helpdesk/DetailTopics';
import ForgetPassword from './views/ForgetPassword';

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

function Routes() {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/forget-password" component={ForgetPassword} />
        <AuthenticatedRoute path="/booking-room/room-master/assign-room-master" component={AssignRoomMaster} />
        <AuthenticatedRoute path="/booking-room/room-master" component={RoomMaster} />
        <AuthenticatedRoute path="/booking-room/room-assistant" component={AssignRoomAssistant} />
        <AuthenticatedRoute path="/booking-room/create-booking-room" component={CreateBookingRoom} />
        <AuthenticatedRoute path="/booking-room/rooms" component={Rooms} />
        <AuthenticatedRoute path="/booking-room" component={BookingRoom} />
        <AuthenticatedRoute path="/event/detail-event/:id" component={DetailEvent} />
        <AuthenticatedRoute path="/event/creator-master-and-assistant" component={CreatorMasterAndAssistant} />
        <AuthenticatedRoute path="/event/approval-event" component={ApprovalEvent} />
        <AuthenticatedRoute path="/event" component={Event} />
        <AuthenticatedRoute path="/setting/setting-perusahaan/stepper-onboarding" component={StepperOnboarding} />
        <AuthenticatedRoute path="/setting/setting-perusahaan/add-address" component={AddAddress} />
        <AuthenticatedRoute path="/setting/setting-perusahaan/add-department" component={AddDepartment} />
        <AuthenticatedRoute path="/setting/setting-perusahaan/add-employee" component={AddEmployee} />
        <AuthenticatedRoute path="/setting/setting-perusahaan/add-service" component={AddService} />
        <AuthenticatedRoute path="/setting/setting-perusahaan/add-admin" component={AddAdmin} />
        <AuthenticatedRoute path="/setting/setting-perusahaan" component={SettingPerusahaan} />
        <AuthenticatedRoute path="/setting/setting-user" component={SettingUser} />
        <AuthenticatedRoute path="/setting/setting-meeting-room/add-meeting-room" component={AddMeetingRoom} />
        <AuthenticatedRoute path="/setting/setting-meeting-room" component={SettingMeetingRoom} />
        <AuthenticatedRoute path="/setting/setting-keamanan" component={SettingKeamanan} />
        <AuthenticatedRoute path="/setting" component={Setting} />
        <AuthenticatedRoute path="/hr/report" component={ReportIjin} />
        <AuthenticatedRoute path="/hr" component={HR} />
        <AuthenticatedRoute path="/kpim/setting" component={SettingKPIM} />
        <AuthenticatedRoute path="/kpim/report" component={ReportKPIM} />
        <AuthenticatedRoute path="/kpim/tal" component={TAL} />
        <AuthenticatedRoute path="/kpim" component={KPIM} />
        <AuthenticatedRoute path="/profil" component={Profil} />
        <AuthenticatedRoute path="/polanews" component={Polanews} />
        <AuthenticatedRoute path="/helpdesk/detail/:id" component={DetailTopics} />
        <AuthenticatedRoute path="/helpdesk" component={Helpdesk} />
        <Redirect from="/" to="/login" />
      </Switch>
    </main>
  );
}

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Cookies.get('POLAGROUP') ? (
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
