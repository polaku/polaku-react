import React, { Component } from 'react';

import { Grid, Button } from '@material-ui/core';

import OnboardingAlamat from '../../Assets/onboardingAlamat.png';

import Stepper from 'react-stepper-horizontal';

export default class StepperOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [{ title: 'alamat & jam operasi' }, { title: 'struktur perusahaan' }, { title: 'upload karyawan' }, { title: 'pilih admin' }, { title: 'quality control' }, { title: 'selesai' }],
      activeStep: 0
    }
  }

  navigateAddAddress = () => {
    this.props.history.push('/setting/setting-perusahaan/add-address')
  }

  navigateAddStucture = () => {
    this.props.history.push('/setting/setting-perusahaan/add-department')
  }

  navigateAddEmployee = () => {
    this.props.history.push('/setting/setting-perusahaan/add-employee')
  }

  render() {
    return (
      <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid style={{ maxWidth: 700 }}>
          <Stepper
            steps={this.state.steps}
            activeStep={this.state.activeStep}
            activeColor="#d71149"
            completeColor="red"
            defaultColor="#c9c9c9"
            activeTitleColor="black"
            defaultTitleColor="#535353"
            completeTitleColor="white"
            circleFontSize={0}
            defaultBarColor="#c9c9c9"
            defaultOpacity="0.5"
            titleFontSize={12}
          />
        </Grid>

        {
          this.state.activeStep === 0 ? (
            <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
              <b>Isi alamat kantor & jam operasi</b>
              <img src={OnboardingAlamat} loading="lazy" alt="Logo" style={{ width: 'auto', maxHeight: 200, margin: '20px 0px' }} />
              <Button variant="contained" color="secondary" onClick={this.navigateAddAddress}>lanjut</Button>
            </Grid>
          ) : this.state.activeStep === 1 ? (
            <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
              <b>Isi struktur dalam perusahaan</b>
              <img src={OnboardingAlamat} loading="lazy" alt="Logo" style={{ width: 'auto', maxHeight: 200, margin: '20px 0px' }} />
              <Button variant="contained" color="secondary" onClick={this.navigateAddStucture}>lanjut</Button>
            </Grid>
          ) : this.state.activeStep === 2 ? (
            <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
              <b>Isi karyawan perusahaan</b>
              <img src={OnboardingAlamat} loading="lazy" alt="Logo" style={{ width: 'auto', maxHeight: 200, margin: '20px 0px' }} />
              <Button variant="contained" color="secondary" onClick={this.navigateAddEmployee}>lanjut</Button>
            </Grid>
          ) : (
                  <p>ELSE</p>
                )
        }
      </Grid>
    )
  }
}
