import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';
export default{
  namespaced:true,
  
  state: {
    roles:[],
  },
  getters: {
    getRoles(state){
      return state.roles;
    }
  },
  mutations: {
    llenarRoles( state, data ){
      state.roles = data;
    }
  },
  actions: {

    cargarRoles:async function({commit}){
      try {
        const setting ={
          methods:'GET',
        }
        const url = `${baseURL}Apis-UTA/roles.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarRoles', json); 
      } catch (error) {
        
      }
    }
  },
  modules: {
  }

}
