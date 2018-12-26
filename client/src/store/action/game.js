import { apiCall, setTokenHeader } from '../../services/api'
import { ADD_GAME, REMOVE_GAME, ADD_GAME_ID } from '../actionTypes'
import { addError } from './errors'
import { addMessage } from './message'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export function addGame(game) {
  return {
    type: ADD_GAME,
    game
  }
}

export function removeGame(players) {
  return {
    type: REMOVE_GAME,
    players
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
      const accessToken = cookies.get('accessToken')
      setTokenHeader(accessToken)
      return apiCall('post', '/api/reserve', game)
        .then(({ newGame }) => {
          dispatch(addGameId(newGame.id))
          dispatch(addMessage(newGame.message))
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
