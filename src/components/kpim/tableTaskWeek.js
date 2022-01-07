import React, { Component } from "react";
import { connect } from 'react-redux';
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

import FormPerulangan from "../modal/modalFormPerulangan";
import ChatTugasku from "../chat/chatTugasku";
// import Ulasan from "../modal/modalUlasan";

// import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { Autocomplete } from "@material-ui/lab";

import { fetchDataCompanies } from '../../store/action';
class tableTaskWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchor: null,
      openPopOver: false,


      chooseWhen: [],
      optionDate: [],

      expanded: false,
      task: "IT",
      when: null,
      time: "",
      user: "",
      company: "",
      newDateTal: '',

      openModalFormPerulangan: false
    };
  }

  async componentDidMount() {
    if (this.props.monthSelected && this.props.weekSelected) {
      await this.fetchOptionDateInWeek(this.props.monthSelected, this.props.weekSelected);
    }

    if (this.props.listDinas) {
      await this.fetchOptionCompany()
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.monthSelected !== prevProps.monthSelected && this.props.weekSelected !== prevProps.weekSelected) {
      await this.fetchOptionDateInWeek(this.props.monthSelected, this.props.weekSelected);
    }

    if (this.props.listDinas !== prevProps.listDinas) {
      await this.fetchOptionCompany()
    }
  }

  getNumberOfWeek = (date) => {
    //yyyy-mm-dd (first date in week)
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay();
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  fetchOptionDateInWeek = (monthSelected, weekSelected) => {
    let date = [];

    let awalMingguSekarang = new Date().getDate() - new Date().getDay();
    let selisihMinggu = weekSelected - this.getNumberOfWeek(new Date());

    for (let i = 1; i <= 7; i++) {
      let newDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        awalMingguSekarang + selisihMinggu * 7
      );

      if (monthSelected === newDate.getMonth() + 1) {
        date.push(newDate.getDate());
      }
      awalMingguSekarang++;
    }

    let day = [];
    date.forEach((el) => {
      let date = new Date(
        new Date().getFullYear(),
        monthSelected - 1,
        el
      ).getDay();
      let listDay = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];

      day.push(listDay[date]);
    });

    if (day.length === 7) day.splice(0, 0, 'Setiap hari')

    day = [...day, "Perulangan", "Tanggal"]
    this.setState({
      chooseWhen: day,
      optionDate: date
    });
  };

  fetchOptionCompany = async () => {
    await this.props.fetchDataCompanies()

    if (this.props.isAdminsuper) {
      this.setState({ optionCompany: [{ acronym: 'Semua' }, ...this.props.dataCompanies] })
    } else {
      let optionCompany = []
      let idCompany = []
      await this.props.listDinas.forEach(el => {
        if (idCompany.indexOf(el.company_id) === -1) {
          let check = this.props.dataCompanies.find(element => el.company_id === element.company_id)
          if (check) {
            idCompany.push(el.company_id)
            optionCompany.push(check)
          }
        }
      })

      this.setState({ optionCompany })
    }
  }

  _handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })

    if (name === 'time' && event.target.value === 'Perulangan') {
      this._handleModalFormPerulangan()
    }
  }

  _handleClick = (event) => {
    this.setState({
      anchor: event.currentTarget,
      openPopOver: true
    })
  }

  _handleClose = () => {
    this.setState({
      anchor: null,
      openPopOver: false
    })
  }

  _handleModalFormPerulangan = () => {
    this.setState({ openModalFormPerulangan: !this.state.openModalFormPerulangan })
  }

  render() {
    const tasks = [
      {
        value: "TAL",
        backgroundColor: "#D71149",
      },
      {
        value: "IT",
        backgroundColor: "#0EA647",
      },
      {
        value: "Polaku",
        backgroundColor: "#FF0000",
      },
      {
        value: "Desain",
        backgroundColor: "#FFC300",
      },
      {
        value: "Karyawan",
        backgroundColor: "#3100FF",
      },
    ];

    const users = [
      { value: "User 1" },
      { value: "User 2" },
      { value: "User 3" },
    ];

    return (
      <Accordion style={{ backgroundColor: '#f4f5f7', marginTop: 30 }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ display: 'flex', alignItems: 'center', padding: 0, paddingLeft: 15, paddingRight: 15, margin: 0 }}
        >
          <Grid style={{ display: 'flex', alignItems: 'center', paddingLeft: 20, margin: 0 }}>
            <Typography style={{ fontWeight: 'bold' }}>Minggu {this.props.weekSelected}</Typography>
            <p style={{ margin: 0, fontSize: 12, color: 'gray', marginLeft: 5 }}>(3 Tugas)</p>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} style={{ borderRadius: 0 }}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={'31%'} style={{ padding: '10px 15px', fontWeight: 'bold' }}>Tugas</TableCell>
                  <TableCell width={'1%'} style={{ padding: '10px 15px' }} />
                  <TableCell width={'9%'} style={{ textAlign: 'center', padding: '10px 15px', fontWeight: 'bold' }}>Tenggat</TableCell>
                  <TableCell width={'5%'} style={{ textAlign: 'center', padding: '10px 15px', fontWeight: 'bold' }}>Bobot</TableCell>
                  <TableCell width={'10%'} style={{ textAlign: 'center', padding: '10px 15px', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell width={'16%'} style={{ textAlign: 'center', padding: '10px 15px', fontWeight: 'bold' }}>Pencapaian</TableCell>
                  <TableCell width={'10%'} style={{ textAlign: 'center', padding: '10px 15px', fontWeight: 'bold' }}>Perusahaan</TableCell>
                  <TableCell width={'9%'} style={{ textAlign: 'center', padding: '10px 15px', fontWeight: 'bold' }}>Waktu</TableCell>
                  <TableCell width={'8%'} style={{ textAlign: 'center', padding: '10px 15px', fontWeight: 'bold' }}>Oleh</TableCell>
                  <TableCell width={'1%'} style={{ textAlign: 'center', padding: '10px 10px' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell width={'31%'} style={{ borderLeft: '10px solid red' }}>Judul design 1</TableCell>
                  <TableCell width={'1%'} style={{ textAlign: 'center', padding: '10px 15px' }}><ChatTugasku /></TableCell>
                  <TableCell width={'9%'} style={{ textAlign: 'center', padding: '10px 15px' }}>Selasa</TableCell>
                  <TableCell width={'5%'} style={{ textAlign: 'center', padding: '10px 15px' }}>10%</TableCell>
                  <TableCell width={'10%'}
                    style={{ backgroundColor: "#BBBBBB", color: "white", textAlign: 'center', padding: '10px 15px' }}
                  >
                    Menunggu
                  </TableCell>
                  <TableCell width={'16%'} style={{ textAlign: 'center', padding: '10px 15px' }}>
                    {/* <StarBorderIcon /> <StarBorderIcon /> <StarBorderIcon />
                    <StarBorderIcon /> <StarBorderIcon /> */}
                  </TableCell>
                  <TableCell width={'10%'} style={{ textAlign: 'center', padding: '10px 15px' }}>PIP</TableCell>
                  <TableCell width={'9%'} style={{ textAlign: 'center', padding: '10px 15px' }} />
                  <TableCell width={'8%'} style={{ padding: '10px 15px' }}>
                    <Avatar style={{ width: 30, height: 30, margin: '0px auto' }}>HI</Avatar>
                  </TableCell>
                  <TableCell width={'1%'} style={{ textAlign: 'center', padding: '10px 10px' }}>
                    <Button aria-describedby='simple-popover' variant="contained" onClick={this._handleClick} style={{ padding: 0, minWidth: 30 }}>
                      ...
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={'31%'} style={{ borderLeft: '10px solid red' }}>Judul design 2</TableCell>
                  <TableCell width={'1%'} style={{ textAlign: 'center', padding: '10px 15px' }}><ChatTugasku /></TableCell>
                  <TableCell width={'9%'} style={{ textAlign: 'center', padding: '10px 15px' }}>Selasa</TableCell>
                  <TableCell width={'5%'} style={{ textAlign: 'center', padding: '10px 15px' }}>10%</TableCell>
                  <TableCell width={'10%'}
                    style={{ backgroundColor: "green", color: "white", textAlign: 'center', padding: '10px 15px' }}
                  >
                    Selesai
                  </TableCell>
                  <TableCell width={'16%'} style={{ textAlign: 'center', padding: '10px 15px' }}>
                    <StarBorderIcon /> <StarBorderIcon /> <StarBorderIcon /> <StarBorderIcon /> <StarBorderIcon />
                  </TableCell>
                  <TableCell width={'10%'} style={{ textAlign: 'center', padding: '10px 15px' }}>PIP</TableCell>
                  <TableCell width={'9%'} style={{ textAlign: 'center', padding: '10px 15px' }}>5j 5m</TableCell>
                  <TableCell width={'8%'} style={{ padding: '10px 15px' }}>
                    <Avatar style={{ width: 30, height: 30, margin: '0px auto' }}>
                      <PersonOutlinedIcon />
                    </Avatar>
                  </TableCell>
                  <TableCell width={'1%'} style={{ textAlign: 'center', padding: '10px 10px' }}>
                    <Button aria-describedby='simple-popover' variant="contained" onClick={this._handleClick} style={{ padding: 0, minWidth: 30 }}>
                      ...
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>

        {
          this.state.expanded && <form noValidate autoComplete="off" style={{ display: 'flex', alignItems: 'center', padding: '5px 20px' }}>
            <Grid style={{ display: 'flex', alignItems: 'center', width: '35%', paddingRight: 10 }}>
              <FormControl style={{ minWidth: 120 }}>
                <Select
                  style={{
                    marginRight: 20,
                    padding: "0 5px",
                    backgroundColor:
                      this.state.task === "TAL"
                        ? "#D71149"
                        : this.state.task === "IT"
                          ? "#0EA647"
                          : this.state.task === "Polaku"
                            ? "#FF0000"
                            : this.state.task === "Desain"
                              ? "#FFC300"
                              : this.state.task === "Karyawan"
                                ? "#3100FF"
                                : "#D71149",
                    color: "white",
                  }}
                  value={this.state.task}
                  onChange={this._handleChange('task')}
                >
                  {tasks.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      style={{
                        backgroundColor: option.backgroundColor,
                        margin: 5,
                        color: "white",
                      }}
                    >
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl style={{ minWidth: '70%' }}>
                <Input
                  id="my-input"
                  aria-describedby="my-helper-text"
                  placeholder="Tugas apa yang ingin Anda kerjakan?"
                />
              </FormControl>
            </Grid>
            <Grid style={{ display: 'flex', alignItems: 'center', width: '20%', paddingRight: 10 }}>
              <CalendarToday style={{ marginRight: 5 }} />
              <TextField
                id="standard-select-currency"
                select
                value={this.state.time}
                onChange={this._handleChange('time')}
                style={{ minWidth: this.state.time === 'Tanggal' ? '35%' : '70%' }}
              >
                {this.state.chooseWhen.map((option) =>
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                )}
              </TextField>
              {
                this.state.time === 'Tanggal' && <TextField
                  id="standard-select-currency"
                  select
                  value={this.state.newDateTal}
                  onChange={this._handleChange('newDateTal')}
                  style={{ minWidth: '30%', marginLeft: 20 }}
                >
                  {this.state.optionDate.map((option) =>
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )}
                </TextField>
              }

            </Grid>
            <Grid style={{ display: 'flex', alignItems: 'center', width: '20%', paddingRight: 10 }}>
              <PersonOutlinedIcon style={{ marginRight: 5 }} />
              <Grid
                item
                style={{
                  marginRight: 40,
                  minWidth: '70%'
                }}
              >
                <Autocomplete
                  id="combo-box-demo"
                  options={users}
                  getOptionLabel={(option) => option.value}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
            <Grid style={{ display: 'flex', alignItems: 'center', width: '20%', paddingRight: 10 }}>
              <Business style={{ marginRight: 5 }} />
              <TextField
                id="standard-select-currency"
                select
                value={this.state.company}
                onChange={this._handleChange('company')}
                style={{ minWidth: '70%' }}
              >
                {this.state.optionCompany.map((option) => (
                  <MenuItem key={option.company_id} value={option.company_id}>
                    {option.company_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid style={{ display: 'flex', alignItems: 'center', width: '5%', justifyContent: 'flex-end' }}>
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
          </form>
        }


        <Button
          style={{ backgroundColor: "transparent" }}
          startIcon={!this.state.expanded ? <Add /> : <Clear />}
          onClick={() => this.setState({ expanded: !this.state.expanded })}
          aria-expanded={this.state.expanded}
          aria-label="show more"
          style={{ marginLeft: 20, marginBottom: 10 }}
        >
          {!this.state.expanded ? "Tugas Baru" : "Batal"}
        </Button>

        {
          this.state.openModalFormPerulangan &&
          <FormPerulangan
            open={this.state.openModalFormPerulangan}
            closeModal={this._handleModalFormPerulangan}
          />
        }


        <Popover
          // id={id}
          open={this.state.openPopOver}
          anchorEl={this.state.anchor}
          onClose={this._handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Grid
            style={{ display: 'flex', alignItems: 'center', padding: '5px 10px', cursor: 'pointer' }}
          >
            <DeleteForever style={{ marginRight: 5 }} />
            Hapus
          </Grid>
        </Popover>
      </Accordion>

      // </>
    );
  }
}

const mapStateToProps = ({ listDinas, isAdminsuper, dataCompanies }) => {
  return {
    listDinas,
    isAdminsuper,
    dataCompanies
  }
}

const mapDispatchToProps = {
  fetchDataCompanies
}

export default connect(mapStateToProps, mapDispatchToProps)(tableTaskWeek)