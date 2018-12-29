import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Main from './main'
import { Provider } from 'react-redux'
import { configureStore } from '../store'
import { setAuthorizationToken, setCurrentUser, isExpired, authUser } from '../store/action/auth'
import Navbar from '../container/navbar'
import jwtDecode from 'jwt-decode'
import Cookies from 'universal-cookie'

const store = configureStore()
const cookies = new Cookies()

function setTokenHeader(token) {
  if (token) {
    setAuthorizationToken(token)
    // prevent someone from manually tampering with the key of jwtToken in localStorage
    try {
      console.log(jwtDecode(token))
      if (!username) {
        store.dispatch(authUser('refresh', {}))
      } else {
        store.dispatch(setCurrentUser(jwtDecode(token)))
      }
    } catch (e) {
      store.dispatch(setCurrentUser({}))
    }
  }
}

store.dispatch(isExpired())
const username = store.getState().currentUser.user.username
const Expired = store.getState().currentUser.isExpired
if (!Expired) {
  if (!username) {
    setTokenHeader(cookies.get('refreshToken'))
  } else {
    setTokenHeader(cookies.get('accessToken'))
  }
} else {
  setTokenHeader(cookies.get('refreshToken'))
  }

const App = () => (

  <Provider store={store}>
    <Router>
      <div className="onboarding">
        <Navbar/>
        <Main />
      </div>
    </Router>
  </Provider>

)

export default App
