import { apiCall } from '../../services/api'
import { setToken } from '../../services/setHeader'
import { addError } from './errors'
import { GET_STAT } from '../actionTypes'

function averageData(golfStat) {
  const finalStat = golfStat.map(stat => {
    let averageStat = {}
    for (let key in stat.scoreStats) {
      if (key === 'puttsGreen') {
        averageStat.puttsGreen = (stat.scoreStats[key] / 18).toFixed(2)
      }
      else if (key !== 'count') {
        averageStat[key] = (stat.scoreStats[key] / stat.scoreStats.count[key]).toFixed(2)
      }
    }
    return Object.assign({}, {
      date: stat.date,
      totalScore: stat.scores,
      averageStat: averageStat})
  })
  return finalStat
}

export function getStat(stat) {
  const date = Date.now()
  const history = stat.filter(course => (
    Date.parse(course.date) < date)).map(course => {
    let initObj = {}
    const scoreStat = course.stats.reduce((acc, hole) => {
      let count = 0
      // const stat = hole.stats
      if (!acc[hole.first_club]) {
        acc[hole.first_club] = +hole.first_distance
        acc.count = Object.assign(initObj, {[hole.first_club]: 1})
      }
      else {
        acc[hole.first_club] += +hole.first_distance
        count = acc.count[hole.first_club] + 1
        acc.count = Object.assign(acc.count, {[hole.first_club]: count})
      }
      if (!acc[hole.second_club]) {
        acc[hole.second_club] = +hole.second_distance
        acc.count = Object.assign(initObj, {[hole.second_club]: 1})
      }
      else {
        count = acc.count[hole.second_club] + 1
        acc[hole.second_club] += +hole.second_distance
        acc.count = Object.assign(acc.count, {[hole.second_club]: count})
      }
      acc.puttsGreen += +hole.stroks_green
      return acc
    }, {puttsGreen: 0})
    return Object.assign({},
      {id: course.id,
        date: course.date,
        scores: +course.stats[0].total_score,
        scoreStats: scoreStat})
  })
  const perform = averageData(history)
  return {
    type: GET_STAT,
    perform
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
