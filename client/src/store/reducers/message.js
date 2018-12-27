import { SET_MESSAGE, REMOVE_MESSAGE } from '../actionTypes'

const DEFAULT_STATE = {
  message: ''
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        message: action.message
      }
    case REMOVE_MESSAGE:
      return {
        message: ''
      }
    default:
      return state
  }
}
