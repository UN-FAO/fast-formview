// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import moment from 'moment';
import App from './App';
import router from './router';
import resources from './resources';
import messages from './messages';

window.moment = moment;

Vue.config.productionTip = false;

Vue.prototype.$resources = resources;
Vue.prototype.$messages = messages;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
