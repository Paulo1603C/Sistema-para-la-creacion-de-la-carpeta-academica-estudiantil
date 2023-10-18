<template>
    <div>
        <NuevaCarpeta :dialog="auxDialog" @dialog="auxDialog = $event" :Item="itemSeleccionado"></NuevaCarpeta>
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
                    <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
                </v-list>
            </v-menu>
        </v-container>
    </div>
</template>
  
<script>
import NuevaCarpeta from './NuevoCarpeta.vue';
export default {
    data() {
        return {
            showMenu: false,
            auxDialog: false,
            itemSeleccionado: {},
            links: [
                { icon: "folder-plus", text: "Crear Carpeta" },
                { icon: "folder-arrow-up", text: "Subir Archivo" },
            ],
        };
    },
    methods: {
        optionSelected(option) {
            switch (option) {
                case "Crear Carpeta":
                    this.nuevoItem();
                    break;
                case "Subir Archivo":
                    this.$refs.fileInput.click();
                    break;
                default:
                    alert('Opción seleccionada: ' + option);
                    break;
            }
        },

        nuevoItem() {
            this.itemSeleccionado = {
                id: 0,
                nombre: '',
                edad: 0,
                profesion: '',
            }
            this.auxDialog = true;

        },
        handleFileChange(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                this.selectedFile = selectedFile;
            }
        },
    },
    components: {
        NuevaCarpeta,
    }
};
</script>
  