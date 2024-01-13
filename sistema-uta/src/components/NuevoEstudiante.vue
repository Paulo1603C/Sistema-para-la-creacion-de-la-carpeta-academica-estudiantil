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
                            <v-col cols="12">
                                <v-select :items="getPlantillas" item-text="NomPlan" item-value="IdPlan" label="Plantillas*"
                                    v-model="ItemEstudiante.idPlanPer" required></v-select>
                            </v-col>
                            {{ auxItemsPlan }}
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
        auxItemsPlan:[],
    },

    data: () => ({
        path: '',
    }),

    created() {
        this.cargarCarreras();
        this.cargarPlantillas();
    },

    methods: {
        ...mapActions('Carreras', ['cargarCarreras']),
        ...mapActions('Estudiantes', ['AgregarEstudiante', 'cargarEstudiantes']),
        ...mapActions('Server_Carpetas', ['crearCarpeta','crearSubCarpeta']),
        ...mapActions('Plantillas', ['cargarPlantillas','cargarItemsPlantillas']),
        ...mapMutations('Dialogo', ['setDialogFolder']),

        agregar: async function () {
            try {
                //console.log(this.ItemEstudiante);
                this.rutaNueva();
                console.log(this.path);
                const storedUser = JSON.parse(localStorage.getItem('user'));
                this.idUser = storedUser.IdUser;
                //console.log(this.ItemEstudiante);
                if(this.itemsBread.length<3){
                    await this.AgregarEstudiante(this.ItemEstudiante);
                    await this.crearCarpeta({datos:this.ItemEstudiante, path:this.path, oldPath:this.rutaAnterior });
                    await this.cargarEstudiantes({ idCar: this.idCarreraSelect, idUser: this.idUser});
                    if( this.ItemEstudiante.IdEst == 0 ){
                        await this.crearSubDirectorios( this.ItemEstudiante, this.path );
                    }
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

        crearSubDirectorios:async function(datosEst, ruta){
            await this.cargarItemsPlantillas(datosEst);
            const cadenaDeItems = this.getItemsPlantillas[0].Items;
            const auxItemsPlan = cadenaDeItems.split(',');
            for( let i=0; i< auxItemsPlan.length; i++ ){
                await this.crearSubCarpeta({datos:datosEst, path:ruta, nombre:auxItemsPlan[i] });
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
        ...mapGetters('Plantillas', ['getPlantillas','getItemsPlantillas']),
        ...mapState('Dialogo', ['itemsBread']),
        ...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Server_Carpetas', ['rutaAnterior']),
    },
}
</script>       