import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 路由懒加载
const Home = () => import('./../components/home.vue')
const Login = () => import('./../components/login.vue')
const Users = () => import('./../components/user/Users.vue')
const Roles = () => import('./../components/authorityManagement/Roles.vue')
const AuthorityList = () => import('./../components/authorityManagement/AuthorityList.vue')
const GoodsCategory = () => import('./../components/goodsManagement/GoodsCategory.vue')
const GoodsParams = () => import('./../components/goodsManagement/GoodsParams.vue')
const GoodsList = () => import('./../components/goodsManagement/GoodsList.vue')
const AddGoods = () => import('./../components/goodsManagement/AddGoods.vue')
const OrderManage = () => import('./../components/order/OrderManange.vue')
const ReportForms = () => import('./../components/report/ReportForms.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  // 让welcome这个组件变成home的子路由规则
  {
    path: '/home',
    component: Home,
    redirect:'/users',
    children:[
      { path:'/users', component:Users },
      { path:'/rights', component:AuthorityList },
      { path:'/roles', component:Roles },
      { path:'/categories', component:GoodsCategory },
      { path:'/params', component:GoodsParams },
      { path:'/goods', component:GoodsList },
      { path:'/goods/add', component:AddGoods },
      { path:'/orders', component:OrderManage },
      { path:'/reports', component:ReportForms }
    ]
  }

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
