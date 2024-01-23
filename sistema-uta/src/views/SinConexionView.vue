<template>
    <v-container>
        <div style="display: flex; margin: auto;">
            <v-row justify="center" align="center" class="fill-height">
                <v-col cols="12" sm="8" md="6">
                    <v-card elevation="3">
                        <v-card-title class="text-h6">
                            Sin conexión a Internet
                        </v-card-title>
                        <v-card-subtitle>
                            Por favor, verifica tu conexión y vuelve a intentarlo.
                        </v-card-subtitle>
                        <v-card-actions>
                            <v-btn @click="retryConnection" color="black">
                                Reintentar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>
  
<script>
export default {
    methods: {
        retryConnection() {
            window.location.reload();
        },
    },
};
</script>
  
<style scoped>
.fill-height {
    height: 100%;
}
</style>
  