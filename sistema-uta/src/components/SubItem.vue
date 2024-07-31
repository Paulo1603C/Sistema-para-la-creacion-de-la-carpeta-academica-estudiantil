<template>
    <v-row justify="center">
        <progres3 :dialog="dailogPlantillaProgress" :message="sms"></progres3>
        <v-dialog v-model="dialog" persistent width="400">
            <v-card>
                <v-card-title>
                    <span v-if="ItemPlantilla.idPlan === 0" class="text-h5">Nuevo SubItem</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field 
                                    label="Nombre Directorio*"
                                    :disabled="true" 
                                    :rules="controles().controlNom" 
                                    v-model="ItemPlantilla.nomPlan" 
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-input>
                                    <v-text-field 
                                        label="Nombre Subcarpeta*" 
                                        :rules="controles().controlItem" 
                                        v-model="item" 
                                        required
                                    ></v-text-field>
                                    <v-tooltip bottom style="margin-right: 100px;">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon 
                                                color="black darken-2" 
                                                size="30" 
                                                @click.stop="agregarItem" 
                                                v-bind="attrs" 
                                                v-on="on"
                                            >
                                                mdi-plus-thick
                                            </v-icon>
                                        </template>
                                        <span>Agregar</span>
                                    </v-tooltip>
                                </v-input>
                            </v-col>
                            <v-col cols="12">
                                <label>Subcarpetas creadas</label>
                                <v-select 
                                    :items="subItems" 
                                    label="Subcarpetas" 
                                    v-model="auxItem" 
                                    @change="cambiarValor" 
                                    required
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" variant="text" @click="cerrarDialog">
                        Close
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="guardar">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import progres3 from './progresCircular.vue';

export default {
    name: "ModuloSubItems",

    props: {
        dialog: Boolean,
        ItemPlantilla: Object,
    },

    data() {
        return {
            sms: 'Guardando Datos...',
            subItems: [],
            item: '',
            aux: '',
            auxItem: '',
        };
    },

    components: {
        progres3,
    },

    methods: {
        ...mapMutations('Dialogo', ['setDialogPlantilla', 'setDailogPlantillaProgress']),
        ...mapActions('SubSubItems', ['insetarSubSubItem']),

        controles() {
            return {
                controlNom: [
                    value => {
                        if (!value) return 'Ingrese un nombre';
                        const soloLetras = /^[a-zA-Z\s]+$/;
                        return soloLetras.test(value) || 'Ingrese solo letras';
                    },
                ],
                controlItem: [
                    value => {
                        if (!value) return 'Ingrese un nombre'; // Asegurar que siempre devuelve algo
                        const soloLetras = /^[a-zA-Z\s]+$/;
                        return soloLetras.test(value) || 'Ingrese solo letras';
                    },
                ],
            };
        },

        //envia los datos al back
        guardar: async function() {
            // Implementación del método guardar
            console.log(this.subItems);
            if( this.subItems.length > 0 ){
                const answer = await this.insetarSubSubItem({subItems:this.subItems ,idItemPlan:this.ItemPlantilla.idPlan});
                if( answer === true || answer === 'true'){
                    this.$alertify.success("Items creados con éxito");
                }else{
                    this.$alertify.error("Error 500 el servidor respondio con FAILED");
                }
                this.subItems = [];
            }else{
                this.$alertify.error("Agrega items antes de guardar");
            }
        },

        agregarItem() {
            console.log('Agregar');
            let indice = this.subItems.indexOf(this.aux);
            if (indice !== -1) {
                this.subItems.splice(indice, 1);
            }
            this.subItems.push(this.item);
            this.item = '';
        },

        //ver items que tiene relacinados, carga de la BD
        verIem: async function(){

        },

        cambiarValor() {
            this.item = this.auxItem;
            this.aux = this.auxItem;
        },

        cerrarDialog() {
            this.$emit('update:dialog', false);
        },
    },

    computed: {
        ...mapState('Dialogo', ['dailogPlantillaProgress']),
    },
};
</script>

<style scoped>
/* Agrega tus estilos aquí */
</style>
