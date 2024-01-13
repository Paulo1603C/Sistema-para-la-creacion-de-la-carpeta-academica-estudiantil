<template>
  <v-app>
    <NavBar :nombreUser="NomCom" :imgUser="imgProfile"></NavBar>
    <v-content class="ma-4">
      <router-view />
    </v-content>
    <Footer></Footer>
  </v-app>
</template>
  
<script>

import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/footer.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: 'Dashboard',

  data: () => ({
    imgProfile: null,
    NomCom: null,

  }),
  components: {
    NavBar,
    Footer,
  },

  created() {
    const isAuthenticated = localStorage.getItem('Authentication') === 'true';

    if (isAuthenticated) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      this.NomCom = storedUser.NomUser + " " + storedUser.ApeUser;
      this.setUser(storedUser);
      this.cargarSubCarpetas();
    } else {
      this.$router.push("/");
    }
  },

  methods: {
    ...mapMutations('Login', ['setUser']),
    ...mapActions('SubCarpetas', ['cargarSubCarpetas']),

  },

  computed: {
    ...mapGetters('Login', ['getUser', 'getAuthentication']),
  },

};
</script>
  