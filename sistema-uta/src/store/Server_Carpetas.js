import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';

export default {
    namespaced: true,

    state: {
        listCarpetas: [],
        rutaAnterior: "",  //servira para tener la ruta que queremos actualizar en el servidor
        dataCarpeta: {},
        isLoading: false,  // Control de carga
        errorMessage: "",  // Mensaje de error
    },

    getters: {
        getCarpetas(state) {
            return state.listCarpetas;
        },
        isLoading(state) {
            return state.isLoading;
        },
        getErrorMessage(state) {
            return state.errorMessage;
        }
    },

    mutations: {
        llenarlista(state, Carpetas) {
            state.listCarpetas = Carpetas;
        },
        setRutaAnterior(state, value) {
            state.rutaAnterior = value;
        },
        setCarpeta(state, value) {
            state.dataCarpeta = value;
        },
        setIsLoading(state, value) {
            state.isLoading = value;
        },
        setErrorMessage(state, value) {
            state.errorMessage = value;
        }
    },

    actions: {

        cargarCarpetas: async function ({ commit }, ruta) {
            commit('setIsLoading', true);  // Iniciar carga
            commit('setErrorMessage', ""); // Limpiar errores anteriores
            try {
                if (ruta) {
                    const items = new FormData();
                    items.append('rutaServidor', ruta.toUpperCase());

                    const setting = {
                        method: 'POST',
                        body: items,
                    };
                    const url = `${baseURL}Dir_ArchSelect.php`;
                    const data = await fetch(url, setting);
                    if (data.ok) {
                        const json = await data.text();
                        if (json.startsWith('{')) {
                            const jsonData = JSON.parse(json);
                            commit('llenarlista', jsonData);
                        } else {
                            const errorResponse = JSON.parse(json);
                            const errorMessage = errorResponse.error;
                            commit('setErrorMessage', errorMessage);  // Establecer el error
                        }
                    }
                }
            } catch (error) {
                commit('setErrorMessage', 'Error al cargar las carpetas: ' + error.message);
            } finally {
                commit('setIsLoading', false);  // Terminar carga
            }
        },

        crearCarpeta: async function ({ commit, dispatch }, { datos, path, oldPath }) {
            commit('setIsLoading', true);  // Iniciar carga
            commit('setErrorMessage', ""); // Limpiar errores anteriores
            try {
                const datosCarpeta = new FormData();
                const rutaC = path + datos.NomEst.toUpperCase() + ' ' + datos.ApeEst.toUpperCase();
                const aux = rutaC.indexOf('.');
                if (aux < 0) {
                    if (datos.ApeEst === '') {
                        datosCarpeta.append('nuevoNombreDirectorio', path + datos.NomEst.toUpperCase());
                    } else {
                        datosCarpeta.append('nuevoNombreDirectorio', path + datos.NomEst.toUpperCase() + ' ' + datos.ApeEst.toUpperCase());
                    }
                    datosCarpeta.append('nombreDirectorio', oldPath.toUpperCase());
                } else {
                    datosCarpeta.append('nuevoNombreDirectorio', path + datos.NomEst);
                    datosCarpeta.append('nombreDirectorio', oldPath);
                }
                const setting = {
                    method: 'POST',
                    body: datosCarpeta,
                };
                const url = datos.IdEst === 0 ? `${baseURL}crearCarpetas.php` : `${baseURL}actualizarCarpetaServidor.php`;

                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    const jsonData = JSON.parse(json);
                    dispatch('cargarCarpetas', path);
                } else {
                    dispatch('cargarCarpetas', path);
                }
            } catch (error) {
                commit('setErrorMessage', 'Error al crear la carpeta: ' + error.message);
            } finally {
                commit('setIsLoading', false);  // Terminar carga
            }
        },

        crearSubCarpeta: async function ({ commit, dispatch }, { datos, path, nombre }) {
            commit('setIsLoading', true);
            commit('setErrorMessage', "");
            try {
                const datosCarpeta = new FormData();
                datosCarpeta.append('nuevoNombreDirectorio', path.toUpperCase() + datos.NomEst.toUpperCase() + ' ' + datos.ApeEst.toUpperCase() + '/' + nombre.toUpperCase());
                
                const setting = {
                    method: 'POST',
                    body: datosCarpeta,
                }
                const url = `${baseURL}crearCarpetas.php`;
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    dispatch('cargarCarpetas', path);
                } else {
                    dispatch('cargarCarpetas', path);
                }
            } catch (error) {
                commit('setErrorMessage', 'Error al crear la subcarpeta: ' + error.message);
            } finally {
                commit('setIsLoading', false);
            }
        },

        crearSubSubCarpeta: async function ({ commit, dispatch }, { datos, nomSubDir ,path, nombre }) {
            commit('setIsLoading', true);
            commit('setErrorMessage', "");
            try {
                const datosCarpeta = new FormData();
                datosCarpeta.append('nuevoNombreDirectorio', path.toUpperCase() + datos.NomEst.toUpperCase() + ' ' + datos.ApeEst.toUpperCase() + '/' + nomSubDir.toUpperCase() + '/' + nombre.toUpperCase());

                const setting = {
                    method: 'POST',
                    body: datosCarpeta,
                };
                const url = `${baseURL}crearCarpetas.php`;
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    dispatch('cargarCarpetas', path);
                } else {
                    dispatch('cargarCarpetas', path);
                }
            } catch (error) {
                commit('setErrorMessage', 'Error al crear la sub-subcarpeta: ' + error.message);
            } finally {
                commit('setIsLoading', false);
            }
        },

        eliminarCarpeta: async function ({ commit, dispatch }, { ruta1, ruta2, tipo }) {
            commit('setIsLoading', true);
            commit('setErrorMessage', "");
            try {
                const datosCarpeta = new FormData();
                if (tipo === 'Archivo') {
                    datosCarpeta.append('rutaServidor', ruta2);
                } else {
                    datosCarpeta.append('rutaServidor', ruta2.toUpperCase());
                }
                const setting = {
                    method: 'POST',
                    body: datosCarpeta,
                };
                const url = `${baseURL}eliminarCarpetaServidor.php`;
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    dispatch('cargarCarpetas', ruta1);
                } else {
                    dispatch('cargarCarpetas', ruta1);
                }
            } catch (error) {
                commit('setErrorMessage', 'Error al eliminar la carpeta: ' + error.message);
            } finally {
                commit('setIsLoading', false);
            }
        },

        descargarCarpeta: async function ({ commit }, { ruta, nombre }) {
            commit('setIsLoading', true);
            commit('setErrorMessage', "");
            try {
                const datosArchivos = new FormData();
                datosArchivos.append('rutaRemota', ruta + nombre.toUpperCase().trim());

                const setting = {
                    method: 'POST',
                    body: datosArchivos,
                };
                const url = `${baseURL}descargarCarpetas.php`;
                const response = await fetch(url, setting);

                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    const blob = new Blob([arrayBuffer], { type: 'application/zip' });
                    const a = document.createElement('a');
                    a.href = window.URL.createObjectURL(blob); // Crear la URL del Blob localmente
                    a.download = nombre || `${ruta}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(a.href);
                }
            } catch (error) {
                commit('setErrorMessage', 'Error al descargar la carpeta: ' + error.message);
            } finally {
                commit('setIsLoading', false);
            }
        },
    }
}
