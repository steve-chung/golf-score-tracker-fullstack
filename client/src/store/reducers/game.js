import { ADD_GAME, REMOVE_GAME, ADD_GAME_ID } from '../actionTypes'

const DEFAULT_STATE = {
  courseName: '',
  date: ''
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ADD_GAME:
      return {
        courseName: action.courseName,
        date: action.date,
        players: [...action.players],
        totalScore: 0
      }
    case REMOVE_GAME:
      return {
        players: [...action.players]
      }
    case ADD_GAME_ID:
      return {
        gameId: action.id
      }
    default:
      return state
  }
}

