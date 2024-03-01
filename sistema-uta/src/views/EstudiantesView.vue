<template>
    <div>
        <BtnOpciones :links="btnOP" v-if="tablaEst == true || tablaArch == true" dark class="mb-2"></BtnOpciones>
        <v-breadcrumbs>
            <v-breadcrumbs-item style="font-size:15px" class="BreadCumbs" v-for="(item, index) in itemsBread" :key="index"
                @click="acciones(item)">
                {{ item }}
                <span style="color:red;font-size:15x" v-if="index < itemsBread.length - 1"> / </span>
            </v-breadcrumbs-item>
        </v-breadcrumbs>


        <Carreras :show="carreras" Titulo="CARRERAS" :Cabecera="CabeceraCarreras" :Items="getCarrerasUser"></Carreras>
        <TablaEst :show="tablaEst" Titulo="ESTUDIANTES " :Cabecera="Cabecera" :Items="getItems"></TablaEst>
        <TablaDir_Arch :show="tablaArch" :Titulo="itemsBread[2]" :Cabecera="Cabecera2" :ItemsArchivos="getCarpetas">
        </TablaDir_Arch>
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
            btnOP: [],
            tituloUser: '',
            idUser: null,
            path: '',
            sms: '',
            carrera: 0,
            permisosDirectorios: new Map(),
            Cabecera: [
                { text: 'Tipo', value: 'tipo', },
                { text: 'Nombre', value: 'NomEst', },
                { text: 'Carrera', value: 'NomCar', },
                { text: 'Modificado', value: 'Fecha', },
                { text: 'Modificador por', value: 'Nom_Modificador', },
                { text: 'ACCIONES', value: 'acciones', },
            ],
            Cabecera2: [
                { text: 'Tipo', value: 'tipo', },
                { text: 'Nombre', value: 'nombre', },
                { text: 'Tamaño', value: 'tamaño', },
                { text: 'Modificado', value: 'fecha', },
                { text: 'Modificador por', value: 'user', },
                { text: 'ACCIONES', value: 'acciones', },
            ],
            CabeceraCarreras: [
                { text: 'Tipo', value: ' ', },
                { text: 'Nombre', value: 'nomCar', },
                { text: 'Descargar', value: 'descargar', },
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
            //console.log(this.carreraSelecionada);
            this.cargarCarrerasUser(this.idUser);
            //this.cargarSubCarpetas();
            this.obtenerPermisosDirectorios();
            //this.notificaciones({idUser:this.idUser});
            this.acciones(this.itemsBread[0]);
        }
    },

    methods: {

        ...mapActions('Carreras', ['cargarCarrerasUser','cargarCarreras']),
        ...mapActions('Estudiantes', ['cargarEstudiantes']),
        ...mapActions('Server_Carpetas', ['cargarCarpetas']),
        ...mapMutations('Dialogo', ['setVentanaEst', 'setVentanaArch', 'setVentanaCarreras', 'setBreadcrumbs', 'setCtlSubirArch', 'setCtlfolder', 'setDailogCargarDatos']),
        //...mapActions('SubCarpetas', ['cargarSubCarpetas']),
        ...mapMutations('Permisos', ['setPermisosSubDirectorios']),
        ...mapActions('Permisos', ['cargarPermisosDirectorios']),
        //...mapActions('Login', ['notificaciones']),

        controlArchFolder: async function (ruta) {
            let partes = ruta.split('/').filter(Boolean);
            let ultimoValor = partes[partes.length - 1]
            //si igual a uno de los padres se crear subcarpetas, caso contrario es padre
            if (this.getSubCarpetas.some(({ NomItem }) => NomItem.toLowerCase() === ultimoValor.toLowerCase())) {
                this.setCtlSubirArch(false);
                this.setCtlfolder(false);
            }
        },

        acciones(item) {
            this.rutaNueva();
            this.controlArchFolder(this.path);
            if (item == this.itemsBread[0]) {
                this.setVentanaCarreras(true);
                this.setVentanaEst(false);
                this.setVentanaArch(false);
                this.setBreadcrumbs(this.itemsVacio);
            } else {
                switch (item) {
                    case 'INGENIERÍA INDUSTRIAL':
                        this.carrera = 1;
                        this.navegacionBreadCrumbs(this.carrera, this.idUser, item);
                        break;
                    case 'SOFTWARE':
                        this.carrera = 2;
                        this.navegacionBreadCrumbs(this.carrera, this.idUser, item);
                        break;
                    case 'TI':
                        this.carrera = 3;
                        this.navegacionBreadCrumbs(this.carrera, this.idUser, item);
                        break;
                    case 'TELECOMUNICACIONES':
                        this.carrera = 4;
                        this.navegacionBreadCrumbs(this.carrera, this.idUser, item);
                        break;
                    case 'AUTOMATIZACIÓN Y ROBÓTICA':
                        this.carrera = 5;
                        this.navegacionBreadCrumbs(this.carrera, this.idUser, item);
                        //console.log(this.path);
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
        },

        obtenerPermisosDirectorios: async function () {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const idUser = storedUser.IdUser;

                await Promise.all(this.getSubCarpetas.map(async (item) => {
                    await this.cargarPermisosDirectorios({ idUser, nomItem: item.NomItem });
                    this.permisosDirectorios.set(item.NomItem.toLowerCase(), this.getPermisosDirectorios[0].NomPer);
                    //console.dir(`Permisos ${item.NomItem} -> ${this.getPermisosDirectorios[0].NomPer}`);
                }));
                const permission = JSON.stringify(Array.from(this.permisosDirectorios.entries()));
                localStorage.setItem('PermisosSubDirectorios', permission);
                //console.log(this.permisosDirectorios);
            } catch (error) {
                this.$alertify.error('Error al obtener permisos de directorios:', error);
                throw error; // Re-lanza el error para que pueda ser manejado externamente si es necesario.
            }
        },


    },
    watch: {
        tablaEst: {
            handler(newVal, oldVal) {
                //console.log('Nueva tablaEst:', newVal);
                if (newVal) {
                    this.btnOP = [
                        { icon: "folder-plus", text: "Crear Estudiante", show: "true" },
                        { icon: "import", text: "Importar Datos", show: "true" },
                    ];
                } else {
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    const idUser = storedUser.IdRolPer;
                    if (idUser == 1) {
                        this.btnOP = [
                            { icon: "folder-plus", text: "Crear Carpeta", show: "true" },
                            //{ icon: "folder-arrow-up", text: "Subir Archivo", show: "true" },
                        ];
                    } else {
                        this.btnOP = [
                            { icon: "alpha-x", text: "Sin permisos", show: "true" },
                        ];

                    }
                }
            },
            immediate: true, // Si deseas que el watcher se ejecute inmediatamente al montar el componente
        },

        ctlSubirArch: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.btnOP = [
                        { icon: "folder-arrow-up", text: "Subir Archivo", show: "true" },
                        { icon: "folder-plus", text: "Crear Carpeta", show: "true" },
                    ];
                    
                } else {
                    this.cargarCarreras();
                    this.rutaNueva();
                    let arreglo = this.path.split("/").filter(Boolean);
                    let auxR = arreglo[arreglo.length - 1];
                    if (this.getCarreras.some(({ NomCar }) => NomCar.toUpperCase() === auxR.toUpperCase())) {
                        this.btnOP = [
                            { icon: "folder-plus", text: "Crear Estudiante", show: "true" },
                            { icon: "import", text: "Importar Datos", show: "true" },
                        ];
                    } else {
                        this.btnOP = [
                            { icon: "folder-plus", text: "Crear Carpeta", show: "true" },
                        ];
                    }
                }
            }
        },

        /*mostrarCrear: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.btnOP = [
                        { icon: "folder-arrow-up", text: "Subir Archivo", show: "true" },
                    ];
                }
            }
        },*/
    },

    computed: {
        ...mapGetters('Estudiantes', ['getItems']),
        ...mapGetters('Carreras', ['getCarrerasUser', 'getCarreras']),
        ...mapGetters('Server_Carpetas', ['getCarpetas']),
        ...mapState('Dialogo', ['tablaEst', 'tablaArch', 'carreras', 'itemsBread', 'ctlSubirArch', 'mostrarCrear', 'dailogCargarDatos']),
        ...mapState('Carreras', ['carreraSelecionada', 'idCarreraSelect']),
        ...mapGetters('Permisos', ['getPermisosDirectorios']),
        ...mapGetters('SubCarpetas', ['getSubCarpetas']),
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