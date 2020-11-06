import Vue from 'vue'
import VueRouter from 'vue-router'
import login from './../components/login.vue'
import home from './../components/home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home', component: home }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // 表示从那个路径跳转而来
  // next是一个函数，表示放行
  // next()放行， next('/login')表示强制跳转到登录页面
  if (to.path === '/login') return next()
  // 获取token
  const tokenStorage = window.sessionStorage.getItem('token')
  // token不存在就强制跳转到登录页面
  if (!tokenStorage) return next('/login')
  // token存在即放行
  next()
})
export default router
