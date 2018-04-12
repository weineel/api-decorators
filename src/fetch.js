import Fly from 'flyio'
import Options from './options'
import { NetError } from './error'

const debug = require('debug')('fetch:')
const fetch = new Fly()

// 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'

// POST传参序列化(添加请求拦截器)
fetch.interceptors.request.use(config => {
  debug('fly config: %o', config)
  return config
}, error => {
  debug(error)
  return Promise.reject(new NetError(error))
})

// 返回状态判断(添加响应拦截器)
fetch.interceptors.response.use(res => {
  debug('response: %o', res)
  return res.data
}, error => {
  debug(error)
  return Promise.reject(new NetError(error))
})

export default fetch
