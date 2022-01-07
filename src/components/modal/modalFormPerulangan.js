import {
  // AppBar,
  Box,
  Button,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // List,
  // ListItem,
  Tab,
  Tabs,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Grid,
  TextField,
  Paper,
  Fade,
  Backdrop,
  Modal
} from "@material-ui/core";

import React, { Component } from "react";

import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}



export default class modalFormPerulangan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      valueTab: 0,
      mingguan: "",

      daySelected: '',
      daysSelected: [],
      datesSelected: [],
      hourSelected: '',

      ListHours: [
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
      ],
      ListDay: [
        { value: 'Senin', isSelected: false },
        { value: 'Selasa', isSelected: false },
        { value: 'Rabu', isSelected: false },
        { value: 'Kamis', isSelected: false },
        { value: 'Jumat', isSelected: false },
        { value: 'Sabtu', isSelected: false },
        { value: 'Minggu', isSelected: false }
      ],
      ListDate: [
        { value: '1', isSelected: false },
        { value: '2', isSelected: false },
        { value: '3', isSelected: false },
        { value: '4', isSelected: false },
        { value: '5', isSelected: false },
        { value: '6', isSelected: false },
        { value: '7', isSelected: false },
        { value: '8', isSelected: false },
        { value: '9', isSelected: false },
        { value: '10', isSelected: false },
        { value: '11', isSelected: false },
        { value: '12', isSelected: false },
        { value: '13', isSelected: false },
        { value: '14', isSelected: false },
        { value: '15', isSelected: false },
        { value: '16', isSelected: false },
        { value: '17', isSelected: false },
        { value: '18', isSelected: false },
        { value: '19', isSelected: false },
        { value: '20', isSelected: false },
        { value: '21', isSelected: false },
        { value: '22', isSelected: false },
        { value: '23', isSelected: false },
        { value: '24', isSelected: false },
        { value: '25', isSelected: false },
        { value: '26', isSelected: false },
        { value: '27', isSelected: false },
        { value: '28', isSelected: false },
        { value: '29', isSelected: false },
        { value: '30', isSelected: false },
        { value: '31', isSelected: false },
      ]
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.valueTab !== prevState.valueTab) {
      this.setState({
        daySelected: '',
        daysSelected: [],
        hourSelected: '',
        ListDay: [
          { value: 'Senin', isSelected: false },
          { value: 'Selasa', isSelected: false },
          { value: 'Rabu', isSelected: false },
          { value: 'Kamis', isSelected: false },
          { value: 'Jumat', isSelected: false },
          { value: 'Sabtu', isSelected: false },
          { value: 'Minggu', isSelected: false }
        ],
        ListDate: [
          { value: '1', isSelected: false },
          { value: '2', isSelected: false },
          { value: '3', isSelected: false },
          { value: '4', isSelected: false },
          { value: '5', isSelected: false },
          { value: '6', isSelected: false },
          { value: '7', isSelected: false },
          { value: '8', isSelected: false },
          { value: '9', isSelected: false },
          { value: '10', isSelected: false },
          { value: '11', isSelected: false },
          { value: '12', isSelected: false },
          { value: '13', isSelected: false },
          { value: '14', isSelected: false },
          { value: '15', isSelected: false },
          { value: '16', isSelected: false },
          { value: '17', isSelected: false },
          { value: '18', isSelected: false },
          { value: '19', isSelected: false },
          { value: '20', isSelected: false },
          { value: '21', isSelected: false },
          { value: '22', isSelected: false },
          { value: '23', isSelected: false },
          { value: '24', isSelected: false },
          { value: '25', isSelected: false },
          { value: '26', isSelected: false },
          { value: '27', isSelected: false },
          { value: '28', isSelected: false },
          { value: '29', isSelected: false },
          { value: '30', isSelected: false },
          { value: '31', isSelected: false },
        ]
      })
    }
  }

  _handleChange = (name) => (e) => {
    this.setState({ [name]: e.target.value })
  }

  _handleClickDays = (index) => {
    let newList = this.state.ListDay, daysSelected = []
    newList[index].isSelected = !newList[index].isSelected

    newList.forEach(el => {
      if (el.isSelected) daysSelected.push(el.value)
    })

    this.setState({ ListDay: newList, daysSelected })
  }

  _handleClickDates = (index) => {
    let newList = this.state.ListDate, datesSelected = []
    newList[index].isSelected = !newList[index].isSelected

    newList.forEach(el => {
      if (el.isSelected) datesSelected.push(el.value)
    })

    this.setState({ ListDate: newList, datesSelected })
  }

  render() {


    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        open={this.props.open}
        onClose={this.closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.open}>
          <Grid style={{
            backgroundColor: 'white',
            boxShadow: 5,
            width: 600,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 10px'
          }}>
            <Paper style={{ display: 'flex', justifyContent: 'center' }}>
              <Tabs
                value={this.state.valueTab}
                onChange={(event, newValue) =>
                  this.setState({ valueTab: newValue })
                }
                aria-label="simple tabs example"
              >
                <Tab label="Harian" {...a11yProps(0)} />
                <Tab label="Mingguan" {...a11yProps(1)} />
                <Tab label="Bulanan" {...a11yProps(2)} />
              </Tabs>
            </Paper>

            <TabPanel value={this.state.valueTab} index={0}>
              <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <p>Setiap hari </p>
                <FormControl variant="outlined" size="small" style={{ margin: '0px 5px', width: 120 }} >
                  <Select value={this.state.daySelected} onChange={this._handleChange('daySelected')} >
                    {
                      this.state.ListDay.map(day =>
                        <MenuItem value={day.value} key={day.value}>{day.value}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
                <p style={{ margin: '0px 5px' }}>pada jam</p>
                <FormControl variant="outlined" size="small" style={{ width: 100 }}>
                  <Select value={this.state.hourSelected} onChange={this._handleChange('hourSelected')} >
                    {
                      this.state.ListHours.map(hour =>
                        <MenuItem value={hour} key={hour}>{hour}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>
            </TabPanel>

            <TabPanel value={this.state.valueTab} index={1}>
              <Grid
                container
                style={{ display: "flex", justifyContent: 'space-between', }}
              >
                {
                  this.state.ListDay.map((day, index) =>
                    <Grid item style={{ display: 'flex"', alignItems: 'center', width: '14%', padding: 3 }}>
                      <Button variant={day.isSelected ? 'contained' : 'outlined'} color={day.isSelected ? 'secondary' : 'default'} style={{ padding: '1px 3px' }} onClick={() => this._handleClickDays(index)}>
                        {day.value}
                      </Button>
                    </Grid>
                  )
                }
              </Grid>
              <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <p>Setiap hari</p>
                <TextField value={this.state.daysSelected.join(',')} disabled={true} style={{ margin: '0px 5px', width: 220 }} />
                <p style={{ margin: '0px 5px' }}>pada jam</p>
                <FormControl variant="outlined" size="small" style={{ width: 100 }}>
                  <Select value={this.state.hourSelected} onChange={this._handleChange('hourSelected')} >
                    {
                      this.state.ListHours.map(hour =>
                        <MenuItem value={hour} key={hour}>{hour}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>
            </TabPanel>

            <TabPanel value={this.state.valueTab} index={2}>
              <Grid
                container
                style={{ display: "flex" }}
              >
                {
                  this.state.ListDate.map((date, index) =>
                    <Grid item style={{ display: 'flex', alignItems: 'center', width: '14%', padding: 5 }}>
                      <Button variant={date.isSelected ? 'contained' : 'outlined'} color={date.isSelected ? 'secondary' : 'default'} style={{ padding: '1px 3px' }} onClick={() => this._handleClickDates(index)}>
                        {date.value}
                      </Button>
                    </Grid>
                  )
                }
              </Grid>
              <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <p>Setiap tanggal</p>
                <TextField value={this.state.datesSelected.join(',')} disabled={true} style={{ margin: '0px 5px', width: 220 }} />
                <p style={{ margin: '0px 5px' }}>pada jam</p>
                <FormControl variant="outlined" size="small" style={{ width: 100 }}>
                  <Select value={this.state.hourSelected} onChange={this._handleChange('hourSelected')} >
                    {
                      this.state.ListHours.map(hour =>
                        <MenuItem value={hour} key={hour}>{hour}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>
            </TabPanel>


            <Grid style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="outlined" color="secondary" style={{ width: 150, marginRight: 30 }} onClick={this.props.closeModal}>Batal</Button>
              <Button variant="contained" color="secondary" style={{ width: 150 }}>Lanjut</Button>
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    );
  }
}
