<template>
    <div>
        <ObsArch :dialog="dialogObs" @dialog="dialogObs = $event"></ObsArch>
        <progres2 :dialog="dailogEliminar" :message="sms"></progres2>
        <template>
            <v-card v-if="show">
                <v-card-title>
                    {{ Titulo }}
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="descargarAll()">Descargar Todo
                        <v-icon right>mdi-folder-download</v-icon>
                    </v-btn>
                </v-card-title>
                <v-data-table v-if="mostaraDatos" dense :headers="Cabecera" :items="ItemsArchivos.elementos"
                    :item-per-page="5" :search="search" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr class="myStyle" v-if="verificarPermisos(item)">
                            <td>
                                <v-icon v-if="item.tipo != 'Archivo'" class="mr-3"
                                    color="yellow darken-1">mdi-folder</v-icon>
                                <v-icon v-else class="mr-3" color="red darken-1">mdi-file-document</v-icon>
                            </td>
                            <td @click="hacerAlgoAlHacerClic(item)" class="linea">{{ item.nombre }}</td>
                            <td v-if="item.tipo != 'Archivo'">{{ item.cantidad }} elementos </td>
                            <td v-else>{{ item.tamaño }} MB</td>
                            <td>{{ item.fecha_creacion }}</td>
                            <td>{{ item.tipo }}</td>
                            <td>
                                <div class="flex">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="primary darken-2" size="30" class="me-2"
                                                v-if="mostrarEditar(item)" @click.stop="editarItem(item)" v-bind="attrs"
                                                v-on="on">
                                                mdi-pencil
                                            </v-icon>
                                            <v-icon v-else size="35">mdi-alpha-x</v-icon>
                                        </template>
                                        <span>Editar</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="error darken-2" size="30" @click.stop="eliminarItem(item)"
                                                v-if="mostrarEliminar(item)" v-bind="attrs" v-on="on">
                                                mdi-delete
                                            </v-icon>
                                            <v-icon v-else size="35">mdi-alpha-x</v-icon>
                                        </template>
                                        <span>Eliminar</span>
                                    </v-tooltip>
                                    <div>
                                        <v-tooltip bottom style="margin-right: 15px;">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="black darken-2" size="30" @click.stop="descargarDatos(item)"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-download
                                                </v-icon>
                                            </template>
                                            <span>Descargar</span>
                                        </v-tooltip>
                                    </div>
                                    <div v-if="mostrarVista(item)">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="yellow darken-2" size="30" class="me-2"
                                                    @click.stop="verObservacion(item)" v-bind="attrs" v-on="on">
                                                    mdi-eye-circle
                                                </v-icon>
                                            </template>
                                            <span>Observacion</span>
                                        </v-tooltip>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else >
                            <td><v-icon color="error darken-2" size="28">mdi-file-alert</v-icon></td>
                            <td style="color: red;"  >Sin</td>
                            <td style="color: red;" >acceso</td>
                            <td style="color: red;" >al</td>
                            <td style="color: red;" >Directorio  {{ sinPermisos }}</td>
                            <td style="color: red;" >Solicite Permisos</td>
                        </tr>
                    </template>
                </v-data-table>
                <div v-else-if="auxPermisosControl.length == 0" class="error-message text-center">No tienes permisos, solicitalos al administrador</div>
                <div v-else class="error-message text-center">No se puede conectar al servidor</div>
            </v-card>
        </template>
    </div>
</template>


<script>
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import ObsArch from './ventanaModalObs.vue';
import progres2 from './progresCircular.vue';
export default {
    name: "TablaC",

    props: ['show', 'Titulo', 'Cabecera', 'ItemsArchivos'],

    data() {
        return {
            search: '',
            path: '',
            search: '',
            sms: 'Cargando Datos...',
            selectedItems: [],
            carpetaSelecionada: {},
            rutaActual: '',
            dialogObs: false,
            auxPermisosControl: [],
            sinPermisos:"",
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDailogEliminar', 'setMostrarCrear', 'setDialogFolder', 'setVentanaEst', 'setVentanaArch', 'setBreadcrumbs', 'setDialogCarpeta', 'setCtlSubirArch', 'setCtlfolder', 'setDailogCargarDatos']),
        ...mapActions('Server_Carpetas', ['cargarCarpetas', 'eliminarCarpeta', 'descargarCarpeta']),
        ...mapActions('Server_Archivos', ['descargarArchivo', 'cargarObsArchivos']),
        ...mapMutations('Server_Carpetas', ['setRutaAnterior', 'setCarpeta']),

        editarItem(item) {
            this.rutaNueva();
            this.carpetaSelecionada = {
                IdEst: 1,
                NomEst: item.nombre,
                ApeEst: '',
            }
            this.setCarpeta(this.carpetaSelecionada);
            this.setDialogCarpeta(true);
            this.setRutaAnterior(this.path + item.nombre);
            this.path = '';
            //this.setRutaAnterior('');
        },


        eliminarItem: async function (item) {
            try {
                this.rutaNueva();
                this.$alertify.confirm(
                    'Deseas eliminar el estudiante: ' + item.nombre,
                    async () => {
                        console.log('Ruta Borrar ' + this.path + item.nombre);
                        await this.eliminarCarpeta({ ruta1: this.path, ruta2: this.path + item.nombre, tipo: item.tipo });
                        await this.cargarCarpetas(this.path);
                        this.path = '';
                        this.$alertify.success('Carpeta ' + item.nombre + ' Eliminada');
                    },
                    () => this.$alertify.error('Cancelado')
                );
            } catch (error) {
                this.$alertify.error('Error al eliminar carpeta ' + error);
            }
        },

        async hacerAlgoAlHacerClic(item) {
            this.setDailogEliminar(true);
            if (this.verificarSiPadre(item)) {
                localStorage.setItem('padreActual', item.nombre.trim().toLowerCase());
            }
            this.verificarSiArchivo(item);
            this.rutaNueva();
            this.setCtlSubirArch(true);
            this.setCtlfolder(true);
            await this.cargarCarpetasAsync(this.path);
            this.path = '';
            this.setDailogEliminar(false);
        },

        async cargarCarpetasAsync(path) {
            await this.cargarCarpetas(path);
        },

        verificarSiArchivo(item) {
            if (item.tipo == 'Archivo') {
                this.rutaNueva();
                this.descargarItem(this.path, item);
                this.path = '';
            } else {
                this.setBreadcrumbs(item.nombre);
            }
        },

        verificarSiPadre(item) {
            try {
                const recuperarPermisos = localStorage.getItem('PermisosSubDirectorios');
                const permisosSubdirectorio = new Map(JSON.parse(recuperarPermisos));
                console.log(permisosSubdirectorio.get(item.nombre.trim().toLowerCase()));
                return permisosSubdirectorio.get(item.nombre.trim().toLowerCase()) != null ? true : false;
            } catch (error) {
                this.$alertify.error('Error al verificar Carpeta Padre ' + error);
            }
        },

        // Función para recuperar permisos
        recuperarPermisos() {
            const recuperarPermisos = localStorage.getItem('PermisosSubDirectorios');
            return new Map(JSON.parse(recuperarPermisos));
        },

        // Verificar permisos genérico
        verificarPermisosGenerico(item, permiso) {
            try {
                const permisosSubdirectorio = this.recuperarPermisos();
                const nombreTrim = item.nombre.trim().toLowerCase();
                if (this.getSubCarpetas.some(({ NomItem }) => NomItem.toLowerCase() === item.nombre.toLowerCase())) {
                    localStorage.setItem('padreActual', '');
                }
                if (permisosSubdirectorio.get(nombreTrim) != null) {
                    return true;
                }
                const padreActual = localStorage.getItem('padreActual');
                const auxPermisos = permisosSubdirectorio.get(padreActual);
                return auxPermisos != null;
            } catch (error) {
                this.$alertify.error('Error al verificar permisos ' + error);
            }
        },

        // Mostrar editar genérico
        mostrarEditarGenerico(item, permiso) {
            try {
                const permisosSubdirectorio = this.recuperarPermisos();
                const nombreTrim = item.nombre.trim().toLowerCase();

                if (permisosSubdirectorio.get(nombreTrim) != null) {
                    return permisosSubdirectorio.get(nombreTrim).includes(permiso);
                }

                const padreActual = localStorage.getItem('padreActual');
                const aux = permisosSubdirectorio.get(padreActual.trim());
                return aux != null && aux.includes(permiso);
            } catch (error) {
                this.$alertify.error('Error al verificar permisos individuales ' + error);
            }
        },

        // Verificar permisos
        verificarPermisos(item) {
            //console.log("Iniciando verificación de permisos para:", item);
            const tienePermisos = this.verificarPermisosGenerico(item);
            //console.log("Resultado de permisos:", tienePermisos);
            
            if (!tienePermisos) {
                this.sinPermisos = item.nombre;
                //this.$alertify.error("No tienes permisos para mostrar los Directorios, Solicitalos");
                //console.log("ERROR al verificar permisos para:", item);
            }
            
            return tienePermisos;
        },

        // Mostrar editar
        mostrarEditar(item) {
            this.mostrarCrear(item);
            return this.mostrarEditarGenerico(item, 'Editar');
        },

        // Mostrar eliminar
        mostrarEliminar(item) {
            return this.mostrarEditarGenerico(item, 'Eliminar');
        },

        // Mostrar eliminar
        mostrarCrear(item) {
            let crear = this.mostrarEditarGenerico(item, 'Crear');
            this.setMostrarCrear(crear);
        },

        mostrarVista(item) {
            return item.tipo === 'Archivo' ? true : false;
        },

        verObservacion: async function (item) {
            this.dialogObs = true;
            this.rutaNueva();
            await this.cargarObsArchivos({ rutaObs: this.path + item.nombre.trim() });
            this.path = '';
        },

        descargarItem: async function (ruta, item) {
            try {
                //this.rutaNueva();
                await this.descargarArchivo({ ruta: ruta + item.nombre, nombre: item.nombre });
                this.$alertify.success('Archivo Descargado');
                //this.path = '';
            } catch (error) {
                this.$alertify.error('Error al descargar el archivo ' + error);
            }
        },

        descargarDirectorio: async function (ruta, item) {
            try {
                //this.rutaNueva();
                await this.descargarCarpeta({ ruta: ruta, nombre: item.nombre });
                this.$alertify.success('Archivo Descargado en unidad C:/DESCARGAS');
                //this.path = '';
            } catch (error) {
                this.$alertify.error('Error al descargar carpeta ' + error);
            }
        },


        descargarAll: async function () {
            try {
                this.rutaNueva();
                const nom = '';
                await this.descargarCarpeta({ ruta: this.path, nombre: nom });
                this.$alertify.success('Archivo Descargado en unidad');
                this.path = '';
            } catch (error) {
                this.$alertify.error('Error al descargar las carpetas ' + error);
            }
        },

        descargarDatos(item) {
            this.rutaNueva();
            if (item.tipo === 'Archivo') {
                this.descargarItem(this.path, item);
            } else {
                this.descargarDirectorio(this.path, item);
            }
            this.path = '';

        },

        rutaNueva() {
            //metodo para obtener la ruta
            for (let i = 0; i < this.itemsBread.length; i++) {
                this.path += this.itemsBread[i] + "/";
            }
            //console.log(this.path);
        },


    },

    components: {
        ObsArch,
        progres2,
    },

    computed: {
        //...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Dialogo', ['itemsBread', 'dailogCargarDatos', 'dailogEliminar']),
        ...mapState('Permisos', ['permisosSubDirectorios']),
        ...mapGetters('SubCarpetas', ['getSubCarpetas']),

        mostaraDatos(){
            for( let i=0; i < this.getSubCarpetas.length; i++ ){
                let permisos = this.recuperarPermisos().get(this.getSubCarpetas[0].NomItem.toLowerCase());
                if( permisos != null ){
                    this.auxPermisosControl = permisos
                }else{
                    console.log('No tienes permisos');
                }
            }
            try {
                if(this.ItemsArchivos.elementos.length > 0 && this.auxPermisosControl.length > 0 ){
                   return true
                }else{
                    return false

                }
            } catch (error) {
                return false
            }
        }
    },

    watch: {
    }
}
</script>
<style>
.myStyle:hover {
    cursor: pointer;
}

.linea:hover {
    text-decoration: underline;
}

.flex {
    display: flex;
    flex-direction: row;
    gap: 10px;
}
</style>