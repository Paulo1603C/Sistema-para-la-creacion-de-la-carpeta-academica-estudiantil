<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="400">
            <v-card>
                <v-card-title>
                    <span v-if="ItemCarpeta.IdEst == 0" class="text-h5">Estudiante Nuevo</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" >
                                <v-text-field label="Cedula*" v-model="ItemCarpeta.Cedula" :counter="10" required></v-text-field>
                            </v-col>
                            <v-col cols="12"  sm="6" md="6" >
                                <v-text-field label="Nombre*" v-model="ItemCarpeta.NomEst"  required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Apellido*" v-model="ItemCarpeta.ApeEst"  required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" style="display: none">
                                <v-text-field label="Apellido*" v-model="ItemCarpeta.Fecha"  required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select :items="getCarreras" item-text="NomCar" item-value="IdCar" label="Carreras*"
                                   v-model="ItemCarpeta.NomCar" required></v-select>
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

    name: "nuevo",

    props:{
        dialog:Boolean,
        ItemCarpeta:{},
    },

    data: () => ({
        
    }),

    created(){
        this.cargarCarreras();
    },

    methods:{
        ...mapActions('Carreras', ['cargarCarreras']),
        ...mapActions('Estudiantes', ['AgregarEstudiante']),
        ...mapMutations('Dialogo',['setDialogFolder']),
        
        agregar(){
            //console.log("Datos Item");
            //console.log(this.ItemCarpeta);
            this.AgregarEstudiante(this.ItemCarpeta);
            this.$alertify.success( this.ItemCarpeta.IdEst == 0 ? "Usuario Insertado" : "Usuario Actualizado" );
            this.cerrarDialog();
        },
        
        cerrarDialog(){
            this.setDialogFolder(false);
        },
            
    },
    computed: {
        ...mapGetters('Carreras', ['getCarreras']),
    },
}
</script>       