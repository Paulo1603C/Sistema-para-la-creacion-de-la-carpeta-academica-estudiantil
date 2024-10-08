import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';

export default {
  namespaced: true,

  state: {
    // este arreglo servira para traer todos los subdirectorios y poder obtener los permisos que tiene cada usuario en el mismo
    subCarpetas: [],
    isLoading: false,  // Control de carga
    errorMessage: "",  // Mensaje de error
  },

  getters: {
    getSubCarpetas(state) {
      return state.subCarpetas;
    },
    isLoading(state) {
      return state.isLoading;
    },
    getErrorMessage(state) {
      return state.errorMessage;
    }
  },

  mutations: {
    llenarSubCarpetas(state, data) {
      state.subCarpetas = data;
    },
    setIsLoading(state, value) {
      state.isLoading = value;
    },
    setErrorMessage(state, value) {
      state.errorMessage = value;
    }
  },

  actions: {

    cargarSubCarpetas: async function ({ commit }) {
      commit('setIsLoading', true);  // Iniciar carga
      commit('setErrorMessage', ""); // Limpiar errores anteriores
      try {
        const setting = {
          method: 'GET',
        }
        const url = `${baseURL}subCarpetasSelect.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarSubCarpetas', json);
      } catch (error) {
        commit('setErrorMessage', 'Error en la solicitud: ' + error.message);  // Manejo de error
        console.error('Error en la solicitud:', error);
      } finally {
        commit('setIsLoading', false);  // Terminar carga
      }
    },

    actualizarSubCapeta: async function({ commit, dispatch }, { nomItem, nuevoItem }) {
      commit('setIsLoading', true);  // Iniciar carga
      commit('setErrorMessage', ""); // Limpiar errores anteriores
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
        if (response.ok) {
          const json = await response.json();
          if (json.message == "SubCarpeta Actualizado") {
            dispatch('cargarSubCarpetas');
            return true;
          } else {
            commit('setErrorMessage', 'Error en la actualización de la subcarpeta');  // Manejo de error
            return false;
          }
        }
      } catch (error) {
        commit('setErrorMessage', 'Error en la solicitud: ' + error.message);  // Manejo de error
        console.error('Error en la solicitud:', error);
      } finally {
        commit('setIsLoading', false);  // Terminar carga
      }
    },
  },

  modules: {
  }

}
