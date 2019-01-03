import { apiCall } from '../../services/api'
import { setToken } from '../../services/setHeader'
import { CREATE_SCORE, UPDATE_SCORE, GET_SCORE } from '../actionTypes'
import { addError } from './errors'
import { setMessage } from './message'


export function createScore(score) {
  return {
    type: CREATE_SCORE,
    score
  }
}

export function updateScore(score) {
  return {
    type: UPDATE_SCORE,
    score
  }
}

export function getScore(score) {
  return {
    type: GET_SCORE,
    score
  }
}



export function createScoreSever(score) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      return apiCall('post', '/api/stat', score)
        .then(newScore => {
          dispatch(createScore(newScore))
          dispatch(setMessage(newScore.message))
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


export function getScoreServer()