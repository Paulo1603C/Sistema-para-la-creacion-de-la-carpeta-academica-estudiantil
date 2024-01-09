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
                            <td>
                                <v-tooltip bottom style="margin-right: 100px;">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="black darken-2" size="30" @click.stop="descargarItem(item)"
                                            v-bind="attrs" v-on="on">
                                            mdi-download
                                        </v-icon>
                                    </template>
                                    <span>Descargar</span>
                                </v-tooltip>
                            </td>
                            
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

    created(){

    },

    methods: {
        ...mapMutations('Dialogo', ['setVentanaCarreras', 'setVentanaEst', 'setBreadcrumbs','setVentanaArch']),
        ...mapMutations('Carreras', ['setCarreraSelect']),
        ...mapMutations('Carreras', ['setIdCarreraSelect']),
        ...mapActions('Estudiantes', ['cargarEstudiantes']),
        //...mapActions('Server_Carpetas', ['cargarCarpetas']),

        abrirVentana(item) {
            //console.log('CARRERAS');
            this.setBreadcrumbs(item.nomCar.toUpperCase());
            this.obtnerIdCarrera();
            const storedUser = JSON.parse(localStorage.getItem('user'));
            //console.log(storedUser.IdUser);
            //console.log(this.carrera);
            this.cargarEstudiantes({ idCar: this.carrera, idUser: storedUser.IdUser });
            //this.cargarCarpetas(this.path);
            this.setCarreraSelect(item.nomCar);
            this.setVentanaCarreras(false);
            //this.setVentanaArch(true);
            this.setVentanaEst(true);
        }, 

        //ya no lo uso
        obtnerIdCarrera(){
            switch (this.itemsBread[1]) {
                case 'INGENIERÍA INDUSTRIAL':
                    this.carrera=1;
                    break;
                case 'SOFTWARE':
                    this.carrera=2;
                    break;
                case 'TI':
                    this.carrera=3;
                    break;
                case 'TELECOMUNICACIONES':
                    this.carrera=4;
                    break;
                case 'AUTOMATIZACIÓN Y ROBÓTICA':
                    this.carrera=5;
                    break;
                default:
                    break;
            }
            this.setIdCarreraSelect(this.carrera);
        },

    },
    computed:{
        ...mapState('Dialogo', ['itemsBread']),
    }
}
</script>

