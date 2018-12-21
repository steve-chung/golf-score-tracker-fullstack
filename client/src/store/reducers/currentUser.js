import { SET_CURRENT_USER, SET_IS_EXPIRED } from '../actionTypes'

const DEFAULT_STATE = {
  isAuthenticated: false, // hopefully be true, when logged in
  isFresh: false,
  isExpired: false,
  user: {} // all the user info when logged in
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        // turn empty object into false or if there are keys, true
        isAuthenticated: !!Object.keys(action.username).length,
        isFresh: action.fresh,
        user: action.username,
        isExpired: action.expired
      }
    case SET_IS_EXPIRED:
      return {
        isExpired: action.expired
      }
    default:
      return state
  }
}
