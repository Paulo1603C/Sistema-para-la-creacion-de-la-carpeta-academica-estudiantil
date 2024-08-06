<template>
    <v-row justify="center">
      <div>
        <progres :dialog="dailogSubirArch" :message="sms"></progres>
      </div>
      <v-dialog v-model="internalDialog" persistent width="600">
        <v-card>
          <v-card-title>
            <span class="text-h5">Subir Archivos</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <input ref="fileInput" type="file" @change="handleFileChange" multiple />
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
  import { mapActions, mapMutations, mapState } from 'vuex';
  import progres from './progresCircular.vue';
  
  export default {
    name: "nuevo",
    props: {
      dialog: Boolean,
      datos:{}
    },
    data() {
      return {
        internalDialog: this.dialog,
        ItemArchivo: {},
        selectedFiles: [],
        obsAux: '',
        sms: 'Subiendo archivo...',
        path: '',
      };
    },
    watch: {
      dialog(val) {
        this.internalDialog = val;
      },
      internalDialog(val) {
        this.$emit('update:dialog', val);
        if (!val) {
          this.$emit('close-modal');
        }
      },
    },
    methods: {
      ...mapActions('Server_Archivos', ['crearArchivos', 'crearObsArchivos']),
      ...mapActions('Server_Carpetas', ['cargarCarpetas']),
      ...mapMutations('Dialogo', ['setDailogSubirArch']),
      agregar: async function () {
        this.setDailogSubirArch(true);
        try {
          this.rutaNueva();
          if (this.selectedFiles.length > 0) {
            await Promise.all(this.selectedFiles.map(file => {
              return Promise.all([
                this.crearArchivos({ ruta: this.path, archivo: file }),
                this.crearObsArchivos({ ruta: this.path + file.name, observacion: this.obsAux, idEst: this.idEst })
              ]);
            }));
            await this.cargarCarpetas(this.path);
            this.$alertify.success("Archivos Insertados");
            this.cerrarDialog();
            this.path = '';
            this.selectedFiles = [];
            this.obsAux = "";
          } else {
            this.$alertify.error('Asegurese de seleccionar un archivo almenos');
          }
        } catch (error) {
          this.$alertify.success("Error al intentar insertar archivos " + error);
        }
        this.setDailogSubirArch(false);
      },
      cerrarDialog() {
        this.internalDialog = false;
      },
      handleFileChange(event) {
        this.selectedFiles = Array.from(event.target.files);
      },
      rutaNueva() {
        this.path = '';
        for (let i = 0; i < this.itemsBread.length; i++) {
          this.path += this.itemsBread[i] + "/";
        }
      },
    },
    components: {
      progres,
    },
    computed: {
      ...mapState('Dialogo', ['itemsBread', 'dailogSubirArch']),
      ...mapState('Server_Carpetas', ['rutaAnterior']),
      ...mapState('Estudiantes', ['dataEst', 'idEst']),
    },
  };
  </script>
  