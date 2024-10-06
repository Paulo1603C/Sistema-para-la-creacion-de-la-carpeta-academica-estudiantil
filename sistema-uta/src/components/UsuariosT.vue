<template>
    <div>
        <div style="overflow: hidden;">
            <PermisosUser :dialog="dailogPermisos" :PermisosUsario="dataPermisosUsuario"></PermisosUser>
        </div>
        <v-card class="mx-auto" max-width="180">

            <v-img :src="(urlDw != null) ? urlDw : imgAux" contain height="80px" cover></v-img>

            <v-card-title class="d-flex justify-center align-center" style="font-size: 15px;">
                {{ nombre }} {{ apellido }}
            </v-card-title>

            <v-card-text class="d-flex justify-center align-center">
                <v-btn color="primary" @click="asignarPermisos()">Permisos
                    <v-icon right>mdi-folder-settings</v-icon>
                </v-btn>
            </v-card-text>

            <v-card-actions>
                <v-btn color="error darken-2" @click="eliminar" icon small>
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn color="primary darken-2" @click="editar" icon small>
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn @click="show = !show" icon small>
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
                    <v-card-text style="font-size: 10px;">
                        <p><strong>Correo: </strong> {{ correo }}</p>
                        <p><strong>Rol: </strong> {{ rol }}</p>
                        <p><strong>Carreras: </strong> {{ carreras }}</p>
                    </v-card-text>
                </div>
            </v-expand-transition>
        </v-card>
    </div>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex';
import PermisosUser from './PermisosUsuario.vue';

export default {
    data: () => ({
        show: false,
        itemSeleccionadoUsuario: {},
        permisoInit: {},
        imgAux: require('../assets/user.png'),
    }),

    props: [
        'id', 'correo', 'nombre', 'apellido', 'contraseña', 'idRol', 'rol', 'idCarreras', 'carreras', 'idPermisos', 'permisos', 'urlDw'
    ],

    methods: {
        ...mapMutations('Dialogo', ['setDialog', 'setDialogPermisos']),
        ...mapMutations('Usuarios', ['setUser']),
        ...mapMutations('Permisos', ['setPermisosUsuario']),
        ...mapActions('Usuarios', ['eliminarUsuario']),
        ...mapActions('Permisos', ['cargarPermisosSubDir_User']),
        ...mapActions('Carreras', ['cargarCarrerasUser']),

        async editar(item) {
            this.setDialog(true);
            await this.cargarCarrerasUser(this.id);
            this.itemSeleccionadoUsuario = {
                id: this.id,
                correo: this.correo,
                contraseña: this.contraseña,
                nombre: this.nombre,
                apellido: this.apellido,
                rol: this.idRol,
                carreras: this.devolverCarreras(),
                urlDw: this.urlDw,
            };
            this.setUser(this.itemSeleccionadoUsuario);
        },

        devolverCarreras() {
            const carreras = this.idCarreras.split(',').filter(id => id.trim() !== '');
            // Eliminar duplicados si es necesario
            const uniqueCarreras = [...new Set(carreras)];
 
            return uniqueCarreras;
        },

        eliminar() {
            this.itemSeleccionadoUsuario = {
                id: this.id,
                nombre: this.nombre,
                apellido: this.apellido,
            };
            this.$alertify.confirm(
                'Deseas eliminar el usuario: ' + this.itemSeleccionadoUsuario.nombre + " " + this.itemSeleccionadoUsuario.apellido,
                () => {
                    this.eliminarUsuario(this.itemSeleccionadoUsuario);
                    this.$alertify.success('Usuario Eliminado');
                },
                () => this.$alertify.error('Cancel')
            );
        },

        async asignarPermisos() {
            try {
                await this.cargarPermisosSubDir_User({ idUser: this.id });
                this.permisoInit = {
                    IdRelacion: 0,
                    IdUserPer: this.id,
                    IdPerPer: [],
                    IdItemSubPer: 0,
                }
                this.setPermisosUsuario(this.permisoInit);
                this.setDialogPermisos(true);
            } catch (error) {
                this.$alertify.error('Error en la solicitud de asignar permisos ' + error);
            }
        },
    },

    components: {
        PermisosUser,
    },

    computed: {
        ...mapState('Dialogo', ['dailogPermisos']),
        ...mapState('Permisos', ['dataPermisosUsuario']),
    }
}
</script>
