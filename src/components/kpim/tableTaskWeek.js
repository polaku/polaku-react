import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Backdrop,
  Button,
  Collapse,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Add,
  CalendarToday,
  Clear,
  ExpandMore,
  PlayArrow,
  AccountCircleRounded,
} from "@material-ui/icons";
import React, { Component } from "react";

import FormPerulangan from "../modal/modalFormPerulangan";
import ChatTugasku from "../chat/chatTugasku";

import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";

export default class tableTaskWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      task: "IT",
      when: null,
      time: "",
      open: false,
    };
  }
  render(props) {
    const tasks = [
      {
        value: "TAL",
        backgroundColor: "#D71149",
      },
      {
        value: "IT",
        backgroundColor: "#0EA647",
      },
      {
        value: "Polaku",
        backgroundColor: "#FF0000",
      },
      {
        value: "Desain",
        backgroundColor: "#FFC300",
      },
      {
        value: "Karyawan",
        backgroundColor: "#3100FF",
      },
    ];

    const times = [
      { value: "Senin" },
      { value: "Selasa" },
      { value: "Rabu" },
      { value: "Kamis" },
      { value: "Jumat" },
      { value: "Sabtu" },
      { value: "Minggu" },
      { value: "Perulangan" },
      { value: "Tanggal" },
    ];

    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Minggu 2 (3 Tugas)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Tugas</TableCell>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>Tenggat</TableCell>
                  <TableCell>Bobot</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Pencapaian</TableCell>
                  <TableCell>Perusahaan</TableCell>
                  <TableCell>Waktu</TableCell>
                  <TableCell>Oleh</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span style={{ backgroundColor: "red" }}>&nbsp;</span>&nbsp;
                    Judul design 2
                  </TableCell>
                  <TableCell>
                    <ChatTugasku />
                    {/* <IconButton aria-label="testimoni">
                      <QuestionAnswerOutlinedIcon
                        style={{ color: "#d71149" }}
                      />
                    </IconButton> */}
                  </TableCell>
                  <TableCell>Selasa</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell
                    style={{ backgroundColor: "#BBBBBB", color: "white" }}
                  >
                    Menunggu
                  </TableCell>
                  <TableCell>lorem ipsum</TableCell>
                  <TableCell>lorem ipsum</TableCell>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>
                    <Avatar>HI</Avatar>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span style={{ backgroundColor: "red" }}>&nbsp;</span>&nbsp;
                    Judul design 2
                  </TableCell>
                  <TableCell>
                    <IconButton aria-label="testimoni">
                      <QuestionAnswerOutlinedIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>Selasa</TableCell>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    Selesai
                  </TableCell>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>3'15''</TableCell>
                  <TableCell>
                    <Avatar>
                      <PersonOutlinedIcon />
                    </Avatar>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span style={{ backgroundColor: "#FFC300" }}>&nbsp;</span>
                    &nbsp; Judul design 2
                  </TableCell>
                  <TableCell>
                    <IconButton aria-label="testimoni">
                      <QuestionAnswerOutlinedIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>Selasa</TableCell>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    Selesai
                  </TableCell>
                  <TableCell>
                    <StarBorderIcon /> <StarBorderIcon /> <StarBorderIcon />
                    <StarBorderIcon /> <StarBorderIcon />
                  </TableCell>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>
                    <Avatar style={{ backgroundColor: "transparent" }}>
                      <IconButton
                        aria-label="testimoni"
                        onClick={() =>
                          this.setState({ open: !this.state.open })
                        }
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
                              <Button variant="outlined">Batal</Button>
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>

        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <AccordionDetails>
            <Grid>
              <FormControl>
                <Select
                  style={{
                    marginRight: 40,
                    padding: "0 5px",
                    backgroundColor:
                      this.state.task === "TAL"
                        ? "#D71149"
                        : this.state.task === "IT"
                        ? "#0EA647"
                        : this.state.task === "Polaku"
                        ? "#FF0000"
                        : this.state.task === "Desain"
                        ? "#FFC300"
                        : this.state.task === "Karyawan"
                        ? "#3100FF"
                        : "#D71149",
                    color: "white",
                  }}
                  value={this.state.task}
                  onChange={(event) =>
                    this.setState({ task: event.target.value })
                  }
                >
                  {tasks.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      style={{
                        backgroundColor: option.backgroundColor,
                        margin: 5,
                        color: "white",
                      }}
                    >
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                style={{ marginRight: 40, width: "18rem" }}
                id="standard-basic"
                placeholder="Tugas apa yang ingin Anda kerjakan?"
              />
              <TextField
                style={{ marginRight: 40 }}
                id="standard-select-currency"
                select
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
                value={this.state.time}
                onChange={(event) =>
                  this.setState({ time: event.target.value })
                }
              >
                {times.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                style={{ marginRight: 40 }}
                id="standard-select-currency"
                select
                value=""
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleRounded />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem>A</MenuItem>
              </TextField>
              <IconButton color="success" aria-label="add an alarm">
                <PlayArrow />
              </IconButton>
            </Grid>
          </AccordionDetails>
        </Collapse>

        <AccordionDetails>
          <Button
            variant="contained"
            style={{ backgroundColor: "transparent" }}
            startIcon={!this.state.expanded ? <Add /> : <Clear />}
            onClick={() => this.setState({ expanded: !this.state.expanded })}
            aria-expanded={this.state.expanded}
            aria-label="show more"
          >
            {!this.state.expanded ? "Tugas Baru" : "Batal"}
          </Button>
        </AccordionDetails>

        {this.state.time === "Perulangan" && <FormPerulangan />}
      </Accordion>
    );
  }
}
