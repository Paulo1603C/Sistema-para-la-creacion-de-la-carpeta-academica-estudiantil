<template>
  <v-app>
    <NavBar />
  <v-content class="ma-4">
    <router-view />
  </v-content>
  <Footer />
  </v-app>
</template>
  
<script>

import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/footer.vue'
export default {
  name: 'Dashboard',

  data: () => ({
    //
  }),
  components: {
    NavBar,
    Footer,
  },

};
</script>
  