import React, { Component } from 'react'

import { Grid, Breadcrumbs, Link, Typography } from '@material-ui/core';

export default class detailNotifikasi extends Component {
  render() {
    return (
      <Grid style={{ padding: 20 }}>
        <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
          <Link style={{ color: '#d71149', cursor: 'pointer' }} onClick={() => this.props.history.push('/notifikasi')}>Notifikasi</Link>
          <Typography style={{ color: '#d71149', fontSize: 14 }}>Judul</Typography>
        </Breadcrumbs>

        <h1 style={{ margin: '10px 0px 0px 0px' }}>Judul</h1>
        <p style={{ margin: 0, fontSize: 13 }}>13 Mei 2021 - Febri</p>
        <p style={{ margin: '10px 0px' }}>BodyText</p>
      </Grid>
    )
  }
}
