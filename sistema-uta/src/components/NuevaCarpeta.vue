<template>
    <v-row justify="center">
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
                                <v-text-field label="Nombre*" v-model="ItemCarpeta.NomEst" required></v-text-field>
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
        ItemCarpeta: {},
    },

    data: () => ({
        path: '',
    }),

    created() {
    },

    methods: {
        ...mapActions('Server_Carpetas', ['crearCarpeta', 'cargarCarpetas', 'crearSubCarpeta']),
        ...mapMutations('Dialogo', ['setDialogCarpeta']),
        ...mapActions('Plantillas', ['AgregarItemsSubDirectorios', 'AgregarItemsDirectorios']),

        agregar: async function () {
            try {
                this.rutaNueva();
                console.log(this.ItemCarpeta.NomEst);
                this.insertarItemSubCarpta(this.ItemCarpeta.NomEst);
                this.crearSubDirectorios(this.path, this.ItemCarpeta.NomEst);
                //await this.crearCarpeta({ datos: this.ItemCarpeta, path: this.path, oldPath: this.rutaAnterior });
                this.$alertify.success(this.ItemCarpeta.IdEst == 0 ? "Carpeta creada" : "Carpeta Actualizada");
                this.cerrarDialog();
                this.path = '';
            } catch (error) {
                console.error('Error al agregar estudiante:', error);
            }
        },

        insertarItemSubCarpta: async function (nombre) {
            const ItemsSubDir = {
                idPlan: 0,
                items: [nombre],
            };
            await this.AgregarItemsSubDirectorios(ItemsSubDir);
            await this.AgregarItemsDirectorios({ datos: ItemsSubDir, idPlan: this.idEstPlan });
        },

        //este metodo creara el subdirectior  nuevo en todos los estudiante que tengan la misma plantilla
        crearSubDirectorios: async function (ruta, nomSub) {
            for (let i = 0; i < this.getEstudinates_Plantillas.length; i++) {
                const row = (this.getEstudinates_Plantillas[i]);
                let partes = ruta.split('/').filter(Boolean);
                partes.pop();
                let nuevaCadena = partes.join('/');
                let partes2 = nuevaCadena.split('/').filter(Boolean);
                partes2.pop();
                let nuevaCadena2 = partes2.join('/');
                //console.log(nuevaCadena2 +"/"+ row.NomCar+ "/"+ row.NomEst + " " + row.ApeEst+"/"+nomSub);
                await this.crearSubCarpeta({ datos: row, path: nuevaCadena2+"/"+row.NomCar+ "/", nombre: nomSub });
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

    },
    computed: {
        ...mapState('Dialogo', ['itemsBread']),
        ...mapState('Server_Carpetas', ['rutaAnterior']),
        ...mapState('Plantillas', ['idEstPlan']),
        ...mapGetters('Plantillas', ['getEstudinates_Plantillas']),
    },
}
</script>       