import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    namespaced: true,

    state: {
        listArchivos: null,

    },

    getters: {
        getArchivos(state) {
            return state.listArchivos;
        },
    },

    mutations: {
        llenarlista(state, Archivos) {
            state.listArchivos = Archivos;
        },

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
                commit('llenarlista', json);

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
                const url = "http://localhost/Apis-UTA/crearArchivos.php";
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

        descargarArchivo: async function ({ commit }, {ruta, nombre}) {
            try {
                console.log('RUTA '+ruta);
                console.log('NOMBRE00 '+nombre);
                const datosArchivos = new FormData();
                datosArchivos.append('rutaRemota', ruta );
                
                const setting = {
                    method: 'POST',
                    body:datosArchivos,
                }
                const url = "http://localhost/Apis-UTA/descargarDir_Arch.php";
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
