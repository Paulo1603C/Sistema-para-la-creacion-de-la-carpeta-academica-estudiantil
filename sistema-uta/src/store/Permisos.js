import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default{
  namespaced:true,
  
  state: {
    permisos:[],
  },
  getters: {
    getPermisos(state){
      return state.permisos;
    }
  },
  mutations: {
    llenarPermisos( state, data ){
      state.permisos = data;
    }
  },
  actions: {

    cargarPermisos:async function({commit}){
      try {
        const setting ={
          methods:'GET',
        }
        const url = 'http://localhost/Apis-UTA/permisos.php';
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarPermisos', json); 
      } catch (error) {
        
      }
    }
  },
  modules: {
  }

}
