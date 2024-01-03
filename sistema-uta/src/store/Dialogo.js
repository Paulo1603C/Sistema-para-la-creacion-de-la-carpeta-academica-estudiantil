import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,

  state: {
    dialogUser: false, // Estado del diálogo
    dialogFolder: false, // Estado del diálogo
    dailogPlantilla:false, // Estado del diálogo
    tablaEst: false, // Estado del diálogo
    tablaArch: false, // Estado del diálogo
    carreras: true, // Estado del diálogo

    itemsBread:['Carreras',],
  },

  mutations: {
    setDialog(state, value) {
      state.dialogUser = value; // Mutación para actualizar el estado del diálogo
    },
    setDialogFolder(state, value) {
      state.dialogFolder = value; // Mutación para actualizar el estado del diálogo
    },
    setDialogPlantilla(state, value) {
      state.dailogPlantilla = value; // Mutación para actualizar el estado del diálogo
    },
    setVentanaEst(state, value) {
      state.tablaEst = value; // Mutación para actualizar el estado del diálogo
    },
    setVentanaArch(state, value) {
      state.tablaArch = value; // Mutación para actualizar el estado del diálogo
    },
    setVentanaCarreras(state, value) {
      state.carreras = value; // Mutación para actualizar el estado del diálogo
    },
    setBreadcrumbs(state, value) {
      if( value == '' ){
        //console.log('Borrra');
        state.itemsBread.splice(1, state.itemsBread.length); 
      }else{
        //console.log('No Borrra');
        state.itemsBread.push(value); 
      }
    },
  }
};