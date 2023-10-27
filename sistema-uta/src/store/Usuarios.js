import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default{
  namespaced:true,
  
  state: {
    Items:[]
  },
  getters: {
    getItems(state){
      return state.Items;
    }
  },
  mutations: {
    llenarItems( state, data ){
      state.Items = data;
    }
  },
  actions: {
    cargarUsuarios: async function({commit}){
      try {
        const setting = {
          methods: 'GET',
        }
        const url = 'https://picsum.photos/v2/list?page=2&limit=5';
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarItems', json)
        
      } catch (error) {
        
      }
    }
  },
  modules: {
  }

}
