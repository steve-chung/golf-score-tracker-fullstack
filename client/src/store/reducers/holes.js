import { CREATE_HOLES } from '../actionTypes'


const DEFAULT_STATE = {
  holes: []
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case CREATE_HOLES:
      return Object.assign({}, action.Newholes)
    default:
      return state
  }
}
