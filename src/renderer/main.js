import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueCookies from 'vue-cookies'

import vuetify from '../plugins/vuetify'
import Directives from '../plugins/directives';
import '../plugins/socketPlugin';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'swiper/dist/css/swiper.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
    //Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueAwesomeSwiper)
Vue.use(Directives)
Vue.use(axios)
Vue.use(VueCookies)

Vue.prototype.$EventBus = new Vue();

VueCookies.config('1d')

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')