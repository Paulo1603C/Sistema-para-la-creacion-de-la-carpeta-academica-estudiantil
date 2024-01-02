import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    namespaced: true,

    state: {
        listCarpetas: null, 
    },

    getters: {
        getCarpetas(state) {
            return state.listCarpetas;
        },
    },

    mutations: {
        llenarlista(state, Carpetas) {
            state.listCarpetas = Carpetas;
        },

    },

    actions: {

        cargarCarpetas: async function({commit}){
            try {
                const setting = {
                    methods:'GET',
                }
                const url = '';
                const data = await fetch(url,setting);
                const json = await data.json();
                commit('llenarlista', json);
                
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
            
        },

        crearCarpeta: async function( { commit, dispatch }, datos ){
            try {
                const datosCarpeta = new FormData();
                datosCarpeta.append('nombreDirectorio', datos.NomEst + datos.ApeEst );

                const setting = {
                    method:'POST',
                    body:datosCarpeta,
                }
                const url = "http://localhost/Apis-UTA/crearCarpetas.php";
                const data = await fetch(url, setting);
                const json = await data.text();
                if( json.startsWith('{') ){
                    const jsonData = JSON.parse(json);
                    dispatch('cargarCarpetas');
                }else{
                    dispatch('cargarCarpetas');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
            
        }
       
    },

}
