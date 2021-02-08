import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
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
  AccountCircleRounded,
} from "@material-ui/icons";
import React, { Component } from "react";

import FormPerulangan from "./formPerulangan";

import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";

export default class taskWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }
  render() {
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
                  <TableCell></TableCell>
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
                  <TableCell component="th" scope="row">
                    Judul design 2
                  </TableCell>
                  <TableCell>
                    <QuestionAnswerOutlinedIcon />
                  </TableCell>
                  <TableCell>Selasa</TableCell>
                  <TableCell>10%</TableCell>
                  <TableCell
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    Menunggu
                  </TableCell>
                  <TableCell>lorem ipsum</TableCell>
                  <TableCell>lorem ipsum</TableCell>
                  <TableCell>3'15''</TableCell>
                  <TableCell>lorem ipsum</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>

        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <AccordionDetails>
            <Grid>
              <TextField
                style={{ marginRight: 20 }}
                id="standard-basic"
                label="Tugas"
              />
              <TextField
                style={{ marginRight: 20 }}
                id="standard-select-currency"
                select
                label={" "}
                value=""
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem>Senin</MenuItem>
                <MenuItem>Selasa</MenuItem>
                <MenuItem>Rabu</MenuItem>
                <MenuItem>Kamis</MenuItem>
                <MenuItem>Jumat</MenuItem>
                <MenuItem>Sabtu</MenuItem>
                <MenuItem>Minggu</MenuItem>
                <FormPerulangan />
                <MenuItem>Tanggal</MenuItem>
              </TextField>
              <TextField
                style={{ marginRight: 20 }}
                id="standard-select-currency"
                select
                label={" "}
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
      </Accordion>
    );
  }
}
