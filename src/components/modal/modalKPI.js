import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  makeStyles,
  Modal,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
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
  spacing: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    width: 145,
    height: 33,
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

  const [tipeTarget, setTipeTarget] = useState("akumulasi");

  const allTipeTarget = [
    {
      value: "akumulasi",
    },
    {
      value: "setara",
    },
    {
      value: "kurang dari",
    },
    {
      value: "lebih dari",
    },
    {
      value: "rata-rata",
    },
  ];

  const [dari, setDari] = useState("nama");
  const allDari = [
    {
      value: "{nama}",
    },
    { value: "kpi" },
  ];

  const [KPI, setKPI] = useState("akumulasi");
  const allKPI = [{ value: "akumulasi" }, { value: "rata-rata" }];

  const [nilai, setNilai] = useState("pencapaian");
  const allNilai = [{ value: "pencapaian" }, { value: "waktu" }];

  const [aktivitas, setAktivitas] = useState("1");
  const allAktivitas = [{ value: "1" }, { value: "<1" }];

  const [anggotaTim, setAnggotaTim] = useState("nama 1");
  const handleChange = (event) => {
    setAnggotaTim(event.target.value);
  };
  const allAnggotaTim = [
    {
      value: "nama 1",
    },
    { value: "nama 2" },
    { value: "nama 3" },
  ];

  return (
    <>
      <Button size="small">
        <img src="/TargetIcon.png" onClick={handleOpen} alt="Target Icon" />
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <Typography variant="h6" align="center">
            Target untuk &nbsp;
            <select className={classes.input}>
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
                spacing={2}
              >
                <Grid item xs={12} className={classes.spacing}>
                  Tipe Target
                  {allTipeTarget.map((option) => (
                    <Button
                      variant="contained"
                      key={option.value}
                      onClick={() => setTipeTarget(option.value)}
                      style={{
                        backgroundColor:
                          tipeTarget === option.value ? "#D71149" : "#C8C8C8",
                        color: "#fff",
                        boxShadow: "none",
                      }}
                    >
                      {option.value}
                    </Button>
                  ))}
                </Grid>
                <Grid item xs={12} className={classes.spacing}>
                  Dari
                  {allDari.map((option) => (
                    <Button
                      variant="contained"
                      key={option.value}
                      onClick={() => setDari(option.value)}
                      style={{
                        backgroundColor:
                          dari === option.value
                            ? "#D71149"
                            : option.value === "kpi"
                            ? "transparent"
                            : "#C8C8C8",
                        color: "#fff",
                        boxShadow: "none",
                      }}
                    >
                      {option.value === "kpi" ? (
                        <img src="/KPI.png" alt="KPI" />
                      ) : (
                        option.value
                      )}
                    </Button>
                  ))}
                  {dari === "kpi" ? (
                    <>
                      {allKPI.map((option) => (
                        <Button
                          variant="contained"
                          key={option.value}
                          onClick={() => setKPI(option.value)}
                          style={{
                            backgroundColor:
                              KPI === option.value ? "#D71149" : "#C8C8C8",
                            color: "#fff",
                            boxShadow: "none",
                          }}
                        >
                          {option.value}
                        </Button>
                      ))}
                      <Grid item xs={12} className={classes.spacing}>
                        <Grid
                          style={{
                            padding: "0 10px",
                            backgroundColor: "#FFFFFF",
                            textAlign: "center",
                          }}
                          className={classes.spacing}
                        >
                          Perusahaan
                          <select
                            className={classes.input}
                            style={{ width: 150 }}
                          >
                            <option>PT. Pola Inti Perkasa</option>
                          </select>
                          Anggota Tim
                          <select
                            value={anggotaTim}
                            onChange={handleChange}
                            className={classes.input}
                          >
                            {allAnggotaTim.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.value}
                              </option>
                            ))}
                          </select>
                        </Grid>
                      </Grid>
                    </>
                  ) : null}
                </Grid>
                <Grid item xs={12} className={classes.spacing}>
                  Nilai
                  {allNilai.map((option) => (
                    <Button
                      variant="contained"
                      key={option.value}
                      onClick={() => setNilai(option.value)}
                      style={{
                        backgroundColor:
                          nilai === option.value ? "#D71149" : "#C8C8C8",
                        color: "#fff",
                        boxShadow: "none",
                      }}
                    >
                      {option.value}
                    </Button>
                  ))}
                </Grid>
                <Grid item xs={12} className={classes.spacing}>
                  Aktivitas
                  {allAktivitas.map((option) => (
                    <Button
                      variant="contained"
                      key={option.value}
                      onClick={() => setAktivitas(option.value)}
                      style={{
                        backgroundColor:
                          aktivitas === option.value ? "#D71149" : "#C8C8C8",
                        color: "#fff",
                        boxShadow: "none",
                      }}
                    >
                      {option.value}
                    </Button>
                  ))}
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
                  <h1>&lt; &#10100;{anggotaTim}&#10101; &gt;</h1>
                  <select className={classes.input}>
                    <option>pilih/buat baru</option>
                  </select>
                  <br />
                  <br />
                  Target <input type="text" className={classes.input} />
                  &nbsp; Unit <input type="text" className={classes.input} />
                </Grid>
                <Typography variant="h6" align="center">
                  Target Bulanan
                </Typography>
                <br />
                <Grid container spacing={3} style={{ marginBottom: 20 }}>
                  {months.map((month) => (
                    <Grid item xs={4} style={{ textAlign: "center" }}>
                      <input
                        type="text"
                        placeholder={month.placeholder}
                        className={classes.input}
                      />
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
