import { FETCH } from '../actionTypes'

const DEFAULT_STATE = { fetch: false }

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case FETCH:
      return { fetch: true }
    default:
      return state
  }
}
