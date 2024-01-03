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
                        <tr @click="hacerAlgoAlHacerClic(item)" class="myStyle">
                            <td><v-icon class="mr-3" color="yellow darken-1">mdi-folder</v-icon></td>
                            <td class="linea">{{ item.NomEst}} {{ item.ApeEst }}</td>
                            <td>{{ item.NomCar }}</td>
                            <td>{{ item.Fecha }}</td>
                            <td>{{ item.user }}</td>
                            <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="primary darken-2" size="20" class="me-2"
                                            @click.stop="editarItem(item)" v-bind="attrs" v-on="on">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="error darken-2" size="20" @click.stop="eliminarItem(item)"
                                            v-bind="attrs" v-on="on">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar</span>
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
            estudianteSeleccionado: {},
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDialogFolder', 'setVentanaEst', 'setVentanaArch', 'setBreadcrumbs']),
        ...mapMutations('Estudiantes', ['setEst']),
        ...mapActions('Estudiantes', ['eliminarEstudiante', 'cargarEstudiantes']),
        ...mapActions('Server_Carpetas', ['cargarCarpetas','eliminarCarpeta']),
        ...mapMutations('Server_Carpetas', ['setRutaAnterior']),

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
            this.setRutaAnterior(this.path+item.NomEst+" "+item.ApeEst);
            this.path='';
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
                    this.eliminarCarpeta(this.path+item.NomEst+" "+item.ApeEst);
                    this.cargarEstudiantes({ idCar: this.idCarreraSelect, idUser: this.idUser });
                    this.$alertify.success('Usuario ' + item.NomEst + " " + item.ApeEst + ' Eliminado');
                    this.path='';
                },
                () => this.$alertify.error('Cancelado')
            );
        },

        hacerAlgoAlHacerClic(item) {
            this.setVentanaEst(false);
            this.setVentanaArch(true);
            this.setBreadcrumbs(item.NomEst + ' ' + item.ApeEst);
            this.rutaNueva();
            this.cargarCarpetas(this.path);
            this.path='';
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
        ...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Dialogo', ['itemsBread']),
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