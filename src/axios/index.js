import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
import qs from 'qs'
import { baseURL } from '@/config/env'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// Vue.use(LoadingPlugin)

const myAxios = axios.create({
  baseURL
})

myAxios.interceptors.request.use(config => {
  // 这里写死一个token，你需要在这里取到你设置好的token的值
  const token = window.sessionStorage.getItem('token') || ''
  if (token) {
    // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

myAxios.interceptors.response.use(res => {
  (res.data.code === 401) && router.replace('/login')
  return res
})

const XHR = ({ loading = false }) => {
  if (loading) {
    NProgress.start()
    // Vue.$vux.loading.show({
    //   text: '正在加载...'
    // })
  }
  // 公共参数
  const parameter = {
    source: 'admin'
  }

  // 无 loading 请求回调
  const sucFunN = res => {
    return res.data
  }
  const errFunN = err => {
    console.log(err)
  }

  // 有 loading 请求回调
  const sucFunL = res => {
    NProgress.done()
    // Vue.$vux.loading.hide()
    return res.data
  }
  const errFunL = err => {
    NProgress.done()
    // Vue.$vux.loading.hide()
    console.log(err)
  }

  const sucFun = loading ? sucFunL : sucFunN
  const errFun = loading ? errFunL : errFunN

  return { parameter, sucFun, errFun }
}

const getData = ({ method = 'post', url = '', data = {}, loading = false }) => {
  let { parameter, sucFun, errFun } = XHR({ loading })
  let params = {...parameter, ...data}
  for (let key in params) {
    if (params[key] === '') {
      delete params[key]
    }
  }
  if (method.toLowerCase() === 'get') {
    return myAxios.get(url, {params}).then(sucFun).catch(errFun)
  } else if (method.toLowerCase() === 'post') {
    return myAxios.post(url, qs.stringify(params)).then(sucFun).catch(errFun)
  }
}

// 无 loading Get 请求
const axiosGet = function (url = '', data = {}) {
  return getData({method: 'GET', url: url, data: data, loading: false})
}
// 有 loading Get 请求
const axiosGeting = function (url = '', data = {}) {
  return getData({method: 'GET', url: url, data: data, loading: true})
}
// 无 loading Post 请求
const axiosPost = function (url = '', data = {}) {
  return getData({method: 'POST', url: url, data: data, loading: false})
}
// 有 loading Post 请求
const axiosPosting = function (url = '', data = {}) {
  return getData({method: 'POST', url: url, data: data, loading: true})
}

Vue.axiosGet = Vue.prototype.$axiosGet = axiosGet
Vue.axiosGeting = Vue.prototype.$axiosGeting = axiosGeting
Vue.axiosPost = Vue.prototype.$axiosPost = axiosPost
Vue.axiosPosting = Vue.prototype.$axiosPosting = axiosPosting
