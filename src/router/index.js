import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/User/Users.vue'
import Rights from '../components/Rights'
import Role from '../components/Role'
import Params from '../components/goods/Params'
import List from '../components/goods/List'
import AddGoods from '../components/goods/AddGoods'
import Order from '../components/Order'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Role },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/addGoods', component: AddGoods },
      { path: '/orders', component: Order }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫（只有登录后的用户才可以访问主页面
// to 要跳转到的路径，from 从哪个路径跳转到，next 放行函数
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next() // 如果访问的是登录页面，直接返回， 不做任何操作。
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login') // 如果没有token，将页面跳转到login页面
  next() // 如果有token的话，直接放行
})

export default router
