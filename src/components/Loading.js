import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import {CircularProgress, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

export default function SimpleBackdrop(props) {
  const classes = useStyles();

  return (
    <div>
      <Backdrop className={classes.backdrop} open={props.loading}>
        <Paper style={{width: 100, height: 100, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent:' center', borderRadius: 10 }}>
          <CircularProgress color="secondary" />
        </Paper>
      </Backdrop>
    </div>
  );
}
