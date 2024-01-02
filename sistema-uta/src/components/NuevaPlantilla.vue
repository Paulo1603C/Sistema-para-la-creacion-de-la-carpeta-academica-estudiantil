<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="400">
            <v-card>
                <v-card-title>
                    <span v-if="ItemPlantilla.IdEst == 0" class="text-h5">Nueva Plantilla</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" >
                                <v-text-field label="Cedula*" v-model="ItemPlantilla.Cedula" :counter="10" required></v-text-field>
                            </v-col>
                            <v-col cols="12"  sm="6" md="6" >
                                <v-text-field label="Nombre*" v-model="ItemPlantilla.NomEst"  required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Apellido*" v-model="ItemPlantilla.ApeEst"  required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" style="display: none">
                                <v-text-field label="Apellido*" v-model="ItemPlantilla.Fecha"  required></v-text-field>
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
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    props: {
        dialog: Boolean,
        ItemPlantilla:{},
    },

    data(){
        return{

        }
    },

    methods:{
        ...mapMutations('Dialogo', ['setDialogPlantilla']),

        agregar(){

        },

        cerrarDialog() {
            this.setDialogPlantilla(false);
        },
    },
    
}
</script>
<style lang="">
    
</style>