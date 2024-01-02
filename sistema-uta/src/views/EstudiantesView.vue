<template>
    <div>
        <BtnOpciones :links="btnOP" v-if="tablaEst==true || tablaArch==true" dark class="mb-2"></BtnOpciones>

        <v-breadcrumbs>
            <v-breadcrumbs-item  style="font-size:20px" class="BreadCumbs" v-for="(item, index) in itemsBread" :key="index" @click="acciones(item)">
                {{ item }}
                <span style="color:red;font-size:30px" v-if="index < itemsBread.length - 1"> / </span>
            </v-breadcrumbs-item>
        </v-breadcrumbs>

        <!--<v-col v-for="(item, index) in getCarrerasUser" :key="index" class="ma-2">
            <Carreras :show="carreras" :nombreCar="item.nomCar"></Carreras>
        </v-col>-->
        <Carreras :show="carreras" Titulo="CARRERAS" :Cabecera="CabeceraCarreras" :Items="getCarrerasUser"></Carreras>
        <TablaEst :show="tablaEst" Titulo="ESTUDIANTES " :Cabecera="Cabecera" :Items="getItems"></TablaEst>
        <TablaDir_Arch :show="tablaArch" :Titulo="itemsBread[1]" :Cabecera="Cabecera" :Items="getItems"></TablaDir_Arch>

    </div>
</template>


<script>

import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import BtnOpciones from '../components/BtnOpciones.vue';
import TablaEst from '../components/TablaEstudiantes.vue';
import TablaDir_Arch from '../components/TablaDir_Arch.vue';
import Carreras from '../components/CarrerasUser.vue';

export default {
    name: 'Estudiantes',

    components: {
        TablaEst,
        BtnOpciones,
        TablaDir_Arch,
        Carreras,
    },

    data() {
        return {
            itemsVacio:[],
            tituloUser:'',
            idUser:null,
            Cabecera: [
                { text: 'Nombre', value: 'nombre', },
                { text: 'Carrera', value: 'carrera', },
                { text: 'Modificado', value: 'fecha', },
                { text: 'Modificador por', value: 'user', },
                { text: 'ACCIONES', value: 'acciones', },
            ],
            CabeceraCarreras: [
                { text: 'Tipo', value: ' ', },
                { text: 'Nombre', value: 'nombre', },
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
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.idUser = storedUser.IdUser;
            console.log(this.carreraSelecionada);
            this.cargarCarrerasUser(this.idUser);
            
        }
    },

    methods: {
        
        ...mapActions('Carreras',['cargarCarrerasUser']),
        ...mapMutations('Dialogo',['setVentanaEst','setVentanaArch','setVentanaCarreras','setBreadcrumbs']),

        acciones(item) {
            console.log(item);
            if (item == this.itemsBread[0]) {
                this.setVentanaCarreras(true);
                this.setVentanaEst(false);
                this.setVentanaArch(false);
                this.setBreadcrumbs(this.itemsVacio);
            }
        }

    },

    computed: {
        ...mapGetters('Estudiantes', ['getItems']),
        ...mapGetters('Carreras', ['getCarrerasUser']),
        ...mapState('Dialogo', ['tablaEst', 'tablaArch', 'carreras','itemsBread']),
        ...mapState('Carreras', ['carreraSelecionada']),
    }
}
</script>

<style>
    .BreadCumbs{
        color:blue; 
        font-size:20px;
        font-weight: bold;
    }
    .BreadCumbs:hover{
        color:rgb(120, 120, 236); 
        cursor: pointer;
    }
</style>