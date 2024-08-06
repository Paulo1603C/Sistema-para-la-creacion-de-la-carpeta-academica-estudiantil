<template>
  <v-row justify="center">
      <div>
          <progres :dialog="dailogSubirArch" :message="sms"></progres>    
      </div>
      <v-dialog v-model="dialog" persistent width="600">
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
                            <v-menu
                              v-model="menu"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              min-width="290"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <div class="d-flex align-center">
                                  <v-text-field
                                    label="Fecha"
                                    v-model="obsAux"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    class="flex-grow-1"
                                  ></v-text-field>
                                  <v-btn
                                    icon
                                    @click.stop="menu = !menu"
                                  >
                                    <v-icon>mdi-calendar</v-icon>
                                  </v-btn>
                                </div>
                              </template>
                              <v-date-picker
                                v-model="obsAux"
                                @input="menu = false"
                              ></v-date-picker>
                            </v-menu>
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
      datos:{},
  },
  data() {
      return {
          ItemArchivo: {},
          selectedFiles: [], // Almacena múltiples archivos
          obsAux: '',
          menu: false,
          sms: 'Subiendo archivo...',
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
      ...mapActions('Estudiantes', ['actaulizarFecha','cargarEstudiantes']),

      toggleMenu(event) {
        event.stopPropagation(); // Asegúrate de que el click no se propague
        this.menu = !this.menu;
      },
      
      agregar: async function () {
          this.setDailogSubirArch(true);
          try {
              if( this.selectedFiles.length>0 && this.obsAux!='' ){
                const rutaNueva = `CARRERAS/${this.datos.ruta}/${this.datos.nombre.toUpperCase()} ${this.datos.apellido.toUpperCase()}/TITULACION/`;
                //console.log(rutaNueva);
                // Subir cada archivo con su observación
                await Promise.all(this.selectedFiles.map(file => {
                    return Promise.all([
                        this.crearArchivos({ ruta: rutaNueva, archivo: file }),
                        this.actaulizarFecha({id:this.datos.id, fecha:this.obsAux}),
                        this.cargarEstudiantes({ idCar: this.idCarreraSelect, idUser: this.datos.id }),
                    ]);
                }));

                //await this.cargarCarpetas(this.path);
                this.$alertify.success("Archivos Insertados");
                this.cerrarDialog();
                this.path = '';
                this.selectedFiles = []; 
                this.obsAux = "";
              }else{
                this.$alertify.error("Complete los campos");
              }
          } catch (error) {
              this.$alertify.error("Error al intentar insertar archivos " + error);
          }
          this.setDailogSubirArch(false);
      },

      cerrarDialog() {
          this.$emit('dialog', false);
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
      ...mapState('Carreras', ['idCarreraSelect']),
  },
}
</script>
