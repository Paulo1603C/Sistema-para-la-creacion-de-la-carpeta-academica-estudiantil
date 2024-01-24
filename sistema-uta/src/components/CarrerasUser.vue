<template>
    <div>
        <template>
            <v-card v-show="show">
                <v-card-title>
                    {{ Titulo }}
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="descargarAll()">Descargar Todo
                        <v-icon right>mdi-folder-download</v-icon>
                    </v-btn>
                </v-card-title>
                <v-data-table dense :headers="Cabecera" :items="Items" :items-per-page="5">
                    <template v-slot:item="{ item }">
                        <tr @click="abrirVentana(item)" class="myStyle">
                            <td class="linea"><v-icon class="mr-3" color="yellow darken-1">mdi-folder</v-icon>{{ item.NomEst
                            }} {{ item.ApeEst }}</td>
                            <td>{{ item.nomCar }}</td>
                            <td>
                                <v-tooltip bottom style="margin-right: 100px;">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="black darken-2" size="30" @click.stop="descargarDirectorio(item)"
                                            v-bind="attrs" v-on="on">
                                            mdi-download
                                        </v-icon>
                                    </template>
                                    <span>Descargar</span>
                                </v-tooltip>
                            </td>

                        </tr>
                    </template>
                </v-data-table>
            </v-card>

        </template>
    </div>
</template>
<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';

export default {
    name: "Carreras",

    props: ['show', 'Titulo', 'Cabecera', 'Items'],

    data() {
        return {
            carrera: 0,
            permisosDirectorios: new Map(),
        }
    },

    created() {

    },

    methods: {
        ...mapMutations('Dialogo', ['setVentanaCarreras', 'setVentanaEst', 'setBreadcrumbs', 'setVentanaArch']),
        ...mapMutations('Carreras', ['setCarreraSelect']),
        ...mapMutations('Carreras', ['setIdCarreraSelect']),
        ...mapActions('Estudiantes', ['cargarEstudiantes']),
        //...mapActions('Server_Carpetas', ['cargarCarpetas']),
        ...mapMutations('Permisos', ['setPermisosSubDirectorios']),
        ...mapActions('Permisos', ['cargarPermisosDirectorios']),
        ...mapActions('Server_Carpetas', ['descargarCarpeta']),

        abrirVentana(item) {
            const recuperarPermisos = localStorage.getItem('PermisosSubDirectorios');
            const permisosSubdirectorio = new Map(JSON.parse(recuperarPermisos));
            //console.log("nuevos permiso" + permisosSubdirectorio.get("CEDULA"));
            this.obtenerPermisosDirectorios();

            this.setBreadcrumbs(item.nomCar.toUpperCase());
            this.obtnerIdCarrera();
            const storedUser = JSON.parse(localStorage.getItem('user'));
            this.cargarEstudiantes({ idCar: this.carrera, idUser: storedUser.IdUser });
            this.setCarreraSelect(item.nomCar);
            this.setVentanaCarreras(false);
            setTimeout(() => {
                this.setVentanaEst(true);
            }, 2000);
        },

        descargarDirectorio: async function (item) {
            this.rutaNueva();
            await this.descargarCarpeta({ ruta: this.path, nombre: item.nomCar });
            this.$alertify.success('Archivo Descargado en unidad /C:');
            this.path = '';
        },

        descargarAll: async function () {
            //this.rutaNueva();
            const nom = '';
            await this.descargarCarpeta({ ruta: this.itemsBread[0], nombre: nom });
            this.$alertify.success('Archivo Descargado en unidad C:/DESCARGAS');
            this.path = '';
        },

        obtnerIdCarrera() {
            switch (this.itemsBread[1]) {
                case 'INGENIERÍA INDUSTRIAL':
                    this.carrera = 1;
                    break;
                case 'SOFTWARE':
                    this.carrera = 2;
                    break;
                case 'TI':
                    this.carrera = 3;
                    break;
                case 'TELECOMUNICACIONES':
                    this.carrera = 4;
                    break;
                case 'AUTOMATIZACIÓN Y ROBÓTICA':
                    this.carrera = 5;
                    break;
                default:
                    break;
            }
            this.setIdCarreraSelect(this.carrera);
        },

        obtenerPermisosDirectorios: async function () {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const idUser = storedUser.IdUser;

                await Promise.all(this.getSubCarpetas.map(async (item) => {
                    await this.cargarPermisosDirectorios({ idUser, nomItem: item.NomItem });
                    this.permisosDirectorios.set(item.NomItem.toLowerCase(), this.getPermisosDirectorios[0].NomPer);
                    //console.dir(`Permisos ${item.NomItem} -> ${this.getPermisosDirectorios[0].NomPer}`);
                }));
                const permission = JSON.stringify(Array.from(this.permisosDirectorios.entries()));
                localStorage.setItem('PermisosSubDirectorios', permission);
                //console.log(this.permisosDirectorios);
            } catch (error) {
                console.error('Error al obtener permisos de directorios:', error);
                throw error; // Re-lanza el error para que pueda ser manejado externamente si es necesario.
            }
        },


        rutaNueva() {
            //metodo para obtener la ruta
            for (let i = 0; i < this.itemsBread.length; i++) {
                //console.log(this.itemsBread[i]);
                this.path += this.itemsBread[i] + "/";
            }
            //console.log(this.path);
        },

    },
    computed: {
        ...mapState('Dialogo', ['itemsBread']),
        ...mapGetters('Permisos', ['getPermisosDirectorios']),
        ...mapGetters('SubCarpetas', ['getSubCarpetas']),
    }
}
</script>

