import React, { Component } from 'react';

import {
  Modal, Backdrop, Fade, Grid, Table, TableHead, TableRow, TableBody, TableCell
} from '@material-ui/core';

import CardItemTAL from '../kpim/cardItemTAL';

export default class modalDetailTAL extends Component {
  closeModal = () => {
    this.props.closeModal()
  }

  refresh = () => {
    this.props.refresh()
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
        open={this.props.status}
        onClose={this.closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={this.props.status}>
          <Grid style={{
            backgroundColor: 'white',
            boxShadow: 5,
            width: 600,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Grid style={{ padding: '15px 25px', backgroundColor: '#d71149', color: 'white', fontSize: 18 }}>
              Week {this.props.data.week}
            </Grid>
            <Table style={{ padding: '14px 16px 14px 16px' }}>
              <TableHead style={{ backgroundColor: '#f8f8f8' }}>
                <TableRow>
                  <TableCell style={{ width: '30%', padding: '14px 16px 14px 16px' }}>
                    Item
                    </TableCell>
                  <TableCell style={{ width: '10%', padding: '14px 16px 14px 16px' }} align="center">
                    Load
                    </TableCell>
                  <TableCell style={{ width: '15%', padding: '14px 16px 14px 16px' }} align="center">
                    When
                    </TableCell>
                  <TableCell align="center" style={{ width: '10%', padding: '14px 16px 14px 16px' }}>
                    Weight
                    </TableCell>
                  <TableCell align="center" style={{ width: '15%', padding: '14px 16px 14px 16px' }} >
                    Pencapaian
                    </TableCell>
                  <TableCell align="center" style={{ width: '20%', padding: '14px 16px 14px 16px' }}>
                    Link
                    </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.props.data.map((el, index) => (
                    <CardItemTAL data={el} key={index} refresh={this.refresh}/>
                  ))
                }
              </TableBody>
            </Table>
          </Grid>
        </Fade>
      </Modal>
    )
  }
}
