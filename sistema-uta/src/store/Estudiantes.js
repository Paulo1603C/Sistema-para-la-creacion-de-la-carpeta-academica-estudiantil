import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,

  state: {
    Items: [],
    dataEst: {},

  },
  getters: {
    getItems(state) {
      return state.Items;
    },

  },
  mutations: {
    llenarItems(state, data) {
      state.Items = data;
    },

    setEst(state, data) {
      state.dataEst = data;
    },

  },
  actions: {
    cargarEstudiantes: async function ({ commit }) {
      try {
        const setting = {
          methods: 'GET',
        }
        const url = 'http://localhost/Apis-UTA/estudiantesSelect.php';
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarItems', json);

      } catch (error) {

      }
    },

    AgregarEstudiante: async function ({ commit, dispatch }, datos) {
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
