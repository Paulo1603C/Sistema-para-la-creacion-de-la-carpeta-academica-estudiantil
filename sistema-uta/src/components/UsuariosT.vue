<template>
    <div>
        <div style="overflow: hidden;">
            <PermisosUser :dialog="dailogPermisos"  :PermisosUsario="dataPermisosUsuario"></PermisosUser>
        </div>
        <v-card class="mx-auto" max-width="344">
            <v-card-title class="d-flex justify-center align-center">
                ID: {{ id }}
            </v-card-title>

            <v-img :src="(urlDw != null) ? urlDw : imgAux" contain height="100px" cover></v-img>

            <v-card-title class="d-flex justify-center align-center">
                {{ nombre }} {{ apellido }}
            </v-card-title>

            <v-card-text class="d-flex justify-center align-center">
                <v-btn color="primary" @click="asignarPermisos()" >Permisos
                    <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
            </v-card-text>

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
        ...mapMutations('Dialogo', ['setDialog','setDialogPermisos']),
        ...mapMutations('Usuarios', ['setUser']),
        ...mapMutations('Permisos', ['setPermisosUsuario']),
        ...mapActions('Usuarios', ['eliminarUsuario']),
        ...mapActions('Permisos', ['cargarPermisosSubDir_User']),
        ...mapActions('Carreras', ['cargarCarrerasUser']),

        editar:async function(item) {
            this.setDialog(true);
            //console.log("ID user "+this.id);
            await this.cargarCarrerasUser(this.id);
            this.itemSeleccionadoUsuario = {
                id: this.id,
                correo: this.correo,
                contraseña: this.contraseña,
                nombre: this.nombre,
                apellido: this.apellido,
                rol: this.idRol,
                carreras: this.devolverCarreras(),
                //permisos: [this.idPermisos[0],this.idPermisos[1],this.idPermisos[2],this.idPermisos[3],this.idPermisos[5],],
                urlDw: this.urlDw,
            };
            //console.log('Datos del card seleccionado:', this.devolverCarreras());
            this.setUser(this.itemSeleccionadoUsuario);
        },

        devolverCarreras(){
            const carreras = [];
            for( let i=0;i<this.idCarreras.length;i++ ){
                if( this.idCarreras[i] !== ',' ){
                    carreras.push(this.idCarreras[i]);
                }
            }
            return carreras;
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
                    //console.log(this.itemSeleccionadoUsuario);
                    this.$alertify.success('Usuario  Eliminado');
                },
                () => this.$alertify.error('cancel')
            );
        },

        asignarPermisos:async function(){
            await this.cargarPermisosSubDir_User( {idUser:this.id} );
            console.log("PERMISOS INIT");
            this.permisoInit={
                IdRelacion:0,
                IdUserPer:this.id,
                IdPerPer:[],
                IdItemSubPer:0,
            }
            console.log(this.permisoInit);
            this.setPermisosUsuario(this.permisoInit);
            this.setDialogPermisos(true);
        },

    },

    components: {
        PermisosUser,
    },

    computed: {
        ...mapState('Dialogo',['dailogPermisos']),
        ...mapState('Permisos', ['dataPermisosUsuario']),
    }
}
</script>