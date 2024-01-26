<template>
    <v-row justify="center">
        <div>
            <progres :dialog="dailogSubirArch" :message="sms"></progres>    
        </div>
        <v-dialog v-model="dialog" persistent width="600">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Subir Archivo</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <input ref="fileInput" type="file" @change="handleFileChange" />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="Observación" v-model="obsAux"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="cerrarDialog">
                        Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="agregar">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations} from 'vuex';
import progres from './progresCircular.vue';
export default {

    name: "nuevo",

    props: {
        dialog: Boolean,
    },

    data() {
        return {
            ItemArchivo: {},
            selectedFile: null,
            obsAux: '',
            sms:'Subiendo archivo...',
            path: '',
        }
    },

    created() {
        //this.subirObsArchivo();
    },

    methods: {

        ...mapActions('Server_Archivos', ['crearArchivos', 'crearObsArchivos']),
        ...mapActions('Server_Carpetas', ['cargarCarpetas']),
        ...mapMutations('Dialogo', ['setDailogSubirArch']),

        agregar: async function () {
            this.setDailogSubirArch(true);
            try {
                this.rutaNueva();
                await Promise.all([
                    this.crearArchivos({ ruta: this.path, archivo: this.selectedFile }),
                    this.crearObsArchivos({ ruta: this.path + this.selectedFile.name, observacion: this.obsAux, idEstPer: this.idEst })
                ]);
                await this.cargarCarpetas(this.path),
                this.$alertify.success("Archivo Insertado");
                this.cerrarDialog();
                this.path = '';
            } catch (error) {
                this.$alertify.success("Error al internar insertar un archivo " + error);
            }
            this.setDailogSubirArch(false);
        },

        cerrarDialog() {
            this.$emit('dialog', false);
        },

        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
            if (this.selectedFile) {
                const rutaArchivo = this.selectedFile;
                //console.log('Ruta: ', rutaArchivo);
            }
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
        progres,
    },

    computed: {
        ...mapState('Dialogo', ['itemsBread','dailogSubirArch']),
        ...mapState('Server_Carpetas', ['rutaAnterior']),
        ...mapState('Estudiantes', ['dataEst', 'idEst']),
    },
}
</script>       