<template>
  <div>
    <SubItem :dialog.sync="dialogPlantilla" :ItemPlantilla="dataPlan"></SubItem>
    <div style="overflow: hidden"></div>
    <v-card class="mx-auto mt-10" max-width="200">
      <v-card-title class="d-flex justify-center align-center" style="font-size: 15px">
        {{ idPlan }}
      </v-card-title>
      <v-img :src="urlDw || imgAux" contain height="100px" cover></v-img>
      <v-card-title class="d-flex justify-center align-center" style="font-size: 15px">
        {{ titulo }}
      </v-card-title>
      <v-card-actions>
        <v-btn color="error darken-2" @click="eliminar" icon small>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn color="primary darken-4" @click="editar" icon small>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="show = !show" icon small>
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <v-list dense>
            <v-list-item
              v-for="(item, index) in itemsList"
              :key="index"
              :class="{ selected: selectedWord === item.text }"
              style="display: flex;">
              <v-row align="center" class="list-item-row">
                <v-col cols="auto">
                  <v-icon size="16" color="yellow darken-1">mdi-folder</v-icon>
                </v-col>
                <v-col>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-col>
                <v-col cols="auto">
                  <v-icon  @click.stop="crearSubSubItemsPlantilla(item)" class="mr-2" color="green darken-1" size="18">
                    mdi-plus
                  </v-icon>
                  <v-icon  @click.stop="verItem(item)" color="blue darken-1" size="18">
                    mdi-eye
                  </v-icon>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import SubItem from "./SubItem.vue";

export default {
  data: () => ({
    show: false,
    itemsList: [],
    imgAux: require("../assets/plantilla.png"),
    selectedWord: null,
    dialogPlantilla: false,
    dataPlan: {},
  }),

  props: ["idPlan", "titulo", "idItem", "items", "urlDw"],

  methods: {
    ...mapMutations("Plantillas", ["setPlan"]),
    ...mapMutations("Dialogo", ["setDialogPlantilla"]),
    ...mapActions("Plantillas", ["eliminarPlantilla"]),

    crearSubSubItemsPlantilla(item) {
      console.log(item);
      this.dialogPlantilla = true;
      this.dataPlan = {
        idPlan: 0,
        nomPlan: item.text,
        items: [],
        idItem:item.id,
      };
    },

    editar() {
      try {
        this.setDialogPlantilla(true);
        this.words = [this.items];
        this.words = this.items.split(",");
        this.plantillaSelect = {
          idPlan: this.idPlan,
          nomPlan: this.titulo,
          items: this.words,
        };
        this.setPlan(this.plantillaSelect);
      } catch (error) {
        this.$alertify.error("Error al editar:", error);
      }
    },

    eliminar() {
      this.itemSeleccionadoPlan = {
        id: this.idPlan,
        nombre: this.titulo,
      };
      this.$alertify.confirm(
        "Deseas eliminar la Plantilla: " + this.itemSeleccionadoPlan.nombre,
        () => {
          this.eliminarPlantilla(this.itemSeleccionadoPlan);
          this.$alertify.success("Plantilla Eliminada");
        },
        () => this.$alertify.error("Cancelado")
      );
    },
  },

  mounted() {
    this.itemsList = this.items.split(",").map((text, index) => ({
      text,
      id: this.idItem.split(",")[index],
    }));
    console.log(this.itemsList);
  },

  components: {
    SubItem,
  },
};
</script>

<style scoped>
.selected {
  background-color: #f0f0f0; 
  font-weight: bold; 
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.list-item-action {
  display: flex;
  align-items: center;
}
</style>
