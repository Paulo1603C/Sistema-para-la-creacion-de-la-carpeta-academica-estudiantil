<template>
    <v-dialog v-model="localDialog" max-width="600px">
        <v-card>
            <v-card-title class="headline">Mensaje</v-card-title>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="data"
                    class="elevation-1"
                ></v-data-table>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDialog">Aceptar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        dialog: Boolean,
        data: Array
    },
    data() {
        return {
            headers: [
                { text: 'ID Sub Item', value: 'idSubSubItem' },
                { text: 'Nombre Sub Item', value: 'NomSubSubItem' },
                { text: 'ID Plantilla', value: 'Id_item_plantilla_per' }
            ]
        };
    },
    computed: {
        ...mapGetters('Server_Archivos', ['getObs']),
        getObsText() {
            // Convierte el objeto JSON a cadena de texto
            return JSON.stringify(this.getObs, null, 2);
        },
        localDialog: {
            get() {
                return this.dialog;
            },
            set(value) {
                this.$emit('update:dialog', value);
            }
        }
    },
    methods: {
        closeDialog() {
            this.localDialog = false;
        }
    }
};
</script>

<style scoped>
/* Agrega estilos según sea necesario */
</style>
