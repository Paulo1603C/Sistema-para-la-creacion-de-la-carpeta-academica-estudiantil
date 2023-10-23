<template>
    <v-content>
        <v-container>
            <v-form @submit="login">
            <v-text-field v-model="user" :rules="controlUser" label="Usuario"
                prepend-icon="mdi-account"></v-text-field>
            <v-text-field v-model="pass" :rules="controlPass" label="Contraseña" type="password"
                prepend-icon="mdi-lock"></v-text-field>
            <v-btn class="primary mt-3" block @click="login">Iniciar Sesión</v-btn>
        </v-form>
        </v-container>
    </v-content>
</template>
<script>
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

    methods: {
        login() {
            this.$router.push("/Dashboard");
        },
    },
}
</script>

<style>
v-card-text{
    font-size: 40px;
}
.miStyle {
    color: blue;
}
</style>