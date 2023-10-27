<template lang="">
    <div>
        <BtnOpciones :links="btnOP" dark class="mb-2"></BtnOpciones>
        <hr>
        <v-row>
            <v-col v-for="(item, index) in getItems" :key="index" class="ma-2">
                <UsuariosT :id="item.id" :author="item.author" :urlDw="item.download_url"></UsuariosT>
            </v-col>
        </v-row>
    </div>
</template>
<script>

import UsuariosT from '../components/UsuariosT.vue';
import BtnOpciones from '../components/BtnOpciones.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "Usuariosview",

    data() {
        return {
            btnOP: [
                { icon: "account-plus-outline", text: "Crear Usuario" },
            ],
        }
    },

    created() {
        this.cargarUsuarios();
    },

    methods: {
        ...mapActions('Usuarios', ['cargarUsuarios'])
    },

    computed: {
        ...mapGetters('Usuarios', ['getItems'])

    },

    components: {
        UsuariosT,
        BtnOpciones,
    }
}
</script>
<style lang="">
    
</style>