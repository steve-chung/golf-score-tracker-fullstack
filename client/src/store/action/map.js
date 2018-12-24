import { SET_MAPCENTER } from '../actionTypes'

export function setCenter(lat, lng) {
  return {
    type: SET_MAPCENTER,
    lat,
    lng
  }
}
