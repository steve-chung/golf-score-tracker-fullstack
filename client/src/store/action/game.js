import { apiCall, setTokenHeader } from '../../services/api'
import { setToken } from '../../services/setHeader'
import { ADD_GAME,
        REMOVE_GAME,
        ADD_GAME_ID,
        UPDATE_LAST_ID,
        UPDATE_DELETE_ID,
        RESET_GAME,
        RESET_DELETE_ID } from '../actionTypes'
import { addError } from './errors'
import { setMessage } from './message'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export function addGame(player) {
  return {
    type: ADD_GAME,
    player
  }
}

export function updateLastId() {
  return {
    type: UPDATE_LAST_ID
  }
}

export function deleteId(id) {
  return {
    type: UPDATE_DELETE_ID,
    id
  }
}

export function resetGame() {
  return {
    type: RESET_GAME
  }
}

export function resetDeleteId() {
  return {
    type: RESET_DELETE_ID
  }
}
export function removeGame() {
  return {
    type: REMOVE_GAME
  }
}

export function addGameId(id) {
  return {
    type: ADD_GAME_ID,
    id
  }
}



export function updateGame(game) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      return apiCall('post', '/api/reserve', game)
        .then(newGame => {
          dispatch(addGameId(newGame.id))
          dispatch(setMessage(newGame.message))
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

export function playGame() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      return apiCall('get', '/api/playGame')
        .then(res => {
          console.log(res)
          resolve()
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  }
}
