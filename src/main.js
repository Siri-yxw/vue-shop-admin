import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import './plugins/element.js'
import './assets/css/global.css'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1';
// http://127.0.0.1:8888/api/private/v1 
// https://www.liulongbin.top:8888/api/private/v1 
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = window.localStorage.getItem('token')
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
