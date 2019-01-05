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
  
    playerScore.hole_id = holes.currentHole.holeId
    const currentHoleIndex = holes.currentHole.holeNumber - 1
    const newHole = holes.currentHole.holeNumber
    totalScore = JSON.parse(localStorage.getItem('totalScore'))
    totalScore = !totalScore ? +playerScore.totalShots : +totalScore + playerScore.totalShots
    playerScore.totalScore = totalScore
    localStorage.setItem('totalScore', JSON.stringify(totalScore))

    this.props.addCurrentHole(holes.holes[newHole])
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
  }

  handleOnPrev(e) {
    const { holes } = this.props
    const currentHoleIndex = holes.currentHole.holeNumber - 1
    let newHole
    newHole = currentHoleIndex > -1 ? currentHoleIndex - 1 : 0
    this.props.addCurrentHole(holes.holes[newHole])
    this.props.getScoreServer(holes.holes[newHole].stat_id)
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
    return (
      <div className='container' style={{margin: '0, auto'}}>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
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
