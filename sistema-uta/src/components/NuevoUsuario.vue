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
                                <v-text-field label="Apellido*" :rules="controles().controlApe"
                                    v-model="ItemUsuario.apellido" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Email*" type="email" :rules="controles().controlCor"
                                    @change="validarC()" v-model="ItemUsuario.correo" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field :disabled="ItemUsuario.id !== 0" label="Password*" type="password"
                                    :rules="controles().controlCon" v-model="ItemUsuario.contraseña"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-select :rules="controles().controlRol" :items="getRoles" item-text="NomRol"
                                    item-value="IdRol" label="Roles*" v-model="ItemUsuario.rol" required></v-select>
                            </v-col>
                            <v-col cols="12" sm="4" style="display:none;">
                                <v-autocomplete :items="getPermisos" item-text="nomPer" item-value="IdPer" label="Permisos*"
                                    multiple v-model="ItemUsuario.permisos"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="4">
                                <v-autocomplete :rules="controles().controlCar" :items="getCarreras" item-text="NomCar"
                                    item-value="IdCar" label="Carreras*" multiple
                                    v-model="ItemUsuario.carreras"></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" variant="text" @click="cerrarDialog">
                        Close
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="agregar">
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
import emailjs from '@emailjs/browser';

export default {
    name: "nuevoUser",

    props: {
        dialog: Boolean,
        ItemUsuario: {},
    },

    data: () => ({
        passAux: "",
    }),

    created() {
        this.cargarCarreras();
        this.cargarRoles();
        this.cargarPermisos();

        if (this.ItemUsuario.id !== 0) {
            // Cargar carreras asignadas al usuario si está en modo edición
            this.ItemUsuario.carreras = this.devolverCarreras();
        } else {
            // Si es un nuevo usuario, inicializa el campo de carreras vacío
            this.ItemUsuario.carreras = [];
        }

        this.ItemUsuario.correo = '';
    },

    methods: {
        ...mapActions('Carreras', ['cargarCarreras','cargarCarrerasUser']),
        ...mapActions('Usuarios', ['AgregarUsuario', 'AgregarUsuarioCarreras', 'eliminarCarrerasSecre']),
        ...mapActions('Roles', ['cargarRoles']),
        ...mapActions('Permisos', ['cargarPermisos']),
        ...mapMutations('Dialogo', ['setDialog']),
        ...mapActions('Login', ['validarCorreo']),

        controles() {
            return {
                controlNom: [
                    value => {
                        if (!value) return 'Ingrese los nombres del usuario';
                        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                        return soloLetras.test(value) || 'Ingrese solo letras';
                    }
                ],
                controlApe: [
                    value => {
                        if (!value) return 'Ingrese los Apellidos del usuario';
                        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
                        return soloLetras.test(value) || 'Ingrese solo letras';
                    }
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
                        return 'Seleccione un rol';
                    },
                ],
                controlCar: [
                    value => {
                        if (value) return true;
                        return 'Seleccione al menos una carrera';
                    },
                ],
            };
        },

        agregar() {
            this.passAux = this.ItemUsuario.contraseña;
            this.insertarUsuario();
            if (this.ItemUsuario.id == 0) {
                this.notificarUsuario(this.ItemUsuario.correo, this.passAux);
            }
        },

        notificarUsuario(email, pass) {
            let sms = {
                to_email: email,
                message: pass,
                from_name: 'UTA Services',
            };

            emailjs.send('service_jafj6oc', 'template_9pjnynb', sms, '_9AGnDi4yMhKta2Fh')
                .then(response => {
                    this.$alertify.alert('Nueva Cuenta', 'Se ha enviado un correo con los datos al usuario', () =>
                        this.$alertify.warning('alerta cerrada')
                    );
                })
                .catch(error => {
                    this.$alertify.alert('Nueva Cuenta', 'El servicio no está disponible', () =>
                        this.$alertify.warning('alerta cerrada')
                    );
                });
        },

        validarC: async function () {
            try {
                let c = this.ItemUsuario.correo;
                let partes = c.split("@").filter(Boolean);
                if (partes[partes.length - 1] !== "uta.edu.ec") {
                    this.$alertify.alert('Correo Incorrecto', 'Ingrese un correo válido => @uta.edu.ec', () => {
                        this.ItemUsuario.correo = '';
                    });
                }

                const correoValido = await this.validarCorreo({ correo: this.ItemUsuario.correo });
                if (correoValido) {
                    this.$alertify.error("Este correo ya está registrado");
                    this.ItemUsuario.correo = '';
                }
            } catch (error) {
                this.$alertify.error('Error al validar correo:', error);
            }
        },

        insertarUsuario: async function () {
            try {
                if (this.ItemUsuario.nombre !== "" &&
                    this.ItemUsuario.apellido !== "" &&
                    this.ItemUsuario.correo !== "" &&
                    this.ItemUsuario.contraseña !== "") {

                    let contraseñaHash = CryptoJS.SHA256(this.ItemUsuario.contraseña).toString();
                    this.ItemUsuario.contraseña = contraseñaHash;

                    await this.AgregarUsuario(this.ItemUsuario);

                    if (this.ItemUsuario.id !== 0) {
                        await this.actualizarCarrerasUsuario();
                    } else {
                        await this.AgregarUsuarioCarreras({ idU: this.ItemUsuario.id, cars: this.ItemUsuario.carreras });
                    }

                    this.cerrarDialog();
                    this.limpiarCampos();
                    this.$alertify.success(this.ItemUsuario.id == 0 ? "Usuario Insertado" : "Usuario Actualizado");
                } else {
                    this.$alertify.error("Complete los campos requeridos");
                }
            } catch (error) {
                this.$alertify.error('Error al agregar usuario:' + error);
            }
        },

        devolverCarreras() {
            return this.getCarrerasUser.map(carrera => carrera.IdCar);
        },

        actualizarCarrerasUsuario: async function () {
            try {
                const carrerasAntiguas = this.devolverCarreras();
                const carrerasNuevas = this.ItemUsuario.carreras;

                const carrerasEliminar = carrerasAntiguas.filter(carrera => !carrerasNuevas.includes(carrera));
                const carrerasAgregar = carrerasNuevas.filter(carrera => !carrerasAntiguas.includes(carrera));

                if (carrerasEliminar.length > 0 || carrerasAgregar.length > 0) {
                    if (carrerasEliminar.length > 0) {
                        for (const carreraEliminar of carrerasEliminar) {
                            await this.eliminarCarrerasSecre({ id: this.ItemUsuario.id, idCar: carreraEliminar });
                        }
                    }
                    if (carrerasAgregar.length > 0) {
                        await this.AgregarUsuarioCarreras({ idU: this.ItemUsuario.id, cars: carrerasAgregar });
                    }
                }
            } catch (error) {
                this.$alertify.error('Error al actualizar carreras:' + error);
            }
        },

        cerrarDialog() {
            this.setDialog(false);
        },

        limpiarCampos() {
            this.ItemUsuario.nombre = '';
            this.ItemUsuario.apellido = '';
            this.ItemUsuario.correo = '';
            this.ItemUsuario.contraseña = '';
            this.ItemUsuario.carreras = [];
        },
    },

    computed: {
        ...mapGetters('Carreras', ['getCarreras', 'getCarrerasUser']),
        ...mapGetters('Roles', ['getRoles']),
        ...mapGetters('Permisos', ['getPermisos']),
    },
};
</script>

<style scoped>
/* Custom styles */
</style>
