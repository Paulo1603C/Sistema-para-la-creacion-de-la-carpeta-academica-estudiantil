<template lang="">
    <div>
        <CarpetasVacias></CarpetasVacias>
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import CarpetasVacias from "../components/CarpetasVacias.vue";
name: "Reportes"
export default {

    data() {
        return {

        }
    },

    async created() {
        const isAuthenticated = localStorage.getItem('Authentication') === 'true';
        if (!isAuthenticated) {
            this.$router.push("/");
        } else {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.idUser = storedUser.IdUser;
            await Promise.all([
                this.notificaciones({ idUser: this.idUser }),
            ]);
        }
    },

    methods: {
        ...mapActions('Notificaciones', ['notificaciones']),
    },

    components: {
        CarpetasVacias,
    }




}
</script>
<style lang="">
    
</style>