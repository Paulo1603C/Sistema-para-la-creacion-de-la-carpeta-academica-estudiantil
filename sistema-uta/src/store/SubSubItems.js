import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import { baseURL } from './config';

export default {
  namespaced: true,
  
  state: {
    listSubSubItems: [],
  },
  getters: {
    getSubSubItems(state) {
      return state.listSubSubItems;
    },
  },
  mutations: {
    llenarListSubsubItems(state, data) {
      state.listSubSubItems = data;
    },
  },
  actions: {
    async cargarSubSubItemsHas({ commit }, { idPlan }) {
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
        //console.log(json);
        if (data.ok) {
            commit('llenarListSubsubItems', json);
        } else {
            console.log('La respuesta no es un JSON válido:', await data.text());
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

    async insetarSubSubItem({ commit, dispatch }, { subItems, idItemPlan }) {
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
          //console.log( json )
          if (json.startsWith('{')) {
            const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
            // dispatch('cargarPlantillas');
          } else {
            // dispatch('cargarPlantillas');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
          return false;
        }
        aux++;
      }
      return true;
    }
  },

  modules: {}
};
