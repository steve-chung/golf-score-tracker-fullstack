import { GET_STAT } from '../actionTypes'


export default (state = [], action) => {
  switch (action.type) {
    case GET_STAT:
      return action.stat
    default:
      return state
  }
}
