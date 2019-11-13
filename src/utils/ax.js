import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
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
