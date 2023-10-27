import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    namespaced: true,

    state: {
        user: null, // Aquí almacenaremos la información del usuario autenticado
        isAuthenticated: false, // Estado de autenticación
        // ...
    },

    getters: {
        getUser(state) {
            return state.user;
        },
        getAuthentication(state) {
            return state.isAuthenticated;
        }
    },

    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setAuthentication(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated;
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
                const url = "http://localhost/Apis-UTA/Login.php";
                const data = await fetch(url, setting)
                if (data.ok) {
                    console.log(user);
                    const json = await data.json();
                    console.log(json);
                    if (json.length > 0) {
                        const firstObject = json[0];
                        commit('setAuthentication', true);
                        commit('setUser', firstObject);
                        localStorage.setItem('user', JSON.stringify(firstObject));

                        
                    } else {
                        console.log("Datos incorrectos");
                    }
                } else {
                    console.log("Datos incorrectos...");
                }
            } catch (error) {
                console.log("Error de Autenticacion:"+ error);
            }
        },
    },

}
