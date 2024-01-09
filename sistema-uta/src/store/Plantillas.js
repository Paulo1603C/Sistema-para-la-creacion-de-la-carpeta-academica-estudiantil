import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,

  state: {
    Plantillas: [],
    ItemsPlantilla:[],
    dataPlan: {},

  },
  getters: {
    getPlantillas(state) {
      return state.Plantillas;
    },

    getItemsPlantillas(state) {
      return state.ItemsPlantilla;
    },

  },
  mutations: {
    llenarPlantillas(state, data) {
      state.Plantillas = data;
    },

    llenarItemsPlantillas(state, data) {
      state.ItemsPlantilla = data;
    },

    setPlan(state, data) {
      state.dataPlan = data;
    },

  },
  actions: {
    cargarPlantillas: async function ({ commit }) {
      try {
        const setting = {
          method: 'GET',
        };
        const url = 'http://localhost/Apis-UTA/plantillasSelect.php';
        const data = await fetch(url, setting);
        const json = await data.json();

        if (data.ok) {
          commit('llenarPlantillas', json);
        } else {
          console.log('La respuesta no es un JSON válido:', await data.text());
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

    },

    cargarItemsPlantillas: async function ( { commit }, datos ) {
      try {
        const datosPlantilla = new FormData();
        datosPlantilla.append('idPlantilla', datos.idPlanPer );

        const setting = {
          method: 'POST',
          body:datosPlantilla,
        };
        const url = 'http://localhost/Apis-UTA/plantillasSelect.php';
        const data = await fetch(url, setting);
        const json = await data.json();

        if (data.ok) {
          commit('llenarItemsPlantillas', json);
        } else {
          console.log('La respuesta no es un JSON válido:', await data.text());
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

    },

    AgregarPlantilla: async function ({ commit, dispatch }, datos) {
      try {
        const datosUser = new FormData();
        datosUser.append('IdEst', datos.IdEst);
        datosUser.append('NomEst', datos.NomEst);
        datosUser.append('ApeEst', datos.ApeEst);
        datosUser.append('CedEst', datos.Cedula);
        datosUser.append('Fecha', datos.Fecha);
        datosUser.append('IdCarPer', datos.NomCar);

        const setting = {
          method: 'POST',
          body: datosUser,
        }
        console.log("datossss");
        console.log(datos);
        var url = "";
        if (datos.IdEst == 0) {
          url = 'http://localhost/Apis-UTA/insertarEstudiantes.php';
        } else {
          url = 'http://localhost/Apis-UTA/actualizarEstudiante.php';
        }
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
          dispatch('cargarEstudiantes');
        } else {
          dispatch('cargarEstudiantes');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

    eliminarEstudiante: async function ({ commit, dispatch }, datos) {
      try {
        const idUser = new FormData();
        //console.log('ID: ' + datos.IdEst);
        idUser.append('idEst', datos.IdEst);
        const setting = {
          method: 'POST',
          body: idUser,
        }
        const url = "http://localhost/Apis-UTA/eliminarEstudiante.php";
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json);
          dispatch('cargarEstudiantes');
        } else {
          dispatch('cargarEstudiantes');
        }
      } catch (error) {
        console.log("Error de eliminción " + error);
      }

    }


  },

  modules: {
  }

}
