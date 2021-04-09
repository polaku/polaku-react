import React, { useState } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import { Button, Grid, makeStyles } from "@material-ui/core";

import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

import ModalKPI from "../../modal/modalKPI";

const useStyles = makeStyles(() => ({
  namaKPI: { height: "100%", border: 0, background: "transparent" },
  bobotKPI: {
    border: "1px solid red",
    width: 70,
    backgroundColor: "transparent",
    height: "100%",
  },
}));

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Index() {
  const classes = useStyles();

  const [selected1, setSelected1] = useState(0);
  const [selected2, setSelected2] = useState(0);

  const nextMonth1 = () => {
    if (selected1 === months.length - 1) return;

    setSelected1((prev) => {
      return prev + 1;
    });
  };

  const prevMonth1 = () => {
    if (selected1 === 0) return;

    setSelected1((prev) => {
      return prev - 1;
    });
  };

  const nextMonth2 = () => {
    if (selected2 === months.length - 1) return;

    setSelected2((prev) => {
      return prev + 1;
    });
  };

  const prevMonth2 = () => {
    if (selected2 === 0) return;

    setSelected2((prev) => {
      return prev - 1;
    });
  };
  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          <span style={{ backgroundColor: "#0011FF" }}>&nbsp;</span>
          <input
            type="text"
            placeholder="Apa yang ingin diukur?"
            className={classes.namaKPI}
          />
        </TableCell>
        <TableCell align="center">
          <Grid style={{ backgroundColor: "grey" }}>
            <Button onClick={prevMonth1}>
              <KeyboardArrowLeft />
            </Button>
            <input
              type="text"
              value={months[selected1]}
              style={{ width: 30, backgroundColor: "transparent", border: 0 }}
              disabled
            />
            <Button onClick={nextMonth1}>
              <KeyboardArrowRight />
            </Button>
            -
            <Button onClick={prevMonth2}>
              <KeyboardArrowLeft />
            </Button>
            <input
              type="text"
              value={months[selected2]}
              style={{ width: 30, backgroundColor: "transparent", border: 0 }}
              disabled
            />
            <Button onClick={nextMonth2}>
              <KeyboardArrowRight />
            </Button>
          </Grid>
        </TableCell>
        <TableCell align="center">
          <input type="text" className={classes.bobotKPI} />
        </TableCell>
        <TableCell align="center">
          <ModalKPI />
        </TableCell>
        <TableCell align="center">
          <Button size="small">
            <img src="/SubmitIcon.png" alt="Submit Icon" />
          </Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
