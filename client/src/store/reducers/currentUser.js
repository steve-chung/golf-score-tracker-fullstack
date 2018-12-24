import { SET_CURRENT_USER, SET_IS_EXPIRED, SET_CURRENT_USER_DEFAULT } from '../actionTypes'

const DEFAULT_STATE = {
  isAuthenticated: false, // hopefully be true, when logged in
  isFresh: false,
  isExpired: false,
  user: {username:'', id:0} // all the user info when logged in
}

export default (state = DEFAULT_STATE, action) => {
  console.log(action)
  switch (action.type) {
    case SET_CURRENT_USER:
      return{
        // turn empty object into false or if there are keys, true
        isAuthenticated: !!Object.keys(action.user.user.username).length,
        isFresh: action.user.fresh,
        user: {username: action.user.user.username,
                id: action.user.user.id},
        isExpired: action.user.expired
      }
    case SET_IS_EXPIRED:
      return Object.assign({}, state, {
        isExpired: action.expired
      })
    case SET_CURRENT_USER_DEFAULT:
      return {
        isAuthenticated: false, // hopefully be true, when logged in
        isFresh: false,
        isExpired: false,
        user: {
          username: '',
          id: 0
        } // all the user info when logged in
      }
    default:
      return state
  }
  console.log(state)
}
