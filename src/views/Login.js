import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';

import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		}
	}

	handleChange = (e) => {
		this.setState({
			[e.target.id]: e.target.valueasd
		})
	}

	render() {
		return (
			<div>
				<img src="https://polaku.polagroup.co.id/uploads/logo.png" alt="Logo" />
				SIGN IN TO CONTINUE.
				<form className={{
					display: 'flex'
				}} noValidate autoComplete="off">
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<TextField
								id="username"
								label="Username"
								className={{ width: 200 }}
								variant="filled"
								value={this.state.username}
								onChange={this.handleChange}
								InputProps={{
									endAdornment: <InputAdornment position="end"><MailIcon /></InputAdornment>,
								}}
								
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="password"
								label="Password"
								type="password"
								className={{ width: 200 }}
								variant="filled"
								value={this.state.password}
								onChange={this.handleChange}
								InputProps={{
									endAdornment: <InputAdornment position="end"><LockIcon /></InputAdornment>,
								}}
							/>
						</Grid>
					</Grid>
				</form>
			</div>
		)
	}
}
