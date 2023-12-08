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
                            <td  class="linea"><v-icon class="mr-3">mdi-folder</v-icon>{{ item.NomEst }} {{ item.ApeEst }}</td>
                            <td>{{ item.NomCar }}</td>
                            <td>{{ item.Fecha }}</td>
                            <td>{{ item.user }}</td>
                            <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon  color="primary darken-2" size="20" class="me-2" @click.stop="editarItem(item)" v-bind="attrs"
                                            v-on="on">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="error darken-2" size="20" @click.stop="eliminarItem(item)" v-bind="attrs" v-on="on">
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
import { mapActions, mapMutations, } from 'vuex';


export default {
    name: "TablaC",

    props: ['show','Titulo', 'Cabecera', 'Items'],

    data() {
        return {
            search: '',
            estudianteSeleccionado:{},
        }
    },

    methods: {
        ...mapMutations('Dialogo',['setDialogFolder','setVentanaEst','setVentanaArch','setBreadcrumbs']),
        ...mapMutations('Estudiantes', ['setEst']),

        editarItem(item) {
            console.log("item Datos");
            this.estudianteSeleccionado={
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

            //console.log(item.IdEst);
        },

        ...mapActions('Estudiantes', ['eliminarEstudiante']),

        eliminarItem(item) {
            this.$alertify.confirm(
                'Deseas eliminar el usuario: ' + item.NomEst+" "+item.ApeEst,
                () => {
                    this.eliminarEstudiante(item);
                    this.$alertify.success('Usuario ' + item.NomEst +" "+item.ApeEst+ ' Eliminado');
                },
                () => this.$alertify.error('Cancelado')
            );
        },

        hacerAlgoAlHacerClic(item) {
            this.setVentanaEst(false);
            this.setVentanaArch(true);
            this.setBreadcrumbs(item.NomEst+' '+item.ApeEst);
            console.log("Ietm selected " + item.NomEst);
        },

    },

    components: {

    },

}
</script>
<style>
    .myStyle:hover{
        cursor: pointer;
    }
    .linea:hover{
        text-decoration: underline;
    }
</style>