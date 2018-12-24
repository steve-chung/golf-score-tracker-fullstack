import { SET_MAPCENTER } from '../actionTypes'

var dotProp = require('dot-prop-immutable')

let initState = {
  map: {
    lat: 0,
    lng: 0
  }
}

const map = (state = initState, action) => {
  switch (action.type) {
    case SET_MAPCENTER:
      const stateLat = dotProp.set(state, 'map.lat', action.lat)
      const updatedState = dotProp.set(stateLat, 'map.lng', action.lng)
      return updatedState
    default:
      return state
  }
}

export default map
