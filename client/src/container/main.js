import React, { Component } from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import Home from './home'
import Invite from './invite'
import Scores from './score'
import History from './history'
import Performance from './performance'
import AuthForm from '../component/authForm'
import { connect } from 'react-redux'
import { authUser } from '../store/action/auth'
import { removeError } from '../store/action/errors'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      courseName: ''
    }
    this.handleCourseName = this.handleCourseName.bind(this)
  }

  handleCourseName(courseName) {
    this.setState({
      courseName
    })
  }
  render() {
    const { courseName } = this.state
    const { authUser, errors, removeError, currentUser } = this.props
    return (
      <div className="container">
        <Switch>
          <Route
            exact path='/'
            render={() =>
              <Home handleCourseName={this.handleCourseName}
                currentUser = {currentUser} {...this.props} />}/>
          <Route path="/invite" render={() =>
            <Invite smallWindows={!window.matchMedia('(min-width: 500px)').matches}
              courseName = {courseName} {...this.props} />}/>
          <Route path='/scores' component={Scores}/>
          <Route path='/history' component={History}/>
          <Route path='/performance' component={Performance}/>
          <Route
            exact
            path='/login'
            render={() => {
              return (
                <AuthForm
                  removeError={removeError}
                  errors={errors}
                  onAuth={authUser}
                  buttonText='Log in'
                  heading='Welcome Back.'
                  {...this.props}
                />
              )
          }} />
          <Route
            exact
            path='/register'
            render={() => {
              return (
                <AuthForm
                  removeError={removeError}
                  errors={errors}
                  onAuth={authUser}
                  register
                  buttonText='Sign me up!'
                  heading='Join Golf Score Tracker Today!!'
                  {...this.props}
                />
              )
            }}/>
          <Redirect to='/'/>
        </Switch>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    errors: state.errors
  }
}
export default withRouter(connect(mapStateToProps, 
                          { authUser, removeError})(Main))

