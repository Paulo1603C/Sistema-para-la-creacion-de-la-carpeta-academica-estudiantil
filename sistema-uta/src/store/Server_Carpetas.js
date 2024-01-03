import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    namespaced: true,

    state: {
        listCarpetas: [],
        rutaAnterior:"",  //servira para tener la ruta que queremos actualizar en el servidor
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

        setRutaAnterior(state, value){
            state.rutaAnterior = value;
        }

    },

    actions: {

        cargarCarpetas: async function ({ commit }, ruta) {
            if (ruta) {
                try {
                    const items = new FormData();
                    items.append('rutaServidor', ruta.toUpperCase());
                    console.log(ruta.toUpperCase());

                    const setting = {
                        method: 'POST',
                        body: items,
                    }
                    const url = 'http://localhost/Apis-UTA/Dir_ArchSelect.php';
                    const data = await fetch(url, setting);
                    const json = await data.json();
                    console.log(json);
                    commit('llenarlista', json);
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                }
            }

        },

        crearCarpeta: async function ({ commit, dispatch }, { datos, path, oldPath }) {
            try {
                const datosCarpeta = new FormData();
                datosCarpeta.append('nuevoNombreDirectorio', path.toUpperCase() + datos.NomEst.toUpperCase() + " " + datos.ApeEst.toUpperCase());
                datosCarpeta.append('nombreDirectorio', oldPath.toUpperCase() );
                //console.log('RUTA->' + path.toUpperCase() + datos.NomEst.toUpperCase() + " " + datos.ApeEst.toUpperCase());
                console.log('nuevoNombreDirectorio', path.toUpperCase() + datos.NomEst.toUpperCase() + " " + datos.ApeEst.toUpperCase());
                console.log('OLD'+oldPath);
                const setting = {
                    method: 'POST',
                    body: datosCarpeta,
                }
                console.log("ID"+datos.IdEst);
                var url = "";
                if(datos.IdEst == 0){
                    url = "http://localhost/Apis-UTA/crearCarpetas.php";
                }else{
                    url = "http://localhost/Apis-UTA/actualizarCarpetaServidor.php"
                }
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    const jsonData = JSON.parse(json);
                    dispatch('cargarCarpetas');
                } else {
                    dispatch('cargarCarpetas');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }

        },

        eliminarCarpeta: async function ({ commit, dispatch }, ruta) {
            try {
                const datosCarpeta = new FormData();
                datosCarpeta.append('rutaServidor', ruta.toUpperCase());
                console.log(ruta.toUpperCase());
                const setting = {
                    method: 'POST',
                    body: datosCarpeta,
                }
                const url = "http://localhost/Apis-UTA/eliminarCarpetaServidor.php";
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    const jsonData = JSON.parse(json);
                    dispatch('cargarCarpetas');
                } else {
                    dispatch('cargarCarpetas');
                }
            } catch (error) {
                console.log("Error de eliminción " + error);
            }
        },
    }
}
