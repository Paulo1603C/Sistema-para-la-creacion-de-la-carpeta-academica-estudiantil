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
                       <v-img :src="imgUser" alt="John" ></v-img>
                    </v-avatar>
                    <v-card-text class="text-center" style="font-size: 24px;">{{nombreUser}}</v-card-text>
                </v-layout>
            </v-list-item>
        </v-card>

        <v-divider></v-divider>
        <v-list density="compact" flat nav>
            <v-list-item v-for="item in navegacion" :key="item.text" router :to="item.route" style="margin-bottom: 1px solid white;">
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
            rolUser:null,
            logo: require("../assets/logo2.png"),
            navegacion: [],
        }
    },

    created() {
        const storedUser = JSON.parse( localStorage.getItem('user') );
        this.rolUser = storedUser.rol_id;

        this.roles();
    },

    methods: {
        salir() {
            localStorage.removeItem('user');
            this.$router.push("/");
        },
        roles() {
            if( this.rolUser == 1 ){
                this.navegacion = [
                    { icon: 'account-circle ', text: 'Usuarios', route: '/Usuarios' },
                    { icon: 'folder', text: 'Estudiantes', route: '/Estudiantes' },
                    { icon: 'view-dashboard', text: 'Plantillas', route: '/About' },
                ]
            }else{
                this.navegacion = [
                    { icon: 'folder', text: 'Estudiantes', route: '/Estudiantes' },
                    { icon: 'view-dashboard', text: 'Plantillas', route: '/About' },
                ]
            }
        },
    }
}
</script>
