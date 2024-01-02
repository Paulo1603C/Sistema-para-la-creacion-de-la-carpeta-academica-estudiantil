<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="400">
            <v-card>
                <v-card-title>
                    <span v-if="ItemPlantilla.idPlan == 0" class="text-h5">Nueva Plantilla</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Nombre Plantilla*" v-model="ItemPlantilla.nomPlan" :counter="10" required></v-text-field>
                            </v-col>
                            <v-col cols="12" >
                                <v-text-field label="Items*" v-model="ItemPlantilla.items"  required></v-text-field>
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
    name:"NuevaPlantilla",

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