import { combineReducers } from 'redux'
import map from './map'
import errors from './errors'
import currentUser from './currentUser'

const rootReducer = combineReducers({
  map,
  errors,
  currentUser
})

export default rootReducer
