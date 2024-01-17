import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';
export default{
  namespaced:true,
  
  state: {
    carreras:[],
    carrerasUser:[],
    carreraSelecionada:'',
    idCarreraSelect:0,
  },

  getters: {
    getCarreras(state){
      return state.carreras;
    },

    getCarrerasUser(state){
      return state.carrerasUser;
    }
  },

  mutations: {
    llenarCarreras( state, data ){
      state.carreras = data;
    },

    llenarCarrerasUser( state, data ){
      state.carrerasUser = data;
    },

    setCarreraSelect(state, value) {
      state.carreraSelecionada = value; 
    },

    setIdCarreraSelect(state, value) {
      state.idCarreraSelect = value; 
    },
  },

  actions: {

    cargarCarreras:async function({commit}){
      try {
        const setting ={
          methods:'GET',
        }
        const url = `${baseURL}Apis-UTA/carreras.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarCarreras', json); 
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

    },
    
    cargarCarrerasUser:async function({commit}, idUser){
      
      try {
        const datosUser = new FormData();
        datosUser.append('IdUser', idUser);
        //console.log(idUser);

        const setting ={
          method:'POST',
          body:datosUser,
        }
        const url = `${baseURL}Apis-UTA/carrerasUsuarios.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        //console.log(json);
        commit('llenarCarrerasUser', json); 
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
      
    },

  },

  modules: {
  }

}
