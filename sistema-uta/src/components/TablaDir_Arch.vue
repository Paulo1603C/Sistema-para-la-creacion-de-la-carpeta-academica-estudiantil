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
                        <tr class="myStyle">
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
                                        <v-icon color="primary darken-2" size="30" class="me-2"
                                            @click.stop="editarItem(item)" v-bind="attrs" v-on="on">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="error darken-2" size="30" @click.stop="eliminarItem(item)"
                                            v-bind="attrs" v-on="on">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar</span>
                                </v-tooltip>
                                <v-tooltip bottom style="margin-right: 100px;">
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
import { mapActions, mapMutations, mapState } from 'vuex';


export default {
    name: "TablaC",

    props: ['show', 'Titulo', 'Cabecera', 'Items'],

    data() {
        return {
            search: '',
            path: '',
            selectedItems: [],
            carpetaSelecionada: {},
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDialogFolder', 'setVentanaEst', 'setVentanaArch', 'setBreadcrumbs', 'setDialogCarpeta']),
        //...mapMutations('Estudiantes', ['setEst']),
        //...mapActions('Estudiantes', ['eliminarEstudiante', 'cargarEstudiantes']),
        ...mapActions('Server_Carpetas', ['cargarCarpetas', 'eliminarCarpeta']),
        ...mapActions('Server_Archivos', ['descargarArchivo']),
        ...mapMutations('Server_Carpetas', ['setRutaAnterior', 'setCarpeta']),

        editarItem(item) {
            //console.log("item Datos");
            //console.log(item);
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


    },

    components: {

    },

    computed: {
        //...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Dialogo', ['itemsBread']),
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