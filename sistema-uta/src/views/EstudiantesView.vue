<template>
    <div>
        <BtnOpciones :links="btnOP" dark class="mb-2"></BtnOpciones>

        <v-breadcrumbs>
            <v-breadcrumbs-item v-for="(item, index) in itemsBread" :key="index" @click="acciones(item)">
                {{ item }}
                <span v-if="index < itemsBread.length - 1"> / </span>
            </v-breadcrumbs-item>
        </v-breadcrumbs>

        <TablaEst :show="tablaEst" Titulo="ESTUDIANTES " :Cabecera="Cabecera" :Items="getItems"></TablaEst>

        <TablaDir_Arch :show="tablaArch" Titulo="Paulo Martinez " :Cabecera="Cabecera" :Items="getItems"></TablaDir_Arch>

    </div>
</template>


<script>

import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import BtnOpciones from '../components/BtnOpciones.vue';
import TablaEst from '../components/TablaEstudiantes.vue';
import TablaDir_Arch from '../components/TablaDir_Arch.vue';

export default {
    name: 'Estudiantes',

    components: {
        TablaEst,
        BtnOpciones,
        TablaDir_Arch,
    },

    data() {
        return {
            itemsVacio:[],
            Cabecera: [
                { text: 'Nombre', value: 'tag', },
                { text: 'Carrera', value: 'carrera', },
                { text: 'Modificado', value: 'fecha', },
                { text: 'Modificador por', value: 'user', },
                { text: 'ACCIONES', value: 'acciones', },
            ],
            btnOP: [
                { icon: "folder-plus", text: "Crear Carpeta" },
                { icon: "folder-arrow-up", text: "Subir Archivo" },
                { icon: "import", text: "Importar Datos" },
            ],
        }
    },

    created() {
        const isAuthenticated = localStorage.getItem('Authentication') === 'true';
        if (!isAuthenticated) {
            this.$router.push("/");
        } else {
            this.cargarEstudiantes();
        }
    },

    methods: {
        ...mapActions('Estudiantes', ['cargarEstudiantes']),
        ...mapMutations('Dialogo',['setVentanaEst','setVentanaArch','setBreadcrumbs']),

        acciones(item) {
            if (item == 'Mis Archivos') {
                this.setVentanaEst(true);
                this.setVentanaArch(false);
                this.setBreadcrumbs(this.itemsVacio);
            }
        }

    },

    computed: {
        ...mapGetters('Estudiantes', ['getItems']),
        ...mapState('Dialogo', ['tablaEst', 'tablaArch', 'itemsBread']),
    }
}
</script>