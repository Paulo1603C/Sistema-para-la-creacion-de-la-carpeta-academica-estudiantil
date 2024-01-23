<template>
    <div>
        <NuevoEstudiante :dialog="dialogFolder" :ItemEstudiante="dataEst"></NuevoEstudiante>
        <NuevaCarpeta :dialog="dailogCarpeta" :ItemCarpeta="dataCarpeta"></NuevaCarpeta>
        <SubirArchivo :dialog="dialogFile" @dialog="dialogFile = $event" :ItemArchivo="dataObsArch"></SubirArchivo>
        <NuevaUsuario :dialog="dialogUser" :ItemUsuario="dataUsuario"></NuevaUsuario>
        <NuevaPlantilla :dialog="dailogPlantilla" :ItemPlantilla="dataPlan"></NuevaPlantilla>
        <progres :dialog="dailogProgres" :message="sms"></progres>
        <input ref="inputFile" id="archivoExcel" type="file" @change="subirExcel" style="display: none">
        <v-container class="mt-5">
            <v-menu v-model="showMenu" offset-y>
                <template v-slot:activator="{ on }">
                    <!-- Botón que activa el menú desplegable -->
                    <v-btn v-on="on" color="primary">Opciones
                        <v-icon right>mdi-menu-down</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item v-for="item in links" :key="item.text" @click="optionSelected(item.text)">
                        <v-list-item-icon>
                            <v-icon color="blue darken-4">mdi-{{ item.icon }}</v-icon>
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
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import readXlsFile from "read-excel-file";
import progres from './progresCircular.vue';

export default {

    props: ['links',],

    created() {

    },

    data() {
        return {
            fecha: "",
            path: '',
            idUser: 0,
            nomUser: '',
            showMenu: false,
            dialogFile: false,
            sms: "Importando datos, por favor espere...",
            estudianteSelect: {},
            carpetaSelect: {},
            itemSeleccionado: {},
            usuarioSelect: {},
            plantillaSelect: {},
            mostrarInput: false,
            items: [],
        };
    },
    methods: {
        ...mapMutations('Dialogo', ['setDialog', 'setDialogFolder', 'setDialogPlantilla', 'setDialogCarpeta', 'setDialogProgres']),
        ...mapMutations('Usuarios', ['setUser']),
        ...mapMutations('Estudiantes', ['setEst']),
        ...mapMutations('Plantillas', ['setPlan']),
        ...mapMutations('Server_Carpetas', ['setCarpeta']),
        ...mapMutations('Server_Archivos', ['setObsArch']),
        ...mapActions('Estudiantes', ['AgregarEstudiante', 'cargarEstudiantes']),
        ...mapActions('Server_Carpetas', ['crearCarpeta', 'crearSubCarpeta']),
        ...mapActions('Plantillas', ['cargarItemsPlantillas']),

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
                case "Crear Estudiante":
                    this.nuevoEstudiante();
                    break;
                default:
                    alert('Opción seleccionada: ' + option);
                    break;
            }
        },

        nuevoEstudiante() {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            let nomUser = storedUser.NomUser + ' ' + storedUser.ApeUser;
            this.fechaActual();
            this.estudianteSelect = {
                IdEst: 0,
                Cedula: '',
                NomEst: '',
                ApeEst: '',
                NomCar: this.idCarreraSelect,
                Fecha: this.fecha,
                IdPlanPer: 0,
                NomModificador: nomUser,
            }
            console.log("Item Est" + this.estudianteSelect);
            this.setEst(this.estudianteSelect);
            this.setDialogFolder(true);
        },

        nuevaCarpeta() {
            this.carpetaSelect = {
                IdEst: 0,
                NomEst: '',
                ApeEst: '',
            };
            //console.log("Item Car"+this.carpetaSelect.IdEst);
            this.setCarpeta(this.carpetaSelect);
            this.setDialogCarpeta(true);
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
                //permisos: [],
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
            this.rutaNueva();
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.idUser = storedUser.IdUser;
            this.nomUser = storedUser.NomUser + ' ' + storedUser.ApeUser;
            let input = document.getElementById("archivoExcel");
            const fileName = input.files[0].name;
            const fileExtension = fileName.split('.').pop();
            console.log(fileExtension)
            if (fileExtension === "xlsx") {
                readXlsFile(input.files[0]).then(async (rows) => {
                    this.items = rows;
                    this.fechaActual();
                    for (let i = 1; i < this.items.length; i++) {
                        this.setDialogProgres(true);
                        const row = this.items[i];
                        console.log(row);
                        const datos = {
                            IdEst: row[0],
                            NomEst: row[1],
                            ApeEst: row[2],
                            Cedula: row[3],
                            Fecha: this.fecha,
                            NomModificador: this.nomUser,
                            NomCar: this.idCarreraSelect,
                            idPlanPer: row[4],
                        };
                        await this.crearCarpeta({ datos: datos, path: this.path, oldPath: this.rutaAnterior });
                        await this.AgregarEstudiante(datos);
                        await this.crearSubDirectorios(datos, this.path);
                        if (i == this.items.length - 1) {
                            this.setDialogProgres(false);
                        }
                    }
                    this.path = '';
                    await this.cargarEstudiantes({ idCar: this.idCarreraSelect, idUser: this.idUser });
                    this.$alertify.success("Estudiantes Insertados");
                    input.value = null;
                });
            } else {
                this.$alertify.error('Selecione solo archivos excel para poder importar los datos');
            }
        },

        crearSubDirectorios: async function (datosEst, ruta) {
            await this.cargarItemsPlantillas(datosEst);
            const cadenaDeItems = this.getItemsPlantillas[0].Items;
            const auxItemsPlan = cadenaDeItems.split(',');
            for (let i = 0; i < auxItemsPlan.length; i++) {
                await this.crearSubCarpeta({ datos: datosEst, path: ruta, nombre: auxItemsPlan[i] });
            }
        },

        fechaActual() {
            const date = new Date();
            this.fecha = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
        },

        rutaNueva() {
            //metodo para obtener la ruta
            for (let i = 0; i < this.itemsBread.length; i++) {
                this.path += this.itemsBread[i] + "/";
            }
            //console.log(this.path);
        },

    },

    components: {
        NuevoEstudiante,
        NuevaUsuario,
        SubirArchivo,
        NuevaPlantilla,
        NuevaCarpeta,
        progres,
    },

    computed: {
        ...mapState('Dialogo', ['dialogUser', 'dialogFolder', 'dailogPlantilla', 'tablaEst', 'tablaArch', 'dailogCarpeta', 'itemsBread', 'dailogProgres']),
        ...mapState('Usuarios', ['dataUsuario']),
        ...mapState('Estudiantes', ['dataEst', 'idEst']),
        ...mapState('Plantillas', ['dataPlan']),
        ...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Server_Carpetas', ['dataCarpeta', 'rutaAnterior']),
        ...mapState('Server_Archivos', ['dataObsArch']),
        ...mapGetters('Plantillas', ['getPlantillas', 'getItemsPlantillas']),
    }
};

</script>

  