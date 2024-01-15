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
                <v-data-table dense :headers="Cabecera" :items="Items" :item-per-page="10" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr class="myStyle">
                            <td><v-icon class="mr-3" color="yellow darken-1">mdi-folder</v-icon></td>
                            <td @click="hacerAlgoAlHacerClic(item)" class="linea">{{ item.NomEst }} {{ item.ApeEst }}</td>
                            <td>{{ item.NomCar }}</td>
                            <td>{{ item.Fecha }}</td>
                            <td>{{ item.Nom_Modificador }}</td>
                            <td>
                                <v-tooltip bottom style="margin-right: 100px; !important">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="primary darken-2" size="30" class="me-2"
                                            @click.stop="editarItem(item)" v-bind="attrs" v-on="on">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom style="margin-right: 100px; !important">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="red darken-2" size="30" @click.stop="eliminarItem(item)"
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
            customDir: null,
            selectedItems: [],
            estudianteSeleccionado: {},
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDialogFolder', 'setVentanaEst', 'setVentanaArch', 'setBreadcrumbs']),
        ...mapMutations('Estudiantes', ['setEst']),
        ...mapMutations('Server_Carpetas', ['setRutaAnterior']),
        ...mapMutations('Plantillas', ['setIdEstPlan']),
        ...mapActions('Estudiantes', ['eliminarEstudiante', 'cargarEstudiantes']),
        ...mapActions('Server_Carpetas', ['cargarCarpetas', 'eliminarCarpeta','descargarCarpeta']),
        ...mapActions('Plantillas', ['cargarEstudinates_Plantillas']),

        editarItem(item) {
            console.log("item Datos");
            this.rutaNueva();
            this.estudianteSeleccionado = {
                IdEst: item.IdEst,
                Cedula: item.CedEst,
                NomEst: item.NomEst,
                ApeEst: item.ApeEst,
                NomCar: item.IdCar,
                Fecha: item.Fecha,
                modificado: '',
            }
            this.setEst(this.estudianteSeleccionado);
            this.setDialogFolder(true);
            this.setRutaAnterior(this.path + item.NomEst + " " + item.ApeEst);
            this.path = '';
            //this.setRutaAnterior('');
            //console.log(item.IdEst);
        },


        eliminarItem(item) {
            this.rutaNueva();
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.idUser = storedUser.IdUser;
            this.$alertify.confirm(
                'Deseas eliminar el estudiante: ' + item.NomEst + " " + item.ApeEst,
                () => {
                    this.eliminarEstudiante(item);
                    this.eliminarCarpeta({ ruta1: this.path, ruta2: this.path + item.NomEst + " " + item.ApeEst });
                    this.cargarEstudiantes({ idCar: this.idCarreraSelect, idUser: this.idUser });
                    this.$alertify.success('Usuario ' + item.NomEst + " " + item.ApeEst + ' Eliminado');
                    this.path = '';
                },
                () => this.$alertify.error('Cancelado')
            );
        },

        descargarItem: async function (item) {
            this.rutaNueva();
            console.log(item.nombre);
            console.log(this.path);
            await this.descargarCarpeta({ ruta: this.path, nombre: item.NomEst + " " + item.ApeEst  });
            this.$alertify.success('Archivo Descargado');
            this.path = '';
        },

        hacerAlgoAlHacerClic:async function(item) {
            localStorage.removeItem('padreActual');
            this.setIdEstPlan(item.IdPlanPer);
            await this.cargarEstudinates_Plantillas( {idPlan:item.IdPlanPer} );
            this.setVentanaEst(false);
            this.setVentanaArch(true);
            this.setBreadcrumbs(item.NomEst.toUpperCase() + ' ' + item.ApeEst.toUpperCase());
            this.rutaNueva();
            console.log(this.path);
            await this.cargarCarpetas(this.path);
            this.path = '';
            //this.selectedItems = [];
        },

        handleDirChange(event) {
            // Obtener la ruta seleccionada por el usuario
            this.customDir = this.$refs.customDirInput.files[0]?.path;
        },

        downloadDirectory() {
            console.log(this.customDir);
        },

        rutaNueva() {
            //metodo para obtener la ruta
            for (let i = 0; i < this.itemsBread.length; i++) {
                this.path += this.itemsBread[i] + "/";
            }
            //console.log(this.path);
        },


    },

    watch: {
        show() {
            console.log('dfvb' + this.selectedItems);
        }
    },

    components: {

    },

    computed: {
        ...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Dialogo', ['itemsBread']),
    },

    watch: {


    },

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