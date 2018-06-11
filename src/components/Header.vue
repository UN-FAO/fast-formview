<template>
  <section class="header">
    <nav class="navbar bg-fao" v-if="show">
      <div class="container-fluid">
        <div class="navbar-header">
          <a :class="['navbar-brand', getLogoClass()]" href="http://www.fao.org" target="_blank">
          </a>
        </div>
      </div>
    </nav>
  </section>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      languages: ['en', 'fr', 'es', 'ru', 'zh', 'ar'],
    };
  },
  methods: {
    getLogoClass() {
      const lang = this.languages.indexOf(this.lang) !== -1 ? this.lang : 'en';
      return `fao-logo-${lang}`;
    },
  },
  computed: {
    show() {
      return this.$route.query.header !== '0';
    },
    lang() {
      return this.$route.query.lang || 'en';
    },
  },
};
</script>

<style lang="scss" scoped>
$header-height: 100px;
$logo-width: 350px;
$logo-height: 67px;
$logo-size: $logo-width $logo-height;

.header {
  .navbar {
    border-radius: 0;
    height: 100px;
  }
  .navbar-brand {
    position: absolute;
    padding: 0;
    left: 50%;
    top: ($header-height - $logo-height) / 2;
    margin-left: -($logo-width / 2) !important;
    width: $logo-width;
    height: $logo-height;
    background-size: $logo-size;

    &.fao-logo-en {
      background: url('/static/img/FAO_logo_en.svg') no-repeat;
    }

    &.fao-logo-fr {
      background: url('/static/img/FAO_logo_fr.svg') no-repeat;
    }

    &.fao-logo-es {
      background: url('/static/img/FAO_logo_es.svg') no-repeat;
    }

    &.fao-logo-ru {
      background: url('/static/img/FAO_logo_ru.svg') no-repeat;
    }

    &.fao-logo-zh {
      background: url('/static/img/FAO_logo_zh.svg') no-repeat;
    }

    &.fao-logo-ar {
      background: url('/static/img/FAO_logo_ar.svg') no-repeat;
    }
  }
}
</style>
