import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import { baseURL } from './config';

export default {
  namespaced: true,

  state: {
    listSubSubItems: [],
    isLoading: false,  // Control de carga
    errorMessage: "",  // Mensaje de error
  },
  
  getters: {
    getSubSubItems(state) {
      return state.listSubSubItems;
    },
    isLoading(state) {
      return state.isLoading;
    },
    getErrorMessage(state) {
      return state.errorMessage;
    },
  },

  mutations: {
    llenarListSubsubItems(state, data) {
      state.listSubSubItems = data;
    },
    setIsLoading(state, value) {
      state.isLoading = value;
    },
    setErrorMessage(state, value) {
      state.errorMessage = value;
    },
  },

  actions: {
    async cargarSubSubItemsHas({ commit }, { idPlan }) {
      commit('setIsLoading', true);  // Iniciar carga
      commit('setErrorMessage', ""); // Limpiar errores anteriores
      try {
        const subSubItem = new FormData();
        subSubItem.append('idItemPlan', idPlan);

        const setting = {
          method: 'POST',
          body: subSubItem,
        };
        const url = `${baseURL}selectSubSubItems.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        
        if (data.ok) {
            commit('llenarListSubsubItems', json);
        } else {
            console.log('La respuesta no es un JSON válido:', await data.text());
            commit('setErrorMessage', 'La respuesta no es un JSON válido');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        commit('setErrorMessage', 'Error en la solicitud: ' + error.message); // Manejo de error
      } finally {
        commit('setIsLoading', false);  // Terminar carga
      }
    },

    async insetarSubSubItem({ commit, dispatch }, { subItems, idItemPlan }) {
      commit('setIsLoading', true);  // Iniciar carga
      commit('setErrorMessage', ""); // Limpiar errores anteriores
      let aux = 0;
      while (aux < subItems.length) {
        try {
          const datosItem = new FormData();
          datosItem.append('nomSubItem', subItems[aux].toUpperCase());
          datosItem.append('idItemPlan', idItemPlan);
          
          const setting = {
            method: 'POST',
            body: datosItem,
          }
          const url = `${baseURL}insetarSubSubItems.php`;
          const data = await fetch(url, setting);
          const json = await data.text();
          
          if (json.startsWith('{')) {
            const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
            // dispatch('cargarPlantillas'); // Si necesitas recargar plantillas
          } else {
            // dispatch('cargarPlantillas');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
          commit('setErrorMessage', 'Error en la solicitud: ' + error.message);  // Manejo de error
          commit('setIsLoading', false);  // Terminar carga antes de salir
          return false;
        }
        aux++;
      }
      commit('setIsLoading', false);  // Terminar carga
      return true;
    }
  },

  modules: {}
};
