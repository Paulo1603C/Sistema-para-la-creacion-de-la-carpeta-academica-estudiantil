import Vue from 'vue'
import VueRouter from 'vue-router'
import logInView from '../views/logInView.vue'
import Dashboard from '../views/dashboard.vue'
import EstudiantesView from '../views/EstudiantesView.vue'
import PlantillasView from '../views/PlantillasView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import CarrerasView from '../views/CarrerasView.vue'
import ReportesView from '../views/ReportesView.vue'
import SinConexionView from '../views/SinConexionView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    //name: 'LogIn',
    component: logInView
  },
  {
    path: '/SinConexion',
    name: 'SinConexion',
    component: SinConexionView
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
        path: '/Carreras',
        name: 'Carreras',
        component: CarrerasView
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
      {
        path: '/Reportes',
        name: 'Reportes',
        component: ReportesView
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
