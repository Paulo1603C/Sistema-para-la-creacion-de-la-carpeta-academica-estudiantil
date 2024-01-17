import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';
export default {
  namespaced: true,

  state: {
    Items: [],
    dataUsuario: {},

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

    setUser(state, data) {
      state.dataUsuario = data;
    },

  },
  actions: {
    cargarUsuarios: async function ({ commit }) {
      try {
        const setting = {
          methods: 'GET',
        }
        const url = `${baseURL}Apis-UTA/usuariosSelect.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarItems', json);

      } catch (error) {

      }
    },

    AgregarUsuario: async function ({ commit, dispatch }, datos) {
      try {
        const datosUser = new FormData();
        datosUser.append('id', datos.id);
        datosUser.append('nombre', datos.nombre);
        datosUser.append('apellido', datos.apellido);
        datosUser.append('contraseña', datos.contraseña);
        datosUser.append('idRol', datos.rol);
        datosUser.append('correo', datos.correo);

        const setting = {
          method: 'POST',
          body: datosUser,
        }
        console.log("datos");
        console.log(datos);
        var url = "";
        if (datos.id == 0) {
          url = `${baseURL}Apis-UTA/insetarUsuario.php`;
        } else {
          url = `${baseURL}Apis-UTA/actualizarUsuario.php`;
        }
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
          dispatch('cargarUsuarios');
        } else {
          dispatch('cargarUsuarios');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

    //insetar carreras para los usaurios-> se pasa un arreglo;
    AgregarUsuarioCarreras: async function ({ commit, dispatch }, {idU, cars}) {
      for (let i= 0; i < cars.length; i++) {
        try {
          const datosUser = new FormData();
          datosUser.append('userPer', idU);
          datosUser.append('carNew', cars[i]);

          const setting = {
            method: 'POST',
            body: datosUser,
          }
          var url = `${baseURL}Apis-UTA/insertCarrerasSecre.php`;
          const data = await fetch(url, setting);
          const json = await data.text();
          if (json.startsWith('{')) {
            const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
            dispatch('cargarUsuarios');
          } else {
            //console.log('La respuesta no es JSON:', data);
            dispatch('cargarUsuarios');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      }
    },


    eliminarUsuario: async function ({ commit, dispatch }, datos) {
      try {
        const idUser = new FormData();
        console.log('ID: ' + datos.id);
        idUser.append('id', datos.id);
        const setting = {
          method: 'POST',
          body: idUser,
        }
        const url = `${baseURL}Apis-UTA/eliminarUsuario.php`;
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
          //console.log('Respuesta JSON:', jsonData);
          dispatch('cargarUsuarios');
        } else {
          //console.log('La respuesta no es JSON:', data);
          dispatch('cargarUsuarios');
        }
      } catch (error) {
        console.log("Error de eliminción " + error);
      }

    },

    eliminarCarrerasSecre: async function ({ commit, dispatch }, { id, idCar }) {
      try {
        const idUser = new FormData();
        idUser.append('id', id);
        idUser.append('idCar', idCar);
        const setting = {
          method: 'POST',
          body: idUser,
        }
        const url = `${baseURL}Apis-UTA/eliminarCarreraSecre.php`;
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
          dispatch('cargarUsuarios');
        } else {
          dispatch('cargarUsuarios');
        }
      } catch (error) {
        console.log("Error de eliminción " + error);
      }

    }


  },

  modules: {
  }

}
