import {
  Button,
  FormControl,
  Grid,
  Input,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { CalendarToday, PlayArrow, Business } from "@material-ui/icons";
import React, { Component } from "react";

export default class Index extends Component {
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
    const times = [
      { value: "Senin" },
      { value: "Selasa" },
      { value: "Rabu" },
      { value: "Kamis" },
      { value: "Jumat" },
      { value: "Sabtu" },
      { value: "Minggu" },
      { value: "Pengulangan" },
      { value: "Tanggal" },
    ];

    const companies = [
      { value: "Company 1" },
      { value: "Company 2" },
      { value: "Company 3" },
    ];
    return (
      <form noValidate autoComplete="off">
        <Grid container>
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
                placeholder="Apa yang perlu dikerjakan?"
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
              onChange={(event) => this.setState({ time: event.target.value })}
              style={{ width: 90 }}
            >
              {times.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            style={{
              marginRight: 40,
            }}
          >
            <FormControl style={{ width: "10rem", border: "1px solid red" }}>
              <Input
                id="my-input"
                aria-describedby="my-helper-text"
                placeholder="Bobot"
              />
            </FormControl>
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
    );
  }
}
