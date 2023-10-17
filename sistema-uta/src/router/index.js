import Vue from 'vue'
import VueRouter from 'vue-router'
import logInView from '../views/logInView.vue'
import Dashboard from '../views/dashboard.vue'
import AboutView from '../views/AboutView.vue'

Vue.use(VueRouter)

const routes = [
  /*{
    path: '/',
    name: 'LogIn',
    component: logInView
  },*/
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
