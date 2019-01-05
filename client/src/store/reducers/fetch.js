import { FETCH, NO_FETCH } from '../actionTypes'

const DEFAULT_STATE = { fetched: false }

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case FETCH:
      return { fetched: true }
    case NO_FETCH:
      return { fetched: false }
    default:
      return state
  }
}
