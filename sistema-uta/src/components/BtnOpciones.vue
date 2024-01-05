<template>
    <div>
        <NuevoEstudiante :dialog="dialogFolder" :ItemEstudiante="dataEst"></NuevoEstudiante>
        <NuevaCarpeta :dialog="dailogCarpeta" :ItemCarpeta="dataCarpeta" ></NuevaCarpeta>
        <SubirArchivo :dialog="dialogFile" @dialog="dialogFile = $event" :ItemArchivo="itemSeleccionado"></SubirArchivo>
        <NuevaUsuario :dialog="dialogUser" :ItemUsuario="dataUsuario"></NuevaUsuario>
        <NuevaPlantilla :dialog="dailogPlantilla" :ItemPlantilla="dataPlan"></NuevaPlantilla>
        <input ref="inputFile" id="archivoExcel" type="file" @change="subirExcel" style="display: none">
        <v-container class="mt-5">
            <v-menu v-model="showMenu" offset-y>
                <template v-slot:activator="{ on }">
                    <!-- Botón que activa el menú desplegable -->
                    <v-btn v-on="on" color="primary">Opciones
                        <v-icon right>mdi-menu-down</v-icon>
                    </v-btn>
                </template>

                <!-- Contenido del menú desplegable -->
                <v-list>
                    <v-list-item v-for="item in links" :key="item.text" @click="optionSelected(item.text)">
                        <v-list-item-icon>
                            <v-icon>mdi-{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-container>
    </div>
</template>
  
<script>
import NuevoEstudiante from './NuevoEstudiante.vue';
import NuevaCarpeta from './NuevaCarpeta.vue';
import SubirArchivo from './SubirArchivo.vue';
import NuevaUsuario from './NuevoUsuario.vue';
import NuevaPlantilla from './NuevaPlantilla.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import readXlsFile from "read-excel-file";
import moment from 'moment';

export default {

    props: ['links',],

    created() {

    },

    data() {
        return {
            fecha: "",
            showMenu: false,
            dialogFile: false,
            estudianteSelect: {},
            carpetaSelect:{},
            itemSeleccionado: {},
            usuarioSelect: {},
            plantillaSelect: {},
            mostrarInput: false,
            items: [],
        };
    },
    methods: {
        ...mapMutations('Dialogo', ['setDialog', 'setDialogFolder', 'setDialogPlantilla','setDialogCarpeta']),
        ...mapMutations('Usuarios', ['setUser']),
        ...mapMutations('Estudiantes', ['setEst']),
        ...mapMutations('Plantillas', ['setPlan']),
        ...mapMutations('Server_Carpetas', ['setCarpeta']),
        ...mapActions('Estudiantes', ['AgregarEstudiante']),

        optionSelected(option) {
            switch (option) {
                case "Crear Carpeta":
                    this.nuevaCarpeta();
                    break;
                case "Subir Archivo":
                    this.subirArchivo();
                    //this.$refs.fileInput.click();
                    break;
                case "Crear Usuario":
                    this.nuevoUsuario();
                    break;
                case "Importar Datos":
                    this.importarDatos();
                    break;
                case "Crear Plantilla":
                    this.crearPlantilla();
                    break;
                default:
                    alert('Opción seleccionada: ' + option);
                    break;
            }
        },

        nuevaCarpeta() {
            console.log(this.tablaEst);
            if (this.tablaEst == true) {
                this.fechaActual();
                this.estudianteSelect = {
                    IdEst: 0,
                    Cedula: '',
                    NomEst: '',
                    ApeEst: '',
                    NomCar: this.idCarreraSelect,
                    Fecha: this.fecha,
                    idPlanPer: 0,
                }
                //console.log("Item Est"+this.estudianteSelect);
                this.setEst(this.estudianteSelect);
                this.setDialogFolder(true);
            }else{
                this.carpetaSelect = {
                    IdEst: 0,
                    NomEst: '',
                    ApeEst: '',
                };
                //console.log("Item Car"+this.carpetaSelect.IdEst);
                this.setCarpeta(this.carpetaSelect);
                this.setDialogCarpeta(true);
            }
        },

        nuevoUsuario() {
            this.usuarioSelect = {
                id: 0,
                nombre: '',
                apellido: '',
                correo: '',
                contraseña: '',
                rol: 0,
                carreras: [],
                permisos: [],
            },
                this.setUser(this.usuarioSelect);
            this.setDialog(true);
        },

        crearPlantilla() {
            this.plantillaSelect = {
                idPlan: 0,
                nomPlan: '',
                items: [],
            }
            this.setPlan(this.plantillaSelect);
            this.setDialogPlantilla(true);
        },

        subirArchivo() {
            this.dialogFile = true;
        },

        importarDatos(event) {
            this.$refs.inputFile.click();
        },

        subirExcel() {
            const input = document.getElementById("archivoExcel");
            readXlsFile(input.files[0]).then((rows) => {
                this.items = rows;
                this.fechaActual();
                for (const row of this.items) {
                    const datos = {
                        IdEst: row[0],
                        NomEst: row[1],
                        ApeEst: row[2],
                        Cedula: row[3],
                        Fecha: this.fecha,
                        NomCar: row[5]
                    };
                    console.log(datos)
                    this.AgregarEstudiante(datos);
                }
                this.$alertify.success("Estudiantes Insertados");
            });
        },

        fechaActual() {
            const date = new Date();
            this.fecha = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        },


    },

    components: {
        NuevoEstudiante,
        NuevaUsuario,
        SubirArchivo,
        NuevaPlantilla,
        NuevaCarpeta,
    },

    computed: {
        ...mapState('Dialogo', ['dialogUser', 'dialogFolder', 'dailogPlantilla', 'tablaEst','dailogCarpeta']),
        ...mapState('Usuarios', ['dataUsuario']),
        ...mapState('Estudiantes', ['dataEst']),
        ...mapState('Plantillas', ['dataPlan']),
        ...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Server_Carpetas', ['dataCarpeta']),
    }
};

</script>
  