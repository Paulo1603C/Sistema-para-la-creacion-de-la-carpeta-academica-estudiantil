<template lang="">
    <div>
        <BtnOpciones :links="btnOP" dark class="mb-2"></BtnOpciones>
        <hr>
        <v-row>
            <v-col v-if="getItems.length === 0" class="d-flex justify-center align-center" style="font-size:30px">
                <span>Cargando Datos...</span>
            </v-col>
            <v-col v-else v-for="(item, index) in paginatedItems" :key="index" class="ma-2">
                <UsuariosT 
                    :id="item.IdUser" 
                    :correo="item.Correo" 
                    :nombre="item.NomUser" 
                    :apellido="item.ApeUser" 
                    :contraseña="item.Contraseña" 
                    :rol="item.NomRol" 
                    :carreras="item.Carreras" 
                    :permisos="item.Permisos" 
                    :idCarreras="item.IdCarreras" 
                    :idPermisos="item.IdPermisos" 
                    :idRol="item.IdRol" 
                    :urlDw="item.download_url">
                </UsuariosT>
            </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-pagination
            v-model="page"
            :length="totalPages"
            rounded="circle"
            @input="onPageChange"
        ></v-pagination>
    </div>
</template>

<script>
import UsuariosT from '../components/UsuariosT.vue';
import BtnOpciones from '../components/BtnOpciones.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "Usuariosview",

    data() {
        return {
            btnOP: [
                { icon: "account-plus-outline", text: "Crear Usuario" },
            ],
            page: 1,
            itemsPerPage: 5, // Puedes ajustar este valor según tu necesidad
        }
    },

    created() {
        const isAuthenticated = localStorage.getItem('Authentication') === 'true';
        if (!isAuthenticated) {
            this.$router.push("/");   
        } else {
            this.cargarUsuarios();
        }
    },

    methods: {
        ...mapActions('Usuarios', ['cargarUsuarios']),
        
        onPageChange(page) {
            this.page = page;
        }
    },

    computed: {
        ...mapGetters('Usuarios', ['getItems']),

        paginatedItems() {
            const start = (this.page - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.getItems.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.getItems.length / this.itemsPerPage);
        }
    },

    components: {
        UsuariosT,
        BtnOpciones,
    }
}
</script>

<style lang="">
    
</style>
