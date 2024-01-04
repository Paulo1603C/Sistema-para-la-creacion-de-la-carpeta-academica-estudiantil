<template lang="">
    <nav>
        <v-app-bar app color="red darken-4" dark>
        <v-app-bar-nav-icon  @click.stop="drawer = !drawer">
        </v-app-bar-nav-icon>
            <v-spacer></v-spacer>
        <v-btn text>
            <span class="mr-2" style="font-size: 24px;">UNIVERSIDAD TECNICA DE AMBATO</span>
            <v-img :src="logo" alt="logo UTA" contain height="60"></v-img>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" dark app class="red darken-4" height="100%">
        <v-card class="mx-auto" min-height="70px">
            <v-list-item>
                <v-layout column>
                    <v-avatar color="surface-variant " size="70" class="mt-2 mx-auto">
                       <v-img :src="(imgUser != null) ? imgUser : imgAux" alt="John" style="background-color:white" ></v-img>
                    </v-avatar>
                    <v-card-text class="text-center" style="font-size: 24px;">{{nombreUser}}</v-card-text>
                </v-layout>
            </v-list-item>
        </v-card>

        <v-divider></v-divider>
        <v-list density="compact" flat nav>
            <v-list-item class="opNav"  v-for="item in navegacion" :key="item.text" router :to="item.route" style="margin-bottom: 1px solid white;">
                <v-list-item-icon>
                    <v-icon size="35" >mdi-{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title style="font-size: 22px;font-weight:bold;">{{item.text}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        

        <template v-slot:append>
          <div class="pa-2">
            <v-btn @click="salir()" block>
                <span class="mr-2">Salir</span>
                <v-icon  >mdi-exit-to-app</v-icon>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </nav>
</template>
<script>

export default {
    name: "NavBar",

    props: ['imgUser', 'nombreUser'],

    data() {
        return {
            drawer: true,
            rolUser: null,
            logo: require("../assets/logo2.png"),
            imgAux: require('../assets/user.png'),
            navegacion: [],
        }
    },

    created() {
        const autenticacion = JSON.parse(localStorage.getItem('Authentication'));
        if (autenticacion) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.rolUser = storedUser.IdRolPer;
            this.roles();
        }
    },

    methods: {
        salir() {
            localStorage.removeItem('user');
            localStorage.removeItem('Authentication');
            this.$router.push("/");
        },
        roles() {
            if (this.rolUser == 1) {
                this.navegacion = [
                    { icon: 'account-circle ', text: 'Usuarios', route: '/Usuarios' },
                    { icon: 'folder', text: 'Estudiantes', route: '/Estudiantes' },
                    { icon: 'view-dashboard', text: 'Plantillas', route: '/Plantillas' },
                ]
            } else {
                this.navegacion = [
                    { icon: 'folder', text: 'Estudiantes', route: '/Estudiantes' },
                    { icon: 'view-dashboard', text: 'Plantillas', route: '/Plantillas' },
                ]
            }
        },
    }
}
</script>

<style>
    .opNav:hover{
        backdrop-filter:blur(10px);
    }
</style>
