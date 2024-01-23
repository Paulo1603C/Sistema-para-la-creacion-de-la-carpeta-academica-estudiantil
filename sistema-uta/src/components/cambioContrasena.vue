<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="400">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Cambiar Contraseña</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Nueva contraseña*" type="password" :rules="controles().controlContra"
                                    v-model="ItemPass.contra1" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Nueva contraseña*" type="password" :rules="controles().controlContra"
                                    v-model="ItemPass.contra2" required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="cerrarDialog()">
                        Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="agregar()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex';
import CryptoJS from 'crypto-js';
export default {

    name: 'CambioContraseña',

    props: {
        dialog: Boolean,
        ItemPass: {},
    },

    data() {
        return {
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDailogContra']),
        ...mapActions('Login', ['cambioContraseñaCorreo']),

        controles() {
            return {
                controlContra: [
                    value => {
                        if (value) return true
                        return 'Ingrese una contraseña'
                    },
                ],
            }
        },

        agregar: async function () {
            if (this.verificarCampos()) {
                if (this.verificarContras()) {
                    this.cambiarPass();
                    this.cerrarDialog();
                } else {
                    this.$alertify.error("Las contraseñas no son iguales")
                }
            } else {
                this.$alertify.error("Complete los campos")
            }

        },

        cambiarPass: async function () {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const correoUser = storedUser.Correo;
            let auxContra = CryptoJS.SHA256(this.ItemPass.contra2).toString();
            let cambio = await this.cambioContraseñaCorreo({ correo: correoUser, newPass: auxContra });
            return cambio ? this.$alertify.success("Contraseña Cambiada") : this.$alertify.error("No se pudo cambiar la contraseña");
        },

        verificarCampos() {
            return this.ItemPass.contra1 != '' && this.ItemPass.contra2 != '' ? true : false;
        },

        verificarContras() {
            return this.ItemPass.contra1 == this.ItemPass.contra2 ? true : false;
        },

        cerrarDialog() {
            this.setDailogContra(false);
        },
    },

    computed: {
    }

}
</script>
<style lang="">
    
</style>