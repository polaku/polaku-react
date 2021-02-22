import React, { Component } from "react";

import { Button, Grid, Paper } from "@material-ui/core";

import "react-circular-progressbar/dist/styles.css";

import NavTugasku from "../../components/navigation/navTugasku";
import AccordionNama from "../../components/kpim/timku/accordionNama";

export default class TAL extends Component {
  render() {
    return (
      <Grid>
        <Grid>
          <NavTugasku />
          <Grid container spacing={1}>
            <Grid item>
              <Button style={{ backgroundColor: "#FFE5E5", color: "#D71149" }}>
                KPI
              </Button>
            </Grid>
            <Grid item>
              <Button style={{ backgroundColor: "#FFE5E5", color: "#D71149" }}>
                TAL
              </Button>
            </Grid>
            <Grid item>
              <Button style={{ backgroundColor: "#FFE5E5", color: "#D71149" }}>
                R & C
              </Button>
            </Grid>
          </Grid>
          <br />
          <AccordionNama />
        </Grid>
      </Grid>
    );
  }
}
