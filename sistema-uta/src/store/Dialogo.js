import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,

  state: {
    dialogUser: false, // Estado del diálogo
    dialogFolder: false, // Estado del diálogo
    dailogPlantilla:false, // Estado del diálogo
    dailogCarpeta:false, // Estado del diálogo
    dailogPermisos:false, // Estado del diálogo
    dailogProgres:false, // Estado del diálogo
    dailogCarreras:false, // Estado del diálogo
    dailogContra:false, // Estado del diálogo
    dailogCarpetas:false, // Estado del diálogo
    dailogCrearEst:false, // Estado del diálogo
    dailogPermisos:false, // Estado del diálogo
    dailogSubirArch:false, // Estado del diálogo
    dailogCargarDatos:false, // Estado del diálogo
    dailogEliminar:false, // Estado del diálogo
    mostrarCrear:false, // Estado del diálogo
    tablaEst: false, // Estado del diálogo
    tablaArch: false, // Estado del diálogo
    carreras: true, // Estado del diálogo
    ctlSubirArch:false,
    ctlfolder:false,//servira para poder modificar las carpetas creadas en donde se puede subir archivos

    itemsBread:['CARRERAS',],
    
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

    setDialogCarpeta(state, value) {
      state.dailogCarpeta = value; // Mutación para actualizar el estado del diálogo
    },

    setDialogPermisos(state, value) {
      state.dailogPermisos = value; // Mutación para actualizar el estado del diálogo
    },

    setDialogProgres(state, value) {
      state.dailogProgres = value; // Mutación para actualizar el estado del diálogo
    },

    setDialogCarreras(state, value) {
      state.dailogCarreras = value; // Mutación para actualizar el estado del diálogo
    },

    setDailogContra(state, value) {
      state.dailogContra = value; // Mutación para actualizar el estado del diálogo
    },

    setDailogCarpetas(state, value) {
      state.dailogCarpetas = value; // Mutación para actualizar el estado del diálogo
    },

    setDailogPermisos(state, value) {
      state.dailogPermisos = value; // Mutación para actualizar el estado del diálogo
    },

    setDailogSubirArch(state, value) {
      state.dailogSubirArch = value; // Mutación para actualizar el estado del diálogo
    },

    setDailogCargarDatos(state, value) {
      state.dailogCargarDatos = value; // Mutación para actualizar el estado del diálogo
    },

    setMostrarCrear(state, value) {
      state.mostrarCrear = value; // Mutación para actualizar el estado del diálogo
    },

    setDailogCrearEst(state, value) {
      state.dailogCrearEst = value; // Mutación para actualizar el estado del diálogo
    },

    setDailogEliminar(state, value) {
      state.dailogEliminar = value; // Mutación para actualizar el estado del diálogo
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

    setCtlSubirArch(state, value) {
      state.ctlfolder = value; // Mutación para actualizar el estado del diálogo
    },

    setCtlfolder(state, value) {
      state.ctlSubirArch = value; // Mutación para actualizar el estado del diálogo
    },

    setBreadcrumbs(state, value) {
      if( value == '' ){
        //console.log('Borrra');
        state.itemsBread.splice(1, state.itemsBread.length); 
      }else{
        //buscar si el parametro existe ? borramos : agregamos
        const found = state.itemsBread.find( (item) => item == value );
        if( found ){
          let index = state.itemsBread.indexOf(value);
          state.itemsBread.splice(index+1,state.itemsBread.length);
        }else{
          state.itemsBread.push(value); 
        }
      }
    },
  }
};