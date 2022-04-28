import React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  // Collapse,
  FormControl,
  Grid,
  // IconButton,
  Input,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Popover,
} from "@material-ui/core";
import {
  Add,
  CalendarToday,
  Clear,
  ExpandMore,
  PlayArrow,
  Business,
  DeleteForever,
} from "@material-ui/icons";

export default function CardEmployee() {
  return (
    <Accordion style={{ backgroundColor: '#f4f5f7', marginTop: 30 }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        style={{ display: 'flex', alignItems: 'center', padding: 0, paddingLeft: 15, paddingRight: 15, margin: 0 }}
      >
        <Grid style={{ display: 'flex', alignItems: 'center', paddingLeft: 20, margin: 0 }}>
          <Typography style={{ fontWeight: 'bold' }}>Minggu Name</Typography>
          <p style={{ margin: 0, fontSize: 12, color: 'gray', marginLeft: 5 }}>(3 Tugas)</p>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
      </AccordionDetails>
    </Accordion>
  )
}
