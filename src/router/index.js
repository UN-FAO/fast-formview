import Vue from 'vue';
import Router from 'vue-router';
import FormviewComponent from '@/components/Formview';
import PageNotFoundComponent from '@/components/NotFound';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/formio/:machine/:formPath*',
      name: 'formio',
      component: FormviewComponent,
      props: true,
    },
    {
      path: '/form/:encodedUrl',
      name: 'custom',
      component: FormviewComponent,
    },
    {
      path: '/:path*',
      name: 'not-found',
      component: PageNotFoundComponent,
      props: true,
    },
  ],
});
