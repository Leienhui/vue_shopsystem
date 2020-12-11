import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// 导入字体图标
import './assets/css/iconfont.css'
// 导入全局css样式
import './assets/css/global.css'
// 导入发起请求的包,然后将这个包挂载到vue的原型上去
import axios from 'axios'
// =================================以下组件的使用========================
// 全局导入element ui
import elementUi from 'element-ui'
// 导入相关css
import 'element-ui/lib/theme-chalk/index.css'// 导入 css
// 注册全局elementui
Vue.use(elementUi)
// ========================================================================
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 挂载请求拦截器，
axios.interceptors.request.use(config => {
  console.log(config)
  // 为请求头对象添加token验证的Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 这样每个vue组件都可以通过this直接访问$http来发起网络请求
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
