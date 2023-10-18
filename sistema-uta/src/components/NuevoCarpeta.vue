<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="400">
            <v-card>
                <v-card-title>
                    <span v-if="Item.id == 0"  class="text-h5">Carpeta Nueva</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" >
                                <v-text-field label="Nombre*" v-model="Item.nombre"  required></v-text-field>
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
import { mapActions } from 'vuex';

export default {

    name: "nuevo",

    props:{
        dialog:Boolean,
        Item:{},
    },

    data: () => ({
    }),

    methods:{

        ...mapActions('clientes', ['AgregarUsuario']),
        
        agregar(){
            console.log("Datos Item");
            console.log(this.Item);
            this.AgregarUsuario(this.Item);
            this.$alertify.success( this.Item.id == 0 ? "Usuario Insertado" : "Usuario Actualizado" );
            this.cerrarDialog();
        },
        
        cerrarDialog(){
            this.$emit('dialog',false);
        },
            
    },
}
</script>       