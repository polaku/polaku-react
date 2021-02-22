import {
  Button,
  FormControl,
  Grid,
  Input,
  MenuItem,
  TextField,
} from "@material-ui/core";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  PlayArrow,
  TrackChanges,
} from "@material-ui/icons";
import React, { useState } from "react";

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

const targets = [
  {
    value: "1",
  },
  {
    value: "2",
  },
  {
    value: "3",
  },
];
export default function Index() {
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

  const [target, setTarget] = useState("");

  const handleChange = (event) => {
    setTarget(event.target.value);
  };
  return (
    <form noValidate autoComplete="off">
      <Grid container>
        <Grid item style={{ backgroundColor: "#0011FF", marginRight: 5 }}>
          &nbsp;
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
              placeholder="Apa yang ingin diukur?"
            />
          </FormControl>
        </Grid>
        <Grid
          item
          style={{ marginRight: 40, backgroundColor: "grey", paddingTop: 5 }}
        >
          <Button onClick={prevMonth1} style={{ padding: 0, minWidth: 37 }}>
            <KeyboardArrowLeft />
          </Button>
          <TextField
            id="standard-basic"
            placeholder="adsdae"
            value={months[selected1]}
            style={{ width: 45 }}
            disabled
            inputProps={{ style: { textAlign: "center" } }}
          />
          <Button onClick={nextMonth1} style={{ padding: 0, minWidth: 37 }}>
            <KeyboardArrowRight />
          </Button>
          -
          <Button onClick={prevMonth2} style={{ padding: 0, minWidth: 37 }}>
            <KeyboardArrowLeft />
          </Button>
          <TextField
            id="standard-basic"
            placeholder="adsdae"
            value={months[selected2]}
            style={{ width: 45 }}
            disabled
            inputProps={{ style: { textAlign: "center" } }}
          />
          <Button onClick={nextMonth2} style={{ padding: 0, minWidth: 37 }}>
            <KeyboardArrowRight />
          </Button>
        </Grid>
        <Grid
          item
          style={{
            marginRight: 40,
          }}
        >
          <input
            type="text"
            style={{
              border: "1px solid red",
              height: 30,
              width: 70,
              backgroundColor: "transparent",
            }}
            placeholder="Bobot"
          />
        </Grid>
        <Grid item>
          <TrackChanges />
          &nbsp;
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
            value={target}
            onChange={handleChange}
            style={{ color: "#06BF69" }}
          >
            {targets.map((option) => (
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
              color: "#06BF69",
            }}
          >
            <PlayArrow />
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
