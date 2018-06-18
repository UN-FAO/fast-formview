<template>
  <section class="app-message">
    <div class="well">
      <div class="message-title" v-if="message.title">
        <h4 :class="[message.body ? 'text-left' : 'text-center']">{{ message.title }}</h4>
      </div>
      <div class="message-body" v-if="message.body">
        <hr />
        <div v-html="message.body"></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'app-message',
  props: {
    message: {
      type: Object,
      default() {
        return {
          title: '',
          body: '',
        };
      },
      require: true,
    },
  },
};

</script>

<style lang="scss" scoped>
.app-message {
}
</style>
