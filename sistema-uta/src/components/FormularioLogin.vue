<template>
    <v-content>
        <v-container>
            <v-form @submit="login">
                <v-text-field v-model="user" :rules="controlUser" label="Usuario" prepend-icon="mdi-account"></v-text-field>
                <v-text-field v-model="pass" :rules="controlPass" label="Contraseña" type="password"
                    prepend-icon="mdi-lock"></v-text-field>
                <v-btn class="primary mt-3" block @click="methodLogin">Iniciar Sesión</v-btn>
            </v-form>
        </v-container>
    </v-content>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {

    name: "FormUser",

    data: () => ({
        user: '',
        pass: '',

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
        
    },

    methods: {
        ...mapActions('Login', ['login']),
        
        async methodLogin() {
            // Llama a la acción 'login' para autenticar al usuario.
            await this.login({ user: this.user, pass: this.pass });
            const autenticacion = localStorage.getItem('Authentication');
            //console.log(this.autenticacion);
            if( autenticacion ){
                this.$router.push("/Estudiantes");
            }
        },

    },

    computed: {
        ...mapGetters('Login', ['getUser','getAuthentication']),
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
</style>