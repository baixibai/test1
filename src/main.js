import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './vuex/store'
import Vuex from 'vuex'
import '@/common/js/global'
import router from './router'
import filters from './common/js/filters'
import Base from './common/js/base'
import { Loading } from 'element-ui';
import 'font-awesome/css/font-awesome.min.css'
import '@/styles/vars.scss'
import '@/element-var.scss'
import './styles/fonts/iconfont.css'
import { post,fetch,patch,put,delax,axiosall } from './api/http'
import getApi from './api/api'
// import '@/permission.js'
// import directives from './directives'


//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put
Vue.prototype.$delete = delax
Vue.prototype.$axiosall = axiosall
Vue.prototype.$getApi = getApi.getApi
Vue.prototype.$Base = Base
Vue.prototype.$friststatus = false
Vue.prototype.$Loading = Loading
Vue.prototype.$webpackurl = process.env

Vue.use(ElementUI)
Vue.use(Vuex)
// Vue.use(directives)
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  render: h => h(App)
}).$mount('#app')

