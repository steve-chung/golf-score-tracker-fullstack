import React, { Component } from 'react'
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider
} from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  add: {
    float: 'right',
    height: 80
  },
  title: {
    marginTop: '3.5rem',
    marginBottom: '2.5rem'
  },
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 400
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  list: {
    backgroundColor: theme.palette.background.paper
  }
})

class HistoryList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: {}
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(i) {
    const {open} = this.state
    let newOpen = {}
    if (open[i] === undefined) {
      newOpen = Object.assign(open, {[i]: false})
    }
    else {
      newOpen = Object.assign({}, open)
    }
    for (let key in newOpen) {
      if (+key === i) {
        newOpen[key] = !newOpen[key]
      }
      else {
        newOpen[key] = false
      }
      this.setState({
        open: newOpen
      })
    }
  }

  render() {
    let history = [ ]
    if (this.props.history) {
      history = this.props.history
    }
    const courseList = history.map((course) => {
      const {classes} = this.props
      const date = new Date(course.date)
      return (
        <div className={classes.list} key={course.id}>
          <List component='nav' >
            <ListItem button onClick={() => this.handleClick(course.id)}>
              <ListItemText primary={date.toDateString()} />
              <ListItemText primary={course.name} />
              {this.state.open[course.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.open[course.id]} timeout="auto" unmountOnExit>
              {
                course.player.map((p) => (
                  <List component="div" disablePadding key={p.id}>
                    <ListItem button className={classes.nested}>
                Player: {p.name}
                    </ListItem>
                    <ListItem button className={classes.nested}>
                Total Score: {p.totalScore}
                    </ListItem>
                  </List>
                ))
              }

            </Collapse>
          </List>
          <Divider/>

        </div>

      )
    })
    return (

      <Grid container direction='column' justify='center' alignItems='stretch'>
        <Grid item xs={12}>
          {courseList}
        </Grid>
      </Grid>

    )
  }
}

export default withStyles(styles)(HistoryList)
