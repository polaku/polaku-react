import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Grid, LinearProgress } from '@material-ui/core';

import BarChartIcon from '@material-ui/icons/BarChart';

import 'react-circular-progressbar/dist/styles.css';

import CardTAL from '../../components/kpim/cardTAL';

class TAL extends Component {
  state = {
    dataTAL: [
      {
        week: 1,
        nilai: 80,
        items: [{
          item: 'item 1',
          weight: 8,
          when: 'Daily',
          load: '50',
          pencapaian: 70,
          link: "-"
        }, {
          item: 'item 1',
          weight: 10,
          when: 'Monday',
          load: '80',
          pencapaian: 80,
          link: "-"
        }]
      }, {
        week: 2,
        nilai: 78,
        items: [{
          item: 'item 2',
          weight: 8,
          when: 'Tuesday',
          load: '50',
          pencapaian: 60,
          link: "-"
        }, {
          item: 'item 2',
          weight: 10,
          when: 'Wednesday',
          load: '80',
          pencapaian: 80,
          link: "-"
        }]
      }, {
        week: 3,
        nilai: 90,
        items: [{
          item: 'item 3',
          weight: 8,
          when: 'Thursday',
          load: '50',
          pencapaian: 86,
          link: "-"
        }, {
          item: 'item 3',
          weight: 10,
          when: 'Friday',
          load: '80',
          pencapaian: 80,
          link: "-"
        }]
      }, {
        week: 4,
        nilai: 60,
        items: [{
          item: 'item 4',
          weight: 8,
          when: 'Daily',
          load: '50',
          pencapaian: 85,
          link: "-"
        }, {
          item: 'item 4',
          weight: 10,
          when: 'Sunday',
          load: '80',
          pencapaian: 80,
          link: "-"
        }]
      }, {
        week: 5,
        nilai: 80,
        items: [{
          item: 'item 5',
          weight: 8,
          when: 'Saturday',
          load: '50',
          pencapaian: 87,
          link: "-"
        }, {
          item: 'item 5',
          weight: 10,
          when: 'Wednesday',
          load: '80',
          pencapaian: 80,
          link: "-"
        }]
      }, {
        week: 6,
        nilai: 68,
        items: [{
          item: 'item 6',
          weight: 8,
          when: 'Daily',
          load: '50',
          pencapaian: 70,
          link: "-"
        }, {
          item: 'item 6',
          weight: 10,
          when: 'Wednesday',
          load: '80',
          pencapaian: 80,
          link: "-"
        }]
      }, {
        week: 7,
        nilai: 30,
        items: [{
          item: 'item 7',
          weight: 8,
          when: 'Daily',
          load: '50',
          pencapaian: 85,
          link: "-"
        }, {
          item: 'item 7',
          weight: 10,
          when: 'Wednesday',
          load: '80',
          pencapaian: 80,
          link: "-"
        }]
      }, {
        week: 8,
        nilai: 91,
        items: [{
          item: 'item 8',
          weight: 8,
          when: 'Daily',
          load: '50',
          pencapaian: 88,
          link: "-"
        }, {
          item: 'item 8',
          weight: 10,
          when: 'Wednesday',
          load: '80',
          pencapaian: 80,
          link: "-"
        }]
      },
    ],
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid>
        <Grid container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Grid item style={{ display: 'flex', alignItems: 'center' }}>
            <BarChartIcon />
            <p style={{ margin: 0, fontSize:20 }}>TO ACHIEVE LIST</p>
          </Grid>
          <Grid item>
            Apr 2019
          </Grid>
        </Grid>
        <Grid style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: 10, borderRadius: 5 }}>
          <p style={{ margin: '0px 0px 5px 0px', fontSize: 12 }}>Performa TAL</p>
          <p style={{ margin: 0, fontSize: 12 }}>performa periode</p>
          <LinearProgress variant="determinate" value={87}
            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
          />
          <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ margin: 0, fontSize: 12 }}>statistik periode</p>
            <p style={{ margin: 0, fontSize: 15 }}>87/100</p>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: 10 }}>
          {
            this.state.dataTAL.map((el, index) =>
              <CardTAL data={el} key={index} />
            )
          }
        </Grid>

      </Grid >
    )
  }
}

const styles = () => ({
  colorPrimary: {
    backgroundColor: '#d6d6d6',
  },
  barColorPrimary: {
    backgroundColor: '#3e98c7',
  }
});


export default withStyles(styles)(TAL);
