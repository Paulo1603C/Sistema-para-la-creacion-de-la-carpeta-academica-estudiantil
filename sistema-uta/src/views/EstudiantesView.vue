<template>
    <div>
        
        <BtnOpciones dark class="mb-2" @click="nuevoItem()"></BtnOpciones>
        <TablaEst Titulo="ESTUDINATES " :Cabecera="Cabecera" :Items="getItems"></TablaEst>
    </div>
</template>


<script>

import { mapActions, mapGetters } from 'vuex';
import TablaEst from '../components/TablaEstudiantes.vue';
import BtnOpciones from '../components/BtnOpciones.vue';

export default {
    name: 'Estudiantes',

    components: {
        TablaEst,
        BtnOpciones,
    },

    data() {
        return {
            Cabecera: [
                { text: 'ID', value: 'id' },
                { text: 'NOMBRE', value: 'nombre' },
                { text: 'EDAD', value: 'edad' },
                { text: 'PROFESION', value: 'profesion' },
                { text: 'Acciones', value: 'actions' },
            ],
        }
    },

    created() {
        this.cargarClientes();
    },

    methods: {
        ...mapActions('clientes', ['cargarClientes']),

    },

    computed: {
        ...mapGetters('clientes', ['getItems'])
    }
}
</script>