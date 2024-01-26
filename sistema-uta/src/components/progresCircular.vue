<template>
    <div>
      <v-dialog v-model="dialog" style="height: 20px;" :persistent="true">
        <div class="loading-container">
          <v-progress-circular color="purple" indeterminate :size="100" :width="6"></v-progress-circular>
          <div>
            <v-alert type="success" outlined dense color="secondary darken-1" >{{ message }}</v-alert>
          </div>
        </div>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Progres_Circular',
    props: {
      dialog: Boolean,
      message: '',
    },
    data() {
      return {};
    },
    methods: {},
  };
  </script>
  
  <style scoped>
  div > .loading-container {
    height: 600px;
  }
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  </style>
  