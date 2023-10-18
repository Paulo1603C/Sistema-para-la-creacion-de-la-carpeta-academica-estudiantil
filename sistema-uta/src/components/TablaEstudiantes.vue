<template>
    <div>
        <template>     
            <v-card>
                <v-card-title>
                    {{ Titulo }}
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table dense :headers="Cabecera" :items="Items" :item-per-page="5" class="elevation-1">
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon size="small" class="me-2" @click="editarItem(item)" v-bind="attrs" v-on="on">
                                    mdi-pencil
                                </v-icon>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon size="small" @click="eliminar(item)" v-bind="attrs" v-on="on">
                                    mdi-delete
                                </v-icon>
                            </template>
                            <span>Eliminar</span>
                        </v-tooltip>
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

    props: ['Titulo', 'Cabecera', 'Items'],

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

        eliminar(item) {
            this.$alertify.confirm(
                'Deseas eliminar el usuario: ' + item.nombre,
                () => {
                    this.eliminarUsuario(item);
                    this.$alertify.success('Usuario ' + item.nombre + ' Eliminado');
                },
                () => this.$alertify.error('cancel')
            );
        },

    },

    components: {
        
    },

}
</script>