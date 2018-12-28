import { ADD_GAME, 
        REMOVE_GAME, 
        ADD_GAME_ID, 
        UPDATE_LAST_ID, 
        UPDATE_DELETE_ID } from '../actionTypes'

const DEFAULT_STATE = {
  courseName: '',
  date: '',
  lastId: 1,
  players: [],
  deletePlayerId: 0
}

export default (state = DEFAULT_STATE, action) => {
  console.log(action.type +' '+action)
  console.log(state)
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
        lastId: state.lastId++
      })

    case UPDATE_DELETE_ID:
      return Object.assign({}, state, {
        deletePlayerId: action.id
      })
    default:
      return state
  }
}

