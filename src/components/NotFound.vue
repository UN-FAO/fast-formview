<template>
  <section class="not-found">
    <span v-for="(message, lang) in messages" :key="lang">
      <h1 :dir="lang === 'ar' ? 'rtl' : 'ltr'">{{ message.title }}</h1>
      <p :dir="lang === 'ar' ? 'rtl' : 'ltr'">{{ message.body }}</p>
    </span>
  </section>
</template>

<script>
export default {
  name: 'AppNotFound',
  props: ['error', 'path', 'url'],
  mounted() {
    /* eslint-disable no-console */
    if (this.path) {
      console.warn(`Unknown path (${this.path})`);
    }
    if (this.error) {
      console.warn(`Could not render form: ${this.error} (${this.url})`);
    }
    /* eslint-enable */
  },
  data() {
    return {
      langs: [
        'ar',
        'zn',
        'en',
        'fr',
        'ru',
        'es',
      ],
      messages: {
        ar: {
          title: 'الصفحة المطلوبة غير موجودة',
          body: 'عذراً و لكن يبدو أن الصفحة التي طلبتها قد تغير عنوانها أو غير موجودة.',
        },
        zn: {
          title: '网页未找到',
          body: '您正在寻找的网页或者被移除或者不再存在。',
        },
        en: {
          title: 'Page not found',
          body: 'The page you are looking for has either been moved or no longer exists.',
        },
        fr: {
          title: 'Page non trouvée',
          body: 'Nous sommes désolés, la page que vous cherchez a été déplacée ou peut-être effacée.',
        },
        ru: {
          title: 'Страница не найдена',
          body: 'Запрошенная страница была перемещена или удалена.',
        },
        es: {
          title: 'Página no encontrada',
          body: 'La página a la que intenta acceder ha sido cambiada de lugar o no existe.',
        },
      },
    };
  },
};

</script>

<style lang="scss" scoped>
.not-found {
  margin-top: 50px;
  background: url('/static/img/404.gif') no-repeat #5895be;
  padding: 2%;
  color: #fff;
  -webkit-box-shadow: 5px 5px 32px -5px rgba(0,0,0,0.75);
  -moz-box-shadow: 5px 5px 32px -5px rgba(0,0,0,0.75);
  box-shadow: 5px 5px 32px -5px rgba(0,0,0,0.75);
}
</style>
