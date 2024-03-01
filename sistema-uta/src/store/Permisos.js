import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';
export default {
  namespaced: true,

  state: {
    permisos: [],
    //se usara para conocer los permisos que tiene un usuarios en cada directorio
    permisosDirectorios: [],
    //amacena los usarios,permios,subdirectios
    permisosSubDir_User: [],
    //se usara para almacenar los subdirectiro y sus permisos
    permisosSubDirectorios: new Map(),
    //
    dataPermisosUsuario: {}

  },
  getters: {
    getPermisos(state) {
      return state.permisos;
    },

    getPermisosDirectorios(state) {
      return state.permisosDirectorios;
    },

    getPermisosSubDir_User(state) {
      return state.permisosSubDir_User;
    },

  },
  mutations: {
    llenarPermisos(state, data) {
      state.permisos = data;
    },

    llenarPermisosDirectorios(state, data) {
      state.permisosDirectorios = data;
    },

    llenarPermisosSubDir_User(state, data) {
      state.permisosSubDir_User = data;
    },

    setPermisosSubDirectorios(state, value) {
      state.permisosSubDirectorios = value;
    },

    setPermisosUsuario(state, value) {
      state.dataPermisosUsuario = value;
    },
  },
  actions: {

    cargarPermisos: async function ({ commit }) {
      try {
        const setting = {
          methods: 'GET',
        }
        const url = `${baseURL}permisos.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarPermisos', json);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

    cargarPermisosDirectorios: async function ({ commit }, { idUser, nomItem }) {
      try {
        const datosPerDir = new FormData();
        datosPerDir.append('IdUser', idUser);
        datosPerDir.append('NomItem', nomItem);

        const setting = {
          method: 'POST',
          body: datosPerDir,
        };
        const url = `${baseURL}permisosDirectorios.php`;
        const response = await fetch(url, setting);
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const json = await response.json();
        commit('llenarPermisosDirectorios', json);
      } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error; // Re-lanza el error para que pueda ser manejado externamente si es necesario.
      }
    },


    cargarPermisosSubDir_User: async function ({ commit }, { idUser }) {
      try {
        const datosPerDir = new FormData();
        datosPerDir.append('IdUser', idUser);

        const setting = {
          method: 'POST',
          body: datosPerDir,
        }
        const url = `${baseURL}permisosSubDirectorios_User.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarPermisosSubDir_User', json);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

    //insetar permisos para los usaurios-> se pasa un arreglo;
    AgregarUsuarioPermisos: async function ({ commit, dispatch }, datos) {
      var aux = 0;
      while (aux < datos.IdPerPer.length) {
        try {
          const datosPermisos = new FormData();
          datosPermisos.append('userPer', datos.IdUserPer);
          datosPermisos.append('perPer', datos.IdPerPer[aux]);
          datosPermisos.append('itemSub', datos.IdItemSubPer);

          const setting = {
            method: 'POST',
            body: datosPermisos,
          }
          var url = "";
          if (datos.IdRelacion == 0) {
            url = `${baseURL}insertarPermisosUser.php`;
          } else {
            url = `${baseURL}actualizarPermisosUser.php`;
          }
          const data = await fetch(url, setting);
          const json = await data.text();
          if (json.startsWith('{')) {
            const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
            //dispatch( 'cargarPermisosSubDir_User', datos.IdUserPer );
          } else {
            //console.log('La respuesta no es JSON:', data);
            //dispatch( 'cargarPermisosSubDir_User', datos.IdUserPer );
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
        aux++;
      }
    },

    //insetar permisos cuando se crear una nueva carpeta...-> lectura
    AgregarUsuarioPermisosCarpeta: async function ({ commit, dispatch }, datos) {
      try {
        const datosPermisos = new FormData();
        datosPermisos.append('userPer', datos.IdUserPer);
        datosPermisos.append('perPer', datos.IdPerPer);
        datosPermisos.append('itemSub', datos.IdItemSubPer);

        const setting = {
          method: 'POST',
          body: datosPermisos,
        }
        var url = `${baseURL}insertarPermisosNew.php`;
        const data = await fetch(url, setting);
        console.log("DATA "+data);
        if ( data.ok ) {
          const json = await data.json();
          console.log("Josn "+json);
          if (json == 'Permiso Insertado...') {
            return true;
          } else {
            return false;
          }
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },

    eliminarPermisosSub_User: async function ({ commit, dispatch }, { idUser, idPer, idItem }) {
      try {
        const datosPermisos = new FormData();
        datosPermisos.append('userPer', idUser);
        datosPermisos.append('perPer', idPer);
        datosPermisos.append('itemSub', idItem);

        const setting = {
          method: 'POST',
          body: datosPermisos,
        }
        const url = `${baseURL}eliminarPermisosSub_User.php`;
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json);
          dispatch('cargarPermisosSubDir_User', idUser);
        } else {
          dispatch('cargarPermisosSubDir_User', idUser);
        }
      } catch (error) {
        console.error("Error de eliminción " + error);
      }

    }



  },
  modules: {
  }

}
