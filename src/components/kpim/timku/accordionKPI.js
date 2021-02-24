import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

import RowDesainOrderForm from "./rowDesainOrderForm";
import RowTAL from "./rowTAL";
import FormKPI from "./formKPI";

export default function Index() {
  const [show, setShow] = useState(false);

  return (
    <Accordion style={{ backgroundColor: "#F4F5F7" }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>KPI: 80</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center">Timeline</TableCell>
                <TableCell align="center">Bobot</TableCell>
                <TableCell align="center">Target</TableCell>
                <TableCell align="center">Pencapaian</TableCell>
                <TableCell align="center" />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <RowTAL />
              <RowDesainOrderForm />
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>

      {show ? (
        <AccordionDetails>
          <FormKPI />
        </AccordionDetails>
      ) : null}

      <AccordionDetails>
        <div onClick={() => setShow(!show)} style={{ cursor: "pointer" }}>
          {show ? "Batal" : "+ KPI Baru"}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
