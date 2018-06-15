// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import resources from './resources';
import messages from './messages';

Vue.config.productionTip = false;

Vue.prototype.$formio = window.Formio;
Vue.prototype.$resources = resources;
Vue.prototype.$messages = messages;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
