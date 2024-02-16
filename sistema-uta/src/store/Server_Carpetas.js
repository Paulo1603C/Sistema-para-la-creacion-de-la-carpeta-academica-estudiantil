import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { baseURL } from './config';
export default {
    namespaced: true,

    state: {
        listCarpetas: [],
        rutaAnterior: "",  //servira para tener la ruta que queremos actualizar en el servidor

        //
        dataCarpeta: {},

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

        setRutaAnterior(state, value) {
            state.rutaAnterior = value;
        },

        setCarpeta(state, value) {
            state.dataCarpeta = value;
        },

    },

    actions: {

        cargarCarpetas: async function ({ commit }, ruta) {
            //console.log('RUTA===>' + ruta.toUpperCase());
            if (ruta) {
                try {
                    const items = new FormData();
                    items.append('rutaServidor', ruta.toUpperCase());

                    const setting = {
                        method: 'POST',
                        body: items,
                    }
                    const url = `${baseURL}Apis-UTA/Dir_ArchSelect.php`;
                    const data = await fetch(url, setting);
                    if (data.ok) {
                        const json = await data.text();
                        //console.log(json);
                        if (json.startsWith('{')) {
                            const jsonData = JSON.parse(json);
                            commit('llenarlista', jsonData);
                        } else {
                            const errorResponse = JSON.parse(json);
                            const errorMessage = errorResponse.error;
                            commit('llenarlista', errorMessage);
                            // Aquí puedes agregar código adicional para mostrar el mensaje de error en pantalla
                            alert(errorMessage); // Por ejemplo, puedes mostrar una alerta con el mensaje de error
                        }
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    commit('setErrorCargaCarpetas', 'Error al cargar las carpetas: ' + error.message);
                }
            }

        },

        crearCarpeta: async function ({ commit, dispatch }, { datos, path, oldPath }) {
            //console.log('IDEst ' + JSON.stringify(datos));/
            try {
                const datosCarpeta = new FormData();
                const rutaC = path + datos.NomEst.toUpperCase() + ' ' + datos.ApeEst.toUpperCase();
                const aux = rutaC.indexOf('.');
                if (aux < 0) {
                    if (datos.ApeEst == '') {
                        console.log('just folder');
                        //console.log(path);
                        //console.log( path + datos.NomEst.toUpperCase());
                        //console.log(  oldPath.toUpperCase() );
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
                }
                //console.log("ID" + datos.IdEst);
                var url = "";
                if (datos.IdEst == 0) {
                    url = `${baseURL}Apis-UTA/crearCarpetas.php`;
                } else {
                    url = `${baseURL}Apis-UTA/actualizarCarpetaServidor.php`;
                }
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    const jsonData = JSON.parse(json);
                    console.log('json');
                    dispatch('cargarCarpetas', path);
                } else {
                    console.log('Text');
                    dispatch('cargarCarpetas', path);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }

        },

        crearSubCarpeta: async function ({ commit, dispatch }, { datos, path, nombre }) {
            try {
                const datosCarpeta = new FormData();
                datosCarpeta.append('nuevoNombreDirectorio', path.toUpperCase() + datos.NomEst.toUpperCase() + ' ' + datos.ApeEst.toUpperCase() + '/' + nombre.toUpperCase());
                //console.log('RUTA-> ' + path.toUpperCase() + datos.NomEst.toUpperCase() + ' ' + datos.ApeEst.toUpperCase()+'/'+nombre.toUpperCase());
                const setting = {
                    method: 'POST',
                    body: datosCarpeta,
                }
                const url = `${baseURL}Apis-UTA/crearCarpetas.php`;
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    const jsonData = JSON.parse(json);
                    console.log('json');
                    dispatch('cargarCarpetas', path);
                } else {
                    console.log('Text');
                    dispatch('cargarCarpetas', path);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }

        },

        eliminarCarpeta: async function ({ commit, dispatch }, { ruta1, ruta2, tipo }) {
            try {
                //console.log('Server'+ruta2.toUpperCase())
                const datosCarpeta = new FormData();
                if (tipo == 'Archivo') {
                    datosCarpeta.append('rutaServidor', ruta2);
                } else {
                    datosCarpeta.append('rutaServidor', ruta2.toUpperCase());
                }
                const setting = {
                    method: 'POST',
                    body: datosCarpeta,
                }
                const url = `${baseURL}Apis-UTA/eliminarCarpetaServidor.php`;
                const data = await fetch(url, setting);
                const json = await data.text();
                if (json.startsWith('{')) {
                    const jsonData = JSON.parse(json);
                    dispatch('cargarCarpetas', ruta1);
                    return true;
                } else {
                    dispatch('cargarCarpetas', ruta1);
                    return true;
                }
            } catch (error) {
                console.log("Error de eliminción " + error);
            }
        },

        descargarCarpeta: async function ({ commit, dispatch }, { ruta, nombre }) {
            try {
                //console.log('RUTA ' + ruta + nombre.toUpperCase());
                const datosArchivos = new FormData();
                datosArchivos.append('rutaRemota', ruta + nombre.toUpperCase().trim());

                const setting = {
                    method: 'POST',
                    body: datosArchivos,
                }
                const url = `${baseURL}Apis-UTA/descargarCarpetas.php`;
                const response = await fetch(url, setting);
                //console.log('Imprimido');
                //const json = await response.text();
                if (response.ok) {
                    //console.log('Imprimido');
                } else {
                    //console.log('No Imprimido');

                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }

        },

    }
}
