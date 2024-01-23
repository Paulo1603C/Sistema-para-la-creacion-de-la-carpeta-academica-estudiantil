<template>
    <v-app>
        <div class="padre" v-if="isOnline">
            <div class="logo red darken-4 d-flex justify-center align-center">
                <v-img class="mx-auto" :src="logo" alt="logo UTA" contain height="500"></v-img>
            </div>
            <div class="login">
                <div class="contenedor">
                    <div>
                        <h1 class="text-center miTitulo">Inicio de sesión</h1>
                    </div>
                    <hr style="background-color:#f48B5e; height: 3px;">
                    <FormularioLogin />
                </div>
            </div>
        </div>
    </v-app>
</template>
  
<script>
import FormularioLogin from '../components/FormularioLogin.vue';

export default {
    data() {
        return {
            logo: require("../assets/logo2.png"),
            isOnline: navigator.onLine,
        };
    },

    created() {

        window.addEventListener('online', this.handleConnectionChange);
        window.addEventListener('offline', this.handleConnectionChange);

        const isAuthenticated = localStorage.getItem('Authentication') === 'true';
        if (isAuthenticated) {
            this.$router.push("/Estudiantes");
        }
    },

    destroyed() {
        window.removeEventListener('online', this.handleConnectionChange);
        window.removeEventListener('offline', this.handleConnectionChange);
    },

    methods: {
        handleConnectionChange() {
            this.isOnline = navigator.onLine;
            if (!this.isOnline) {
                console.log('algo');
                // Puedes agregar aquí la lógica para redirigir a otra página
                this.$router.push("/SinConexion");
            }
        },
    },

    components: {
        FormularioLogin,
    },
};
</script>
  
<style>
.padre {
    display: grid;
    grid-template-columns: 65% 1fr;
    border: 1px solid black;
    height: 100%;
}

.miTitulo {
    font-size: 50px;
    font-weight: bold;
    color: #0d3b66;
}

.login {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #faf0ca;
}

.contenedor {
    padding: 25px;
    border: 2px solid #f48B5e;
    border-radius: 10px;
    backdrop-filter: blur(10px);
}
</style>
  