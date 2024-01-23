import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import './assets/tailwind.css'
import vuetify from './plugins/vuetify'
import CryptoJS from 'crypto-js';


import VueAlertify from 'vue-alertify';
 
Vue.use(VueAlertify);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  CryptoJS,
  render: function (h) { return h(App) }
}).$mount('#app')
