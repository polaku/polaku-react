import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";

import React, { Component } from "react";

import PropTypes from "prop-types";

export default class formPerulangan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      value: 0,
      mingguan: "",
    };
  }
  render() {
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

    return (
      <>
        <Dialog
          open={this.state.open}
          onClose={() => this.setState({ open: !this.state.open })}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <AppBar position="static" color="transparent">
              <Tabs
                value={this.state.value}
                onChange={(event, newValue) =>
                  this.setState({ value: newValue })
                }
                aria-label="simple tabs example"
              >
                <Tab label="Harian" {...a11yProps(0)} />
                <Tab label="Mingguan" {...a11yProps(1)} />
                <Tab label="Bulanan" {...a11yProps(2)} />
              </Tabs>
            </AppBar>
            <TabPanel value={this.state.value} index={0}>
              Setiap <input type="text" /> Hari di{" "}
              <select name="cars" id="cars">
                <option value="volvo">09:00</option>
                <option value="saab">10:00</option>
                <option value="opel">10:00</option>
                <option value="audi">12:00</option>
              </select>
            </TabPanel>
            <TabPanel value={this.state.value} index={1}>
              <List
                style={{ display: "flex", flexDirection: "row", padding: 0 }}
              >
                <ListItem>Sen</ListItem>
                <ListItem>Sel</ListItem>
                <ListItem>Rab</ListItem>
                <ListItem>Kam</ListItem>
                <ListItem>Jum</ListItem>
                <ListItem>Sab</ListItem>
                <ListItem>Min</ListItem>
              </List>
              <br />
              Setiap <input type="text" /> Minggu di{" "}
              <select name="cars" id="cars">
                <option value="volvo">09:00</option>
                <option value="saab">10:00</option>
                <option value="opel">10:00</option>
                <option value="audi">12:00</option>
              </select>
            </TabPanel>
            <TabPanel value={this.state.value} index={2}>
              <List
                style={{ display: "flex", flexDirection: "row", padding: 0 }}
              >
                <ListItem>1</ListItem>
                <ListItem>2</ListItem>
                <ListItem>3</ListItem>
                <ListItem>4</ListItem>
                <ListItem>5</ListItem>
                <ListItem>6</ListItem>
                <ListItem>7</ListItem>
              </List>
              <List
                style={{ display: "flex", flexDirection: "row", padding: 0 }}
              >
                <ListItem>8</ListItem>
                <ListItem>9</ListItem>
                <ListItem>10</ListItem>
                <ListItem>11</ListItem>
                <ListItem>12</ListItem>
                <ListItem>13</ListItem>
                <ListItem>14</ListItem>
              </List>
              <List
                style={{ display: "flex", flexDirection: "row", padding: 0 }}
              >
                <ListItem>15</ListItem>
                <ListItem>16</ListItem>
                <ListItem>17</ListItem>
                <ListItem>18</ListItem>
                <ListItem>19</ListItem>
                <ListItem>20</ListItem>
                <ListItem>21</ListItem>
              </List>
              <List
                style={{ display: "flex", flexDirection: "row", padding: 0 }}
              >
                <ListItem>22</ListItem>
                <ListItem>23</ListItem>
                <ListItem>24</ListItem>
                <ListItem>25</ListItem>
                <ListItem>26</ListItem>
                <ListItem>27</ListItem>
                <ListItem>28</ListItem>
              </List>
              <List
                style={{ display: "flex", flexDirection: "row", padding: 0 }}
              >
                <ListItem>29</ListItem>
                <ListItem>30</ListItem>
                <ListItem>31</ListItem>
                <ListItem>Awal</ListItem>
                <ListItem>Akhir</ListItem>
              </List>
              <br />
              Setiap <input type="text" /> bulan di{" "}
              <select name="cars" id="cars">
                <option value="volvo">09:00</option>
                <option value="saab">10:00</option>
                <option value="opel">10:00</option>
                <option value="audi">12:00</option>
              </select>
            </TabPanel>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ open: !this.state.open })}
              color="primary"
            >
              Batal
            </Button>
            <Button
              onClick={() => this.setState({ open: !this.state.open })}
              color="primary"
            >
              Lanjut
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
