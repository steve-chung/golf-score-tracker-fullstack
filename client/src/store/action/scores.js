import { apiCall } from '../../services/api'
import { setToken } from '../../services/setHeader'
import { CREATE_SCORE, UPDATE_SCORE, GET_SCORE } from '../actionTypes'
import { addStatId } from './holes'
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



export function createScoreServer(score) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      return apiCall('post', '/api/stat', score)
        .then(newScore => {
          dispatch(createScore(newScore))
          dispatch(addStatId(score.hole_id, newScore.stat_id))
          dispatch(setMessage(newScore.message))
          resolve()
        })
        .catch(err => {
          dispatch(addError({
            message: err.data.message,
            code: err.status
          }))
          reject(err)
        })
    })
  }
}

export function getScoreServer(stat_id) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      return apiCall('get', `/api/stat/${stat_id}`)
        .then(newScore => {
          console.log(newScore)
          dispatch(getScore(newScore))
          localStorage.setItem('score', JSON.stringify(newScore))
          resolve()
        })
        .catch(err => {
          dispatch(addError({
            message: err.data.message,
            code: err.status
          }))
          reject(err)
        })
    })
  }
}


export function putScoreServer(stat_id, score) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      return apiCall('put', `/api/stat/${stat_id}`, score)
        .then(newScore => {
          dispatch(getScore(newScore))
          resolve()
        })
        .catch(err => {
          dispatch(addError({
            message: err.data.message,
            code: err.status
          }))
          reject(err)
        })
    })
  }
}
