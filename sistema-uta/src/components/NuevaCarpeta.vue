<template>
    <v-row justify="center">
        <progres2 :dialog="dailogCarpetas" :message="sms2"></progres2>
        <v-dialog v-model="dialog" persistent width="400">
            <v-card>
                <v-card-title>
                    <span v-if="ItemCarpeta.IdEst == 0" class="text-h5">Nueva Carpeta</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Nombre*" :rules="controles().controlNom" v-model="ItemCarpeta.NomEst"
                                    required></v-text-field>
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
import progres2 from './progresCircular.vue';
export default {

    name: "nuevo",

    props: {
        dialog: Boolean,
        ItemCarpeta: {},
    },

    data: () => ({
        path: '',
        sms2: 'Creando carpetas...',
        permisosDirectorios: new Map(),
    }),

    created() {
    },

    methods: {
        ...mapActions('Server_Carpetas', ['crearCarpeta', 'cargarCarpetas', 'crearSubCarpeta']),
        ...mapMutations('Dialogo', ['setDialogCarpeta', 'setDailogCarpetas']),
        ...mapActions('Plantillas', ['AgregarItemsSubDirectorios', 'AgregarItemsDirectorios']),
        ...mapActions('Carreras', ['cargarCarreras']),
        ...mapActions('Permisos', ['AgregarUsuarioPermisosCarpeta', 'cargarPermisosDirectorios']),
        ...mapActions('SubCarpetas', ['cargarSubCarpetas']),

        controles() {
            return {
                controlNom: [
                    value => {
                        if (value) return true
                        return 'Ingrese un nombre'
                    },
                ],
            }
        },

        agregar: async function () {
            try {
                if (this.ItemCarpeta.NomEst != "") {
                    this.rutaNueva();
                    if (this.ItemCarpeta.IdEst == 0) {
                        //dependiendo la ruta se creara la carpeta
                        let partes = this.path.split('/').filter(Boolean);
                        let ultimoValor = partes[partes.length - 2]
                        //si igual a uno de los padres se crear subcarpetas, caso contrario es padre
                        if (this.getCarreras.some(({ NomCar }) => NomCar.toLowerCase() === ultimoValor.toLowerCase())) {
                            //console.log("PADRE "+ultimoValor);
                            await this.insertarItemSubCarpta(this.ItemCarpeta.NomEst);
                            await this.crearSubDirectorios(this.path, this.ItemCarpeta.NomEst);
                            await this.agregarPermisos(this.ItemCarpeta.NomEst);
                            await this.cargarSubCarpetas();
                            this.obtenerPermisosDirectorios();
                        } else {
                            //console.log("HIJA "+ultimoValor);
                            await this.crearCarpeta({ datos: this.ItemCarpeta, path: this.path, oldPath: this.rutaAnterior });
                        }
                        this.$alertify.success(this.ItemCarpeta.IdEst == 0 ? "Carpeta creada" : "Carpeta Actualizada");
                    } else {
                        if (this.ctlSubirArch == true || this.ctlfolder == true) {
                            await this.crearCarpeta({ datos: this.ItemCarpeta, path: this.path, oldPath: this.rutaAnterior });
                            this.$alertify.success(this.ItemCarpeta.IdEst == 0 ? "Carpeta creada" : "Archivo Actualizado");
                        } else {
                            this.$alertify.error("NO PUEDES CAMBIAR LOS NOMBRES DE ESTAS CARPETAS");
                        }
                    }
                    await this.cargarCarpetas(this.path);
                    this.cerrarDialog();
                    this.path = '';
                } else {
                    this.$alertify.error("Complete todos campos para llevar acabo el proceso");
                }
            } catch (error) {
                console.error('Error al agregar estudiante:', error);
                this.$alertify.error("Error al realizar la operación "+error);
            }
        },

        agregarPermisos: async function (nomCar) {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const idUser = storedUser.IdUser;
                let permisos = {
                    IdUserPer: idUser,
                    IdPerPer: 1,
                    IdItemSubPer: nomCar,
                };
                let res = await this.AgregarUsuarioPermisosCarpeta(permisos);
                return res ? this.$alertify.success("Permiso insertado") : this.$alertify.error("No se pudo insetar el permiso");
            } catch (error) {
                this.$alertify.error("Error al realizar la operación " + error);
            }
        },

        insertarItemSubCarpta: async function (nombre) {
            try {
                const ItemsSubDir = {
                    idPlan: 0,
                    items: [nombre],
                };
                await this.AgregarItemsSubDirectorios(ItemsSubDir);
            } catch (error) {
                this.$alertify.error("Error al realizar la operación " + error);
            }
        },

        //este metodo creara el subdirectior  nuevo en todos los estudiante que tengan la misma plantilla
        crearSubDirectorios: async function (ruta, nomSub) {
            try {
                this.setDailogCarpetas(true);
                for (let i = 0; i < this.getEstudinates_Plantillas.length; i++) {
                    const row = (this.getEstudinates_Plantillas[i]);
                    let partes = ruta.split('/').filter(Boolean);
                    partes.pop();
                    let nuevaCadena = partes.join('/');
                    let partes2 = nuevaCadena.split('/').filter(Boolean);
                    partes2.pop();
                    let nuevaCadena2 = partes2.join('/');
                    //console.log(nuevaCadena2 +"/"+ row.NomCar+ "/"+ row.NomEst + " " + row.ApeEst+"/"+nomSub);
                    await this.crearSubCarpeta({ datos: row, path: nuevaCadena2 + "/" + row.NomCar + "/", nombre: nomSub });
                }
                this.setDailogCarpetas(false);
            } catch (error) {
                this.$alertify.error("Error al realizar la operación " + error);
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
            this.setDialogCarpeta(false);
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
                console.log(this.permisosDirectorios);
            } catch (error) {
                console.error('Error al obtener permisos de directorios:', error);
                throw error; // Re-lanza el error para que pueda ser manejado externamente si es necesario.
            }
        },

    },

    components: {
        progres2,
    },

    computed: {
        ...mapState('Dialogo', ['itemsBread', 'ctlSubirArch', 'ctlfolder', 'dailogCarpetas']),
        ...mapState('Server_Carpetas', ['rutaAnterior']),
        ...mapState('Plantillas', ['idEstPlan']),
        ...mapGetters('Plantillas', ['getEstudinates_Plantillas']),
        ...mapGetters('SubCarpetas', ['getSubCarpetas']),
        ...mapGetters('Carreras', ['getCarreras']),
        ...mapGetters('Permisos', ['getPermisosDirectorios']),
    },
}
</script>       