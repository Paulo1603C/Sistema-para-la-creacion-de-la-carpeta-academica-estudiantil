<template>
    <v-content>
        <v-container>
            <v-form @submit="login">
                <v-text-field v-model="user" :rules="controlUser" label="Usuario" prepend-icon="mdi-account"></v-text-field>
                <v-text-field v-model="pass" :rules="controlPass" label="Contraseña" type="password"
                    prepend-icon="mdi-lock"></v-text-field>
                <v-btn class="primary mt-3" block @click="methodLogin">Iniciar Sesión</v-btn>
                <div style="margin-top: 20px;">
                    <a @click="cambioContraseña()" class="mail">¿Has olvidado la contraseña?</a>
                </div>
            </v-form>
        </v-container>
    </v-content>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import CryptoJS from 'crypto-js';
import emailjs from '@emailjs/browser';
export default {

    name: "FormUser",

    data: () => ({
        user: '',
        pass: '',
        message: '',
        //permisosDirectorios: new Map(),

        controlUser: [
            value => {
                if (value) return true
                return 'Debes ingresar un Usuario'
            },
        ],
        controlPass: [
            value => {
                if (value) return true
                return 'Debes ingresar una Contraseña'
            },
        ],

    }),

    created() {
        this.cargarSubCarpetas();
    },

    methods: {
        ...mapActions('Login', ['login', 'validarCorreo', 'cambioContraseñaCorreo']),
        ...mapActions('SubCarpetas', ['cargarSubCarpetas']),

        recuperarContraseña( email, pass) {
            let sms = {
                to_email: email,
                message: pass,
                from_name: 'UTA Services',
            };

            emailjs.send('service_jafj6oc', 'template_a6j4kwb', sms, '_9AGnDi4yMhKta2Fh')
                .then(response => {
                    this.$alertify.alert('Cambio de contraseña', 'Se ha enviado un correo con una contraseña temporal', () =>
                        this.$alertify.warning('alerta cerrada')
                    );
                })
                .catch(error => {
                    this.$alertify.alert('Cambio de contraseña', 'El servicio no esta disponible', () =>
                        this.$alertify.warning('alerta cerrada')
                    );
                });
        },

        generarContraseña() {
            var chars = "abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            var password = '';
            for (let i = 0; i < 10; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        },

        cambioContraseña() {
            this.$alertify.promptWithTitle(
                'Cambio de contraseña',
                'Digite su correo para poder seguir con el proceso',
                'correo',
                async (evt, value) => {
                    try {
                        if ( value != '' ) {
                            const correoValido = await this.validarCorreo({ correo: value });
                            if (correoValido) {
                                let auxC = this.generarContraseña();
                                let auxContra = CryptoJS.SHA256( auxC ).toString();
                                let cambio = await this.cambioContraseñaCorreo( { correo: value, newPass: auxContra } );
                                if( cambio ){
                                    this.recuperarContraseña( value, auxC );
                                }else{
                                    this.$alertify.error('Error con el servidor');
                                }
                            } else {
                                this.$alertify.error('El correo ingresado no existe');
                            }
                        }else{
                            this.$alertify.error('Ingrese un correo válido');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                },
                () => this.$alertify.error('cancel')
            );
        },


        methodLogin: async function () {
            // Llama a la acción 'login' para autenticar al usuario.
            let auxContra = CryptoJS.SHA256(this.pass).toString();
            await this.login({ user: this.user, pass: auxContra });
            const autenticacion = localStorage.getItem('Authentication');
            //console.log(this.autenticacion);
            if (autenticacion) {
                this.$router.push("/Estudiantes");
                //this.obtenerPermisosDirectorios();
            } else {
                this.$alertify.error("Usuario no encontrado");
            }
        },

    },

    computed: {
        ...mapGetters('Login', ['getUser', 'getAuthentication', 'getSms']),
    }
}
</script>

<style>
v-card-text {
    font-size: 40px;
}

.miStyle {
    color: blue;
}

.mail {
    display: flex;
    align-items: center;
    justify-content: center;
}

.mail:hover {
    text-decoration: underline;

}
</style>