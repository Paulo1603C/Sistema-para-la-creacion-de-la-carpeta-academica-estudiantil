<template>
  <div>
    <v-list>
      <v-list-item @click="openFileInput">
        <v-list-item-content>
          <v-list-item-title>Cargar archivo</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <input
      ref="fileInput"
      type="file"
      style="display: none"
      @change="handleFileChange"
    />

    <!-- Mostrar el archivo cargado -->
    <div v-if="selectedFile">
      <p>Nombre del archivo: {{ selectedFile.name }}</p>
      <p>Tipo de archivo: {{ selectedFile.type }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.selectedFile = selectedFile;
      }
    },
  },
};
</script>
