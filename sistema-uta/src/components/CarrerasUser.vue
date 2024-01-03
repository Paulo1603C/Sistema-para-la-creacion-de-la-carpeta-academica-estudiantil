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
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
    name: "Carreras",

    props: ['show', 'Titulo', 'Cabecera', 'Items'],

    data() {
        return {
            carrera:0,
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setVentanaCarreras', 'setVentanaEst', 'setBreadcrumbs']),
        ...mapMutations('Carreras', ['setCarreraSelect']),
        ...mapMutations('Carreras', ['setIdCarreraSelect']),
        ...mapActions('Estudiantes', ['cargarEstudiantes']),

        abrirVentana(item) {
            //console.log(item.idCar);
            this.setBreadcrumbs(item.nomCar);
            this.obtnerIdCarrera();
            const storedUser = JSON.parse(localStorage.getItem('user'));
            //console.log(storedUser.IdUser);
            console.log(this.carrera);
            this.cargarEstudiantes({ idCar: this.carrera, idUser: storedUser.IdUser });
            this.setCarreraSelect(item.nomCar);
            this.setVentanaCarreras(false);
            this.setVentanaEst(true);

        }, 

        obtnerIdCarrera(){
            switch (this.itemsBread[1]) {
                case 'Ingeniería Industrial':
                    this.carrera=1;
                    break;
                case 'Software':
                    this.carrera=2;
                    break;
                case 'TI':
                    this.carrera=3;
                    break;
                case 'Telecomunicaciones':
                    this.carrera=4;
                    break;
                case 'Automatización y robótica':
                    this.carrera=5;
                    break;
                default:
                    break;
            }
            this.setIdCarreraSelect(this.carrera);
        }
    },
    computed:{
        ...mapState('Dialogo', ['itemsBread']),
    }
}
</script>

