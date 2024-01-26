<template lang="">

    <nav>
        <div>
            <CambioPass :dialog="dailogContra"  :ItemPass="datosPass"> </CambioPass>
        </div>

        <v-app-bar app color="red darken-4" dark>
        <v-app-bar-nav-icon  @click.stop="drawer = !drawer">
        </v-app-bar-nav-icon>
            <v-spacer></v-spacer>
        <v-btn text>
            <div class="flex" style="display:flex;flex-direction: column;padding:10px; font-size:100%">
                <span class="mr-2" >UNIVERSIDAD TECNICA DE AMBATO</span>
                <span class="mr-2" >FACULTAD DE INGENIERÍA EN SISTEMAS, ELECTRÓNICA E INDUSTRIAL</span>
            </div>
            <v-img :src="logo" alt="logo UTA" contain height="60"></v-img>
        </v-btn>
        <!--<div class="text-center">
            <v-menu transition="scroll-x-transition" offset-y >
                <template v-slot:activator="{ on, attrs }">
                <v-icon color="secondary" class="ma-2" v-bind="attrs" v-on="on">
                    mdi-bell
                </v-icon>
                </template>
                <v-list>
                <v-list-item>
                    <v-list-item-title>Notificaciones</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="n in getNotificaciones" :key="n">
                    <v-list-item-title>{{ n }}</v-list-item-title>
                </v-list-item>
                </v-list>
            </v-menu>
        </div>-->

      </v-app-bar>

      <v-navigation-drawer v-model="drawer" dark app class="red darken-4" height="100%">
        <v-card class="mx-auto" min-height="70px">
            <v-list-item>
                <v-layout column>
                    <v-avatar color="surface-variant " size="70" class="mt-2 mx-auto">
                       <v-img :src="(imgUser != null) ? imgUser : imgAux" alt="John" style="background-color:white" ></v-img>
                    </v-avatar>
                    <v-card-text class="text-center" style="font-size: 24px;">
                        <v-menu v-model="showMenu" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" color="red darken-4">{{nombreUser}}
                                    <v-icon right>mdi-cog</v-icon>
                                </v-btn>
                            </template>

                            <v-list style=" height:65px" >
                                <v-list-item v-for="item in btnOP" :key="item.text" @click="openChangePass()">
                                    <v-list-item-icon>
                                        <v-icon color="blue darken-4">mdi-{{ item.icon }}</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <div>{{ item.text }}</div>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-card-text>
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
            <v-btn @click.stop="salir()" block>
                <span class="mr-2">Salir</span>
                <v-icon  >mdi-exit-to-app</v-icon>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </nav>
</template>
<script>
import CambioPass from './cambioContrasena.vue';
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex';
export default {
    name: "NavBar",

    props: ['imgUser', 'nombreUser'],

    data() {
        return {
            fav: true,
            menu: false,
            message: false,
            hints: true,
            drawer: true,
            rolUser: null,
            showMenu: false,
            logo: require("../assets/logo2.png"),
            imgAux: require('../assets/user.png'),
            navegacion: [],
            btnOP: [
                { icon: "key-change", text: "Cambiar contraseña", show: "true" },
                //{ icon: "folder-arrow-up", text: "Subir Archivo", show: "true" },
            ],
            datosPass: {},
        }
    },

    created() {
        const autenticacion = JSON.parse(localStorage.getItem('Authentication'));
        if (autenticacion) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.rolUser = storedUser.IdRolPer;
            let rolUser = storedUser.IdRolPer;
            this.roles();
        }
    },

    methods: {
        ...mapMutations('Dialogo', ['setDailogContra']),

        salir() {
            localStorage.removeItem('user');
            localStorage.removeItem('Authentication');
            this.$router.push("/");
        },
        roles() {
            if (this.rolUser == 1) {
                this.navegacion = [
                    { icon: 'account-circle ', text: 'Usuarios', route: '/Usuarios' },
                    { icon: 'school', text: 'Carreras', route: '/Carreras' },
                    { icon: 'folder', text: 'Estudiantes', route: '/Estudiantes' },
                    { icon: 'view-dashboard', text: 'Plantillas', route: '/Plantillas' },
                ]
            } else {
                this.navegacion = [
                    { icon: 'folder', text: 'Estudiantes', route: '/Estudiantes' },
                ]
            }
        },

        openChangePass() {
            this.datosPass = {
                contra1: '',
                contra2: '',
            }
            this.setDailogContra(true);
        },

        mostrarNotificaciones() {

        },
    },

    computed: {
        ...mapState('Dialogo', ['dailogContra']),
        ...mapGetters('Carreras', ['getCarrerasUser']),
        ...mapGetters('Login', ['getNotificaciones']),
    },

    components: {
        CambioPass,
    }
}
</script>

<style>
.opNav:hover {
    backdrop-filter: blur(10px);
}

.flex {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

@media only screen and (max-width : 900px) {
    .flex>span {
        font-size: 12px;
        padding: 10px;
    }
}
</style>
