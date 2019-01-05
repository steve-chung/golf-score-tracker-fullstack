import { CREATE_HOLES,
          ADD_CURRENT_HOLE,
          NEXT_HOLE,
          PREV_HOLE,
          ADD_HOLE_STAT_ID } from '../actionTypes'

const DEFAULT_STATE = {
  
}

export default (state = DEFAULT_STATE, action) => {
 
  switch (action.type) {
    case CREATE_HOLES:
      return (!state.holes ? Object.assign({}, state, {holes: action.Newholes})
              : Object.assign({}, state))
    case ADD_CURRENT_HOLE: {
      return (Object.assign({}, {holes: deepCopy(state.holes)}, {currentHole: action.currentHole}))
             
    }
    case NEXT_HOLE:
      return (Object.assign({}, {holes: deepCopy(state.holes)}, {currentHole: action.nextHole}))
    case PREV_HOLE:
      return (Object.assign(state.currentHole.key)[0] === '0' ?
              Object.assign({}, deepCopy(state), action.currentHole) :
              Object.assign({}, deepCopy(state), action.currentHole - 1))
    case ADD_HOLE_STAT_ID:
      return (Object.assign({},
              {holes: deepCopyAddProp(state.holes, action.hole_id, action.statId)},
              {currentHole: state.currentHole}))
    default:
      return state
  }
}

function deepCopy(holes) {
 return holes.map(hole => {
     return (Object.assign({}, hole))
  })
}

function deepCopyAddProp(holes, id, prop) {
  let index
  for (let i = 0; i < holes.length; i++) {
    if (+holes[i].holeId === +id) {
      index = i
      break
    }
  }
  return holes.map((hole, i) => {
    return index === i ? Object.assign({}, hole, {stat_id: prop}) : Object.assign({}, hole)
  })
}
