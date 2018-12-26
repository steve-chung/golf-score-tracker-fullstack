import { SET_MESSAGE } from '../actionTypes'

export function setMessage(message) {
  return {
    type: SET_MESSAGE,
    message
  }
}
