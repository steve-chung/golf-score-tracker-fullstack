import { combineReducers } from 'redux'
import map from './map'
import errors from './errors'
import currentUser from './currentUser'
import fetch from './fetch'
import game from './game'
import message from './message'

const rootReducer = combineReducers({
  map,
  errors,
  currentUser,
  fetch,
  game,
  message
})

export default rootReducer
