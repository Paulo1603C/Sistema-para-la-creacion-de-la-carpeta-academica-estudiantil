import Vue from 'vue'
import Vuex from 'vuex'
import Login from './Login'
import Usuarios from './Usuarios'
import Roles from './Roles'
import Dialogo from './Dialogo'
import Permisos from './Permisos'
import Carreras from './Carreras'

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
    Roles,
    Dialogo,
    Permisos,
    Carreras,
  }
})
