import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
        const url = 'http://localhost/Apis-UTA/subCarpetasSelect.php';
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
        var url = 'http://localhost/Apis-UTA/actualizarItemSubDir.php';
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
          dispatch('cargarSubCarpetas');
        } else {
          dispatch('cargarSubCarpetas');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

  },

  modules: {
  }

}
