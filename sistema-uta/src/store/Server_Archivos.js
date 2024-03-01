import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';
export default {
    namespaced: true,

    state: {
        listArchivos: null,
        dataObsArch: {},
        observacion: '',

    },

    getters: {
        getArchivos(state) {
            return state.listArchivos;
        },

        getObs(state) {
            return state.observacion;
        },
    },

    mutations: {
        llenarlista(state, Archivos) {
            state.listArchivos = Archivos;
        },

        cargarObs(state, sms) {
            state.observacion = sms;
        },

        setObsArch(state, value) {
            this.state = value;
        }
    },

    actions: {

        cargarArchivos: async function ({ commit }) {
            try {
                const setting = {
                    methods: 'GET',
                }
                const url = '';
                const data = await fetch(url, setting);
                const json = await data.json();
                commit('cargarObs', json);

            } catch (error) {
                console.error('Error en la solicitud:', error);
            }

        },

        cargarObsArchivos: async function ({ commit }, { rutaObs }) {

            try {
                const datosEST = new FormData();
                datosEST.append('rutaObs', rutaObs);
                const setting = {
                    method: 'POST',
                    body: datosEST,
                };
                const url = `${baseURL}obsArchSelect.php`;
                const data = await fetch(url, setting);
                const json = await data.json();

                if (data.ok) {
                    commit('cargarObs', json);
                } else {
                    commit('cargarObs', 'La respuesta no es un JSON válido:');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }

        },

        crearArchivos: async function ({ commit, dispatch }, { ruta, archivo }) {
            try {
                const datosArchivos = new FormData();
                datosArchivos.append('rutaRemota', ruta);
                datosArchivos.append('file', archivo);

                const setting = {
                    method: 'POST',
                    body: datosArchivos,
                }
                const url = `${baseURL}crearArchivos.php`;
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    const jsonData = JSON.parse(json);
                    //dispatch('cargarArchivos');
                } else {
                    //dispatch('cargarArchivos');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }

        },

        crearObsArchivos: async function ({ commit, dispatch }, { ruta, observacion, idEstPer }) {
            try {
                //console.log(observacion);
                //console.log(ruta);
                const datosObsArchivos = new FormData();
                datosObsArchivos.append('RutaArchivo', ruta);
                datosObsArchivos.append('Observacion', observacion);
                datosObsArchivos.append('IdEstPer', idEstPer);

                const setting = {
                    method: 'POST',
                    body: datosObsArchivos,
                }
                const url = `${baseURL}insertarObsArch.php`;
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    const jsonData = JSON.parse(json);
                    //dispatch('cargarArchivos');
                } else {
                    //dispatch('cargarArchivos');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }

        },

        descargarArchivo: async function ({ commit }, { ruta, nombre }) {
            try {
                //console.log('RUTA ' + ruta);
                //console.log('NOMBRE00 ' + nombre);
                const datosArchivos = new FormData();
                datosArchivos.append('rutaRemota', ruta);

                const setting = {
                    method: 'POST',
                    body: datosArchivos,
                }
                const url = `${baseURL}descargarDir_Arch.php`;
                const response = await fetch(url, setting);
                //const json = await response.text();
                if (response.ok) {
                    const blob = await response.blob();
                    // Crear un enlace de descarga y hacer clic en él
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = nombre; // Nombre del archivo que se guardará localmente
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }

        },

    },

}
