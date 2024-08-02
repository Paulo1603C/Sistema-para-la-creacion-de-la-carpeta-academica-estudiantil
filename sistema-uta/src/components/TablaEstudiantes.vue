<template>
    <div>
        <template>
            <progres :dialog="dailogCargarDatos" :message="sms"></progres>
            <v-card v-show="show">
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
                <v-data-table dense :headers="Cabecera" :items="Items" :item-per-page="10"
                    :search="search" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr class="myStyle">
                            <td><v-icon class="mr-3" color="yellow darken-1">mdi-folder</v-icon></td>
                            <td @click="hacerAlgoAlHacerClic(item)" class="linea">{{ item.NomEst }} {{ item.ApeEst }}</td>
                            <td>{{ item.NomCar }}</td>
                            <td>{{ item.Fecha }}</td>
                            <td>{{ item.Nom_Modificador }}</td>
                            <td>
                                <v-tooltip bottom style="margin-right: 100px !important">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="primary darken-2" size="30" class="me-2"
                                            @click.stop="editarItem(item)" v-bind="attrs" v-on="on">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom style="margin-right: 100px !important">
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
import progres from './progresCircular.vue';

export default {
    name: "TablaC",

    props: ['show', 'Titulo', 'Cabecera', 'Items'],

    data() {
        return {
            search: '',
            path: '',
            sms:'Cargando datos...',
            search: '',
            customDir: null,
            selectedItems: [],
            estudianteSeleccionado: {},
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDialogFolder', 'setVentanaEst', 'setVentanaArch', 'setBreadcrumbs','setDailogCargarDatos']),
        ...mapMutations('Estudiantes', ['setEst', 'setIdEst']),
        ...mapMutations('Server_Carpetas', ['setRutaAnterior']),
        ...mapMutations('Plantillas', ['setIdEstPlan']),
        ...mapActions('Estudiantes', ['eliminarEstudiante', 'cargarEstudiantes']),
        ...mapActions('Server_Carpetas', ['cargarCarpetas', 'eliminarCarpeta', 'descargarCarpeta']),
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
        },


        eliminarItem(item) {
            this.rutaNueva();
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.idUser = storedUser.IdUser;
            this.$alertify.confirm(
                'Deseas eliminar el estudiante: ' + item.NomEst + " " + item.ApeEst + ', Se borran todos los datos',
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
            try {
                this.rutaNueva();
                await this.descargarCarpeta({ ruta: this.path, nombre: item.NomEst + " " + item.ApeEst });
                this.$alertify.success('Archivo Descargado');
                this.path = '';
            } catch (error) {
                this.$alertify.error('Error al descargar un archivo ' + error);
            }
        },

        async descargarAll() {
            try {
                this.rutaNueva();
                const nombre = '';
                await this.descargarCarpeta({ ruta: this.path, nombre });
                this.$alertify.success('Archivo Descargado ');
                this.path = '';
            } catch (error) {
                console.error('Error al descargar carpeta:', error);
                this.$alertify.error('Error al descargar carpeta ' + error);
            }
        },

        hacerAlgoAlHacerClic: async function (item) {
            this.setDailogCargarDatos(true);
            localStorage.removeItem('padreActual');
            this.setIdEst(item.IdEst);
            this.setIdEstPlan(item.IdPlanPer);
            await this.cargarEstudinates_Plantillas({ idPlan: item.IdPlanPer });
            this.setVentanaEst(false);
            this.setVentanaArch(true);
            this.setBreadcrumbs(item.NomEst.toUpperCase() + ' ' + item.ApeEst.toUpperCase());
            this.rutaNueva();
            //console.log(this.path);
            await this.cargarCarpetas(this.path);
            this.path = '';
            this.setDailogCargarDatos(false);
        },

        handleDirChange(event) {
            // Obtener la ruta seleccionada por el usuario
            this.customDir = this.$refs.customDirInput.files[0]?.path;
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
            //console.log('dfvb' + this.selectedItems);
        }
    },

    components: {
        progres,
    },

    computed: {
        ...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Dialogo', ['itemsBread','dailogCargarDatos']),
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