<template>
    <div>
        <BtnOpciones :links="btnOP" v-if="tablaEst == true || tablaArch == true" dark class="mb-2"></BtnOpciones>

        <v-breadcrumbs>
            <v-breadcrumbs-item style="font-size:20px" class="BreadCumbs" v-for="(item, index) in itemsBread" :key="index"
                @click="acciones(item)">
                {{ item }}
                <span style="color:red;font-size:30px" v-if="index < itemsBread.length - 1"> / </span>
            </v-breadcrumbs-item>
        </v-breadcrumbs>

        <!--<v-col v-for="(item, index) in getCarrerasUser" :key="index" class="ma-2">
            <Carreras :show="carreras" :nombreCar="item.nomCar"></Carreras>
        </v-col>-->
        <Carreras :show="carreras" Titulo="CARRERAS" :Cabecera="CabeceraCarreras" :Items="getCarrerasUser"></Carreras>
        <TablaEst :show="tablaEst" Titulo="ESTUDIANTES " :Cabecera="Cabecera" :Items="getItems"></TablaEst>
        <TablaDir_Arch :show="tablaArch" :Titulo="itemsBread[2]" :Cabecera="Cabecera2" :Items="getCarpetas"></TablaDir_Arch>

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
            itemsVacio: [],
            tituloUser: '',
            idUser: null,
            path: '',
            carrera: 0,
            Cabecera: [
                { text: 'Tipo', value: 'tipo', },
                { text: 'Nombre', value: 'nombre', },
                { text: 'Carrera', value: 'carrera', },
                { text: 'Modificado', value: 'fecha', },
                { text: 'Modificador por', value: 'user', },
                { text: 'ACCIONES', value: 'acciones', },
            ],
            Cabecera2: [
                { text: 'Tipo', value: 'tipo', },
                { text: 'Nombre', value: 'nombre', },
                { text: 'Tamaño', value: 'amaño', },
                { text: 'Modificado', value: 'fecha', },
                { text: 'Modificador por', value: 'user', },
                { text: 'ACCIONES', value: 'acciones', },
            ],
            CabeceraCarreras: [
                { text: 'Tipo', value: ' ', },
                { text: 'Nombre', value: 'nombre', },
                { text: 'Descargar', value: 'descargar', },
            ],
            btnOP: [
                { icon: "folder-plus", text: "Crear Carpeta", show: "true" },
                { icon: "folder-arrow-up", text: "Subir Archivo", show: "true" },
                { icon: "import", text: "Importar Datos", show: "true" },
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

        ...mapActions('Carreras', ['cargarCarrerasUser']),
        ...mapActions('Estudiantes', ['cargarEstudiantes']),
        ...mapActions('Server_Carpetas', ['cargarCarpetas']),
        ...mapMutations('Dialogo', ['setVentanaEst', 'setVentanaArch', 'setVentanaCarreras', 'setBreadcrumbs']),

        acciones(item) {
            //console.log(item);
            this.rutaNueva();
            //console.log(this.path);
            if (item == this.itemsBread[0]) {
                //console.log('Mijas de pan');
                this.setVentanaCarreras(true);
                this.setVentanaEst(false);
                this.setVentanaArch(false);
                this.setBreadcrumbs(this.itemsVacio);
            } else {
                switch (item) {
                    case 'INGENIERÍA INDUSTRIAL':
                        this.carrera = 1;
                        this.navegacionBreadCrumbs(this.carrera, this.idUser,item);
                        break;
                    case 'SOFTWARE':
                        this.carrera = 2;
                        this.navegacionBreadCrumbs(this.carrera, this.idUser,item);
                        break;
                    case 'TI':
                        this.carrera = 3;
                        this.navegacionBreadCrumbs(this.carrera, this.idUser,item);
                        break;
                    case 'TELECOMUNICACIONES':
                        this.carrera = 4;
                        this.navegacionBreadCrumbs(this.carrera, this.idUser,item);
                        break;
                    case 'AUTOMATIZACIÓN Y ROBÓTICA':
                        this.carrera = 5;

                        this.navegacionBreadCrumbs(this.carrera, this.idUser,item);
                        console.log(this.path);
                        break;
                    default:
                        this.path = '';
                        this.setBreadcrumbs(item);
                        this.rutaNueva();
                        this.cargarCarpetas(this.path);
                        break;
                }

            }
            this.path = '';
        },

        navegacionBreadCrumbs(idCar, idUser, item) {
            this.path = '';
            this.setBreadcrumbs(item);
            this.rutaNueva();
            this.cargarEstudiantes({ idCar: idCar, idUser: idUser });
            this.setVentanaEst(true);
            this.setVentanaArch(false);
        },

        rutaNueva() {
            //metodo para obtener la ruta
            for (let i = 0; i < this.itemsBread.length; i++) {
                this.path += this.itemsBread[i] + "/";
            }
            //console.log(this.path);
        },

    },

    computed: {
        ...mapGetters('Estudiantes', ['getItems']),
        ...mapGetters('Carreras', ['getCarrerasUser']),
        ...mapGetters('Server_Carpetas', ['getCarpetas']),
        ...mapState('Dialogo', ['tablaEst', 'tablaArch', 'carreras', 'itemsBread']),
        ...mapState('Carreras', ['carreraSelecionada', 'idCarreraSelect']),
    }
}
</script>

<style>
.BreadCumbs {
    color: black;
    font-size: 20px;
    font-weight: bold;
}

.BreadCumbs:hover {
    color: rgb(120, 120, 236);
    cursor: pointer;
}
</style>