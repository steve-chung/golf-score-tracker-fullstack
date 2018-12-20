import React, { Component } from 'react'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import Home from './home'
import Invite from './invite'
import Scores from './score'
import History from './history'
import Performance from './performance'

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
    return (
      <div className="container">
        <Switch>
          <Route
            exact path="/"
            render={() =>
              <Home handleCourseName={this.handleCourseName}
                {...this.props} />}/>
          <Route path="/invite" render={props =>
            <Invite smallWindows={!window.matchMedia('(min-width: 500px)').matches}
              courseName = {courseName} {...this.props} />}/>
          <Route path='/scores' component={Scores}/>
          <Route path='/history' component={History}/>
          <Route path='/performance' component={Performance}/>
          <Redirect to="/"/>
        </Switch>
      </div>
    )
  }
}
export default withRouter(Main)
