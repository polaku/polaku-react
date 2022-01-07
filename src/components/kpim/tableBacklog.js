import React, { Component } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Button,
  Avatar,
  Popover
} from "@material-ui/core";
import { ExpandMore, DeleteForever } from "@material-ui/icons";
import ChatTugasku from "../chat/chatTugasku";


export default class tableBacklog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  _handleClick = (event) => {
    this.setState({
      anchor: event.currentTarget,
      openPopOver: true
    })
  }

  render() {
    return (
      <Accordion style={{ marginTop: 20 }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid style={{ display: 'flex', alignItems: 'center', paddingLeft: 20, margin: 0 }}>
            <Typography style={{ fontWeight: 'bold' }}>Minggu lainnya</Typography>
            <p style={{ margin: 0, fontSize: 12, color: 'gray', marginLeft: 5 }}>(3 Tugas)</p>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
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
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>

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
    );
  }
}
