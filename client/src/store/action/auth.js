import { apiCall, setTokenHeader } from '../../services/api'
import {
  SET_CURRENT_USER,
  SET_IS_EXPIRED,
  SET_CURRENT_USER_DEFAULT
} from '../actionTypes'
import { addError, removeError } from './errors'
import { setMessage } from './message'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  }
}

export function setCurrentUserDefault() {
  return {
    type: SET_CURRENT_USER_DEFAULT
  }
}


export function setIsExpired(isExpired) {
  return {
    type: SET_IS_EXPIRED,
    isExpired
  }
}

export function setAuthorizationToken(token) {
  setTokenHeader(token)
}

export function logout() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return apiCall('post', '/api/auth/logout')
        .then(({ message }) => {
          // localStorage.clear()
          cookies.remove('accessToken', {httpOnly: true})
          cookies.remove('refreshToken', {httpOnly: true})
          setAuthorizationToken(false, false)
          dispatch(setCurrentUserDefault())
          dispatch(setMessage(message))
        })
        .catch(err => {
          dispatch(addError({
            message: err.data.message,
            code: err.status
          }))
          dispatch(addError(err))
        })
    })
  }
}

export function authUser(type, userData) {
  return dispatch => {
    // wrap our thunk in a promise so we can wait for the API call
    return new Promise((resolve, reject) => {
      return apiCall('post', `/api/auth/${type}`, userData)
        .then(({ accessToken, refreshToken, expire, ...user }) => {
          let fresh = false
          cookies.set('accessToken', accessToken, {httpOnly: true})
          cookies.set('refreshToken', refreshToken, {httpOnly: true})
          cookies.set('expire', expire, {httpOnly: true})
          if ((type === 'register') || (type === 'login')) {
             fresh = true
          }
          if (type !== 'refresh') {
            setAuthorizationToken(accessToken)
          } else {
            setAuthorizationToken(refreshToken)
          }
          dispatch(setCurrentUser({user, fresh, expired: false}))
          console.log('here')
          dispatch(removeError())
          resolve() // indicate that the API call succeeded
        })
        .catch((err) => {
          console.log(err)
          dispatch(addError({message: err.data.message, code: err.status}))
        })
    })
  }
}

export function isExpired() {
  return dispatch =>
  { 
    const expire = cookies.get('expire')
    if (+expire < Date.now()) {
      dispatch(setIsExpired({expired: true}))
    }
  }
}
