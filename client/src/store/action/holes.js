import { apiCall } from '../../services/api'
import { setToken } from '../../services/setHeader'
import { addError } from './errors'
import { CREATE_HOLES, ADD_CURRENT_HOLE, NEXT_HOLE, PREV_HOLE, ADD_HOLE_STAT_ID } from '../actionTypes'

export function createHoles(Newholes) {
  return {
    type: CREATE_HOLES,
    Newholes
  }
}

export function nextHole(nextHole) {
  return {
    type: NEXT_HOLE,
    nextHole
  }
}

export function prevHole() {
  return {
    type: PREV_HOLE
  }
}

export function addCurrentHole(currentHole) {
  return {
    type: ADD_CURRENT_HOLE,
    currentHole
  }
}

export function addStatId(hole_id, statId) {
  return {
    type: ADD_HOLE_STAT_ID,
    hole_id,
    statId
  }
}

export function saveHoles(holes) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      return apiCall('post', '/api/holes', holes)
        .then((newHoles) => {
          holes.holes = newHoles
          localStorage.setItem('holes', JSON.stringify(newHoles))
          localStorage.setItem('currentHole', JSON.stringify(newHoles[0]))
          dispatch(createHoles(newHoles))
          dispatch(addCurrentHole(newHoles[0]))
          resolve()
        })
        .catch(err => {
          dispatch(addError({
            message: err.data.message,
            code: err.status
          }))
          dispatch(addError(err))
          reject(err)
        })
    })
  }
}
