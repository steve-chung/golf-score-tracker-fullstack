import React, { Component } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Checkbox,
} from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#1C54F5',
    color: theme.palette.common.white,
    fontSize: '1.1rem'
  },
  body: {
    fontSize: '1rem',
  }
}))(TableCell)

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

class FriendsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: {}
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    const {open} = this.state
    console.log(e.target)
    const  i = +e.target.value
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
    }
    console.log(i)
    if (newOpen[i]) {
      this.props.handleDelete(i)
    }
    this.setState({
      open: newOpen
    })
  }

  render() {
    const { classes } = this.props
    const { smallWindows, players } = this.props
    console.log(this.props)
    console.log(this.state)
    const displayTable = () => {
      return (
        <Paper>
          <Table>
            <colgroup>
              <col style={{width: '30%'}}/>
              <col style={{width: '20%'}}/>
              <col style={{width: '50%'}}/>
            </colgroup>
            <TableHead>
              <TableRow>
                <CustomTableCell>Name</CustomTableCell>
                <CustomTableCell>Average Score</CustomTableCell>
                <CustomTableCell>Email</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerList}
            </TableBody>
          </Table>
        </Paper>
      )
    }
    const playerList = players.map((player) => (
      <TableRow className={classes.row}
        key={player.id}
        role='checkbox'
        >
        <CustomTableCell component='th' scope='row'>
          <Checkbox checked={player.id ? this.state.open[player.id]: false} 
          onChange={(e) => this.handleClick(e)} value={player.id.toString()}/>
          {player.name}
        </CustomTableCell>
        <CustomTableCell >
          {player.avgScore}
        </CustomTableCell>
        <CustomTableCell >
          {player.email}
        </CustomTableCell>
      </TableRow>
    ))

    const displayList = players.map((player) => {
      const {classes} = this.props
      return (
        <div className={classes.list} key={player.id}>
          <List component='nav' >
            <ListItem button onChange={() => this.handleClick(player.id)}>
              <Checkbox checked={this.state.open[player.id]} />
              <ListItemText primary={player.name} />
              {this.state.open[player.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.open[player.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                Average Score: {player.avgScore}
                </ListItem>
                <ListItem button className={classes.nested}>
                Email: {player.email}
                </ListItem>
              </List>
            </Collapse>
          </List>
          <Divider/>

        </div>

      )
    })
    return (
      <Grid container direction='column' justify='center' alignItems='stretch'>

        <Grid item xs={12}>
          {(smallWindows)
            ? displayList : displayTable()
          }

        </Grid>
      </Grid>
    )
  }

}

export default withStyles(styles)(FriendsTable)
