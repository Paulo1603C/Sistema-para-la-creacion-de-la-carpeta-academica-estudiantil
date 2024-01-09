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
                                <v-text-field label="Nombre Plantilla*" v-model="ItemPlantilla.nomPlan" :counter="10"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-input>
                                    <v-text-field label="Nombre Subcarpeta*" v-model="item" required ></v-text-field>
                                    <v-tooltip bottom style="margin-right: 100px;">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="black darken-2" size="30" @click.stop="agrgarItem()"
                                                v-bind="attrs" v-on="on">
                                                mdi-plus-thick
                                            </v-icon>
                                        </template>
                                        <span>Agregar</span>
                                    </v-tooltip>
                                </v-input>
                            </v-col>
                            <v-col cols="12">
                                <v-select :items="ItemPlantilla.items" label="Subcarpetas agregadas" v-model="auxItem"
                                @change="cambiarValor()"   required></v-select>
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
    name: "NuevaPlantilla",

    props: {
        dialog: Boolean,
        ItemPlantilla: {},
    },

    data() {
        return {
            item: '',
            auxItem:'',
            aux:'',
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDialogPlantilla']),
        ...mapActions('Plantillas', ['AgregarPlantilla','AgregarItemsPlantilla']),

        agregar: async function() {
            await this.AgregarPlantilla( this.ItemPlantilla );
            await this.AgregarItemsPlantilla( this.ItemPlantilla );
            this.$alertify.success(this.ItemPlantilla.idPlan == 0 ? "Plantilla creada" : "Plantilla Actualizada");
            this.cerrarDialog();
        },

        cerrarDialog() {
            this.setDialogPlantilla(false);
        },

        agrgarItem() {
            const foundItem = this.ItemPlantilla.items.indexOf( this.aux );
            if( foundItem > 0){
                this.ItemPlantilla.items.splice(foundItem,1);
                this.ItemPlantilla.items.push(this.item);
            }else{
                this.ItemPlantilla.items.push(this.item);
            }
            console.log(this.ItemPlantilla.items);
            this.item = '';
        },

        cambiarValor(){
            this.item = this.auxItem;
            this.aux = this.auxItem;
        },
    },

}
</script>
<style lang="">
    
</style>