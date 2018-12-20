import { apiCall, setTokenHeader } from "../../services/api";
import { SET_CURRENT_USER } from "../actionTypes";
import { addError, removeError } from "./errors";
import Cookies from 'universal-cookie'
import { access } from "fs";

const cookies = new Cookies()

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  }
}

export function setAuthorizationToken(token) {
  setTokenHeader(token)
}

export function logout() {
  return dispatch => {
    // localStorage.clear()
    cookies.remove('accessToken', {httpOnly: true})
    cookies.remove('refreshToken', {httpOnly: true})
    setAuthorizationToken(false, false)
    dispatch(setCurrentUser({}))
  }
}

export function authUser(type, userData) {
  return dispatch => {
    // wrap our thunk in a promise so we can wait for the API call
    return new Promise((resolve, reject) => {
      return apiCall('post', `/api/auth/${type}`, userData)
        .then(({ accessToken, refreshToken, expire, username }) => {
          cookies.set('accessToken', accessToken)
          cookies.set('refreshToken', refreshToken)
          cookies.set('expire', expire)
          setAuthorizationToken(accessToken)
          dispatch(setCurrentUser(username))
          dispatch(removeError())
          resolve() // indicate that the API call succeeded
        })
        .catch(err => {
          dispatch(addError(err.message))
        })
    })
  }
}

