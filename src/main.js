// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import axios from "axios"

import router from './router'
import App from './App'

Vue.config.productionTip = false

Vue.use(ElementUI,{locale});

const myaxios = axios.create({
  baseURL:process.env.BASE_API,
  timeout: 50000 // 请求超时时间
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
Vue.prototype.$axios = myaxios;
