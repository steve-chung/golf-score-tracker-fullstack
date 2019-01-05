import { FETCH, NO_FETCH } from '../actionTypes'


export function fetched() {
  return {
    type: FETCH
  }
}

export function notFetch() {
  return {
    type: NO_FETCH
  }
}
