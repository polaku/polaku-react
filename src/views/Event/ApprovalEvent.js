import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid } from '@material-ui/core';

import CardEvent from '../../components/event/cardEvent';

import { fetchDataEventNeedApproval } from '../../store/action';

class ApprovalEvent extends Component {
  async componentDidMount() {
    await this.props.fetchDataEventNeedApproval()
    console.log(this.props.dataEventNeedApproval)
  }

  render() {
    return (
      <Grid container >
        {
          this.props.dataEventNeedApproval.length !== 0
            ? this.props.dataEventNeedApproval.map((event, index) => (
              <Grid item xs={12} sm={4} key={index} style={{ padding: 10 }}>
                <CardEvent data={event} approval={true} />
              </Grid>
            ))
            : <p>No Event Need Approval</p>
        }
      </Grid>
    )
  }
}

const mapDispatchToProps = {
  fetchDataEventNeedApproval
}

const mapStateToProps = ({ loading, dataEventNeedApproval, error }) => {
  return {
    loading,
    dataEventNeedApproval,
    error
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ApprovalEvent)