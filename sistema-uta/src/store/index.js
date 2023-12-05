import Vue from 'vue'
import Vuex from 'vuex'
import Login from './Login'
import Usuarios from './Usuarios'
import Carreras from './Carreras'
import Roles from './Roles'
import Dialogo from './Dialogo'
import Permisos from './Permisos'
import Estudiantes from './Estudiantes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Login,
    Usuarios,
    Carreras,
    Roles,
    Dialogo,
    Permisos,
    Estudiantes,
  }
})
