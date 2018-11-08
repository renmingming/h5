// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import router1  from './router/index.js'
import store from './vuex'
import utils from './assets/js/utils.js'

const https = axios.create({
	baseURL: utils.urlPrefix,
	headers:{
		ticket: utils.request('ticket'),
	}
});
Vue.prototype.$axios = https;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router1,
  store,
  render: h => h(App)
})
