import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';
export default {
  namespaced: true,

  state: {
    //este arreglo servira para traer todos los subdirectorios y poder obtener los permisos que tiene cada usuario en el mismo
    subCarpteas: [],
  },

  getters: {
    getSubCarpetas(state) {
      return state.subCarpteas;
    },
  },

  mutations: {
    llenarSubCarpetas(state, data) {
      state.subCarpteas = data;
    },
  },

  actions: {

    cargarSubCarpetas: async function ({ commit }) {
      try {
        const setting = {
          methods: 'GET',
        }
        const url = `${baseURL}subCarpetasSelect.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarSubCarpetas', json);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

    },

    actualizarSubCapeta:async function({ commit, dispatch }, { nomItem, nuevoItem }) {
      try {
        const datosPantilla = new FormData();
        datosPantilla.append('nomItem', nomItem.toUpperCase());
        datosPantilla.append('nuevoItem', nuevoItem.toUpperCase());

        const setting = {
          method: 'POST',
          body: datosPantilla,
        }
        var url = `${baseURL}actualizarItemSubDir.php`;
        const response = await fetch(url, setting);
        if ( response.ok ) {
          const json = await response.json();
          if( json.message == "SubCarpeta Actualizado" ){
            dispatch('cargarSubCarpetas');
            return true;
          }else{
            return false;
          }
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

  },

  modules: {
  }

}
