import { CREATE_SCORE, UPDATE_SCORE, GET_SCORE } from '../actionTypes'

const DEFAULT_STATE = {
  score: {},
  deadEnd: false
}


export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case CREATE_SCORE:
      return Object.assign({}, action.score)
    case UPDATE_SCORE:
      return Object.assign({}, state, action.score)
    case GET_SCORE:
      return Object.assign({}, state, action.score)
    default:
      return state
  }
}
