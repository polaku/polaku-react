import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';

const Login = lazy(() => import('./views/Login'));
const BookingRoom = lazy(() => import('./views/Facility/BookingRoom'));
const CreateBookingRoom = lazy(() => import('./views/Facility/CreateBookingRoom'));
const AssignRoomMaster = lazy(() => import('./views/Facility/AssignRoomMaster'));
const AssignRoomAssistant = lazy(() => import('./views/Facility/AssignRoomAssistant'));
const RoomMaster = lazy(() => import('./views/Facility/RoomMaster'));
const Rooms = lazy(() => import('./views/Facility/Rooms'));
const Event = lazy(() => import('./views/Event/Event'));
const ApprovalEvent = lazy(() => import('./views/Event/ApprovalEvent'));
const CreatorMasterAndAssistant = lazy(() => import('./views/Event/CreatorMasterAndAssistant'));
const DetailEvent = lazy(() => import('./views/Event/DetailEvent'));
const Setting = lazy(() => import('./views/Setting/Setting'));
const SettingPerusahaan = lazy(() => import('./views/Setting/SettingPerusahaan'));
const StepperOnboarding = lazy(() => import('./views/Setting/StepperOnboarding'));
const SettingUser = lazy(() => import('./views/Setting/SettingUser'));
const SettingMeetingRoom = lazy(() => import('./views/Setting/SettingMeetingRoom'));
const AddMeetingRoom = lazy(() => import('./views/Setting/AddMeetingRoom'));
const AddAddress = lazy(() => import('./views/Setting/AddAddress'));
const AddDepartment = lazy(() => import('./views/Setting/AddDepartment'));
const AddEmployee = lazy(() => import('./views/Setting/AddEmployee'));
const AddService = lazy(() => import('./views/Setting/AddService'));
const AddAdmin = lazy(() => import('./views/Setting/AddAdmin'));
const SettingKeamanan = lazy(() => import('./views/Setting/SettingKeamanan'));
const HR = lazy(() => import('./views/HR/HR'));
const ReportIjin = lazy(() => import('./views/HR/ReportIjin'));
// import KPIM from './views/KPIM/DashboardKPIM';
// const KPIM = lazy(() => import('./views/KPIM/DashboardKPIM-backup'));
const KPIM = lazy(() => import('./backup/DashboardKPIM-backup'));
// const TAL = lazy(() => import('./views/KPIM/TAL'));
const TAL = lazy(() => import('./backup/TAL-backup'));
const ReportKPIM = lazy(() => import('./views/KPIM/ReportKPIM'));
const SettingKPIM = lazy(() => import('./views/KPIM/SettingKPIM'));
const Profil = lazy(() => import('./views/Profil'));
const Polanews = lazy(() => import('./views/Polanews/Polanews'));
const Helpdesk = lazy(() => import('./views/Helpdesk/Index'));
const DetailTopics = lazy(() => import('./views/Helpdesk/DetailTopics'));
const ForgetPassword = lazy(() => import('./views/ForgetPassword'));
const ResetPassword = lazy(() => import('./views/ResetPassword'));


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
      <Suspense fallback={<></>}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/reset-password/:token" component={ResetPassword} />
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
          <AuthenticatedRoute path="/helpdesk/detail/:id/sub-topics/:idSub/question/:idQuestion" component={DetailTopics} />
          <AuthenticatedRoute path="/helpdesk/detail/:id/sub-topics/:idSub" component={DetailTopics} />
          <AuthenticatedRoute path="/helpdesk/detail/:id" component={DetailTopics} />
          <AuthenticatedRoute path="/helpdesk" component={Helpdesk} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Suspense>
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
