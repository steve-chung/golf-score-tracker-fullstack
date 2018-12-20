import React, { Component } from 'react'
import HistoryList from '../component/historyList'

class History extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: null
    }
  }
  componentDidMount() {
    const date = Date.now()
    fetch('/data/games', {method: 'GET'})
      .then(res => res.json())
      .then(res => {
        let playerList = []
        let courseObj = {}
        const history = res.filter(coures => (
          coures.date < date)).map(course => {
          playerList = course.players.map(player => {
            return Object.assign({}, {id: player.id, name: player.name, totalScore: player.totalScore})
          })
          courseObj = Object.assign({},
            {id: course.id, date: course.date, name: course.course, player: playerList})
          return courseObj
        })
        this.setState({
          history
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    const {history} = this.state
    return (
      <div className='container' style={{width: '80%', margin: 'auto'}}>
        <h1 className='title'>Course History</h1>
        <HistoryList history={history} />
      </div>
    )
  }
}

export default History
