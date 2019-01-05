import React, { Component } from 'react'
import {
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Slide} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import FriendsTable from '../component/friendsTable'
import { connect } from 'react-redux'
import { updateGame,
        removeGame,
        addGame,
        updateLastId,
        deleteId,
        resetGame,
        resetDeleteId } from '../store/action/game'
import { fetched } from '../store/action/fetch'
import { compose } from 'recompose'


function Transition(props) {
  return <Slide direction="up" {...props} />
}

function getDate() {
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let dt = date.getDate()
  let time = date.toLocaleTimeString('it-IT')
  if (dt < 10) {
    dt = '0' + dt
  }
  if (month < 10) {
    month = '0' + month
  }
  let hour = time.substring(0, 2)
  let min = time.substring(3, 5)
  return (year + '-' + month + '-' + dt + 'T' + hour + ':' + min)
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexlWrap: 'wrap'
  },
  button: {
    float: 'right'
  },
  date: {
    display: 'flex',
    marginBottom: 10,
    justifyContent: 'center'
  },
  submit: {
    float: 'none'
  }
})

class Invite extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      players: [],
      lastId: 1,
      deletePlayerId: 0,
      scheduledDate: 0
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleSelectDelete = this.handleSelectDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDate = this.handleDate.bind(this)
  }

  handleClickOpen() {
    this.setState({
      open: true
    })
  }

  handleSelectDelete(id) {
    this.props.deleteId(id)

  }

  handleClickDelete() {
    this.props.removeGame()
    this.props.resetDeleteId()
  }

  handleSubmit() {
    const { players } = this.props.games
    const { scheduledDate } = this.state
    const { courseName } = this.props
    const date = scheduledDate
    const newData = {
      course: courseName,
      date,
      players,
      totalScores: 0
    }
    if (players.length !== 0) {
      this.props.fetched()
      this.props.updateGame(newData)
      this.props.resetGame()
      this.props.history.push('/')
    }
    else {
      alert('please add players')
    }
  }

  handleCancel(e) {
    this.setState({
      open: false
    })
  }

  handleDate(e) {
    const date = e.target.value + ':00'
    this.setState({
      scheduledDate: date
    })
  }

  handleClose(e) {
    e.preventDefault(this.props)
    if (typeof (e.target[0].value) === 'string') {
      const { lastId } = this.props.games
      const playerInfo = {
        id: lastId,
        name: e.target[0].value,
        avgScore: +e.target[1].value,
        email: e.target[2].value
      }
      this.props.addGame(playerInfo)
      this.props.updateLastId()
    }
    this.setState({
      open: false
    })
    e.target.reset()
  }

  render() {
    const { classes, smallWindows, courseName } = this.props
    const { open } = this.state
    const { players } = this.props.games
    const date = getDate()
    return (
      <div className='container' style={{width: '70%', margin: 'auto'}}>
        <h1 className='title'>Invite to Play</h1>
        <p className='invite'> Please invite friends to play at {courseName} </p>
        <div className={classes.date}>
          <form className={classes.container} noValidate>
            <TextField
              id='date'
              label='Schedule'
              type='datetime-local'
              className={classes.TextField}
              defaultValue={date}
              InputLabelProps={{
                shrink: true
              }}
              onChange={this.handleDate}
            />
          </form>
        </div>

        <FriendsTable
          smallWindows={ smallWindows }
          courseName={ courseName }
          players={ players }
          handleDelete={this.handleSelectDelete}/>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title">
          <form onSubmit={this.handleClose}>
            <DialogTitle id="alert-dialog-slide-title">
            Enter Players Info?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
              Please Enter Player Name
              </DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Player Name'
                required
                fullWidth/>
            </DialogContent>
            <DialogContent>
              <DialogContentText>
              Please Enter Player Average Score
              </DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                id='score'
                label='Average Score'
                fullWidth/>
            </DialogContent>
            <DialogContent>
              <DialogContentText>
              Please Enter Email
              </DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                id='email'
                label='Player Email'
                type='email'
                fullWidth/>
            </DialogContent>
            <DialogActions>
              <Button type='submit' color="primary">
              OK
              </Button>
              <Button onClick={this.handleCancel} color="primary">
              Cancel
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Button className={classes.button} onClick={this.handleClickOpen} color='primary'> Add </Button>
        <Button className={classes.button} onClick={this.handleClickDelete} color='primary'> Delete </Button>
        <div>
          <Button className={classes.submit} onClick={this.handleSubmit} color='primary'>Submit</Button>
        </div>
      </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    message: state.message,
    games: state.game
  }
}

export default compose(withStyles(styles),
              connect(mapStateToProps, {
                      updateGame, 
                      removeGame, 
                      addGame, 
                      deleteId, 
                      updateLastId, 
                      fetched,
                      resetGame,
                      resetDeleteId }))(Invite)
