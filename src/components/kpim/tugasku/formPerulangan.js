import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";

export default class formPerulangan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }
  render() {
    return (
      <>
        <Button variant="outlined" color="primary" onClick={this.state.open}>
          Open form dialog
        </Button>
        <Dialog
          open={this.state.open}
          onClose={() => this.setState({ open: !this.state.open })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ open: !this.state.open })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => this.setState({ open: !this.state.open })}
              color="primary"
            >
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
