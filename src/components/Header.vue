<template>
  <section class="app-header">
    <nav class="navbar bg-fao" v-if="show">
      <div class="container-fluid">
        <div class="navbar-header">
          <a :class="['navbar-brand', lang, ]" :href="link" target="_blank">
          </a>
        </div>
      </div>
    </nav>
  </section>
</template>

<script>
export default {
  name: 'app-header',
  props: ['lang'],
  data() {
    return {
      logos: ['en', 'fr', 'es', 'ru', 'zh', 'ar'],
      link: 'http://www.fao.org',
    };
  },
  computed: {
    show() {
      return this.$route.query.header !== '0';
    },
  },
};
</script>

<style lang="scss" scoped>
$header-height: 100px;
$logo-width: 350px;
$logo-height: 67px;
$logo-size: $logo-width $logo-height;

.app-header {
  .navbar {
    border-radius: 0;
    height: 100px;
  }
  .navbar-brand {
    position: absolute;
    padding: 0;
    left: 50%;
    top: ($header-height - $logo-height) / 2;
    margin-left: -($logo-width / 2);
    width: $logo-width;
    height: $logo-height;
    background-size: $logo-size;
    background-repeat: no-repeat;
    background-image: url('/static/img/FAO_logo_en.svg');

    &.fr {
      background-image: url('/static/img/FAO_logo_fr.svg');
    }

    &.es {
      background-image: url('/static/img/FAO_logo_es.svg');
    }

    &.ru {
      background-image: url('/static/img/FAO_logo_ru.svg');
    }

    &.zh {
      background-image: url('/static/img/FAO_logo_zh.svg');
    }

    &.ar {
      background-image: url('/static/img/FAO_logo_ar.svg');
    }
  }
}

@media only screen and (max-width: 350px) {
  .navbar-brand {
    top: 22px !important;
    margin-left: -146px !important;
    width: 293px !important;
    height: 56px !important;
    background-size: 293px 56px !important;
  }
}
</style>
