<template lang="">
    <nav>
        <v-app-bar app color="red darken-4" dark>
        <v-app-bar-nav-icon  @click.stop="drawer = !drawer">
        </v-app-bar-nav-icon>
            <v-spacer></v-spacer>
        <v-btn text>
            <span class="mr-2" style="font-size: 24px;">UNIVERSIDAD TECNICA DE AMBATO</span>
            <v-img :src="logo" alt="logo" contain height="60"></v-img>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" dark app class="red darken-4" height="100%">
        <v-card class="mx-auto" min-height="70px">
            <v-list-item>
                <v-layout column>
                    <v-avatar color="surface-variant " size="70" class="mt-2 mx-auto">
                       <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" ></v-img>
                    </v-avatar>
                    <v-card-text class="text-center" style="font-size: 24px;">Paulo Martinez</v-card-text>
                </v-layout>
            </v-list-item>
        </v-card>

        <v-divider></v-divider>
        <v-list density="compact" flat nav>
            <v-list-item v-for="item in links" :key="item.text" router :to="item.route" style="margin-bottom: 1px solid white;">
                <v-list-item-icon>
                    <v-icon >mdi-{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title style="font-size: 19px;">{{item.text}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        

        <template v-slot:append>
          <div class="pa-2">
            <v-btn href="/" block>
                <span class="mr-2">Cerrar</span>
                <v-icon  >mdi-exit-to-app</v-icon>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </nav>
</template>
<script>
export default {
    data() {
        return {
            drawer: true,
            logo: require("../assets/logo2.png"),
            links: [
                { icon: 'view-dashboard', text: 'Administrador', route: '/' },
                { icon: 'folder', text: 'Estudiantes', route: '/Estudiantes' },
                { icon: 'view-dashboard', text: 'Plantillas', route: '/About' },
            ]
        }
    }
}
</script>
