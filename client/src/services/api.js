import axios from 'axios'

export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

export function apiCall(method, path, data, header) {
  return new Promise((resolve, reject) => {
    return axios[method.toLowerCase()](path, data, header)
      .then(res => {
        return resolve(res.data)
      })
      .catch(err => {
        console.log(err.response)
        return reject(err.response)
      })
  })
}
