<template>
  <section class="main">
    <AppHeader></AppHeader>
    <div id="app" class="container">
      <router-view/>
    </div>
  </section>
</template>

<script>
import HeaderComponent from '@/components/Header';

export default {
  name: 'App',
  components: {
    AppHeader: HeaderComponent,
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
