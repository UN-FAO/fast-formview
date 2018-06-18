<template>
  <section class="app-error">
    <app-header></app-header>
    <div class="container" :class="errorClass">
      <div class="error-wrapper">
        <span class="error-message" v-for="(message, lang) in messages" :key="lang">
          <h1 :dir="getDirection(lang)">{{ message.title }}</h1>
          <p :dir="getDirection(lang)">{{ message.body }}</p>
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import _find from 'lodash/find';

import HeaderComponent from '@/components/Header';

import { ErrorMessages } from '@/messages';
import { Languages } from '@/resources';

export default {
  name: 'app-error',
  components: {
    'app-header': HeaderComponent,
  },
  props: ['error', 'path', 'url', 'code'],
  data() {
    return {
      messages: {},
      errorClass: '',
    };
  },
  mounted() {
    switch (this.code) {
      case 400:
        this.messages = ErrorMessages.badRequest;
        this.errorClass = 'error-400';
        break;
      case 401:
        this.messages = ErrorMessages.unauthorized;
        this.errorClass = 'error-401';
        break;
      case 408:
        this.messages = ErrorMessages.timeout;
        this.errorClass = 'error-408';
        break;
      default:
        this.messages = ErrorMessages.notFound;
        this.errorClass = 'error-404';
    }

    /* eslint-disable no-console */
    if (this.path) {
      console.warn(`Unknown path (${this.path})`);
    }
    if (this.error) {
      console.warn(`Could not render form: ${this.error} (${this.url})`);
    }
    /* eslint-enable no-console */
  },
  methods: {
    getDirection(code) {
      const language = _find(Languages, { code }) || { direction: 'ltr' };
      return language.direction;
    },
  },
};

</script>

<style lang="scss" scoped>
.app-error {
  padding-bottom: 50px;

  .container {
    position: relative;
    -webkit-box-shadow: 5px 5px 32px -5px rgba(0,0,0,0.75);
    -moz-box-shadow: 5px 5px 32px -5px rgba(0,0,0,0.75);
    box-shadow: 5px 5px 32px -5px rgba(0,0,0,0.75);
    background-color: #5895be;
    color: #fff;

    &::before {
      padding: 0;
      margin: 0;
      font-size: 200px;
      line-height: 200px;
      color: #71a5c8;
      content: '404';
    }

    &.error-400::before {
      content: '400';
    }

    &.error-401::before {
      content: '401';
    }

    &.error-408::before {
      content: '408';
    }

    .error-wrapper {
      margin-top: -200px;
    }
  }
}

@media only screen and (max-width: 600px) {
  .app-error {
    padding: 0;

    .container {
      margin-top: -20px;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
    }
  }
}
</style>
