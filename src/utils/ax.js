import Vue from 'vue'
import axios from 'axios'
import JSONbig from 'json-bigint'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
axios.defaults.transformResponse = [function (data) {
  // 服务器端返回给客户端的data数据主要就两种类型
  // 1) 字符串对象  '{xx:xx...}'
  // 2) 空字符串   ''
  // 在此处要利用JSONbig对返回的信息加以处理，如果不处理，系统默认是通过JSON.parse()给处理的
  // 这样大数字就错误了
  if (data) {
    return JSONbig.parse(data)
  } else {
    return data
  }
}]
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (userinfo) {
    config.headers.Authorization = 'Bearer ' + JSON.parse(userinfo).token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
Vue.prototype.$html = axios
