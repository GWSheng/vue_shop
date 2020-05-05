import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫（只有登录后的用户才可以访问主页面）
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next() // 如果访问的是登录页面，直接返回， 不做任何操作。
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login') // 如果没有token，将页面跳转到login页面
  next() // 如果有token的话，直接放行
})

export default router