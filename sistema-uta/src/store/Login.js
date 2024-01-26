import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';

export default {
    namespaced: true,

    state: {
        user: null, // Aquí almacenaremos la información del usuario autenticado
        isAuthenticated: false, // Estado de autenticación

        sms: '',
        notificaciones:[],
    },

    getters: {
        getUser(state) {
            return state.user;
        },
        getAuthentication(state) {
            return state.isAuthenticated;
        },
        getSms(state) {
            state.sms;
        },
        getNotificaciones(state) {
            state.notificaciones;
        }
    },

    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setAuthentication(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated;
        },
        setSms(state, value) {
            state.sms = value;
        },
        setNotificaciones(state, value) {
            console.log(state.notificaciones);
        },

    },

    actions: {
        async login({ commit, state }, { user, pass }) {
            try {
                const datosUser = new FormData();
                datosUser.append('user', user);
                datosUser.append('pass', pass);
                const setting = {
                    method: 'POST',
                    body: datosUser,
                }
                const url = `${baseURL}Apis-UTA/Login.php`;
                const data = await fetch(url, setting)
                if (data.ok) {
                    const json = await data.json();
                    const firstObject = json[0];
                    console.log(firstObject);
                    if (user.toLowerCase() === firstObject.Correo.toLowerCase() && pass === firstObject.Contraseña) {
                        commit('setAuthentication', true);
                        commit('setUser', firstObject);
                        commit('setSms', 'correcto');
                        localStorage.setItem('Authentication', true);
                        localStorage.setItem('user', JSON.stringify(firstObject));
                    } else {
                        //console.log("No se encontro el usuario...");
                        commit('setSms', 'incorrecto');
                    }
                } else {
                    commit('setSms', 'incorrecto');
                    //console.log(" Not found => Error 400 ");
                }
            } catch (error) {
                console.log("Error de Autenticacion:" + error);
            }
        },

        validarCorreo: async function ({ commit, state }, { correo }) {
            try {
                const datosCorreo = new FormData();
                datosCorreo.append('correo', correo);

                const setting = {
                    method: 'POST',
                    body: datosCorreo,
                };
                const url = `${baseURL}Apis-UTA/validarCorreo.php`;
                const response = await fetch(url, setting);
                if (response.ok) {
                    const json = await response.json();
                    if (json == 'existe') {
                        return true;
                    } else {
                        return false;
                    }
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                throw error; // Re-lanza el error para que pueda ser manejado externamente si es necesario.
            }
        },


        cambioContraseñaCorreo: async function ({ commit, state }, { correo, newPass }) {
            try {
                const datosContra = new FormData();
                datosContra.append('correo', correo);
                datosContra.append('Contraseña', newPass);

                const setting = {
                    method: 'POST',
                    body: datosContra,
                };
                const url = `${baseURL}Apis-UTA/cambioContrasena.php`;
                const response = await fetch(url, setting);
                if (response.ok) {
                    const json = await response.json();
                    //console.log(json);
                    if (json.message == 'contraseña Actualizada') {
                        return true;
                    } else {
                        return false;
                    }
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                throw error; // Re-lanza el error para que pueda ser manejado externamente si es necesario.
            }
        },

        notificaciones: async function ({ commit, state }, { idUser }) {
            try {
                const datosCar = new FormData();
                datosCar.append('IdUser', 2);

                const setting = {
                    method: 'POST',
                    body: datosCar,
                };
                const url = `${baseURL}Apis-UTA/carpetasVaciasServidor.php.`;
                const response = await fetch(url, setting);
                if (response.ok) {
                    const json = await response.text();
                    //console.log(json);
                    commit('setNotificaciones', json);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                throw error; // Re-lanza el error para que pueda ser manejado externamente si es necesario.
            }
        },
    },

}
