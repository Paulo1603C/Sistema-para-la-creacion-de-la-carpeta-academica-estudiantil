import Vue from 'vue'
import VueRouter from 'vue-router'
import logInView from '../views/logInView.vue'
import Dashboard from '../views/dashboard.vue'
import EstudiantesView from '../views/EstudiantesView.vue'
import AboutView from '../views/AboutView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    //name: 'LogIn',
    component: logInView
  },
  {
    path: '/Dashboard',
    //name: 'Dashboard',
    component: Dashboard,
    children:[
      {
        path: '/Estudiantes',
        name: 'Estudiantes',
        component: EstudiantesView
      },
      {
        path: '/About',
        name: 'About',
        component: AboutView
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
