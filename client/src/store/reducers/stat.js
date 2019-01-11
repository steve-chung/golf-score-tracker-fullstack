import { GET_STAT } from '../actionTypes'


export default (state = [{test:0}], action) => {
  switch (action.type) {
    case GET_STAT:
      return action.stat
    default:
      return state
  }
}
