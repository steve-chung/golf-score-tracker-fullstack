import { CREATE_HOLES,
          ADD_CURRENT_HOLE,
          NEXT_HOLE,
          PREV_HOLE,
          ADD_HOLE_STAT_ID } from '../actionTypes'


const DEFAULT_STATE = {
  
}

export default (state = DEFAULT_STATE, action) => {
  console.log(state)
  console.log(action)
  switch (action.type) {
    case CREATE_HOLES:
      return Object.assign({}, state, {holes: action.Newholes})
    case ADD_CURRENT_HOLE: {
      console.log(deepCopy(state.holes))
      console.log({holes: deepCopy(state.holes)} === state)
      return Object.assign({}, {hole: deepCopy(state.holes)}, {currentHole: action.currentHole})
    }
    case NEXT_HOLE:
      return (Object.assign({}, deepCopy(state), {currentHole: action.nextHole}))
    case PREV_HOLE:
      return (Object.assign(state.currentHole.key)[0] === '0' ?
              Object.assign({}, deepCopy(state), action.currentHole) :
              Object.assign({}, deepCopy(state), action.currentHole - 1))
    case ADD_HOLE_STAT_ID:
      return (Object.assign(state.holes)[action.key].stat_id ? 
              state :
              Object.assign({}, deepCopy(state), {statId: action.statId}))
    default:
      return state
  }
}

function deepCopy(holes) {
 return holes.map(hole => {
     return (Object.assign({}, hole))
  })
}
