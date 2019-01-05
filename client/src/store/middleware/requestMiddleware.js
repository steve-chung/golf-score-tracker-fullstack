import Cookies from 'universal-cookie'
import { apiCall, setTokenHeader } from '../../services/api'
import { addError } from '../action/errors'
import { setCurrentUserDefault } from '../action/auth'

const cookies = new Cookies()

const requestMiddleware = store => next => action => {
  if (typeof action === 'function')
    return action(store.dispatch, store.getState)
  const { fetched } = store.getState().fetch
  if (fetched) {
    console.log('fetched')
    const refreshThreshold = (new Date().getTime() + 300000) // 5 minutes from now
    const expire = cookies.get('expire')
    const refresh_token = cookies.get('refreshToken')
    if (refresh_token && refreshThreshold > expire) {
      setTokenHeader(refresh_token)
      apiCall('POST', '/api/auth/refresh')
        .then(
          ({accessToken}) => {
            cookies.set('accessToken', accessToken)
            return next(action)
          })
        .catch(err => {
          store.dispatch(addError(err))
          store.dispatch(setCurrentUserDefault())
        })
    }
  }
  return next(action)
}

export default requestMiddleware
