<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent width="400">
            <v-card>
                <v-card-title>
                    <span v-if="ItemCarrera.idCar == 0" class="text-h5">Nueva Carpeta</span>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Nombre*" :rules="controles().controlNom" v-model="ItemCarrera.nomCar"
                                    required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" variant="text" @click="cerrarDialog()">
                        Close
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="agregar()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex';
export default {

    name: 'NuevaCarrera',

    props: {
        dialog: Boolean,
        ItemCarrera: {},
    },


    methods: {
        ...mapMutations('Dialogo', ['setDialogCarreras']),
        ...mapActions('Carreras', ['agregarCarrera', 'crearCarpetaCarrera']),

        controles() {
            return {
                controlNom: [
                    value => {
                        if (!value) return 'Ingrese un nombre';
                        const soloLetras = /^[a-zA-Z\s]+$/;
                        return soloLetras.test(value) || 'Ingrese solo letras';
                    }
                ],
            }
        },

        agregar: async function () {

            try {
                if (this.ItemCarrera.nomCar != '') {
                    let insertSer = await this.crearCarpetaCarrera({ path: this.itemsBread[0], datos: this.ItemCarrera, oldPath: this.rutaAnterior });
                    if (insertSer) {
                        await this.agregarCarrera(this.ItemCarrera);
                        this.$alertify.success(`Carrera ${this.ItemCarrera.nomCar} insertada`);
                    } else {
                        this.$alertify.error(`No se pudo insertar la carrera ${this.ItemCarrera.nomCar}`);
                    }
                    this.cerrarDialog();
                } else {
                    this.$alertify.error("Complete los campos para continuar");
                }
            } catch (error) {
                console.error('Error al agregar carrera:', error);
                this.$alertify.error("Error al realizar la operación " + error);
            }

        },

        cerrarDialog() {
            this.setDialogCarreras(false);
        },
    },

    computed: {
        ...mapGetters('Carreras', ['getSmsCar']),
        ...mapState('Server_Carpetas', ['rutaAnterior']),
        ...mapState('Dialogo', ['itemsBread']),
    }

}
</script>
<style lang="">
    
</style>