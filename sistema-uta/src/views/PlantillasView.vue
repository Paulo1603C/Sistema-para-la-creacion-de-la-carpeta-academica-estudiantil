<template lang="">
  <div>
    <Carreras texto="Software" />
  </div>
</template>
<script>
import Carreras from '../components/CarrerasUser.vue';

export default {

  created() {
    const isAuthenticated = localStorage.getItem('Authentication') === 'true';
        if (!isAuthenticated) {
            this.$router.push("/");   
        }
    },

    components:{
      Carreras,
    },
  
}
</script>
<style lang="">
  
</style>