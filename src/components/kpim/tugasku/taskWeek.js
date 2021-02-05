import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Collapse,
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
} from "@material-ui/icons";
import React, { Component } from "react";

import FormPerulangan from "./formPerulangan";

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
                  <TableCell align="right">Tenggat</TableCell>
                  <TableCell align="right">Bobot</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Pencapaian</TableCell>
                  <TableCell align="right">Perusahaan</TableCell>
                  <TableCell align="right">Waktu</TableCell>
                  <TableCell align="right">Oleh</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Judul design 2
                  </TableCell>
                  <TableCell align="right">Selasa</TableCell>
                  <TableCell align="right">10%</TableCell>
                  <TableCell align="right">Menunggu</TableCell>
                  <TableCell align="right">lorem ipsum</TableCell>
                  <TableCell align="right">lorem ipsum</TableCell>
                  <TableCell align="right">3'15''</TableCell>
                  <TableCell align="right">lorem ipsum</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>

        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TextField id="standard-basic" label="Tugas" />
                    </TableCell>

                    <TableCell align="right">
                      <TextField
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
                        style={{ width: 100 }}
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
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        id="standard-select-currency"
                        select
                        label="Oleh"
                        style={{ width: 100 }}
                      >
                        <MenuItem>A</MenuItem>
                        <MenuItem>A</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="success" aria-label="add an alarm">
                        <PlayArrow />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
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
