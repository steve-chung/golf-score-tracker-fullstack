import { apiCall } from '../../services/api'
import { setToken } from '../../services/setHeader'
import { addError } from './errors'
import { setMessage } from './message'
import { CREATE_HOLES } from '../actionTypes'



export function CreateHoles(Newholes) {
    return {
        type: CREATE_HOLES,
        Newholes
    }
}




export function saveHoles(holes) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      console.log(holes)
      return apiCall('post', '/api/holes', holes)
        .then((newHoles) => {
          console.log(newHoles)
          dispatch(CreateHoles(newHoles))
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
