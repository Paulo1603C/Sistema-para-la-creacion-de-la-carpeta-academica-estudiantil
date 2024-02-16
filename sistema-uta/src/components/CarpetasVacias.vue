<template lang="">
    <div>
        <template>
            <v-card v-show="true">
                <v-card-title>
                    {{ Titulo }}
                    <v-spacer></v-spacer>
                    <v-text-field v-model="searchInput" append-icon="mdi-magnify" label="INGENIERÍA INDUSTRIAL/..." single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table v-if="getNotificaciones.length > 0" dense :headers="Cabecera" :items="getNotificaciones" :item-per-page="10"
                    :search="search" class="elevation-1">
                    <template v-slot:item="{ item }">
                        <tr class="myStyle">
                            <td><v-icon class="mr-3" color="yellow darken-1">mdi-folder</v-icon></td>
                            <td>{{ item.carVacia }}</td>
                        </tr>
                    </template>
                </v-data-table>
                <p v-else class="text-center">Esperando datos...</p>
            </v-card>

        </template>
    </div>
</template>
<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
export default {
    name:"carVacias",

    data(){
        return{
            search: '/UTA/FISEI/CARRERAS/',
            searchInput: '',
            Titulo:"Reportes de Carpetas Vacias",
            Cabecera: [
                { text: 'Tipo', value: 'tipo', },
                { text: 'Ruta', value: 'carVacia', },
            ],
        }
    },

    computed: {
        ...mapGetters('Notificaciones', ['getNotificaciones']),
    },

    watch: {
        searchInput(newVal) {
            this.search = newVal;
        }
    },

}
</script>
<style lang="">
    
</style>