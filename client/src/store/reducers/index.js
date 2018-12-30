import { combineReducers } from 'redux'
import map from './map'
import errors from './errors'
import currentUser from './currentUser'
import fetch from './fetch'
import game from './game'
import message from './message'
import holes from './holes'

const rootReducer = combineReducers({
  map,
  errors,
  currentUser,
  fetch,
  game,
  message,
  holes
})

export default rootReducer
