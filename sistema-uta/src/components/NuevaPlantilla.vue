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
                                <v-text-field label="Nombre Plantilla*" :rules="controles().controlNom"
                                    v-model="ItemPlantilla.nomPlan" required></v-text-field>
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
            auxArray: [],
        }
    },


    methods: {
        ...mapMutations('Dialogo', ['setDialogPlantilla']),
        ...mapActions('Plantillas', ['AgregarPlantilla', 'AgregarMasItemsDirectorios', 'AgregarItemsSubDirectorios', 'AgregarItemsDirectorios', 'cargarPlantillas', 'AgregarItemsPalntilla', 'cargarItemsPlantillasTiene']),
        ...mapActions('SubCarpetas', ['actualizarSubCapeta']),


        controles() {
            return {
                controlNom: [
                    value => {
                        if (value) return true
                        return 'Ingrese un nombre'
                    },
                ],
                controlItem: [
                    value => {
                        if (value) return true
                        return 'Ingrese un nombre para agregar a la lista'
                    },
                ],
            }
        },

        agregar: async function () {
            try {
                if (this.ItemPlantilla.nomPlan !== "" || this.ItemPlantilla.items > 0) {
                    await Promise.all([
                        this.AgregarPlantilla(this.ItemPlantilla),
                        this.AgregarItemsPalntilla(this.ItemPlantilla),
                        this.AgregarItemsSubDirectorios(this.ItemPlantilla)
                    ]);
                    if (this.ItemPlantilla.idPlan > 0) {
                        let aux = this.obtenerNoRepetidos(this.auxArray);
                        await this.AgregarMasItemsDirectorios({ datos: aux, idPlan: this.ItemPlantilla.idPlan });
                    } else {
                        await this.AgregarItemsDirectorios({ datos: this.ItemPlantilla, idPlan: this.ItemPlantilla.idPlan });
                    }
                    await this.cargarPlantillas();
                    this.$alertify.success(this.ItemPlantilla.idPlan === 0 ? "Plantilla creada" : "Plantilla Actualizada");
                    this.cerrarDialog();
                } else {
                    this.$alertify.error("No existen datos");
                }
            } catch (error) {
                console.error('Error:', error);
                this.$alertify.error("Ocurrió un error al procesar la solicitud agregar Plantilla " + error);
            }
        },


        cerrarDialog() {
            this.setDialogPlantilla(false);
        },

        agrgarItem: async function () {
            try {
                if (this.ItemPlantilla.idPlan > 0) {
                    await this.cargarItemsPlantillasTiene({ idPlan: this.ItemPlantilla.idPlan });
                }
                // Comprobar si el valor en el campo de texto ha sido modificado
                if (this.aux != this.item) {
                    if (this.ItemPlantilla.idPlan > 0) {
                        await this.actualizarSubCapeta({ nomItem: this.aux, nuevoItem: this.item });
                    }
                    // Buscar y eliminar el valor antiguo en la lista de items
                    const foundItemIndex = this.ItemPlantilla.items.indexOf(this.aux);
                    if (foundItemIndex !== -1) {
                        this.ItemPlantilla.items.splice(foundItemIndex, 1);
                    }
                    // Agregar el valor modificado a la lista de items
                    this.ItemPlantilla.items.push(this.item);
                }
                if (this.ItemPlantilla.idPlan > 0) {
                    const currentItem = this.item;
                    if (this.getItemsPlantillasTiene.some(({ NomItem }) => NomItem.toLowerCase() != currentItem.toLowerCase())) {
                        this.auxArray.push(currentItem);
                    }
                }
                this.item = '';
            } catch (error) {
                this.$alertify.error("Error al realizar la operación agregar Plantilla " + error);
            }
        },

        obtenerNoRepetidos(arr) {
            let nuevoArray = [];
            const contador = {};
            for ( const valor of arr) {
                contador[valor] = (contador[valor] || 0) + 1;
            }
            for ( const aux in contador) {
                if (contador[aux] <= 1) {
                    nuevoArray.push(aux);
                }
            }
            return nuevoArray;
        },

        cambiarValor() {
            this.item = this.auxItem;
            this.aux = this.auxItem;
        },
    },

    computed: {
        ...mapGetters('Plantillas', ['getItemsPlantillasTiene']),
    }

}
</script>
<style lang="">
    
</style>