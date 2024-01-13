<template>
    <div>
        <template>
            <v-card v-show="show">
                <v-card-title>
                    {{ Titulo }}
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table dense :headers="Cabecera" :items="Items.elementos" :item-per-page="5" class="elevation-1">
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
                            <td>{{ item.user }}</td>
                            <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="primary darken-2" size="30" class="me-2" v-if="mostrarEditar(item)"
                                            @click.stop="editarItem(item)" v-bind="attrs" v-on="on">
                                            mdi-pencil
                                        </v-icon>
                                        <v-icon v-else size="35">mdi-alpha-x</v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="error darken-2" size="30" @click.stop="eliminarItem(item)" v-if="mostrarEditar(item)"
                                            v-bind="attrs" v-on="on">
                                            mdi-delete
                                        </v-icon>
                                        <v-icon v-else size="35" >mdi-alpha-x</v-icon>
                                    </template>
                                    <span>Eliminar</span>
                                </v-tooltip>
                                <v-tooltip bottom style="margin-right: 15px;">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="black darken-2" size="30" @click.stop="descargarItem(item)"
                                            v-bind="attrs" v-on="on">
                                            mdi-download
                                        </v-icon>
                                    </template>
                                    <span>Descargar</span>
                                </v-tooltip>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card>

        </template>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';


export default {
    name: "TablaC",

    props: ['show', 'Titulo', 'Cabecera', 'Items'],

    data() {
        return {
            search: '',
            path: '',
            selectedItems: [],
            carpetaSelecionada: {},
            rutaActual:'',
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDialogFolder', 'setVentanaEst', 'setVentanaArch', 'setBreadcrumbs', 'setDialogCarpeta']),
        ...mapActions('Server_Carpetas', ['cargarCarpetas', 'eliminarCarpeta']),
        ...mapActions('Server_Archivos', ['descargarArchivo']),
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


        eliminarItem(item) {
            console.log('Borrar Items');
            this.rutaNueva();
            this.$alertify.confirm(
                'Deseas eliminar el estudiante: ' + item.nombre,
                () => {
                    this.eliminarCarpeta({ ruta1: this.path, ruta2: this.path + item.nombre });
                    console.log('Ruta Borrar ' + this.path);
                    //this.cargarCarpetas(this.path);
                    this.path = '';
                    this.$alertify.success('Carpeta ' + item.nombre + ' Eliminada');
                },
                () => this.$alertify.error('Cancelado')
            );
        },

        hacerAlgoAlHacerClic(item) {
            console.log("Ietm selected" + item.nombre);
            this.setBreadcrumbs(item.nombre);
            this.rutaNueva();
            console.log(this.ruta);
            this.cargarCarpetas(this.path);
            this.path = '';
        },

        descargarItem: async function (item) {
            this.rutaNueva();
            console.log(item.nombre);
            console.log(this.path);
            await this.descargarArchivo({ ruta: this.path + item.nombre, nombre: item.nombre });
            this.$alertify.success('Archivo Descargado');
            this.path = '';
        },

        rutaNueva() {
            //metodo para obtener la ruta
            for (let i = 0; i < this.itemsBread.length; i++) {
                this.path += this.itemsBread[i] + "/";
            }
            //console.log(this.path);
        },

        verificarPermisos(item) {
            //this.rutaNueva();
            //this.rutaActual = this.path;
            const recuperarPermisos = localStorage.getItem('PermisosSubDirectorios');
            const permisosSubdirectorio = new Map(JSON.parse(recuperarPermisos));

            if (permisosSubdirectorio.get(item.nombre.trim()) != null) {
                return true;
            }

            /*const palabras = this.rutaActual.split("/").filter(Boolean);
            const carpetaAnterior = palabras[palabras.length-1];
            console.log("PADRE "+carpetaAnterior);
            if( permisosSubdirectorio.get(carpetaAnterior.trim()) != null ){
                return true;
            }*/
            
            return false;
        },

        mostrarEditar(item) {
            const recuperarPermisos = localStorage.getItem('PermisosSubDirectorios');
            const permisosSubdirectorio = new Map(JSON.parse(recuperarPermisos));
            const found = permisosSubdirectorio.get(item.nombre.trim()).includes('Editar');
            //console.log(found);
            if ( found == true ) {
                return true;
            }
            return false;
        },

        mostrarEditar(item) {
            const recuperarPermisos = localStorage.getItem('PermisosSubDirectorios');
            const permisosSubdirectorio = new Map(JSON.parse(recuperarPermisos));
            const found = permisosSubdirectorio.get(item.nombre.trim()).includes('Eliminar');
            //console.log(found);
            if ( found == true ) {
                return true;
            }
            return false;
        },
    },

    components: {

    },

    computed: {
        //...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Dialogo', ['itemsBread']),
        ...mapState('Permisos', ['permisosSubDirectorios']),
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

</style>