import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';

import { API } from '../config/API';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      proses: false,
      editableInput: true
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  signin = async e => {
    e.preventDefault();

    this.setState({
      proses: true,
      editableInput: false
    })
    let user, data
    user = {
      username: this.state.username,
      password: this.state.password
    }
    try {
      data = await API.post('/users/signin', user)
      localStorage.setItem('token', data.data.token)
      if (data) {
        this.setState({
          proses: false,
          editableInput: true,
          username: '',
          password: ''
        })
      }
      // this.props.setUserId(data.data.user_id)
      // this.props.navigation.navigate("Home")
    } catch (err) {
      alert(err)
      this.setState({
        proses: false,
        editableInput: true
      })
    }

  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '5% 0 0 auto' }}>
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
          <img src="https://polaku.polagroup.co.id/uploads/logo.png" alt="Logo" />
          <Typography style={{ margin: 10, fontSize: 13 }}>SIGN IN TO CONTINUE.</Typography>
          <form noValidate autoComplete="off" onSubmit={this.signin} style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              id="username"
              label="Username"
              value={this.state.username}
              onChange={this.handleChange('username')}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: <InputAdornment position="end"><MailIcon /></InputAdornment>,
              }}
              style={{ marginBottom: 15 }}
              disabled={this.state.proses}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              value={this.state.password}
              onChange={this.handleChange('password')}
              InputProps={{
                endAdornment: <InputAdornment position="end"><LockIcon /></InputAdornment>,
              }}
              disabled={this.state.proses}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography style={{ fontSize: 12 }}>Forgot password?</Typography>
              <div style={{ position: 'relative', }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ margin: '20px 0', width: 100, alignSelf: 'center' }}
                  data-testid='buttonSignin'
                  disabled={this.state.proses}>
                  Sign In </Button>
                {this.state.proses && <CircularProgress size={24} style={{
                  color: 'blue',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }} />}
              </div>
            </div>
          </form>

          <Typography style={{ marginTop: 20, fontSize: 12 }}>©<Link to='/login'> polagroup</Link></Typography>
          <Typography style={{ fontSize: 12 }}>2019 - Version 1.0.0</Typography>
        </div>
      </div>
    )
  }
}

// import React from 'react';
// import clsx from 'clsx';
// import { makeStyles } from '@material-ui/core/styles';
// import MenuItem from '@material-ui/core/MenuItem';
// import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';



// export default function OutlinedTextFields() {
//   // const classes = useStyles();
//   const [values, setValues] = React.useState({
//     name: 'Cat in the Hat',
//     age: '',
//     multiline: 'Controlled',
//     currency: 'EUR',
//   });

//   const handleChange = name => event => {
//     setValues({ ...values, [name]: event.target.value });
//   };

//   return (
//     // <form className={classes.container} noValidate autoComplete="off">
//     <form>
//       <Grid item xs={12}>
//       <TextField
//         id="outlined-name"
//         label="Name"
//         className={{width: 200}}
//         value={values.name}
//         onChange={handleChange('name')}
//         margin="normal"
//         variant="outlined"
//       />
//       </Grid>
//       <Grid item xs={12}>
//       <TextField
//         id="outlined-password-input"
//         label="Password"
//         className={{width: 200}}
//         type="password"
//         autoComplete="current-password"
//         margin="normal"
//         variant="outlined"
//       />
//       </Grid>
//     </form>
//   );
// }