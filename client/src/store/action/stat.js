import { apiCall } from '../../services/api'
import { setToken } from '../../services/setHeader'
import { addError } from './errors'
import { GET_STAT } from '../actionTypes'

export function getStat(stat) {
  return {
    type: GET_STAT,
    stat
  }
}

export function getStatServer() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      return apiCall('get', '/api/stat/view')
        .then((newStat) => {
          console.log(newStat)
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