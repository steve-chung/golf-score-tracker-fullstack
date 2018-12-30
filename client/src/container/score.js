import React, { Component } from 'react'
import {
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Slide} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ScoreCard from '../container/scoreCard'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { playGame } from '../store/action/game'

function Transition(props) {
  return <Slide direction="up" {...props} />
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

let holes = []
for (let i = 1; i < 19; i++) {
  holes.push(i)
}

function holeInput() {
  return holes.map((hole) => {
    let holeLabel = 'Hole ' + hole
    return (<TextField
      key={hole}
      margin='dense'
      id='hole'
      label= {holeLabel}
      style={{width: 80}}/>)
  })
}
class Score extends Component {
  constructor(props) {
    super(props)
    this.state = {
      players: [{

      }],
      courseName: '',
      open: false,
      currentHole: 1,
      currentPlayer: null,
      prevHolePlayers: [],
      gameId: 0
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleOnNext = this.handleOnNext.bind(this)
    this.handleOnPrev = this.handleOnPrev.bind(this)
  }

  componentDidMount() {
    // fetch('/data/games', {method: 'GET'})
    //   .then(res => res.json())
    //   .then(res => {
    //     let newPlayers = [ ]
    //     let currentHole = 1
    //     const lastCourse = res.length - 1
    //     let open = true
    //     for (let i = 0; i < res[lastCourse].players.length; i++) {
    //       newPlayers.push(res[lastCourse].players[i])
    //     }
    //     let localData = localStorage.getItem('localData')
    //     const parsed = JSON.parse(localData)
    //     let currentPlayer = res[lastCourse].players[0]
    //     let newHoles = null
    //     if (parsed) {
    //       open = false
    //       currentPlayer = parsed.currentPlayer
    //       if (res[lastCourse].players[0].hole) {
    //         const lastHoleIndex = res[lastCourse].players[0].hole.length
    //         currentHole = parsed.holes[lastHoleIndex]
    //       }
    //       else {
    //         currentHole = parsed.holes[0]
    //       }
    //       newHoles = parsed.holes
    //     }
    this.props.playGame()
      //   this.setState({
      //     players: newPlayers,
      //     open: open,
      //     date: res[lastCourse].date,
      //     courseName: res[lastCourse].course,
      //     currentPlayer: currentPlayer,
      //     currentHole,
      //     holes: newHoles,
      //     gameId: res[lastCourse].id
      //   })
      // })
      // .catch(err => {
      //   console.error(err)
      // })
  }

  handleClose(e) {
    e.preventDefault()
    if (typeof (e.target[0].value) !== 'string') {
      this.setState({
        open: false
      })
    }
    else {
      let eachHole = {}
      const newHoles = holes.map((hole, i) => {
        eachHole = {}
        eachHole[hole] = +e.target[i].value
        return eachHole
      })
      this.setState({
        open: false,
        holes: newHoles,
        currentHole: newHoles[0]
      })
      let localData = {
        open: false,
        holes: newHoles
      }
      localStorage.setItem('localData', JSON.stringify(localData))
    }
    e.target.reset()
  }

  handleUpdatePlayer(playerNowObj, players, currentPlayerId, playerScore, playerNow, holeIndex) {
    let updatedPlayers = players.filter(player => (
      player.id !== currentPlayerId
    ))
    updatedPlayers.push(playerNowObj)
    if (JSON.stringify(playerNow[0].hole[holeIndex]) === JSON.stringify(playerScore)) {
      updatedPlayers = players
    }
    return updatedPlayers
  }

  handleOnNext(firstClub, firstDistance, secondClub, secondDistance, stroksGreen, totalShots) {
    const { currentHole, players, currentPlayer, holes } = this.state
    const playerScore = {
      hole: currentHole,
      firstClub,
      firstDistance,
      secondClub,
      secondDistance,
      stroksGreen,
      totalShots
    }
    const holeIndex = Object.keys(playerScore.hole)[0] - 1
    let newHole = []
    newHole.push(playerScore)
    const nextPlayerIndex = players.indexOf(currentPlayer) + 1
    let playerNow = players.filter(player => (
      player.id === currentPlayer.id))
    let playerNowObj = {}
    if (!playerNow[0].hole) {
      playerNow[0].hole = newHole
      playerNow[0].totalScore = +playerScore.totalShots
      playerNowObj = playerNow[0]
    }
    else if (JSON.stringify(playerNow[0].hole[holeIndex]) !== JSON.stringify(playerScore)) {
      if (JSON.stringify(playerNow[0].hole[holeIndex]) === undefined) {
        playerNow[0].hole.push(playerScore)
        playerNow[0].totalScore += +playerScore.totalShots
      }
      else {
        playerNow[0].hole[holeIndex] = playerScore
        playerNow[0].totalScore += +playerScore.totalShots
      }
      playerNowObj = playerNow[0]
    }
    const updatedPlayers = this.handleUpdatePlayer(playerNowObj, players, currentPlayer.id, playerScore, playerNow, holeIndex)
    const nextHole = holes.indexOf(currentHole) + 1
    const localData = localStorage.getItem('localData')
    let parsed = JSON.parse(localData)

    if (nextPlayerIndex === players.length) {
      this.setState({
        players: updatedPlayers,
        currentHole: holes[nextHole],
        currentPlayer: players[0]
      })
      if (nextHole === 18) {
        this.props.history.push('/')
        localStorage.clear()
      }
    }
    else {
      this.setState({
        players: updatedPlayers,
        currentPlayer: players[nextPlayerIndex]
      })
    }
    parsed.currentPlayer = currentPlayer
    localStorage.setItem('localData', JSON.stringify(parsed))
    this.handlePutScores(updatedPlayers)
  }

  handlePutScores(players) {
    const { gameId, courseName, date } = this.state

    fetch(`/data/games/${gameId}`, {method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({course: courseName, date: date, players: players})})
      .then(res => res.json())
      .then(res =>
        console.log(res))
      .catch(err =>
        console.error(err))

  }

  handleOnPrev(e) {
    const { players, currentHole, currentPlayer } = this.state
    const newHoles = this.state.holes
    let playerIndex = players.indexOf(currentPlayer)
    let holeIndex = newHoles.indexOf(currentHole)
    if (!holeIndex) {
      holeIndex = 0
    }
    else {
      if (!playerIndex) {
        holeIndex--
      }
      else {
        holeIndex = currentHole
      }
    }

    if (playerIndex > 0) {
      playerIndex--
    }
    else {
      playerIndex = 0
    }

    this.setState({
      currentHole: newHoles[holeIndex],
      currentPlayer: players[playerIndex]
    })
  }

  handleCancel(e) {
    this.setState({
      open: false
    })
  }
  render() {
    const { courseName, currentPlayer, currentHole } = this.state
    return (
      <div className='container' style={{margin: '0, auto'}}>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description">
          <form onSubmit = {this.handleClose}>
            <DialogTitle id="alert-dialog-slide-title">
            Pleaes enter pars for each hole at {courseName}?
            </DialogTitle>
            <DialogContent>
              {holeInput()}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancel} color="primary">
              Cancel
              </Button>
              <Button type='submit' color="primary">
              Submit
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <h1 className='title'>Welcome to {courseName}</h1>
        <ScoreCard
          currentPlayer={currentPlayer}
          currentHole={currentHole}
          handleOnNext={this.handleOnNext}
          handleOnPrev={this.handleOnPrev}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    game: state.game
  }
}

export default compose(withStyles(styles),
                      connect(mapStateToProps, {
                               playGame}))(Score)
