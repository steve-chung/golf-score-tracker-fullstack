import React, { Component, Fragment } from 'react'
import { Paper, Tabs, Tab, AppBar } from '@material-ui/core'
import BarChart from '../component/graph'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { getStatServer } from '../store/action/stat'

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
    this.props.getStatServer()
  }

  handleChange(event, value) {
    this.setState({ value })
  }

  render() {
    const { classes, stat } = this.props
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
              { stat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.props.stat}
                category = 'totalScore'>
              </BarChart> }
            </Paper>}
            {value === 1 && <Paper className={classes.paper} elevation={1}>
              { stat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.props.stat}
                category = 'Driver'>
              </BarChart> }
            </Paper>}
            {value === 2 && <Paper className={classes.paper} elevation={1}>
              { stat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.props.stat}
                category = '3-wood'>
              </BarChart> }
            </Paper>}
            {value === 3 && <Paper className={classes.paper} elevation={1}>
              { stat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.props.stat}
                category = '3-iron'>
              </BarChart> }
            </Paper>}
            {value === 4 && <Paper className={classes.paper} elevation={1}>
              { stat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.props.stat}
                category = '6-iron'>
              </BarChart> }
            </Paper>}
            {value === 5 && <Paper className={classes.paper} elevation={1}>
              { stat && <BarChart size={[600, 500]}
                style={{margin: 'auto'}}
                data = {this.props.stat}
                category = 'puttsGreen'>
              </BarChart> }
            </Paper>}
          </main>
        </AppBar>

      </Fragment>

    )
  }
}

function mapStateToProps(state) {
  return {
      stat: state.stat
  }
}

export default compose(withStyles(styles), 
                connect(mapStateToProps,
                    {  getStatServer }))(Performance)

