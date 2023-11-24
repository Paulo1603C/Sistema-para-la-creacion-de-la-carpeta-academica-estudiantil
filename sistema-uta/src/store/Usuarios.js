import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
        const url = 'http://localhost/Apis-UTA/usuariosSelect.php';
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
          url = 'http://localhost/Apis-UTA/insetarUsuario.php';
        } else {
          url = 'http://localhost/Apis-UTA/actualizarUsuario.php';
        }
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
    },

    //insetar carreras para los usaurios-> se pasa un arreglo;
    AgregarUsuarioCarreras: async function ({ commit, dispatch }, datos) {
      var aux = 0;
      while (aux < datos.carreras.length) {
        try {
          const datosUser = new FormData();
          datosUser.append('userPer', datos.id);
          datosUser.append('carPer', datos.carreras[aux]);

          const setting = {
            method: 'POST',
            body: datosUser,
          }
          var url = "";
          if (datos.id == 0) {
            url = 'http://localhost/Apis-UTA/insertCarrerasSecre.php';
          } else {
            url = 'http://localhost/Apis-UTA/actualizarCarrerasSecre.php';
          }
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
        aux++;
      }
    },

    //insetar permisos para los usaurios-> se pasa un arreglo;
    AgregarUsuarioPermisos: async function ({ commit, dispatch }, datos) {
      var aux = 0;
      while (aux < datos.permisos.length) {
        try {
          const datosUser = new FormData();
          datosUser.append('userPer', datos.id);
          datosUser.append('perPer', datos.permisos[aux]);

          const setting = {
            method: 'POST',
            body: datosUser,
          }
          var url = "";
          if (datos.id == 0) {
            url = 'http://localhost/Apis-UTA/insertarPermisosUser.php';
          } else {
            url = 'http://localhost/Apis-UTA/actualizarPermisosUser.php';
          }
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
        aux++;
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
        const url = "http://localhost/Apis-UTA/eliminarUsuario.php";
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

    }


  },

  modules: {
  }

}
