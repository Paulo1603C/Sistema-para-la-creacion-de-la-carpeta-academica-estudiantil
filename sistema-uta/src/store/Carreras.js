import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';
export default {
  namespaced: true,

  state: {
    carreras: [],
    carrerasUser: [],
    carreraSelecionada: '',
    idCarreraSelect: 0,
    smsCar: '',
  },

  getters: {
    getCarreras(state) {
      return state.carreras;
    },

    getCarrerasUser(state) {
      return state.carrerasUser;
    },

    getSmsCar(state) {
      return state.smsCar;
    },
  },

  mutations: {
    llenarCarreras(state, data) {
      state.carreras = data;
    },

    llenarCarrerasUser(state, data) {
      state.carrerasUser = data;
    },

    setCarreraSelect(state, value) {
      state.carreraSelecionada = value;
    },

    setIdCarreraSelect(state, value) {
      state.idCarreraSelect = value;
    },

    setSmsCar(state, value) {
      state.smsCar = value;
      //console.log('Mutation setSmsCar:', state.smsCar);
    },
  },

  actions: {

    cargarCarreras: async function ({ commit }) {
      try {
        const setting = {
          methods: 'GET',
        }
        const url = `${baseURL}carreras.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarCarreras', json);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

    },

    cargarCarrerasUser: async function ({ commit }, idUser) {
      try {
        const datosUser = new FormData();
        datosUser.append('IdUser', idUser);

        const setting = {
          method: 'POST',
          body: datosUser,
        }
        const url = `${baseURL}carrerasUsuarios.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarCarrerasUser', json);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

    },

    agregarCarrera: async function ({ commit, dispatch }, datos) {
      if (datos.nomCar != '') {
        try {
          const datosCar = new FormData();
          datosCar.append('idCarrera', datos.idCar);
          datosCar.append('NomCarrera', datos.nomCar);

          const setting = {
            method: 'POST',
            body: datosCar,
          }
          let url = "";
          if (datos.idCar == 0) {
            url = `${baseURL}InsetarCarrera.php`;
          } else {
            url = `${baseURL}editarCarrera.php`;
          }
          const data = await fetch(url, setting);
          if (data.ok) {
            const json = await data.text();
            if (json.startsWith('{')) {
              const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
              dispatch('cargarCarreras');
              return true;
              //commit('setSmsCar', 'insertado');
            } else {
              dispatch('cargarCarreras');
              return true;
              //commit('setSmsCar', 'insertado');
            }
          } else {
            return false;
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }

      }
    },

    crearCarpetaCarrera: async function ({ commit, dispatch }, { path, datos, oldPath }) {
      try {
        const datosCarpeta = new FormData();
        datosCarpeta.append('nuevoNombreDirectorio', path.toUpperCase() + '/' + datos.nomCar.toUpperCase());
        datosCarpeta.append('nombreDirectorio', oldPath.toUpperCase());
        const setting = {
          method: 'POST',
          body: datosCarpeta,
        }
        var url = "";
        if (datos.idCar == 0) {
          url = `${baseURL}crearCarpetas.php`;
        } else {
          url = `${baseURL}actualizarCarpetaServidor.php`;
        }
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json);
          dispatch('cargarCarreras');
          return true;
        } else {
          dispatch('cargarCarreras');
          return true;
        }
      } catch (error) {
        return false;
        console.error('Error en la solicitud:', error);
      }
    },

    eliminarCarrera: async function ({ commit, dispatch }, datos) {
      if (datos.IdCar > 0) {
        try {
          const datosCar = new FormData();
          datosCar.append('IdCarrera', datos.IdCar);

          const setting = {
            method: 'POST',
            body: datosCar,
          }
          const url = `${baseURL}eliminarCarrera.php`;
          const data = await fetch(url, setting);
          if (data.ok) {
            const json = await data.text();
            if (json.startsWith('{')) {
              const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
              commit('setSmsCar', 'eliminado');
              dispatch('cargarCarreras');
            } else {
              commit('setSmsCar', 'eliminado');
              dispatch('cargarCarreras');
            }
          } else {
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }

      }
    },

  },

  modules: {
  }

}
