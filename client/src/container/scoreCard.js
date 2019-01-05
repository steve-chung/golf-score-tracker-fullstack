import React, { Component, Fragment } from 'react'
import { Paper,
  CssBaseline,
  TextField,
  MenuItem,
  InputAdornment,
  Button} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },

  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    width: 200,
    margin: theme.spacing.unit
  },
  next: {
    float: 'right'
  },
  prev: {
    float: 'left'
  }
})

const firstClub = ['Driver', '3-wood', '3-iron', '6-iron', '9-iron']
const secondClub = ['3-wood', '3-iron', '6-iron', '9-iron', 'PW']
const stroksGreen = [1, 2, 3, 4, 5, 6]

class scoreCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstClub: '',
      secondClub: '',
      stroksGreen: 0,
      firstDistance: 0,
      secondDistance: 0,
      totalShots: 0
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
  }

  handlePrev(e) {
    this.props.handleOnPrev(e)
    const { firstClub,
      secondClub,
      stroksGreen,
      firstDistance,
      secondDistance,
      totalShots } = this.props.score

    this.setState({
      firstClub,
      secondClub,
      stroksGreen,
      firstDistance,
      secondDistance,
      totalShots
    })
  }
  handleOnSubmit(e) {
    e.preventDefault()
    this.props.handleOnNext(e.target[0].value,
      e.target[1].value,
      e.target[2].value,
      e.target[3].value,
      e.target[4].value,
      e.target[5].value)
    this.handleRestState()
    e.target.reset()
  }

  handleRestState() {
    this.setState({
      firstClub: '',
      secondClub: '',
      stroksGreen: 0,
      firstDistance: 0,
      secondDistance: 0,
      totalShots: 0
    })
  }

  componentDidMount() {
    const {currentHole} = this.props
    if (!currentHole) {
      this.handleRestState()
    }
  }

  handleOnChange(e, name) {
    this.setState({
      [name]: e.target.value
    })
  }

  render() {
    const { classes } = this.props
    let currentHole = 1
    if (this.props.currentHole) {
      currentHole = this.props.currentHole
    }

    return (
      <Fragment>
        <CssBaseline />
        <main className={classes.layout} style={{margin: '0, auto'}}>
          <Paper className={classes.paper} elevation={1}>
            <h3> Hole {currentHole.holeNumber}/ Par {currentHole.par} </h3>
            <form onSubmit={this.handleOnSubmit}>
              <TextField
                select
                className={classes.textField}
                value={this.state.firstClub}
                onChange = {(e) => this.handleOnChange(e, 'firstClub')}
                label='Club at Tee Off'>
                {firstClub.map((club, i) => (
                  <MenuItem key={i} value={club}>
                    {club}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Distance of first shot"
                className={classes.textField}
                value={this.state.firstDistance}
                onChange={(e) => this.handleOnChange(e, 'firstDistance')}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>Yard</InputAdornment>
                }}/>
              <TextField
                select
                className={classes.textField}
                value={this.state.secondClub}
                onChange={(e) => this.handleOnChange(e, 'secondClub')}
                label='Club at Second Shot'>
                {secondClub.map((club, i) => (
                  <MenuItem key={i} value={club}>
                    {club}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Distance of second shot"
                value={this.state.secondDistance}
                onChange={(e) => this.handleOnChange(e, 'secondDistance')}
                className={classes.textField}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>Yard</InputAdornment>
                }}/>
              <TextField
                select
                className={classes.textField}
                value={+this.state.stroksGreen}
                onChange = {(e) => this.handleOnChange(e, 'stroksGreen')}
                label='Num of Stroks at Green'>
                {stroksGreen.map((num, i) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                label="Total Number of Shots"
                value={this.state.totalShots}
                onChange = {(e) => this.handleOnChange(e, 'totalShots')}
                className={classes.textField}/>
              <Button type='submit' className={classes.next} color='primary'> Next</Button>
              <Button onClick={this.handlePrev} className={classes.prev} color='primary'> Prev </Button>
            </form>
          </Paper>
        </main>
      </Fragment>
    )
  }
}

export default withStyles(styles)(scoreCard)
