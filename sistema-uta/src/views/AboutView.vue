<template lang="">
  <div>
    Plantilla
  </div>
</template>
<script>
export default {

  created() {
    const isAuthenticated = localStorage.getItem('Authentication') === 'true';
        if (!isAuthenticated) {
            this.$router.push("/");   
        }
    },
  
}
</script>
<style lang="">
  
</style>