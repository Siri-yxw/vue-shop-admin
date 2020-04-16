import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue"
import Users from "../components/users/Users.vue"
import Roles from "../components/roles/Roles.vue"
import Rights from "../components/roles/Rights.vue"

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
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'Welcome', component: Welcome },
      { path: '/users', name: 'Users', component: Users },
      { path: '/roles', name: 'Roles', component: Roles },
      { path: '/rights', name: 'Rights', component: Rights },

    ]
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
