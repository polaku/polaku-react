import React from "react";
// import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// import store from './store'

// core components
import Admin from "./layouts/Admin.js";
import Login from "./views/Login"

// import "assets/css/material-dashboard-react.css?v=1.8.0";

function App() {
  return (
  // <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/login" component={Login} />
        <Redirect from="/" to="/admin" />
      </Switch>
    </Router>
  // </Provider>
  )
}

export default App;
