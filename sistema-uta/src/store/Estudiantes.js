import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';
export default {
  namespaced: true,

  state: {
    Items: [],
    dataEst: {},
    buscarEst:"",

    //almacena el id del usario para insertar so obs
    idEst:'',

  },
  getters: {
    getItems(state) {
      return state.Items;
    },

    getEstCed(state) {
      return state.buscarEst;
    },

  },
  mutations: {
    llenarItems(state, data) {
      state.Items = data;
    },

    setEst(state, data) {
      state.dataEst = data;
    },

    setIdEst(state, data) {
      state.idEst = data;
    },

    setBuscarEst(state, data) {
      state.buscarEst = data;
    },

  },
  actions: {
    
    cargarEstudiantesCarrera: async function ({ commit,  rootState }, { idCar }) {

      try {
        const datosEST = new FormData();
        datosEST.append('IdCar', idCar);
        const setting = {
          method: 'POST',
          body: datosEST,
        };
        const url = `${baseURL}cragarEstudienteCarrera.php`;
        const data = await fetch(url, setting);
        const json = await data.json();

        if (data.ok) {
          commit('llenarItems', json);
        } else {
          console.log('La respuesta no es un JSON válido:', await data.text());
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

    },


    cargarEstudiantes: async function ({ commit,  rootState }, { idCar,idUser }) {
      console.log('Ejecutando metodo')
      console.log(idCar)
      console.log(idUser)
      try {
        const datosEST = new FormData();
        datosEST.append('IdUser', idUser);
        datosEST.append('IdCar', idCar);
        const setting = {
          method: 'POST',
          body: datosEST,
        };
        const url = `${baseURL}estudiantesSelect.php`;
        const data = await fetch(url, setting);
        const json = await data.json();
        console.log('json');
        console.log(json);
        if (data.ok) {
          commit('llenarItems', json);
        } else {
          console.log('La respuesta no es un JSON válido:', await data.text());
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

    },

    buscarEstCedula: async function ({ commit,  rootState }, { cedula }) {
      try {
        const datosEST = new FormData();
        datosEST.append('cedEst', cedula);
        const setting = {
          method: 'POST',
          body: datosEST,
        };
        const url = `${baseURL}buscarEstCedula.php`;
        const data = await fetch(url, setting);
        
        if (data.ok) {
          const json = await data.json();
          //console.log(json);
          if(  json == "existe" ){
            return true;
          }else{
            return false;
          }
        } else {
          console.log('La respuesta no es un JSON válido:', await data.text());
          return false;
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    },


    AgregarEstudiante: async function ({ commit, dispatch }, datos) {
      console.log('datos');
      console.log(datos);
      try {
        const datosUser = new FormData();
        datosUser.append('IdEst', datos.IdEst);
        datosUser.append('NomEst', datos.NomEst);
        datosUser.append('ApeEst', datos.ApeEst);
        datosUser.append('CedEst', datos.Cedula);
        datosUser.append('Fecha', datos.Fecha);
        datosUser.append('NomModificador', datos.NomModificador);
        datosUser.append('IdCarPer', datos.NomCar);
        datosUser.append('IdPlanPer', datos.idPlanPer);

        const setting = {
          method: 'POST',
          body: datosUser,
        }
        var url = "";
        if (datos.IdEst == 0) {
          url = `${baseURL}insertarEstudiantes.php`;
        } else {
          url = `${baseURL}actualizarEstudiante.php`;
        }
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
          //dispatch('cargarEstudiantes');
        } else {
          //dispatch('cargarEstudiantes');
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
        const url = `${baseURL}eliminarEstudiante.php`;
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json);
          //dispatch('cargarEstudiantes');
        } else {
          //dispatch('cargarEstudiantes');
        }
      } catch (error) {
        console.log("Error de eliminción " + error);
      }

    },


    actaulizarFecha:async function ({ commit, dispatch }, {id ,fecha}) {
      try {
        const idUser = new FormData();
        idUser.append('IdEst', id);
        idUser.append('Fecha', fecha);
        const setting = {
          method: 'POST',
          body: idUser,
        }
        const url = `${baseURL}actualizarFechaEstudiante.php`;
        const data = await fetch(url, setting);
        const json = await data.text();
        if (json.startsWith('{')) {
          const jsonData = JSON.parse(json);
          //console.log(json);
          //dispatch('cargarEstudiantes');
        } else {
          //dispatch('cargarEstudiantes');
          //console.log(json);
        }
      } catch (error) {
        console.log("Error de actualizacion fecha " + error);
      }
    }
  },

  modules: {
  }

}
