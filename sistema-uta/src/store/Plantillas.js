import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';

const verificarConexion = () => {
  return navigator.onLine; // Comprueba si hay conexión a Internet
};

export default {
  namespaced: true,

  state: {
    Plantillas: [],
    ItemsPlantilla: [],
    ItemsPlantillaTiene: [],
    dataPlan: {},
    estudinates_Plantillas: [],
    idEstPlan: '',
  },
  getters: {
    getPlantillas(state) {
      return state.Plantillas;
    },

    getItemsPlantillas(state) {
      return state.ItemsPlantilla;
    },

    getItemsPlantillasTiene(state) {
      return state.ItemsPlantillaTiene;
    },

    getEstudinates_Plantillas(state) {
      return state.estudinates_Plantillas;
    },
  },
  mutations: {
    llenarPlantillas(state, data) {
      state.Plantillas = data;
    },

    llenarItemsPlantillas(state, data) {
      state.ItemsPlantilla = data;
    },

    llenarItemsPlantillasTiene(state, data) {
      state.ItemsPlantillaTiene = data;
    },

    llenarEstudinates_Plantillas(state, data) {
      state.estudinates_Plantillas = data;
    },

    setPlan(state, data) {
      state.dataPlan = data;
    },

    setIdEstPlan(state, data) {
      state.idEstPlan = data;
    },
  },
  actions: {
    cargarPlantillas: async function ({ commit }) {
      if (!verificarConexion()) {
        console.error('No hay conexión a Internet.');
        return;
      }

      try {
        const setting = {
          method: 'GET',
        };
        const url = `${baseURL}plantillasSelect.php`;
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

    cargarItemsPlantillas: async function ({ commit }, datos) {
      if (!verificarConexion()) {
        console.error('No hay conexión a Internet.');
        return;
      }

      try {
        const datosPlantilla = new FormData();
        datosPlantilla.append('idPlantilla', datos.idPlanPer);

        const setting = {
          method: 'POST',
          body: datosPlantilla,
        };
        const url = `${baseURL}plantillasSelect.php`;
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

    cargarItemsPlantillasTiene: async function ({ commit }, { idPlan }) {
      if (!verificarConexion()) {
        console.error('No hay conexión a Internet.');
        return;
      }

      try {
        const datosPlantilla = new FormData();
        datosPlantilla.append('IdPlan', idPlan);

        const setting = {
          method: 'POST',
          body: datosPlantilla,
        };
        const url = `${baseURL}ItemsPlantillaTiene.php`;
        const data = await fetch(url, setting);
        const json = await data.json();

        if (data.ok) {
          commit('llenarItemsPlantillasTiene', json);
        } else {
          console.log('La respuesta no es un JSON válido:', await data.text());
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

    cargarEstudinates_Plantillas: async function ({ commit }, { idPlan }) {
      if (!verificarConexion()) {
        console.error('No hay conexión a Internet.');
        return;
      }

      try {
        const datosPlantilla = new FormData();
        datosPlantilla.append('IdPlanPer', idPlan);

        const setting = {
          method: 'POST',
          body: datosPlantilla,
        };
        const url = `${baseURL}estudiantesPlantillaSelect.php`;
        const data = await fetch(url, setting);
        const json = await data.json();

        if (data.ok) {
          commit('llenarEstudinates_Plantillas', json);
        } else {
          console.log('La respuesta no es un JSON válido:', await data.text());
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

    AgregarPlantilla: async function ({ commit, dispatch }, datos) {
      if (!verificarConexion()) {
        console.error('No hay conexión a Internet.');
        return;
      }

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
          url = `${baseURL}insetarPlantilla.php`;
        } else {
          url = `${baseURL}actualizarEstudiante.php`;
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

    AgregarItemsSubDirectorios: async function ({ commit, dispatch }, datos) {
      if (!verificarConexion()) {
        console.error('No hay conexión a Internet.');
        return;
      }

      var aux = 0;
      while (aux < datos.items.length) {
        try {
          const datosItem = new FormData();
          datosItem.append('NomSubDirectorio', datos.items[aux].toUpperCase());
          const setting = {
            method: 'POST',
            body: datosItem,
          }
          const url = `${baseURL}insertarItemsSubdirectorios.php`;
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
        aux++;
      }
    },

    AgregarItemsPalntilla: async function ({ commit, dispatch }, datos) {
      if (!verificarConexion()) {
        console.error('No hay conexión a Internet.');
        return;
      }

      var aux = 0;
      while (aux < datos.items.length) {
        try {
          const datosItem = new FormData();
          datosItem.append('NomSubDirectorio', datos.items[aux].toUpperCase());
          const setting = {
            method: 'POST',
            body: datosItem,
          }
          const url = `${baseURL}insertarItemsPlantilla.php`;
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
        aux++;
      }
    },

    AgregarItemsDirectorios: async function ({ commit, dispatch }, { datos, idPlan }) {
      if (!verificarConexion()) {
        console.error('No hay conexión a Internet.');
        return;
      }

      var aux = 0;
      while (aux < datos.items.length) {
        try {
          const datosItem = new FormData();
          datosItem.append('NomItem', datos.items[aux].toUpperCase());
          datosItem.append('IdPlan', idPlan);
          const setting = {
            method: 'POST',
            body: datosItem,
          }
          var url = "";
          if (datos.idPlan == 0) {
            url = `${baseURL}insertarItemDirectorio.php`;
          } else {
            url = `${baseURL}insertarItemDirectorio.php`;
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
        aux++;
      }
    },

    eliminarPlantilla: async function ({ commit, dispatch }, id) {
      if (!verificarConexion()) {
        console.error('No hay conexión a Internet.');
        return;
      }

      try {
        const datosPlantilla = new FormData();
        datosPlantilla.append('idPlantilla', id);

        const setting = {
          method: 'POST',
          body: datosPlantilla,
        };
        const url = `${baseURL}eliminarPlantilla.php`;
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
  },
}
