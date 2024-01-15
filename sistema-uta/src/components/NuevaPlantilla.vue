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
                                <v-text-field label="Nombre Plantilla*" v-model="ItemPlantilla.nomPlan"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-input>
                                    <v-text-field label="Nombre Subcarpeta*" v-model="item" required></v-text-field>
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
                                <label>Subcarpetas creadas</label>
                                <v-select :items="ItemPlantilla.items" label="Subcarpetas" v-model="auxItem"
                                    @change="cambiarValor()" required></v-select>
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
            auxItem: '',
            aux: '',
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDialogPlantilla']),
        ...mapActions('Plantillas', ['AgregarPlantilla', 'AgregarItemsSubDirectorios', 'AgregarItemsDirectorios']),
        ...mapActions('SubCarpetas', ['actualizarSubCapeta']),

        agregar: async function () {
            console.log(this.ItemPlantilla);
            await this.AgregarPlantilla(this.ItemPlantilla);
            await this.AgregarItemsSubDirectorios(this.ItemPlantilla);
            await this.AgregarItemsDirectorios({ datos: this.ItemPlantilla, idPlan: '' });
            this.$alertify.success(this.ItemPlantilla.idPlan == 0 ? "Plantilla creada" : "Plantilla Actualizada");
            this.cerrarDialog();
        },

        cerrarDialog() {
            this.setDialogPlantilla(false);
        },

        agrgarItem:async function() {
            // Comprobar si el valor en el campo de texto ha sido modificado
            if (this.aux != this.item) {
                if(this.ItemPlantilla.idPlan != 0){
                    console.log("actualizar valor en base de datos");
                    await this.actualizarSubCapeta({  nomItem:this.aux, nuevoItem:this.item });
                }
                // Buscar y eliminar el valor antiguo en la lista de items
                const foundItemIndex = this.ItemPlantilla.items.indexOf(this.aux);
                if (foundItemIndex !== -1) {
                    this.ItemPlantilla.items.splice(foundItemIndex, 1);
                }
                // Agregar el valor modificado a la lista de items
                this.ItemPlantilla.items.push(this.item);
            }
            console.log(this.ItemPlantilla.items);
            this.item = ''; // Limpiar el campo de texto después de agregar
        },

        cambiarValor() {
            this.item = this.auxItem;
            this.aux = this.auxItem;
        },
    },

}
</script>
<style lang="">
    
</style>