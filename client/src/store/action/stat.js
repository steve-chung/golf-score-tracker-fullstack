import { apiCall } from '../../services/api'
import { setToken } from '../../services/setHeader'
import { addError } from './errors'
import { GET_STAT } from '../actionTypes'

export function getStat(stat) {
  const date = Date.now()
  console.log(stat)
  const history = stat.filter(course => (
    Date.parse(course.date) < date)).map(course => {
    let courseObj = {}
    let initObj = {}
    console.log(course)
    // const scoreStat = course.reduce((acc, hole) => {
    //   let count = 0
    //   if (!acc[hole.first_club]) {
    //     acc[hole.first_club] = +hole.first_distance
    //     acc.count = Object.assign(initObj, {[hole.first_club]: 1})
    //   }
    //   else {
    //     acc[hole.first_club] += +hole.first_distance
    //     count = acc.count[hole.first_club] + 1
    //     acc.count = Object.assign(acc.count, {[hole.first_club]: count})
    //   }
    //   if (!acc[hole.second_club]) {
    //     acc[hole.second_club] = +hole.second_distance
    //     acc.count = Object.assign(initObj, {[hole.second_club]: 1})
    //   }
    //   else {
    //     count = acc.count[hole.second_club] + 1
    //     acc[hole.second_club] += +hole.second_distance
    //     acc.count = Object.assign(acc.count, {[hole.second_club]: count})
    //   }
    //   acc.puttsGreen += +hole.stroks_green
    //   return acc
    // }, {puttsGreen: 0})
    // courseObj = Object.assign({},
    //   {id: course.id,
    //     date: course.date,
    //     playerName: course.players[0].name,
    //     scores: +course.players[0].totalScore,
    //     scoreStats: scoreStat})
    console.log(courseObj) 
    })
  return {
    type: GET_STAT,
    stat
  }
}

export function getStatServer() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      setToken('accessToken')
      return apiCall('get', '/api/stat/view')
        .then((newStat) => {
          dispatch(getStat(newStat))
          resolve()
        })
        .catch(err => {
          console.log(err)
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