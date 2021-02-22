import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import {
  Button,
  Grid,
  LinearProgress,
  Menu,
  MenuItem,
} from "@material-ui/core";

import FormDesainOrderForm from "./formDesainOrderForm";
import { QuestionAnswerOutlined } from "@material-ui/icons";

export default function Index() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          <span style={{ backgroundColor: "red" }}>&nbsp;</span>
          &nbsp;&nbsp;TAL: 80
          <LinearProgress variant="determinate" />
        </TableCell>
        <TableCell align="center">
          <Grid style={{ backgroundColor: "grey" }}>Jan - Dec</Grid>
        </TableCell>
        <TableCell align="center">80%</TableCell>
        <TableCell align="center">100</TableCell>
        <TableCell align="center">lorem ipsum</TableCell>
        <TableCell align="center">
          <Button aria-controls="simple-menu" aria-haspopup="true">
            ...
          </Button>
        </TableCell>
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell align="center">Tenggat</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Bobot</TableCell>
                    <TableCell align="center">Pencapaian</TableCell>
                    <TableCell align="center">Perusahaan</TableCell>
                    <TableCell align="center">Waktu</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <span style={{ backgroundColor: "red" }}>&nbsp;</span>
                      &nbsp; TAL: 80%
                    </TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="testimoni">
                        <QuestionAnswerOutlined />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">Selasa</TableCell>
                    <TableCell
                      align="center"
                      style={{ backgroundColor: "grey", color: "white" }}
                    >
                      Menunggu
                    </TableCell>
                    <TableCell align="center">
                      <Grid style={{ border: "1px solid red" }}>&nbsp;</Grid>
                    </TableCell>
                    <TableCell align="center">lorem ipsum</TableCell>
                    <TableCell align="center">PIP</TableCell>
                    <TableCell align="center">23J 14M</TableCell>
                    <TableCell align="center">
                      <Button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        ...
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <Grid style={{ marginLeft: 8, color: "grey" }}>
                          Aksi
                        </Grid>
                        <MenuItem onClick={handleClose}>Hapus</MenuItem>
                        <MenuItem onClick={handleClose}>Duplikat</MenuItem>
                        <Grid style={{ marginLeft: 8, color: "grey" }}>
                          Pindah
                        </Grid>
                        <MenuItem onClick={handleClose}>Paling Atas</MenuItem>
                        <MenuItem onClick={handleClose}>Paling Bawah</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Grid>
                {show ? (
                  <>
                    <br />
                    <FormDesainOrderForm />
                  </>
                ) : null}
              </Grid>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShow(!show)}
              >
                {show ? "Batal" : "+ TAL Baru"}
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
