import { ADD_GAME, 
        REMOVE_GAME, 
        ADD_GAME_ID, 
        UPDATE_LAST_ID, 
        UPDATE_DELETE_ID,
        RESET_GAME,
        RESET_DELETE_ID,
        PLAY_GAME,
        REMOVE_PLAYER } from '../actionTypes'

const DEFAULT_STATE = {
  courseName: '',
  date: '',
  lastId: 1,
  players: [],
  deletePlayerId: 0
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ADD_GAME:
      return Object.assign({}, state, {
        players: [...state.players, action.player]
      })
    
    case REMOVE_GAME:
      return Object.assign({}, state, {
        players: state.players.map((player) => {
          return Object.assign({}, player)
            }).filter((player) => (
              player.id !== state.deletePlayerId
            ))
      })
    
    case ADD_GAME_ID:
      return Object.assign({}, state, {
        gameId: action.id
      })
    case UPDATE_LAST_ID:
      return Object.assign({}, state, {
        lastId: state.lastId + 1
      })

    case UPDATE_DELETE_ID:
      return Object.assign({}, state, {
        deletePlayerId: action.id
      })
    
    case RESET_GAME:
      return Object.assign({}, state, {
        players: [],
        lastId: 1,
        deletePlayerId: 0
      })

    case RESET_DELETE_ID:
      return Object.assign({}, state, {
        deletePlayerId: 0
      })

    case PLAY_GAME:
      return Object.assign({}, state, {
        courseName: action.game.courseName,
        id: action.game.id,
        date: action.game.date
      })
    default:
      return state
  }
}

