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
                            <v-col cols="12" >
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
        ...mapActions('Server_Carpetas', ['crearCarpeta','cargarCarpetas']),
        ...mapMutations('Dialogo', ['setDialogCarpeta']),

        agregar: async function () {
            try {
                this.rutaNueva();
                await this.crearCarpeta({datos:this.ItemCarpeta, path:this.path, oldPath:this.rutaAnterior });
                //console.log(this.path);
                this.$alertify.success(this.ItemCarpeta.IdEst == 0 ? "Carpeta creada" : "Carpeta Actualizada");
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
            this.setDialogCarpeta(false);
        },

    },
    computed: {
        ...mapState('Dialogo', ['itemsBread']),
        ...mapState('Server_Carpetas', ['rutaAnterior']),
    },
}
</script>       