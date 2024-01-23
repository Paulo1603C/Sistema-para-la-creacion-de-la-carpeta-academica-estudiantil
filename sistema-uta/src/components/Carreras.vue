<template>
    <div>
        <div style="margin-bottom: 40px;">
            <NuevaCarrera :dialog="dailogCarreras" :ItemCarrera="nuevaCarrera"></NuevaCarrera>
        </div>
        <template>
            <v-card>
                <v-card-title>
                    {{ Titulo }}
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.stop-="agregarCarrera()">Crear
                        <v-icon right>mdi-school-outline</v-icon>
                    </v-btn>
                </v-card-title>
                <v-data-table v-if="getCarreras.length > 0" dense :headers="Cabecera" :items="getCarreras" :item-per-page="5" :search="search"
                    class="mt-4 elevation-1">
                    <template v-slot:item="{ item }">
                        <tr class="myStyle">
                            <td><v-icon class="mr-3" color="pink darken-1" size="35">mdi-school-outline</v-icon></td>
                            <td>{{ item.NomCar }}</td>
                            <td>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="primary darken-2" size="30" class="me-2"
                                            @click.stop="editarItem(item)" v-bind="attrs" v-on="on">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="error darken-2" @click.stop="eliminarItem(item)" size="30"
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

import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import NuevaCarrera from './NuevaCarrera.vue';

export default {
    name: "Carreras",

    data() {
        return {
            search: '',
            path: '',
            nuevaCarrera: {},
            Titulo: 'CARRERAS FISEI',
            Cabecera: [
                { text: 'Tipo', value: 'tipo', },
                { text: 'Carrera', value: 'carreras', }, ,
                { text: 'ACCIONES', value: 'acciones', },
            ],
        }
    },

    methods: {

        ...mapMutations('Dialogo', ['setDialogCarreras']),
        ...mapActions('Carreras', ['eliminarCarrera']),
        ...mapActions('Server_Carpetas', ['eliminarCarpeta']),
        ...mapMutations('Server_Carpetas', ['setRutaAnterior']),

        agregarCarrera() {
            this.nuevaCarrera = {
                idCar: 0,
                nomCar: '',
            };
            this.setDialogCarreras(true);

        },

        editarItem(item) {
            this.nuevaCarrera={
                idCar:item.IdCar,
                nomCar:item.NomCar,
            };
            this.setDialogCarreras(true);
            console.log(this.itemsBread[0] +'/'+ item.NomCar.trim())
            this.setRutaAnterior(this.itemsBread[0] +'/'+ item.NomCar.trim());
            this.path = '';

        },

        eliminarItem(item) {
            this.$alertify.confirm(
                'Deseas eliminar la Carrera: ' + item.NomCar + ', Se borrara permanentemente los datos',
                () => {
                    this.eliminarCarrera(item);
                    this.eliminarCarpeta({ ruta1: '', ruta2: this.itemsBread[0] + '/' +item.NomCar });
                    if (this.smsCar == 'eliminado') {
                        this.$alertify.success('Carrera ' + item.NomCar + ' Eliminado');
                    } else {
                        this.$alertify.error('No se pudo eliminar la carrera ' + item.NomCar);
                    }
                    this.path = '';
                },
                () => this.$alertify.error('Cancelado')
            );
        },

        rutaNueva() {
            //metodo para obtener la ruta
            for (let i = 0; i < this.itemsBread.length; i++) {
                this.path += this.itemsBread[i] + "/";
            }
        },
    },

    components: {
        NuevaCarrera,
    },


    computed: {
        ...mapGetters('Carreras', ['getCarreras']),
        ...mapState('Carreras', ['smsCar']),
        ...mapState('Dialogo', ['itemsBread', 'dailogCarreras']),
    }
}
</script>

