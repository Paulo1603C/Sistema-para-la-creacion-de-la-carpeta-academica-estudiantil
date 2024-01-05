<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="400">
            <v-card>
                <v-card-title>
                    <span v-if="ItemEstudiante.IdEst == 0" class="text-h5">Estudiante Nuevo</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Cedula*" v-model="ItemEstudiante.Cedula" :counter="10"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Nombre*" v-model="ItemEstudiante.NomEst" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Apellido*" v-model="ItemEstudiante.ApeEst" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" style="display: none">
                                <v-text-field label="Apellido*" v-model="ItemEstudiante.Fecha" required></v-text-field>
                            </v-col>
                            <v-col cols="12" style="display: none">
                                <v-select :items="getCarreras" item-text="NomCar" item-value="IdCar" label="Carreras*"
                                    v-model="ItemEstudiante.NomCar" required></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-select :items="getItems" item-text="NomPlan" item-value="IdPlan" label="Plantillas*"
                                    v-model="ItemEstudiante.idPlanPer" required></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="cerrarDialog()">
                        Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="agregar()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {

    name: "nuevo",

    props: {
        dialog: Boolean,
        ItemEstudiante: {},
    },

    data: () => ({
        path: '',
    }),

    created() {
        this.cargarCarreras();
        this.cargarPlantilla();
    },

    methods: {
        ...mapActions('Carreras', ['cargarCarreras']),
        ...mapActions('Estudiantes', ['AgregarEstudiante', 'cargarEstudiantes']),
        ...mapActions('Server_Carpetas', ['crearCarpeta']),
        ...mapActions('Plantillas', ['cargarPlantilla']),
        ...mapMutations('Dialogo', ['setDialogFolder']),

        agregar: async function () {
            try {
                //console.log(this.ItemEstudiante);
                this.rutaNueva();
                console.log(this.path);
                const storedUser = JSON.parse(localStorage.getItem('user'));
                this.idUser = storedUser.IdUser;
                if(this.itemsBread.length<3){
                    await this.AgregarEstudiante(this.ItemEstudiante);
                    await this.cargarEstudiantes({ idCar: this.idCarreraSelect, idUser: this.idUser});
                    await this.crearCarpeta({datos:this.ItemEstudiante, path:this.path, oldPath:this.rutaAnterior });
                }else{
                    await this.crearCarpeta({datos:this.ItemEstudiante, path:this.path, oldPath:this.rutaAnterior });
                    await this.cargarEstudiantes({ idCar: this.idCarreraSelect, idUser: this.idUser });
                }
                    this.$alertify.success(this.ItemEstudiante.IdEst == 0 ? "Estudiantre creado" : "Estudiante Actualizado");
                this.cerrarDialog();
                this.path='';
            } catch (error) {
                console.error('Error al agregar estudiante:', error);
            }
        },

        rutaNueva() {
            //metodo para obtener la ruta
            for (let i = 0; i < this.itemsBread.length; i++) {
                this.path += this.itemsBread[i] + "/";
            }
            //console.log(this.path);
        },

        cerrarDialog() {
            this.setDialogFolder(false);
        },

    },
    computed: {
        ...mapGetters('Carreras', ['getCarreras']),
        ...mapGetters('Plantillas', ['getItems']),
        ...mapState('Dialogo', ['itemsBread']),
        ...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Server_Carpetas', ['rutaAnterior']),
    },
}
</script>       