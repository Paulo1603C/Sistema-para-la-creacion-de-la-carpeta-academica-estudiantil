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

        cargarArchivos: async function({commit}){
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

        crearArchivos: async function( { commit, dispatch }, datos ){
            try {
                const datosArchivos = new FormData();
                datosArchivos.append('nombreDirectorio', datos.NomEst + datos.ApeEst );

                const setting = {
                    method:'POST',
                    body:datosArchivos,
                }
                const url = "http://localhost/Apis-UTA/crearArchivos.php";
                const data = await fetch(url, setting);
                const json = await data.text();
                if( json.startsWith('{') ){
                    const jsonData = JSON.parse(json);
                    dispatch('cargarArchivos');
                }else{
                    dispatch('cargarArchivos');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
            
        }
       
    },

}
