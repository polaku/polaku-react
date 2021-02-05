import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import React, { Component } from "react";

export default class backlog extends Component {
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
          <Typography>Backlog</Typography>
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
      </Accordion>
    );
  }
}
