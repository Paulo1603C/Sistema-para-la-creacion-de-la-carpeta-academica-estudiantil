<template lang="">
    <div>
        <BtnOpciones style="display:none" :links="btnOP" dark class="mb-2"></BtnOpciones>
        <Carreras></Carreras>
    </div>
</template>
<script>

import BtnOpciones from '../components/BtnOpciones.vue';
import Carreras from '../components/Carreras.vue';
export default {
    name: "Usuariosview",

    created() {
        const isAuthenticated = localStorage.getItem('Authentication') === 'true';
        if (!isAuthenticated) {
            this.$router.push("/");
        } else {
            this.cargarUsuarios();
        }
    },

    data() {
        return {
            btnOP: [
                { icon: "school-outline", text: "Crear Carreras" },
            ],

        }
    },

    created() {
    },

    methods: {

    },

    computed: {
    },

    components: {
        Carreras,
        BtnOpciones,
    }
}
</script>
<style lang="">
    
</style>