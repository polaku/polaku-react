import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import { ExpandMore, TrackChanges } from "@material-ui/icons";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 1000,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: "16px 32px 24px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "black",
  },
}));

export default function Index() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const months = [
    { placeholder: "Jan" },
    { placeholder: "Feb" },
    { placeholder: "Mar" },
    { placeholder: "Apr" },
    { placeholder: "May" },
    { placeholder: "Jun" },
    { placeholder: "Jul" },
    { placeholder: "Aug" },
    { placeholder: "Sep" },
    { placeholder: "Oct" },
    { placeholder: "Nov" },
    { placeholder: "Dec" },
  ];
  return (
    <>
      <IconButton aria-label="delete" onClick={handleOpen} color="primary">
        <TrackChanges />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <Typography variant="h6" align="center">
            Target untuk &nbsp;
            <select>
              <option>2021</option>
            </select>
          </Typography>

          <p style={{ textAlign: "right" }}>
            <a href="/">belajar lebih lanjut</a>
          </p>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Perhitungan Target</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                style={{ backgroundColor: "#F5F5F5", padding: 10 }}
              >
                <Grid item xs={12} style={{ marginBottom: 10 }}>
                  Tipe Target
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#D71149" }}
                  >
                    akumulasi
                  </Button>
                  <Button variant="contained">setara</Button>
                  <Button variant="contained">kurang dari</Button>
                  <Button variant="contained">lebih dari</Button>
                  <Button variant="contained">rata-rata</Button>
                </Grid>
                <Grid item xs={12}>
                  Dari
                  <Button variant="contained">Nama</Button>
                  <Button>
                    <img src="/KPI.png" alt="KPI" />
                  </Button>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#D71149" }}
                  >
                    akumulasi
                  </Button>
                  <Button variant="contained">rata-rata</Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Cara Hitung</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form className={classes.root} noValidate autoComplete="off">
                <Grid style={{ textAlign: "center", marginBottom: 20 }}>
                  Target <input type="text" />
                  &nbsp; Unit <input type="text" />
                </Grid>
                <Typography variant="h6" align="center">
                  Target Bulanan
                </Typography>
                <br />
                <Grid container spacing={3} style={{ marginBottom: 20 }}>
                  {months.map((month) => (
                    <Grid item xs={4} style={{ textAlign: "center" }}>
                      <input type="text" placeholder={month.placeholder} />
                    </Grid>
                  ))}
                </Grid>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#d71149", color: "white" }}
                  fullWidth
                >
                  SIMPAN
                </Button>
              </form>
            </AccordionDetails>
          </Accordion>
        </div>
      </Modal>
    </>
  );
}
