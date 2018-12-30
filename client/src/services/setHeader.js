import Cookies from 'universal-cookie'
import { setTokenHeader } from './api'

const cookies = new Cookies()

export function setToken(token) {
  const tokenHeader = cookies.get(token)
  setTokenHeader(tokenHeader)
}

