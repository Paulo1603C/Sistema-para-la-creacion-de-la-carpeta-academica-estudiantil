<template>
    <div>
        <v-card class="mx-auto" max-width="344">
            <v-img :src="urlDw" height="200px" cover></v-img>

            <v-card-title>
                {{ author }}
            </v-card-title>

            <v-card-subtitle>
                {{ id }}
            </v-card-subtitle>

            <v-card-actions>
                <v-btn color="orange-lighten-2" variant="text">
                    Explore
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn @click="show = !show">
                    <template v-if="show">
                        <v-icon>mdi-chevron-up</v-icon>
                    </template>
                    <template v-else>
                        <v-icon>mdi-chevron-down</v-icon>
                    </template>
                </v-btn>

            </v-card-actions>

            <v-expand-transition>
                <div v-show="show">
                    <v-divider></v-divider>

                    <v-card-text>
                        <p>Alto: {{ height }}</p>
                        <p>Ancho: {{ width }}</p>
                    </v-card-text>
                </div>
            </v-expand-transition>
        </v-card>
    </div>
</template>

<script>
export default {
    data: () => ({
        show: false,
    }),

    props: {
        id: String,
        author: String,
        urlDw: String,
        width: 0,
        height: 0,
    },

    /*props: [
        'items'
    ]*/
}
</script>