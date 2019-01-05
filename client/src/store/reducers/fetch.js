import { FETCH } from '../actionTypes'

const DEFAULT_STATE = { fetched: false }

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case FETCH:
      return { fetched: true }
    default:
      return state
  }
}
