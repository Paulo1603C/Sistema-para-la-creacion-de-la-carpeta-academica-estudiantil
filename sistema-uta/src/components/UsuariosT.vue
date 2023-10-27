<template>
    <div>
        <v-card class="mx-auto" max-width="344">
            <v-img :src="(urlDw != null) ? urlDw : imgAux" height="200px" cover></v-img>

            <v-card-title>
                {{ author }}
            </v-card-title>

            <v-card-subtitle>
                {{ id }}
            </v-card-subtitle>

            <v-card-actions>
                <v-btn @click="eliminar">
                    <template>
                        <v-icon>mdi-delete</v-icon>
                    </template>
                </v-btn>
                <v-btn @click="editar">
                    <template>
                        <v-icon>mdi-pencil</v-icon>
                    </template>
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
                        <p>Alto:</p>
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
        imgAux: require('../assets/user.png'),
    }),

    props: {
        id: String,
        author: String,
        urlDw: String,
    },

    methods: {
        eliminar() {

        },

        editar() { },
    }

}
</script>