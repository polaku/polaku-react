import {
  Avatar,
  Backdrop,
  Button,
  Fade,
  Grid,
  IconButton,
  Modal,
  TextareaAutosize,
} from "@material-ui/core";
import React, { Component } from "react";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  render(props) {
    return (
      <Avatar style={{ backgroundColor: "transparent" }}>
        <IconButton
          aria-label="testimoni"
          onClick={() => this.setState({ open: !this.state.open })}
        >
          <ModeCommentOutlinedIcon />
        </IconButton>
        <Modal
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Fade in={this.state.open}>
            <div
              style={{
                backgroundColor: "white",
                boxShadow:
                  "0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%)",
                padding: "16px 32px 24px",
              }}
            >
              <h2 id="transition-modal-title">Ulasan</h2>
              <p id="transition-modal-description">
                Terima kasih atas penilaiannya
              </p>
              <TextareaAutosize
                aria-label="minimum height"
                rowsMin={5}
                style={{ width: "20rem" }}
                placeholder="Berikan ulasan untuk kinerjanya"
              />
              <Grid>
                <Button
                  variant="outlined"
                  onClick={() => this.setState({ open: false })}
                >
                  Batal
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    marginLeft: "5px",
                  }}
                >
                  Kirim
                </Button>
              </Grid>
            </div>
          </Fade>
        </Modal>
      </Avatar>
    );
  }
}
