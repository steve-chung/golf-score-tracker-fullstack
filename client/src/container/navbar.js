import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText
} from '@material-ui/core'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'recompose'
import { logout } from '../store/action/auth'
import { connect } from 'react-redux'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  icon: {
    display: 'inline',
    verticalAlign: 'middle',
    paddingRight: '5px',
  },
})

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle(e) {
    this.setState((prevState) => {
      return {open: !prevState.open}
    })
  }

  render() {
    const { classes } = this.props
    const { isAuthenticated, user } = this.props.currentUser

    const list =
      <div className={classes.list}>
        <List>
          <ListItem>
            <Link to='/'onClick={this.handleToggle}><ListItemText primary={'Home'}/></Link>
          </ListItem>
          <Divider/>
          { isAuthenticated && (<div>
            <ListItem>
              <Link to='/history' onClick={this.handleToggle}><ListItemText primary={'History'}/></Link>
            </ListItem>
            <Divider/>
            <ListItem>
              <Link to='/scores' onClick={this.handleToggle}><ListItemText primary={'Play Game'}/></Link>
            </ListItem>
            <Divider/>
            <ListItem>
              <Link to='/performance' onClick={this.handleToggle}><ListItemText primary={'Performance'}/></Link>
            </ListItem>
            <Divider/>
          </div>)}
        </List>
      </div>

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.handleToggle}>
              <MenuIcon />
            </IconButton>
            <Drawer open={this.state.open} onClose={this.handleToggle}>
              <div>
                {list}
              </div>
            </Drawer>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <Link to='/' style={{textDecoration: 'none', color: 'white'}}>
               Golf Score Tracker
              </Link>
              {this.props.currentUser.isAuthenticated ? (
                <div style={{display:'inline', float:'right'}}>
                  <PermIdentityIcon className={classes.icon} style={{display:'inline'}}/>
                  <span style={{paddingRight: '10px'}}>Hello, {user.username}!</span>
                  <Link to='/' style={{textDecoration: 'none', color: 'white'}}     
                    onClick = {this.props.logout}>
                    Log out
                </Link>
              </div>
                
                ) : (
                  <span>
                    <Link to='/register' style={{textDecoration: 'none', color: 'white', float: 'right'}} >
                      Sign up
                    </Link>
                    <Link to='/login' style={{textDecoration: 'none', color: 'white', float: 'right', paddingRight:'1rem'}} >
                      Login
                    </Link>
                  </span>
               
                )}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>

    )

  }

}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default compose(withStyles(styles), 
    connect(mapStateToProps, {
    logout
    }))(Navbar)
