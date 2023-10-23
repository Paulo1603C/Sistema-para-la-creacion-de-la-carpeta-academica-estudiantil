<template>
    <div>

        <BtnOpciones dark class="mb-2" @click="nuevoItem()"></BtnOpciones>
        <TablaEst Titulo="ESTUDIANTES " :Cabecera="Cabecera" :Items="getItems"></TablaEst>
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
                { text: 'Nombre', value: 'tag', },
                { text: 'Carrera', value: 'carrera', },
                { text: 'Modificado', value: 'fecha', },
                { text: 'Modificador por', value: 'user', },
                { text: 'ACCIONES', value: 'acciones', },
            ],
            //datos de prueba=>borrar
            getItems: [
                { tag: 'Paulo Martinez', carrera:'Software' ,fecha: '22/02/2023', user: 'Paulo', },
                { tag: 'Cristina Silva', carrera:'TI' ,fecha: '22/02/2023', user: 'Paulo', },
                { tag: 'Lenin Acosta', carrera:'Industrial' ,fecha: '22/02/2023', user: 'Paulo', },
                // Agrega más elementos al array según sea necesario
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