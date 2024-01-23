<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="1024">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Nuevo Usuario</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Nombre*" :rules="controles().controlNom" v-model="ItemUsuario.nombre"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Apellido*" :rules="controles().controlApe" v-model="ItemUsuario.apellido"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Email*" :rules="controles().controlCor" v-model="ItemUsuario.correo"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Password*" type="password" :rules="controles().controlCon"
                                    v-model="ItemUsuario.contraseña" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-select :rules="controles().controlRol" :items="getRoles" item-text="NomRol" item-value="IdRol" label="Roles*"
                                    v-model="ItemUsuario.rol" required></v-select>
                            </v-col>
                            <v-col cols="12" sm="4" style="display:none;">
                                <v-autocomplete :items="getPermisos" item-text="nomPer" item-value="IdPer" label="Permisos*"
                                    multiple v-model="ItemUsuario.permisos"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-autocomplete :rules="controles().controlCar" :items="getCarreras" item-text="NomCar" item-value="IdCar" label="Carreras*"
                                    multiple v-model="ItemUsuario.carreras"></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="cerrarDialog">
                        Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="agregar">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import CryptoJS from 'crypto-js';

export default {

    name: "nuevoUser",

    props: {
        dialog: Boolean,
        ItemUsuario: {},
    },

    data: () => ({
    }),

    created() {
        this.cargarCarreras();
        this.cargarRoles();
        this.cargarPermisos();
    },

    methods: {

        ...mapActions('Carreras', ['cargarCarreras']),
        ...mapActions('Usuarios', ['AgregarUsuario', 'AgregarUsuarioCarreras', 'eliminarCarrerasSecre']),
        ...mapActions('Roles', ['cargarRoles']),
        ...mapActions('Permisos', ['cargarPermisos']),
        ...mapMutations('Dialogo', ['setDialog']),

        controles() {
            return {
                controlNom: [
                    value => {
                        if (value) return true;
                        return 'Ingresar los nombres de usuario';
                    },
                ],
                controlApe: [
                    value => {
                        if (value) return true;
                        return 'Ingresar los apellidos de usuario';
                    },
                ],
                controlCor: [
                    value => {
                        if (value) return true;
                        return 'Ingresar el correo';
                    },
                ],
                controlCon: [
                    value => {
                        if (value) return true;
                        return 'Ingresar una contraseña';
                    },
                ],
                controlRol: [
                    value => {
                        if (value) return true;
                        return 'Selecione un rol';
                    },
                ],
                controlCar: [
                    value => {
                        if (value) return true;
                        return 'Selecione almenos una carrera';
                    },
                ],
            };
        },

        agregar: async function () {

            try {
                if (this.ItemUsuario.nombre !== "" &&
                    this.ItemUsuario.apellido !== "" &&
                    this.ItemUsuario.correo !== "" &&
                    this.ItemUsuario.contraseña !== "") {
                    let contraseñaHash = CryptoJS.SHA256(this.ItemUsuario.contraseña).toString();
                    this.ItemUsuario.contraseña = contraseñaHash;
                    await this.AgregarUsuario(this.ItemUsuario);
                    await this.actualizarCarrerasUsuario();
                    //await this.AgregarUsuarioCarreras({ idU: this.ItemUsuario.id, cars: this.ItemUsuario.carreras });
                    this.cerrarDialog();
                    this.limpiarCampos();
                    this.$alertify.success(this.ItemUsuario.id == 0 ? "Usuario Insertado" : "Usuario Actualizado");
                } else {
                    this.$alertify.error("Complete los campos requeridos");

                }
            } catch (error) {
                console.error('Error al agregar usuario:', error);
            }
        },

        devolverCarreras() {
            const carreras = [];
            for (let i = 0; i < this.getCarrerasUser.length; i++) {
                carreras.push(this.getCarrerasUser[i].idCar);
            }
            return carreras;
        },

        actualizarCarrerasUsuario: async function () {
            const carrerasAntiguas = this.devolverCarreras();
            const carrerasNuevas = this.ItemUsuario.carreras;

            // Identificar carreras que deben eliminarse
            const carrerasEliminar = carrerasAntiguas.filter(carrera => !carrerasNuevas.includes(carrera));

            // Identificar carreras que deben agregarse
            const carrerasAgregar = carrerasNuevas.filter(carrera => !carrerasAntiguas.includes(carrera));

            // Actualizar carreras solo si hay cambios
            if (carrerasEliminar.length > 0 || carrerasAgregar.length > 0) {
                console.log('Realizando actualización de carreras');

                // Eliminar carreras que ya no están en la lista nueva
                if (carrerasEliminar.length > 0) {
                    for (const carreraEliminar of carrerasEliminar) {
                        await this.eliminarCarrerasSecre({ id: this.ItemUsuario.id, idCar: carreraEliminar });
                    }
                }
                // Agregar carreras nuevas que no estaban en la lista antigua
                if (carrerasAgregar.length > 0) {
                    await this.AgregarUsuarioCarreras({ idU: this.ItemUsuario.id, cars: carrerasAgregar });
                }
                console.log('Actualización completa');
            } else {
                console.log('No hay cambios en las carreras');
            }
        },


        cerrarDialog() {
            this.setDialog(false);
        },

        limpiarCampos() {
            this.ItemUsuario.nombre = "";
            this.ItemUsuario.apellido = "";
            this.ItemUsuario.correo = "";
            this.ItemUsuario.contraseña = "";
            this.ItemUsuario.rol = "";
            this.ItemUsuario.permisos = "";
            this.ItemUsuario.carreras = "";
        },

    },

    computed: {
        ...mapGetters('Carreras', ['getCarreras', 'getCarrerasUser']),
        ...mapGetters('Roles', ['getRoles']),
        ...mapGetters('Permisos', ['getPermisos']),
    },
}
</script>       