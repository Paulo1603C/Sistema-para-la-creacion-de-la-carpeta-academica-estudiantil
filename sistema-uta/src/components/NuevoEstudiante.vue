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
                                <v-text-field label="Cedula*" :rules="controles().controlCed"
                                    @change="buscarEstudianteCed()" v-model="ItemEstudiante.Cedula" :counter="10"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Nombres*" :rules="controles().controlNom"
                                    v-model="ItemEstudiante.NomEst" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Apellidos*" :rules="controles().controlApe"
                                    v-model="ItemEstudiante.ApeEst" required></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="ItemEstudiante.IdEst == 0" >
                                <v-select :rules="controles().controlPlan" :items="getPlantillas" item-text="NomPlan"
                                    item-value="IdPlan" label="Plantillas*" v-model="ItemEstudiante.idPlanPer"
                                    required></v-select>
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
        auxItemsPlan: [],
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
        ...mapActions('Estudiantes', ['AgregarEstudiante', 'cargarEstudiantes', 'buscarEstCedula']),
        ...mapActions('Server_Carpetas', ['crearCarpeta', 'crearSubCarpeta']),
        ...mapActions('Plantillas', ['cargarPlantillas', 'cargarItemsPlantillas']),
        ...mapMutations('Dialogo', ['setDialogFolder']),

        controles() {
            return {
                controlCed: [
                    value => {
                        if (value) return true
                        return 'Ingrese la cedula del estudiante'
                    },
                ],
                controlNom: [
                    value => {
                        if (value) return true
                        return 'Ingrese los nombres del estudiante'
                    },
                ],
                controlApe: [
                    value => {
                        if (value) return true
                        return 'Ingrese los apellidos del estudiante'
                    },
                ],
                controlPlan: [
                    value => {
                        if (value) return true
                        return 'Seleccione una plantilla'
                    },
                ],
            }
        },

        agregar: async function () {
            try {
                if (this.ItemEstudiante.Cedula !== "" &&
                    this.ItemEstudiante.NomEst !== "" &&
                    this.ItemEstudiante.ApeEst !== "") {
                    this.rutaNueva();
                    console.log(this.path);
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    this.idUser = storedUser.IdUser;
                    if (this.itemsBread.length < 3) {
                        await this.AgregarEstudiante(this.ItemEstudiante);
                        await this.crearCarpeta({ datos: this.ItemEstudiante, path: this.path, oldPath: this.rutaAnterior });
                        if (this.ItemEstudiante.IdEst == 0) {
                            await this.crearSubDirectorios(this.ItemEstudiante, this.path);
                        }
                        await this.cargarEstudiantes({ idCar: this.idCarreraSelect, idUser: this.idUser });
                    } else {
                        await this.crearCarpeta({ datos: this.ItemEstudiante, path: this.path, oldPath: this.rutaAnterior });
                        await this.cargarEstudiantes({ idCar: this.idCarreraSelect, idUser: this.idUser });
                    }
                    this.$alertify.success(this.ItemEstudiante.IdEst == 0 ? "Estudiantre creado" : "Estudiante Actualizado");
                    this.cerrarDialog();
                    this.path = '';
                } else {
                    this.$alertify.error("Complete todos campos para llevar acabo el proceso");
                }
            } catch (error) {
                console.error('Error al agregar estudiante:', error);
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

        buscarEstudianteCed: async function () {
            let buscar = await this.buscarEstCedula({ cedula: this.ItemEstudiante.Cedula });
            if (buscar) {
                this.$alertify.confirm(
                    `El estudinate con cedula ${this.ItemEstudiante.Cedula} ya existe, Deseas crear el mismo estudiante otra vez?`,
                    () => {
                        this.$alertify.success('Prosiga')
                    },
                    () => {
                        this.cerrarDialog(),
                            this.ItemEstudiante.Cedula = '',
                            this.$alertify.error('Cancelado')
                    }
                );
            }
        }

    },
    computed: {
        ...mapGetters('Carreras', ['getCarreras']),
        ...mapGetters('Plantillas', ['getPlantillas', 'getItemsPlantillas']),
        ...mapState('Dialogo', ['itemsBread']),
        ...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Server_Carpetas', ['rutaAnterior']),
    },
}
</script>       