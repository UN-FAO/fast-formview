import Vue from 'vue';
import Router from 'vue-router';
import FormViewComponent from '@/components/FormView';
import ErrorComponent from '@/components/Error';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/form/:encodedUrl',
      name: 'custom',
      component: FormViewComponent,
      props: true,
    },
    {
      path: '/form/:machine/:formPath*',
      name: 'formio',
      component: FormViewComponent,
      props: true,
    },
    {
      path: '/formio/:machine/:formPath*',
      name: 'formio-legacy',
      component: FormViewComponent,
      props: true,
    },
    {
      path: '/:path*',
      name: 'error',
      component: ErrorComponent,
      props: true,
    },
  ],
});
