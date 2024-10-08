import Vue from 'vue'
import Vuex from 'vuex'
import { baseURL } from './config';

Vue.use(Vuex)

export default {
    namespaced: true,

    state: {
        listArchivos: null,
        dataObsArch: {},
        observacion: '',
        loading: false, // Estado para manejar el loading
    },

    getters: {
        getArchivos(state) {
            return state.listArchivos;
        },
        getObs(state) {
            return state.observacion;
        },
        isLoading(state) {
            return state.loading; // Getter para el estado de carga
        },
    },

    mutations: {
        llenarlista(state, Archivos) {
            state.listArchivos = Archivos;
        },
        cargarObs(state, sms) {
            state.observacion = sms;
        },
        setLoading(state, isLoading) {
            state.loading = isLoading; // Cambiar el estado de loading
        },
    },

    actions: {
        async cargarArchivos({ commit }) {
            commit('setLoading', true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de tiempo de espera

            try {
                const setting = {
                    method: 'GET',
                    signal: controller.signal, // Añadir la señal de abortar
                };
                const url = ''; // tu URL
                const json = await fetchWithRetry(url, setting);
                commit('llenarlista', json);

            } catch (error) {
                if (error.name === 'AbortError') {
                    commit('cargarObs', 'La solicitud ha tardado demasiado y fue cancelada.');
                } else {
                    console.error('Error en la solicitud:', error);
                    commit('cargarObs', 'Hubo un problema con la conexión a Internet. Por favor, inténtalo de nuevo.');
                }
            } finally {
                clearTimeout(timeoutId);
                commit('setLoading', false);
            }
        },

        async cargarObsArchivos({ commit }, { rutaObs }) {
            commit('setLoading', true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de tiempo de espera

            try {
                const datosEST = new FormData();
                datosEST.append('rutaObs', rutaObs);
                const setting = {
                    method: 'POST',
                    body: datosEST,
                    signal: controller.signal,
                };
                const url = `${baseURL}obsArchSelect.php`;
                const json = await fetchWithRetry(url, setting);

                commit('cargarObs', json);
            } catch (error) {
                if (error.name === 'AbortError') {
                    commit('cargarObs', 'La solicitud ha tardado demasiado y fue cancelada.');
                } else {
                    console.error('Error en la solicitud:', error);
                    commit('cargarObs', 'Hubo un problema con la conexión a Internet. Por favor, inténtalo de nuevo.');
                }
            } finally {
                clearTimeout(timeoutId);
                commit('setLoading', false);
            }
        },

        async crearArchivos({ commit }, { ruta, archivo }) {
            commit('setLoading', true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de tiempo de espera

            try {
                const datosArchivos = new FormData();
                datosArchivos.append('rutaRemota', ruta);
                datosArchivos.append('file', archivo);

                const setting = {
                    method: 'POST',
                    body: datosArchivos,
                    signal: controller.signal,
                }
                const url = `${baseURL}crearArchivos.php`;
                const json = await fetchWithRetry(url, setting);

                // Aquí puedes manejar el json según sea necesario

            } catch (error) {
                if (error.name === 'AbortError') {
                    commit('cargarObs', 'La solicitud ha tardado demasiado y fue cancelada.');
                } else {
                    console.error('Error en la solicitud:', error);
                    commit('cargarObs', 'Hubo un problema con la conexión a Internet. Por favor, inténtalo de nuevo.');
                }
            } finally {
                clearTimeout(timeoutId);
                commit('setLoading', false);
            }
        },

        async crearObsArchivos({ commit }, { ruta, observacion, idEstPer }) {
            commit('setLoading', true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de tiempo de espera

            try {
                const datosObsArchivos = new FormData();
                datosObsArchivos.append('RutaArchivo', ruta);
                datosObsArchivos.append('Observacion', observacion);
                datosObsArchivos.append('IdEstPer', idEstPer);

                const setting = {
                    method: 'POST',
                    body: datosObsArchivos,
                    signal: controller.signal,
                }
                const url = `${baseURL}insertarObsArch.php`;
                const json = await fetchWithRetry(url, setting);

                // Aquí puedes manejar el json según sea necesario

            } catch (error) {
                if (error.name === 'AbortError') {
                    commit('cargarObs', 'La solicitud ha tardado demasiado y fue cancelada.');
                } else {
                    console.error('Error en la solicitud:', error);
                    commit('cargarObs', 'Hubo un problema con la conexión a Internet. Por favor, inténtalo de nuevo.');
                }
            } finally {
                clearTimeout(timeoutId);
                commit('setLoading', false);
            }
        },

        async descargarArchivo({ commit }, { ruta, nombre }) {
            commit('setLoading', true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de tiempo de espera

            try {
                const datosArchivos = new FormData();
                datosArchivos.append('rutaRemota', ruta);

                const setting = {
                    method: 'POST',
                    body: datosArchivos,
                    signal: controller.signal,
                }
                const url = `${baseURL}descargarDir_Arch.php`;
                const response = await fetch(url, setting);
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = nombre; // Nombre del archivo que se guardará localmente
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    commit('cargarObs', 'La solicitud ha tardado demasiado y fue cancelada.');
                } else {
                    console.error('Error en la solicitud:', error);
                    commit('cargarObs', 'Hubo un problema con la conexión a Internet. Por favor, inténtalo de nuevo.');
                }
            } finally {
                clearTimeout(timeoutId);
                commit('setLoading', false);
            }
        },
    },
}

// Función para realizar reintentos
async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json(); // Asumiendo que esperas JSON
        } catch (error) {
            if (i === retries - 1) throw error; // Lanza el error si es el último intento
            console.log(`Intento ${i + 1} fallido, reintentando...`);
        }
    }
}
