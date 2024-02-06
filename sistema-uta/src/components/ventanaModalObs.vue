<template>
    <v-dialog v-model="dialog" width="400" persistent>
        <v-card>
            <v-card-title class="headline">
                Mensaje
            </v-card-title>
            <v-card-text>
                {{ mensaje }}
            </v-card-text>
            <v-card-text>
                {{ getObs.length > 0 ? getObs[0].Observacion : 'No tiene observacion para mosttar' }}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="cerrarDialog()">Aceptar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script>
import { mapGetters } from 'vuex';

export default {

    props: {
        dialog: Boolean,
    },

    data() {
        return {
            mensaje: '',
            dialogObs: false,
        };
    },
    methods: {
        cerrarDialog() {
            this.$emit('dialog', false);
        },


    },

    computed: {
        ...mapGetters('Server_Archivos', ['getObs']),
        getObsText() {
            // Convierte el objeto JSON a cadena de texto
            return JSON.stringify(this.getObs, null, 2);
        },
    }
};
</script>
  
<style scoped>
/* Agrega estilos según sea necesario */
</style>
  