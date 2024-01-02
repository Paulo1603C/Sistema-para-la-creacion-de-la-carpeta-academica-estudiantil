import Vue from 'vue'
import VueRouter from 'vue-router'
import logInView from '../views/logInView.vue'
import Dashboard from '../views/dashboard.vue'
import EstudiantesView from '../views/EstudiantesView.vue'
import PlantillasView from '../views/PlantillasView.vue'
import UsuariosView from '../views/UsuariosView.vue'

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
        path: '/Plantillas',
        name: 'Plantillas',
        component: PlantillasView
      },
      {
        path: '/Usuarios',
        name: 'Usuarios',
        component: UsuariosView
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
