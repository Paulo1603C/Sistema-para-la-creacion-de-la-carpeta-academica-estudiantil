<template>
  <v-app>
    <NavBar :nombreUser="getUser.nombre" :imgUser="imgProfile"></NavBar>
    <v-content class="ma-4">
      <router-view />
    </v-content>
    <Footer></Footer>
  </v-app>
</template>
  
<script>

import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/footer.vue';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'Dashboard',
  
  data: () => ({
    imgProfile: 'https://cdn.vuetifyjs.com/images/john.jpg',
    
  }),
  components: {
    NavBar,
    Footer,
  },
  
  created() {
    const storedUser =  localStorage.getItem('user');
    if (storedUser) {
      this.setUser(JSON.parse(storedUser));
    }else{
      this.$router.push("/");
      
    }
  },
  
  methods:{
    ...mapMutations('Usuarios',['setUser']),
    
  },

  computed: {
    ...mapGetters('Usuarios', ['getUser', 'getAuthentication']),
  },

};
</script>
  