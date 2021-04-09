import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  Input,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Add,
  CalendarToday,
  Clear,
  ExpandMore,
  PlayArrow,
  Business,
} from "@material-ui/icons";
import React, { Component } from "react";

import FormPerulangan from "../modal/modalFormPerulangan";
import ChatTugasku from "../chat/chatTugasku";
import Ulasan from "../modal/modalUlasan";

import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { Autocomplete } from "@material-ui/lab";

export default class tableTaskWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      task: "IT",
      when: null,
      time: "",
      user: "",
      company: "",
      open: false,
    };
  }
  render() {
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

    const users = [
      { value: "User 1" },
      { value: "User 2" },
      { value: "User 3" },
    ];

    const companies = [
      { value: "Company 1" },
      { value: "Company 2" },
      { value: "Company 3" },
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
            <Table aria-label="simple table" size="small">
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
                    <Ulasan />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>

        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <AccordionDetails>
            <form noValidate autoComplete="off">
              <Grid container>
                <Grid item>
                  <FormControl style={{ minWidth: 120 }}>
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
                </Grid>
                <Grid
                  item
                  style={{
                    marginRight: 40,
                  }}
                >
                  <FormControl style={{ width: "20rem" }}>
                    <Input
                      id="my-input"
                      aria-describedby="my-helper-text"
                      placeholder="Tugas apa yang ingin Anda kerjakan?"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <CalendarToday />
                </Grid>
                <Grid
                  item
                  style={{
                    marginRight: 40,
                  }}
                >
                  <TextField
                    id="standard-select-currency"
                    select
                    value={this.state.time}
                    onChange={(event) =>
                      this.setState({ time: event.target.value })
                    }
                    style={{ width: 90 }}
                  >
                    {times.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item>
                  <PersonOutlinedIcon />
                </Grid>
                <Grid
                  item
                  style={{
                    marginRight: 40,
                  }}
                >
                  <Autocomplete
                    id="combo-box-demo"
                    options={users}
                    getOptionLabel={(option) => option.value}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item>
                  <Business />
                </Grid>
                <Grid
                  item
                  style={{
                    marginRight: 40,
                  }}
                >
                  <TextField
                    id="standard-select-currency"
                    select
                    value={this.state.company}
                    onChange={(event) =>
                      this.setState({ company: event.target.value })
                    }
                    style={{ width: 90 }}
                  >
                    {companies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    style={{
                      backgroundColor: "transparent",
                      maxWidth: "30px",
                      minWidth: "30px",
                    }}
                  >
                    <PlayArrow />
                  </Button>
                </Grid>
              </Grid>
            </form>
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
