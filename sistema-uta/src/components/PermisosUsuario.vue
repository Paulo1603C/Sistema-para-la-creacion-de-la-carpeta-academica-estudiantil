<template>
    <v-row justify="center">
        <v-dialog :retain-focus="false" v-model="dialog" persistent width="800">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Permisos Asignados</span>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                    </v-text-field>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        v-if="getPermisosSubDir_User.length != 0"
                        style="max-height:200px; overflow-y: auto;"
                        dense
                        :headers="Cabecera"
                        :items="getPermisosSubDir_User"
                        :search="search"
                        >
                        <template v-slot:item="{ item }">
                            <tr class="myStyle">
                            <td><v-icon class="mr-3" color="yellow darken-1">mdi-folder</v-icon></td>
                            <td>{{ item.NomItem }}</td>
                            <td>{{ item.NomPer }}</td>
                            <td>
                                <v-tooltip bottom style="margin-right: 100px;">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="red darken-2" size="30" @click.stop="eliminarItem(item)" v-bind="attrs" v-on="on">
                                    mdi-delete
                                    </v-icon>
                                </template>
                                <span>Eliminar</span>
                                </v-tooltip>
                            </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card-text>

                <v-card-title>
                    <span class="text-h5">Asignar Permisos</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-select :items="getSubCarpetas" :rules="controles().controlCar" item-text="NomItem"
                                    item-value="IdItem" label="SubCarpetas*" v-model="PermisosUsario.IdItemSubPer"
                                    required></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-autocomplete :items="getPermisos" :rules="controles().controlPer" item-text="nomPer"
                                    item-value="IdPer" label="Permisos*" v-model="PermisosUsario.IdPerPer"
                                    multiple></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" variant="text" @click="cerrarDialog()">
                        Close
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="agregar()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
export default {

    name: "PermisosUsuario",

    props: {
        dialog: Boolean,
        PermisosUsario: {},

    },

    data() {
        return {
            search:'',
            Cabecera: [
                { text: 'Tipo', value: 'tipo', },
                { text: 'SubCarpeta', value: 'NomItem', },
                { text: 'Permisos', value: 'NomPer', },
                { text: 'ACCIONES', value: 'acciones', },
            ],
        }
    },

    created() {
        //this.cargarPermisos();
        this.cargarSubCarpetas();
    },

    methods: {

        ...mapActions('Permisos', ['cargarPermisos']),
        ...mapActions('SubCarpetas', ['cargarSubCarpetas']),
        ...mapMutations('Dialogo', ['setDialogPermisos']),
        ...mapActions('Permisos', ['AgregarUsuarioPermisos', 'eliminarPermisosSub_User', 'cargarPermisosSubDir_User']),

        controles() {
            return {
                controlCar: [
                    value => {
                        if (value) return true;
                        return 'Seleccione una carpeta';
                    },
                ],
                controlPer: [
                    value => {
                        if (value) return true;
                        return 'Seleccione por lo menos un permiso';
                    },
                ],
            }
        },

        agregar: async function () {
            try {
                await this.AgregarUsuarioPermisos(this.PermisosUsario);
                this.cerrarDialog();
                this.$alertify.success(this.PermisosUsario.IdRelacion == 0 ? "Permisos Insertados" : "Permisos Actualizados");
            } catch (error) {
                this.$alertify.error("Error en la solicitud agregar Permisos " + error);
            }

        },

        cerrarDialog() {
            this.setDialogPermisos(false);
        },

        eliminarItem: async function (item) {
            try {
                await this.eliminarPermisosSub_User({ idUser: item.IdUser, idPer: item.IdPer, idItem: item.IdItem });
                await this.cargarPermisosSubDir_User({ idUser: item.IdUser });
                this.$alertify.success('Permiso ' + item.NomPer + ' eliminado para ' + item.NomItem);
            } catch (error) {
                this.$alertify.error('Fallo en la solicitud eliminar Item ' +error);
            }
        },

    },

    computed: {
        ...mapGetters('Permisos', ['getPermisos', 'getPermisosSubDir_User']),
        ...mapGetters('SubCarpetas', ['getSubCarpetas']),
    },

}
</script>
<style lang="">
    
</style>