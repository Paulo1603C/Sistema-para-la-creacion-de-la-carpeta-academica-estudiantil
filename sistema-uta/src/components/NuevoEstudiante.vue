<template>
    <v-row justify="center">
        <progres :dialog="dailogCrearEst" :message="sms"></progres>
        <v-dialog v-model="dialog" persistent width="450">
            <v-card>
                <v-card-title>
                    <span v-if="ItemEstudiante.IdEst == 0" class="text-h5">Estudiante Nuevo</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Cedula*" :rules="[controles().controlCed, cedulaLengthRule]" maxlength="10"
                                    @change="buscarEstudianteCed()" v-model="ItemEstudiante.Cedula" :counter="10"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Nombres Completos*" maxlength="30" :rules="controles().controlNom"
                                    v-model="ItemEstudiante.NomEst" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Apellidos Completos*" maxlength="30"  :rules="controles().controlApe"
                                    v-model="ItemEstudiante.ApeEst" required></v-text-field>
                            </v-col>
                            <v-col cols="12" v-if="ItemEstudiante.IdEst == 0">
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
                    <v-btn color="secondary" variant="text" @click="cerrarDialog()">
                        Close
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="agregar()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import progres from './progresCircular.vue';
export default {

    name: "nuevo",

    props: {
        dialog: Boolean,
        ItemEstudiante: {},
        auxItemsPlan: [],
    },

    data: () => ({
        path: '',
        sms: 'Creando las carpetas para el estudiante...'
    }),

    created() {
        this.cargarCarreras();
        this.cargarPlantillas();
    },

    methods: {
        ...mapActions('Carreras', ['cargarCarreras']),
        ...mapActions('Estudiantes', ['AgregarEstudiante', 'cargarEstudiantes', 'buscarEstCedula']),
        ...mapActions('Server_Carpetas', ['crearCarpeta', 'crearSubCarpeta','crearSubSubCarpeta']),
        ...mapActions('Plantillas', ['cargarPlantillas', 'cargarItemsPlantillas']),
        ...mapMutations('Dialogo', ['setDialogFolder', 'setDailogCrearEst']),
        ...mapActions("SubSubItems", ["cargarSubSubItemsHas"]),

        cedulaLengthRule(value) {
            if (!value || value.length === 10) {
                return true; // La longitud es correcta
            } else {
                return 'La cédula debe tener exactamente 10 dígitos'; // Mensaje de error
            }
        },

        controles() {
            return {
                controlCed: [
                    value => {
                        if (!value) return 'Ingrese una cédula';
                        const soloNumeros = /^\d+$/;
                        return soloNumeros.test(value) || 'Ingrese solo números';
                    },
                ],
                controlNom: [
                    value => {
                        if (!value) return 'Ingrese los nombres del estudiante';
                        const soloLetras = /^[a-zA-Z\s]+$/;
                        return soloLetras.test(value) || 'Ingrese solo letras';
                    }
                ],
                controlApe: [
                    value => {
                        if (!value) return 'Ingrese los apellidos del estudiante';
                        const soloLetras = /^[a-zA-Z\s]+$/;
                        return soloLetras.test(value) || 'Ingrese solo letras';
                    }
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
                    //console.log(this.path);
                    const storedUser = JSON.parse(localStorage.getItem('user'));
                    this.idUser = storedUser.IdUser;
                    if (this.itemsBread.length < 3) {
                        await this.AgregarEstudiante(this.ItemEstudiante);
                        await this.crearCarpeta({ datos: this.ItemEstudiante, path: this.path, oldPath: this.rutaAnterior });
                        if (this.ItemEstudiante.IdEst == 0) {
                            await this.crearSubDirectorios(this.ItemEstudiante, this.path);
                        }
                        console.log("ID=> "+ this.idUser);
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
                this.$alertify.error('Error al agregar estudiante:', error);
            }
        },

        crearSubDirectorios: async function (datosEst, ruta) {
            try {
                this.setDailogCrearEst(true);
                await this.cargarItemsPlantillas(datosEst);
                const cadenaDeItems = this.getItemsPlantillas[0].Items;
                const auxItemsPlan = cadenaDeItems.split(",");

                // Crear subcarpetas en paralelo
                const crearSubCarpetasPromises = auxItemsPlan.map((item) =>
                    this.crearSubCarpeta({ datos: datosEst, path: ruta, nombre: item })
                );
                await Promise.all(crearSubCarpetasPromises);

                const idDeItems = this.getItemsPlantillas[0].IdItem; // Servirá para buscar subSubItems relacionados
                const auxIdItemsPlan = idDeItems.split(",");

                // Cargar SubSubItems y crear subSubCarpetas en paralelo
                const subSubItemsPromises = auxIdItemsPlan.map(async (id, index) => {
                    await this.cargarSubSubItemsHas({ idPlan: id });
                    const nomSubDirectorio = auxItemsPlan[index];
                    console.log('Datsos porblem')
                    console.log(this.getSubSubItems);
                    console.log(this.nomSubDirectorio);
                    if (this.getSubSubItems.length > 0) {
                    const crearSubSubCarpetasPromises = this.getSubSubItems.map((subSubItem) =>
                        this.crearSubSubCarpeta({
                        datos: datosEst,
                        nomSubDir: nomSubDirectorio,
                        path: ruta,
                        nombre: subSubItem.NomSubSubItem,
                        })
                    );
                    await Promise.all(crearSubSubCarpetasPromises);
                    }
                });
                await Promise.all(subSubItemsPromises);
                this.setDailogCrearEst(false);
            } catch (error) {
                this.$alertify.error('Error al intentar crear una carpeta:', error);
                console.log('Error al intentar crear una carpeta:', error);
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
            let res = this.validarCedula(this.ItemEstudiante.Cedula);
            if (res) {
                let buscar = await this.buscarEstCedula({ cedula: this.ItemEstudiante.Cedula });
                if (buscar) {
                    this.$alertify.confirm(
                        `El estudinate con cedula ${this.ItemEstudiante.Cedula} ya existe`,
                        () => {
                            this.ItemEstudiante.Cedula = ''
                        },
                        () => {
                            this.cerrarDialog(),
                                this.ItemEstudiante.Cedula = '',
                                this.$alertify.error('Cancelado')
                        }
                    );
                }
            } else {
                this.ItemEstudiante.Cedula = '';
                this.$alertify.error('La cédula no es válida');
            }
        },

        validarCedula(cedula) {
            const digitos = cedula.substring(0, 9);
            // Obtener el décimo dígito (dígito verificador)
            const verificador = parseInt(cedula.charAt(9));
            // Calcular el dígito verificador esperado
            let suma = 0;
            for (let i = 0; i < 9; i++) {
                let digito = parseInt(digitos.charAt(i));
                if (i % 2 === 0) {
                    digito *= 2;
                    if (digito > 9) {
                        digito -= 9;
                    }
                }
                suma += digito;
            }
            const residuo = suma % 10;
            const digitoEsperado = residuo === 0 ? 0 : 10 - residuo;
            // Comparar el dígito verificador calculado con el proporcionado
            return digitoEsperado === verificador;
        },

        controlCedula() {
            let res = this.validarCedula(this.ItemEstudiante.Cedula)
            if (res) {
                console.log("La cédula es válida.");
            } else {
                console.log("La cédula no es válida.");
            }
        },


    },

    components: {
        progres,
    },

    computed: {
        ...mapGetters('Carreras', ['getCarreras']),
        ...mapGetters('Plantillas', ['getPlantillas', 'getItemsPlantillas']),
        ...mapState('Dialogo', ['itemsBread', 'dailogCrearEst']),
        ...mapState('Carreras', ['idCarreraSelect']),
        ...mapState('Server_Carpetas', ['rutaAnterior']),
        ...mapGetters("SubSubItems", ["getSubSubItems"]),
    },
}
</script>       