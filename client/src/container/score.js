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
import { saveHoles,
        addCurrentHole,
        // callCurrentHole,
        prevHole,
        createHoles } from '../store/action/holes'
import { createScoreServer,
         getScoreServer } from '../store/action/scores'

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
    this.props.playGame()
    let open = true
    const holes = localStorage.getItem('holes')
    console.log(holes)
    const currentHole = localStorage.getItem('currentHole')
    if (holes) {
      open = false
      this.props.createHoles(JSON.parse(holes).holes)
      this.props.addCurrentHole(JSON.parse(currentHole))
    }

    this.setState({
      open: open
    })
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
      const gameId = this.props.game.id
      const game = {
        game_id: gameId,
        holes: newHoles
      }
      console.log(this.props)
      console.log(game)
      this.props.saveHoles(game)
      this.setState({
        open: false
      })
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
    const { holes } = this.props
    let totalScore
    const gameId = this.props.game.id
    const playerScore = {
      game_id: gameId,
      firstClub,
      firstDistance,
      secondClub,
      secondDistance,
      stroksGreen,
      totalShots
    }
    
      // this.props.addCurrentHole(holes.holes[0])
    
    playerScore.hole_id = holes.currentHole.holeId
    const currentHoleIndex = holes.currentHole.holeNumber - 1
    const newHole = holes.currentHole.holeNumber
    totalScore = JSON.parse(localStorage.getItem('totalScore'))
    totalScore = !totalScore ? +playerScore.totalShots : +totalScore + playerScore.totalShots
    playerScore.totalScore = totalScore
    localStorage.setItem('totalScore', JSON.stringify(totalScore))

    this.props.addCurrentHole(holes.holes[newHole])
    console.log(playerScore)
    if (!holes.holes[currentHoleIndex].stat_id) {
      this.props.createScoreServer(playerScore)
    } else if (currentHoleIndex === 17) {
      this.props.history.push('/')
      localStorage.clear()
      return
    } else {
      this.props.getScoreServer(holes.holes[newHole].stat_id)
    }
    localStorage.setItem('score', JSON.stringify(playerScore))
    localStorage.setItem('currentHole', JSON.stringify(holes.holes[newHole]))
    // localStorage.getItem('totalScore')
    // localStorage.setItem('totalScore', totalScore)
    // this.props.nextHole()
    
    // const updatedPlayers = this.handleUpdatePlayer(playerNowObj, players, currentPlayer.id, playerScore, playerNow, holeIndex)
    // const nextHole = holes.indexOf(currentHole) + 1

    // if (nextPlayerIndex === players.length) {
    //   this.setState({
    //     players: updatedPlayers,
    //     currentHole: holes[nextHole],
    //     currentPlayer: players[0]
    //   })
    //   if (nextHole === 18) {
    //     this.props.history.push('/')
    //     localStorage.clear()
    //   }
    // }
    // else {
    //   this.setState({
    //     players: updatedPlayers,
    //     currentPlayer: players[nextPlayerIndex]
    //   })
    // }
    // parsed.currentPlayer = currentPlayer
    // localStorage.setItem('localData', JSON.stringify(parsed))
    // this.handlePutScores(updatedPlayers)
  }

  // handlePutScores(players) {
  //   const { gameId, courseName, date } = this.state

  //   fetch(`/data/games/${gameId}`, {method: 'PUT',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({course: courseName, date: date, players: players})})
  //     .then(res => res.json())
  //     .then(res =>
  //       console.log(res))
  //     .catch(err =>
  //       console.error(err))

  // }

  handleOnPrev(e) {
    // const { players, currentHole, currentPlayer } = this.state
    const { holes } = this.props
    console.log(holes.currentHole)
    const gameId = this.props.game.id
    const currentHoleIndex = holes.currentHole.holeNumber - 1
    let newHole
    newHole = currentHoleIndex > -1 ? currentHoleIndex - 1 : 0
    console.log(holes.holes[newHole])
    this.props.addCurrentHole(holes.holes[newHole])
    this.props.getScoreServer(holes.holes[newHole].stat_id)
    // if (!holeIndex) {
    //   holeIndex = 0
    // }
    // else {
    //   if (!playerIndex) {
    //     holeIndex--
    //   }
    //   else {
    //     holeIndex = currentHole
    //   }
    // }

    // if (playerIndex > 0) {
    //   playerIndex--
    // }
    // else {
    //   playerIndex = 0
    // }

    // this.setState({
    //   currentHole: newHoles[holeIndex],
    //   currentPlayer: players[playerIndex]
    // })
  }

  handleCancel(e) {
    this.setState({
      open: false
    })
  }
  render() {
    const { holes, score } = this.props
    const { currentHole } = this.props.holes
    const { courseName } = this.props.game
    if (holes.holes) {
      localStorage.setItem('holes', JSON.stringify(holes))
    }
    console.log(this.props)
    console.log(this.state.open)
    return (
      <div className='container' style={{margin: '0, auto'}}>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          // keepMounted
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
          currentHole={currentHole}
          score = {score}
          handleOnNext={this.handleOnNext}
          handleOnPrev={this.handleOnPrev}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    game: state.game,
    holes: state.holes,
    score: state.scores
  }
}

export default compose(withStyles(styles),
                      connect(mapStateToProps, {
                               playGame,
                              saveHoles,
                              addCurrentHole,
                              createHoles,
                              prevHole,
                              createScoreServer,
                              getScoreServer }))(Score)
