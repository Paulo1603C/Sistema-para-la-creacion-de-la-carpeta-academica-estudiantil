import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';

export default {
    namespaced: true,

    state: {
        notificaciones: [],
    },

    getters: {
        getNotificaciones(state) {
            return state.notificaciones;
        }
    },

    mutations: {

        setNotificaciones(state, value) {
            state.notificaciones = value;
            console.log(state.notificaciones);
        },

    },

    actions: {

        notificaciones: async function ({ commit, state }, { idUser }) {
            try {
                const datosCar = new FormData();
                datosCar.append('IdUser', idUser);

                const setting = {
                    method: 'POST',
                    body: datosCar,
                };
                const url = `${baseURL}carpetasVaciasServidor.php`;
                const response = await fetch(url, setting);
                if (response.ok) {
                    const json = await response.text();
                    if (json.startsWith('[')) {
                        const jsonData = JSON.parse(json); // Analiza como JSON si parece válido
                        commit('setNotificaciones', jsonData);
                    } else {
                        commit('setNotificaciones', json);
                    }
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                throw error; // Re-lanza el error para que pueda ser manejado externamente si es necesario.
            }
        },
    },

}
