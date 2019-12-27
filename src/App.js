import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from './store'

// core components
import Navsidebar from "./components/navsidebar";

import { makeStyles } from '@material-ui/core/styles';

import Routes from './routes';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <Router>
        <div className={classes.root}>
          <Navsidebar />
          <Routes />
        </div>
      </Router>
    </Provider>
  )
}

export default App;
