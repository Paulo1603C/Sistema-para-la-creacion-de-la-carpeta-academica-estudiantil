<template>
    <div>
        <template>
            <v-card v-show="show">
                <v-card-title>
                    {{ Titulo }}
                    <!--<v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                    </v-text-field>-->
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table dense :headers="Cabecera" :items="Items" :items-per-page="5">
                    <template v-slot:item="{ item }">
                        <tr @click="abrirVentana(item)" class="myStyle">
                            <td class="linea"><v-icon class="mr-3" color="yellow darken-1">mdi-folder</v-icon>{{ item.NomEst
                            }} {{ item.ApeEst }}</td>
                            <td>{{ item.nomCar }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card>

        </template>
    </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex';

export default {
    name: "Carreras",

    props: ['show', 'Titulo', 'Cabecera', 'Items'],

    data() {
        return {
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setVentanaCarreras', 'setVentanaEst', 'setBreadcrumbs']),
        ...mapMutations('Carreras', ['setCarreraSelect']),
        ...mapActions('Estudiantes', ['cargarEstudiantes']),

        abrirVentana(item) {
            //console.log(item.idCar);
            this.setBreadcrumbs(item.nomCar);
            const storedUser = JSON.parse(localStorage.getItem('user'));
            //console.log(storedUser.IdUser);
            this.cargarEstudiantes({ idCar: item.idCar, idUser: storedUser.IdUser });
            this.setCarreraSelect(item.nomCar);
            this.setVentanaCarreras(false);
            this.setVentanaEst(true);

        }
    },
}
</script>

