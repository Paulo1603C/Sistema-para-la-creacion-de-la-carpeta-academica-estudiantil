<template>
    <div>
        <div style="overflow: hidden;">
        </div>
        <v-card class="mx-auto" max-width="344">
            <v-img :src="(urlDw != null) ? urlDw : imgAux" contain height="200px" cover></v-img>

            <v-card-title class="d-flex justify-center align-center">
                {{ titulo }}
            </v-card-title>

            <v-card-actions>
                <v-btn color="error darken-2" @click="eliminar">
                    <template>
                        <v-icon>mdi-delete</v-icon>
                    </template>
                </v-btn>
                <v-btn color="primary darken-2" @click="editar">
                    <template>
                        <v-icon>mdi-pencil</v-icon>
                    </template>
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn @click="show = !show">
                    <template v-if="show">
                        <v-icon>mdi-chevron-up</v-icon>
                    </template>
                    <template v-else>
                        <v-icon>mdi-chevron-down</v-icon>
                    </template>
                </v-btn>

            </v-card-actions>

            <v-expand-transition>
                <div v-show="show">
                    <v-divider></v-divider>
                    <v-card-text v-for="(word, index) in words" :key="index" >
                        <p style="font-size: 20px;overflow: hidden;">
                            <strong>
                                <v-icon class="mr-3" size="36" color="yellow darken-1">mdi-folder</v-icon>
                                {{ word }}
                            </strong>
                        </p>
                    </v-card-text>
                </div>
            </v-expand-transition>
        </v-card>
    </div>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    data: () => ({
        show: false,
        words: [],
        imgAux: require('../assets/user.png'),
        
    }),

    props: [
        'titulo', 'items', 'urlDw',
    ],

    methods: {

        editar(item) {

        },

        eliminar() {
            this.$alertify.confirm(
                'Deseas eliminar el usuario: ' + this.itemSeleccionadoUsuario.nombre + " " + this.itemSeleccionadoUsuario.apellido,
                () => {
                    this.eliminarUsuario(this.itemSeleccionadoUsuario);
                    //console.log(this.itemSeleccionadoUsuario);
                    this.$alertify.success('Usuario  Eliminado');
                },
                () => this.$alertify.error('cancel')
            );
        },

    },

    mounted() {
        // Separar la cadena en palabras utilizando la coma como delimitador
        this.words = this.items.split(",");
    },

    computed: {
    }
}
</script>