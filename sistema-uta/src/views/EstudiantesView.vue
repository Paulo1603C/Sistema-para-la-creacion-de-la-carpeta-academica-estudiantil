<template>
    <div>
        <BtnOpciones :links="btnOP" dark class="mb-2"></BtnOpciones>
        <KeepAlive>
            <TablaEst Titulo="ESTUDIANTES " :Cabecera="Cabecera" :Items="getItems"></TablaEst>
        </KeepAlive>
        <!--<KeepAlive>
            <TablaDir_Arch Titulo="ESTUDIANTES " :Cabecera="Cabecera" :Items="getItems"></TablaDir_Arch>
        </KeepAlive>-->
    </div>
</template>


<script>

import { mapActions, mapGetters } from 'vuex';
import TablaEst from '../components/TablaEstudiantes.vue';
import BtnOpciones from '../components/BtnOpciones.vue';
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
            Cabecera: [
                { text: 'Nombre', value: 'tag', },
                { text: 'Carrera', value: 'carrera', },
                { text: 'Modificado', value: 'fecha', },
                { text: 'Modificador por', value: 'user', },
                { text: 'ACCIONES', value: 'acciones', },
            ],
            //datos de prueba=>borrar
            /*getItems: [
                { tag: 'Paulo Martinez', carrera: 'Software', fecha: '22/02/2023', user: 'Paulo', },
                { tag: 'Cristina Silva', carrera: 'TI', fecha: '22/02/2023', user: 'Paulo', },
                { tag: 'Lenin Acosta', carrera: 'Industrial', fecha: '22/02/2023', user: 'Paulo', },
                // Agrega más elementos al array según sea necesario
            ],*/
            btnOP: [
                { icon: "folder-plus", text: "Crear Carpeta" },
                { icon: "folder-arrow-up", text: "Subir Archivo" },
                { icon: "import", text: "Importar Datos" },
            ],
        }
    },

    created() {
        this.cargarEstudiantes();
    },

    methods: {
        ...mapActions('Estudiantes', ['cargarEstudiantes']),

    },

    computed: {
        ...mapGetters('Estudiantes', ['getItems'])
    }
}
</script>