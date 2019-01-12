import { GET_STAT } from '../actionTypes'


export default (state = null, action) => {
  switch (action.type) {
    case GET_STAT:
      return action.perform
    default:
      return state
  }
}
