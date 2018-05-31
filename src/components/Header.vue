<template>
  <section class="header">
    <nav class="navbar bg-fao" v-if="show">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand fao-logo-white" href="http://www.fao.org" target="_blank">
          </a>
        </div>
      </div>
    </nav>
  </section>
</template>

<script>
export default {
  name: 'AppHeader',
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
    background: url('/static/img/fao-logo-white.svg') no-repeat;
    background-size: $logo-size;
  }
}
</style>
