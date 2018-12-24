import React, { Component, Fragment } from 'react'
import { Paper, Tabs, Tab, AppBar } from '@material-ui/core'
import BarChart from '../component/graph'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    backgroundColor: '#2F4A6D'
  }
})

class Performance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const date = Date.now()
    fetch('/data/games', {method: 'GET'})
      .then(res => res.json())
      .then(res => {
        const history = res.filter(coures => (
          coures.date < date)).map(course => {
          let courseObj = {}
          let initObj = {}
          const scoreStat = course.players[0].hole.reduce((acc, hole) => {
            let count = 0
            if (!acc[hole.firstClub]) {
              acc[hole.firstClub] = +hole.firstDistance
              acc.count = Object.assign(initObj, {[hole.firstClub]: 1})
            }
            else {
              acc[hole.firstClub] += +hole.firstDistance
              count = acc.count[hole.firstClub] + 1
              acc.count = Object.assign(acc.count, {[hole.firstClub]: count})
            }
            if (!acc[hole.secondClub]) {
              acc[hole.secondClub] = +hole.secondDistance
              acc.count = Object.assign(initObj, {[hole.secondClub]: 1})
            }
            else {
              count = acc.count[hole.secondClub] + 1
              acc[hole.secondClub] += +hole.secondDistance
              acc.count = Object.assign(acc.count, {[hole.secondClub]: count})
            }
            acc.puttsGreen += +hole.stroksGreen
            return acc
          }, {puttsGreen: 0})
          courseObj = Object.assign({},
            {id: course.id,
              date: course.date,
              playerName: course.players[0].name,
              scores: +course.players[0].totalScore,
              scoreStats: scoreStat})
          return courseObj
        })
        this.averageData(history)
      })
      .catch(err => {
        console.error(err)
      })
  }

  averageData(golfStat) {

    const finalStat = golfStat.map(stat => {
      let date = new Date(stat.date)
      let averageStat = {}
      for (let key in stat.scoreStats) {
        if (key === 'puttsGreen') {
          averageStat.puttsGreen = (stat.scoreStats[key] / 18).toFixed(2)
        }
        else if (key !== 'count') {
          averageStat[key] = (stat.scoreStats[key] / stat.scoreStats.count[key]).toFixed(2)
        }
      }
      return Object.assign({}, {
        date: date.toDateString(),
        playerName: stat.playerName,
        totalScore: stat.scores,
        averageStat: averageStat})
    })
    this.setState({
      finalStat
    })
  }

  handleChange(event, value) {
    this.setState({ value })
  }

  render() {
    const { classes } = this.props
    const { value } = this.state
    return (
      <Fragment>
        <AppBar position="static" color='default'>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="Total Score" />
            <Tab label="Driver" />
            <Tab label="3-Wood" />
            <Tab label="3-Iron" />
            <Tab label="6-Iron" />
            <Tab label="Putts on Green" />
            <Tab label="Item Seven" />
          </Tabs>
          <h2 style={{textAlign: 'center'}}>
          Performance
          </h2>
          <main className={classes.layout} style={{margin: '0, auto'}}>
            {value === 0 && <Paper className={classes.paper} elevation={1}>
              { this.state.finalStat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.state}
                category = 'totalScore'>
              </BarChart> }
            </Paper>}
            {value === 1 && <Paper className={classes.paper} elevation={1}>
              { this.state.finalStat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.state}
                category = 'Driver'>
              </BarChart> }
            </Paper>}
            {value === 2 && <Paper className={classes.paper} elevation={1}>
              { this.state.finalStat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.state}
                category = '3-wood'>
              </BarChart> }
            </Paper>}
            {value === 3 && <Paper className={classes.paper} elevation={1}>
              { this.state.finalStat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.state}
                category = '3-iron'>
              </BarChart> }
            </Paper>}
            {value === 4 && <Paper className={classes.paper} elevation={1}>
              { this.state.finalStat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.state}
                category = '6-iron'>
              </BarChart> }
            </Paper>}
            {value === 5 && <Paper className={classes.paper} elevation={1}>
              { this.state.finalStat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.state}
                category = 'puttsGreen'>
              </BarChart> }
            </Paper>}
          </main>
        </AppBar>

      </Fragment>

    )
  }
}

export default withStyles(styles)(Performance)
