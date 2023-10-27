<template>
    <v-row justify="center">
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
                                <v-text-field label="Observación" v-model="Item.observacion"></v-text-field>
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
import { mapActions } from 'vuex';

export default {

    name: "nuevo",

    props: {
        dialog: Boolean,
        Item: {},
    },

    data: () => ({
        selectedFile:null,
    }),

    methods: {

        ...mapActions('clientes', ['AgregarUsuario']),

        agregar() {
            console.log("Datos Item",this.selectedFile);
            //this.AgregarUsuario(this.Item);
            //this.$alertify.success(this.Item.id == 0 ? "Usuario Insertado" : "Usuario Actualizado");
            this.cerrarDialog();
        },

        cerrarDialog() {
            this.$emit('dialog', false);
        },

        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
            if (this.selectedFile) {
                this.selectedFile = this.selectedFile;
            }
        },

    },
}
</script>       