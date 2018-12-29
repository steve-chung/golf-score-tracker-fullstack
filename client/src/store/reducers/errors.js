import { ADD_ERROR, REMOVE_ERROR } from '../actionTypes'

export default (state = { message: null, code: null }, action) => {
  switch (action.type) {
    
    case ADD_ERROR:
      return { ...state,
              message: action.error.message, 
              code: action.error.code }
    case REMOVE_ERROR:
      return { ...state, message: null, code: null }
    default:
      return state
  }
}
