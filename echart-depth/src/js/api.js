import axios from 'axios'
// 创建axios实例
const api = axios.create({
  withCredentials: true,
  timeout: 60000
})

api.interceptors.request.use(async(config) => {
  // Do something before request

  if (config.method === 'post') {
    config.headers['content-type'] = 'application/json'
  }
    
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})


export default api