import axios from 'axios'

axios.default.timeout = 5000

export function request(config) {
  return axios(config)
    .then((response) => {
      if (response.data.errCode && response.data.errCode !== 0) {
        console.error(response.data)
        return false
      }
      return Promise.resolve(response)
    })
    .catch((e) => {
      return Promise.reject(e)
    })
}
