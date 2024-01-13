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
        console.log(datos.nomPlan.toUpperCase());
        const datosPantilla = new FormData();
        datosPantilla.append('NomPlantilla', datos.nomPlan.toUpperCase());

        const setting = {
          method: 'POST',
          body: datosPantilla,
        }
        var url = "";
        if (datos.idPlan == 0) {
          url = 'http://localhost/Apis-UTA/insetarPlantilla.php';
        } else {
          url = 'http://localhost/Apis-UTA/actualizarEstudiante.php';
        }
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
          //dispatch('cargarPlantillas');
        } else {
          //dispatch('cargarPlantillas');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

    //insetar carreras para los usaurios-> se pasa un arreglo;
    AgregarItemsSubDirectorios: async function ({ commit, dispatch }, datos) {
      var aux = 0;
      while (aux < datos.items.length) {
        try {
          const datosItem = new FormData();
          datosItem.append('NomSubDirectorio', datos.items[aux].toUpperCase());

          const setting = {
            method: 'POST',
            body: datosItem,
          }
          var url = "";
          if (datos.idPlan == 0) {
            url = 'http://localhost/Apis-UTA/insertarItemsSubdirectorios.php';
          } else {
            url = 'http://localhost/Apis-UTA/actualizarCarrerasSecre.php';
          }
          const data = await fetch(url, setting);
          const json = await data.text();
          if (json.startsWith('{')) {
            const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
            dispatch('cargarPlantillas');
          } else {
            //console.log('La respuesta no es JSON:', data);
            dispatch('cargarPlantillas');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
        aux++;
      }
    },

    //insetar carreras para los usaurios-> se pasa un arreglo;
    AgregarItemsDirectorios: async function ({ commit, dispatch }, datos) {
      var aux = 0;
      while (aux < datos.items.length) {
        try {
          const datosItem = new FormData();
          datosItem.append('NomItem', datos.items[aux].toUpperCase());

          const setting = {
            method: 'POST',
            body: datosItem,
          }
          var url = "";
          if (datos.idPlan == 0) {
            url = 'http://localhost/Apis-UTA/insertarItemDirectorio.php';
          } else {
            url = 'http://localhost/Apis-UTA/actualizarCarrerasSecre.php';
          }
          const data = await fetch(url, setting);
          const json = await data.text();
          if (json.startsWith('{')) {
            const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
            dispatch('cargarPlantillas');
          } else {
            //console.log('La respuesta no es JSON:', data);
            dispatch('cargarPlantillas');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
        aux++;
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
          dispatch('cargarPlantillas');
        } else {
          dispatch('cargarPlantillas');
        }
      } catch (error) {
        console.log("Error de eliminción " + error);
      }

    }


  },

  modules: {
  }

}
