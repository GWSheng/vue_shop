import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import myCom from './components/MyCom.vue'
import gInput from './components/G_input.vue'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios // 将axios挂载到Vue对象的原型上，这样在其他组件中可以直接通过this.$http发起请求

// 拦截前端请求，并给请求头authorization加上token  请求发送时，显示进度条
axios.interceptors.request.use(config => {
  nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  nprogress.done()
  return config
})

Vue.config.productionTip = false

Vue.filter('timeHandle', time => {
  const date = new Date(time)
  const y = date.getFullYear().toString()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  const h = date.getHours().toString().padStart(2, '0')
  const mm = date.getMinutes().toString().padStart(2, '0')
  const ss = date.getSeconds().toString().padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${mm}:${ss}`
})

// 注册自定义组件为全局组件
Vue.component('myCom', myCom)
Vue.component('g-input', gInput)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
