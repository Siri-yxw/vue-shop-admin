import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  } else {
    const token = window.localStorage.getItem('token')
    if (!token) {
      return next('/login')
    } else {
      return next()
    }
  }
})
export default router
