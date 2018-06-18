<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
// import formio styles
@import 'formiojs/dist/formio.full.min.css';
// import bootstrap ltr|rtl support
// @import 'bootstrap-rtl-ondemand/less/bootstrap-rtl.less';
// import fonts
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');

$fao-color: #0d6cac;
$app-font: 'Open Sans', sans-serif;

.bg-fao {
  background-color: $fao-color;
}

.text-fao {
  color: $fao-color;
}

#app {
  font-family: $app-font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
