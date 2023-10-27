<template>
    <div>
        <NuevaCarpeta :dialog="dialogFolder" @dialog="dialogFolder = $event" :Item="itemSeleccionado"></NuevaCarpeta>
        <SubirArchivo :dialog="dialogFile" @dialog="dialogFile = $event" :Item="itemSeleccionado"></SubirArchivo>
        <NuevaUsuario :dialog="dialogUser" @dialog="dialogUser = $event" :Item="itemSeleccionado"></NuevaUsuario>
        <v-container class="mt-5">
            <v-menu v-model="showMenu" offset-y>
                <template v-slot:activator="{ on }">
                    <!-- Botón que activa el menú desplegable -->
                    <v-btn v-on="on" color="primary">Opciones
                        <v-icon right>mdi-menu-down</v-icon>
                    </v-btn>
                </template>

                <!-- Contenido del menú desplegable -->
                <v-list>
                    <v-list-item v-for="item in links" :key="item.text" @click="optionSelected(item.text)">
                        <v-list-item-icon>
                            <v-icon>mdi-{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-container>
    </div>
</template>
  
<script>
import NuevaCarpeta from './NuevoCarpeta.vue';
import NuevaUsuario from './NuevoUsuario.vue';
import SubirArchivo from './SubirArchivo.vue';
export default {

    props: ['links'],

    data() {
        return {
            showMenu: false,
            dialogFolder: false,
            dialogFile: false,
            dialogUser: false,
            itemSeleccionado: {},
        };
    },
    methods: {
        optionSelected(option) {
            switch (option) {
                case "Crear Carpeta":
                    this.nuevaCarpeta();
                    break;
                case "Subir Archivo":
                    this.subirArchivo();
                    //this.$refs.fileInput.click();
                    break;
                case "Crear Usuario":
                    this.nuevoUsuario();
                    break;
                case "Importar Datos":
                    this.nuevoUsuario();
                    break;
                default:
                    alert('Opción seleccionada: ' + option);
                    break;
            }
        },

        nuevaCarpeta() {
            this.itemSeleccionado = {
                id: 0,
                nombre: '',
                edad: 0,
                profesion: '',
            }
            this.dialogFolder = true;
        },
        
        nuevoUsuario() {
            this.itemSeleccionado = {
                id: 0,
                nombre: '',
                edad: 0,
                profesion: '',
            }
            this.dialogUser = true;
        },
        
        subirArchivo(){
            this.dialogFile = true;
        },
        
        
    },
    components: {
        NuevaCarpeta,
        NuevaUsuario,
        SubirArchivo,
    }
};

</script>
  