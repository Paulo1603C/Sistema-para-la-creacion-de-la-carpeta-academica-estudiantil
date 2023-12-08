import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,

  state: {
    dialogUser: false, // Estado del diálogo
    dialogFolder: false, // Estado del diálogo
    tablaEst: true, // Estado del diálogo
    tablaArch: false, // Estado del diálogo

    itemsBread:['Mis Archivos',],
  },

  mutations: {
    setDialog(state, value) {
      state.dialogUser = value; // Mutación para actualizar el estado del diálogo
    },
    setDialogFolder(state, value) {
      state.dialogFolder = value; // Mutación para actualizar el estado del diálogo
    },
    setVentanaEst(state, value) {
      state.tablaEst = value; // Mutación para actualizar el estado del diálogo
    },
    setVentanaArch(state, value) {
      state.tablaArch = value; // Mutación para actualizar el estado del diálogo
    },
    setBreadcrumbs(state, value) {
      if( value == '' ){
        //console.log("algom");
        state.itemsBread.splice(1, state.itemsBread.length); 
      }else{
        state.itemsBread.push(value); 
      }
    },
  }
};