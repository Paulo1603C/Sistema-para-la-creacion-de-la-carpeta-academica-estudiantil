import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,

  state: {
    dialogUser: false, // Estado del diálogo
    dialogFolder: false, // Estado del diálogo
  },

  mutations: {
    setDialog(state, value) {
      state.dialogUser = value; // Mutación para actualizar el estado del diálogo
    },
    setDialogFolder(state, value) {
      state.dialogFolder = value; // Mutación para actualizar el estado del diálogo
    }
  }
};