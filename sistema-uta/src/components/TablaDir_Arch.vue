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
                <v-data-table dense :headers="Cabecera" :items="Items" :item-per-page="5" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr @click="hacerAlgoAlHacerClic(item)" class="myStyle">
                            <td  class="linea"><v-icon class="mr-3" color="yellow darken-1">mdi-folder</v-icon>{{ item.tag }}</td>
                            <td>{{ item.carrera }}</td>
                            <td>{{ item.fecha }}</td>
                            <td>{{ item.user }}</td>
                            <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon  color="primary darken-2"  size="20" class="me-2" @click.stop="editarItem(item)" v-bind="attrs"
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
import { mapActions } from 'vuex';


export default {
    name: "TablaC",

    props: ['show','Titulo', 'Cabecera', 'Items'],

    data() {
        return {
            search: '',
        }
    },

    methods: {

        editarItem(item) {
            console.log(item);
            this.itemSeleccionado = item;
            this.auxDialog = true;
        },

        ...mapActions('clientes', ['eliminarUsuario']),

        eliminarItem(item) {
            this.$alertify.confirm(
                'Deseas eliminar el usuario: ' + item.nombre,
                () => {
                    this.eliminarUsuario(item);
                    this.$alertify.success('Usuario ' + item.nombre + ' Eliminado');
                },
                () => this.$alertify.error('cancel')
            );
        },

        hacerAlgoAlHacerClic(item) {
            console.log("Ietm selected" + item.tag);
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