<template>
  <v-app>
    <NavBar />
    <v-content class="ma-4">
      <v-main>
        <router-view />
      </v-main>
    </v-content>
    <Footer/>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/footer.vue'
export default {
  name: 'App',

  data: () => ({
    //
  }),

  components: {
    NavBar,
    Footer,
  },

};
</script>
