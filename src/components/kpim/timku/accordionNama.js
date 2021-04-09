import React, { Component } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

import AccordionRewards from "./accordionRewards";
import AccordionKPI from "./accordionKPI";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Accordion style={{ backgroundColor: "#F4F5F7" }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div
            style={{
              borderRadius: 10,
              padding: 5,
              backgroundColor: "#EAE6FF",
              color: "#403294",
              margin: "auto 0",
            }}
          >
            BPW
          </div>
          &nbsp;
          <Typography style={{ fontWeight: "bold", margin: "auto 0" }}>
            Nama
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: "100%" }}>
            <AccordionRewards />
            <AccordionKPI />
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }
}
