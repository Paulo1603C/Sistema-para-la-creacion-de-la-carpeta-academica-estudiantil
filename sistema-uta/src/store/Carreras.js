import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default{
  namespaced:true,
  
  state: {
    carreras:[],
  },
  getters: {
    getCarreras(state){
      return state.carreras;
    }
  },
  mutations: {
    llenarCarreras( state, data ){
      state.carreras = data;
    }
  },
  actions: {

    cargarCarreras:async function({commit}){
      try {
        const setting ={
          methods:'GET',
        }
        const url = 'http://localhost/Apis-UTA/carreras.php';
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarCarreras', json); 
      } catch (error) {
        
      }
    }
  },
  modules: {
  }

}
