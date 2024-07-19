<template lang="">
  <div>
      <BtnOpciones :links="btnOP" dark class="mb-2"></BtnOpciones>
      <hr>
      <v-row>
          <v-col v-if="getPlantillas.length == 0" class="d-flex justify-center align-center" style="font-size:30px" >
              <span>Cargando Datos...</span>
          </v-col>
          <v-col v-else v-for="(item, index) in getPlantillas" :key="index" class="ma-2">
            <Plantillas :idPlan="item.IdPlan" :titulo='item.NomPlan' :idItem="item.IdItem" :items="item.Items" ></Plantillas>               
          </v-col>
      </v-row>
  </div>
</template>

<script>
import Plantillas from '../components/Plantillas.vue';
import BtnOpciones from '../components/BtnOpciones.vue';
import { mapActions, mapGetters } from 'vuex';

export default {

  data() {
    return {
      btnOP: [
        { icon: "folder-plus", text: "Crear Plantilla" },
      ],
    }
  },

  created() {
    const isAuthenticated = localStorage.getItem('Authentication') === 'true';
    if (!isAuthenticated) {
      this.$router.push("/");
    } else {
      this.cargarPlantillas();
    }
  },

  methods: {
    ...mapActions('Plantillas', ['cargarPlantillas']),
  },

  computed: {
    ...mapGetters('Plantillas', ['getPlantillas']),
  },

  components: {
    Plantillas,
    BtnOpciones,
  },

}
</script>
<style lang="">
  
</style>