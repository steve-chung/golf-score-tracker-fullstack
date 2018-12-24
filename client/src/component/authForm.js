import React, { Component } from 'react'
import {Avatar,
        Button,
        CssBaseline,
        FormControl,
        FormControlLabel,
        Input,
        InputLabel,
        Paper,
        Typography} from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import LockIcon from '@material-ui/icons/LockOutlined' 

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
})



class AuthForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      name: '',
      phone: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const authType = this.props.register ? 'register' : 'login'
    this.props
      .onAuth(authType, this.state)
      .then(() => {
        this.props.history.push('/')
      })
      .catch(() => {
        return
      })
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  };

  render() {
    const { email, password, name, phone } = this.state
    const {
      heading,
      buttonText,
      errors,
      history,
      register,
      removeError,
      classes
    } = this.props
    history.listen(() => {
      removeError()
    })

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component='h1' variant='h5' style={{fontWeight: '700'}}>
            {heading}
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            {errors.message && (
              <Typography component='h1' variant='h5' color='secondary'>{errors.message}</Typography>
            )}
            { register && (
              <div>
                <FormControl marign='normal' required fullWidth>
                  <InputLabel htmlFor='name'>Name</InputLabel>
                  <Input
                    autoComplete='off'
                    className='form-control'
                    id='name'
                    name='name'
                    onChange={this.handleChange}
                    type='text'
                    value={name}
                  />
                </FormControl>
                <FormControl margin='normal' required fullWidth>
                  <InputLabel htmlFor='phone'>Phone number</InputLabel>
                  <Input
                    autoComplete='off'
                    className='form-control'
                    id='phone'
                    name='phone'
                    onChange={this.handleChange}
                    type='text'
                    value={phone}
                  />
                </FormControl>
              </div>
            )}
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='email'>E-mail</InputLabel>
              <Input
                autoComplete='off'
                className='form-control'
                id='email'
                name='email'
                onChange={this.handleChange}
                type='text'
                value={email}
              />
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='password'>Password</InputLabel>
              <Input
                autoComplete='off'
                className='form-control'
                id='password'
                name='password'
                onChange={this.handleChange}
                type='password'
                value={password}
              />
            </FormControl>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              className={classes.submit}
              color='primary'
            >
              {buttonText}
            </Button>
          </form>
        </Paper>
      </main>
    )
  }
}
// AuthForm.propTypes = {
//   buttonText: PropTypes.string,
//   errors: PropTypes.object,
//   heading: PropTypes.string,
//   history: PropTypes.object,
//   onAuth: PropTypes.func,
//   signIn: PropTypes.bool,
//   removeError: PropTypes.func
// };

export default withStyles(styles)(AuthForm)
