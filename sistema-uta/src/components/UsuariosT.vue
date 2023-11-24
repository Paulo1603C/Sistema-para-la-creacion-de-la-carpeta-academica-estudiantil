<template>
    <div>
        <div style="overflow: hidden;">
            
        </div>
        <v-card class="mx-auto" max-width="344">
            <v-card-title class="d-flex justify-center align-center">
                ID: {{ id }}
            </v-card-title>

            <v-img :src="(urlDw != null) ? urlDw : imgAux" contain height="200px" cover></v-img>

            <v-card-title class="d-flex justify-center align-center">
                {{ nombre }} {{ apellido }}
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
                    <v-card-text>
                        <p><strong>Correo: </strong> {{ correo }}</p>
                        <p><strong>Rol: </strong> {{ rol }}</p>
                        <p><strong>Carreras: </strong> {{ carreras }}</p>
                        <p><strong>Permisos: </strong> {{ permisos }}</p>
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
        itemSeleccionadoUsuario: {},
        imgAux: require('../assets/user.png'),
    }),

    props: [
        'id', 'correo','nombre', 'apellido', 'contraseña' ,'rol', 'carreras', 'permisos','urlDw'        
    ],

    methods: {
        ...mapMutations('Dialogo',['setDialog']),
        ...mapMutations('Usuarios',['setUser']),
        ...mapActions('Usuarios',['eliminarUsuario']),

        editar(item) {
            this.setDialog(true);
            // Asigna los datos del card a la variable itemSeleccionadoUsuario
            this.itemSeleccionadoUsuario = {
                id:this.id,
                correo: this.correo,
                contraseña: this.contraseña,
                nombre: this.nombre,
                apellido: this.apellido,
                rol: this.rol,
                carreras: this.carreras,
                permisos: this.permisos,
                urlDw: this.urlDw,
            };
            console.log('Datos del card seleccionado:', this.itemSeleccionadoUsuario);
            this.setUser(this.itemSeleccionadoUsuario);
        },

        eliminar() {
            this.itemSeleccionadoUsuario = {
                id:this.id,
                author: this.author,
            };
            this.$alertify.confirm(
                'Deseas eliminar el usuario: ' +this.itemSeleccionadoUsuario.author,
                () => {
                    this.eliminarUsuario(this.itemSeleccionadoUsuario);
                    //console.log(this.itemSeleccionadoUsuario);
                    this.$alertify.success('Usuario  Eliminado');
                },
                () => this.$alertify.error('cancel')
            );
        },

    },

    components: {
        
    },

    computed: {
    }
}
</script>