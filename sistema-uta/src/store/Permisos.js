import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  namespaced: true,

  state: {
    permisos: [],
    //se usara para conocer los permisos que tiene un usuarios en cada directorio
    permisosDirectorios: [],
    //amacena los usarios,permios,subdirectios
    permisosSubDir_User:[],
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
        const url = 'http://localhost/Apis-UTA/permisos.php';
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
        }
        const url = 'http://localhost/Apis-UTA/permisosDirectorios.php';
        const data = await fetch(url, setting);
        const json = await data.json();
        commit('llenarPermisosDirectorios', json);
      } catch (error) {
        console.error('Error en la solicitud:', error);
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
        const url = 'http://localhost/Apis-UTA/permisosSubDirectorios_User.php';
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
            url = 'http://localhost/Apis-UTA/insertarPermisosUser.php';
          } else {
            url = 'http://localhost/Apis-UTA/actualizarPermisosUser.php';
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

    eliminarPermisosSub_User: async function ({ commit, dispatch }, {idUser, idPer, idItem}) {
      try {
        const datosPermisos = new FormData();
        datosPermisos.append('userPer', idUser);
        datosPermisos.append('perPer', idPer);
        datosPermisos.append('itemSub', idItem);

        const setting = {
          method: 'POST',
          body: datosPermisos,
        }
        const url = "http://localhost/Apis-UTA/eliminarPermisosSub_User.php";
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json);
          dispatch('cargarPermisosSubDir_User', idUser);
        } else {
          dispatch('cargarPermisosSubDir_User', idUser);
        }
      } catch (error) {
        console.log("Error de eliminción " + error);
      }

    }



  },
  modules: {
  }

}
