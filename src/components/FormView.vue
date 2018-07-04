<template>
  <section class="app-formview">

    <app-header
      v-if="showHeader"
      :lang="language">
    </app-header>

    <div class="container">

      <app-spinner
        v-if="!rendered">
      </app-spinner>

      <app-language-picker
        v-if="rendered"
        :form="form"
        :language="language"
        :languages="languages"
        @languageChanged="onLanguageChanged">
      </app-language-picker>

      <div
        ref="formio"
        v-if="!submitted"
        v-show="rendered"
      ></div>

      <app-message
        v-if="submitted"
        :message="message">
      </app-message>
    </div>

  </section>
</template>

<script>
import { Formio, createForm } from 'formiojs';

import _isEmpty from 'lodash/isEmpty';
import _forEach from 'lodash/forEach';
import _merge from 'lodash/merge';

import HeaderComponent from './Header';
import SpinnerComponent from './Spinner';
import LanguagePickerComponent from './LanguagePicker';
import MessageComponent from './Message';

export default {
  name: 'app-formview',
  components: {
    'app-header': HeaderComponent,
    'app-spinner': SpinnerComponent,
    'app-language-picker': LanguagePickerComponent,
    'app-message': MessageComponent,
  },
  props: {
    machine: { type: String, default: 'examples' },
    formPath: { type: String, default: 'example' },
    encodedUrl: { type: String },
  },
  data() {
    return {
      ready: false,
      rendered: false,
      options: {
        language: 'en',
        i18n: {},
      },
      submitted: false,
      form: {},
      language: 'en',
      languages: ['en'],
      messages: {},
      errors: [],
      timeout: 10000,
    };
  },
  computed: {
    src() {
      return this.encodedUrl ? atob(this.encodedUrl) : `https://${this.machine}.form.io/${this.formPath}${this.query}`;
    },
    token() {
      return this.$route.query['x-jwt-token'] || '';
    },
    query() {
      return this.token ? `?x-jwt-token=${this.token}` : '';
    },
    projectUrl() {
      return (new Formio(this.src)).projectUrl;
    },
    message() {
      return this.messages[this.language] || this.$messages.submitted[this.language];
    },
    showHeader() {
      return this.$route.query.header !== '0';
    },
  },
  methods: {
    onSubmit() {
      this.submitted = true;
    },
    onError(errors) {
      this.errors = errors;

      _forEach(errors, (error) => {
        if (!error.component && error.message.toLowerCase() === 'unauthorized') {
          this.$router.push({
            name: 'error',
            params: { error, url: this.src, code: 401 },
            query: this.$route.query,
          });
          return false;
        }
        return true;
      });
    },
    onLanguageChanged(lang) {
      this.language = lang.code;
      this.runFixes();
    },
    getTranslations(language, limit = 100, skip = 0) {
      return new Promise((resolve) => {
        let translations = {};
        let messages = {};
        const select = language ? `data.label,data.${language}` : 'data';
        const filter = `?limit=${limit}&skip=${skip}&select=${select}`;

        Formio.request(`${this.projectUrl}/translations/submission${filter}`, 'get', null, null, { getHeaders: true })
          .then(async (response) => {
            const data = response.result || [];
            const headers = response.headers || {};

            _forEach(data, (item) => {
              if (item.data && item.data.label) {
                const translation = item.data;
                const label = translation.label;
                delete translation.label;
                delete translation.submit;

                _forEach(translation, (value, key) => {
                  if (value) {
                    if (!translations[key]) {
                      translations[key] = {};
                      messages[key] = {};
                    }

                    switch (label) {
                      case 'submit_title':
                        messages[key].title = value;
                        break;
                      case 'submit_body':
                        messages[key].body = value;
                        break;
                      case 'Drop files to attach, or':
                        translations[key][` ${label} `] = ` ${value} `;
                        break;
                      default:
                        translations[key][label] = value;
                    }
                  }
                });
              }
            });

            if (typeof headers['content-range'] === 'string') {
              const range = parseInt(headers['content-range'].split('/')[1], 10);

              if (range > limit + skip) {
                const more = await this.getTranslations(language, limit, skip + limit);
                translations = _merge(translations, more.translations);
                messages = _merge(messages, more.messages);
              }
            }
            resolve({ messages, translations });
          })
          .catch((error) => {
            resolve({ error });
          });
      });
    },
    runFixes() {
      this.fixSurveysResponsive();
    },
    fixSurveysResponsive() {
      _forEach(this.form.element.querySelectorAll('.formio-component-survey'), (el) => {
        if (el) {
          const table = el.querySelector('table');
          if (table) {
            const parent = table.parentNode;
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            parent.insertBefore(wrapper, table);
            wrapper.appendChild(table);
          }
        }
      });
    },
    initializeForm(options) {
      this.form = {};
      this.ready = false;
      this.rendered = false;

      return createForm(this.$refs.formio, this.src, options).then((form) => {
        this.form = form;
        this.form.on('submit', this.onSubmit);
        this.form.on('render', () => {
          this.rendered = true;
        });
        this.form.on('error', this.onError);
        this.ready = true;
        return this.form.render();
      }).catch((error) => {
        /* eslint-disable no-console */
        console.warn('could not initialize form: ', error);
        /* eslint-enable no-console */
        this.$router.push({
          name: 'error',
          params: { error, url: this.src, code: 400 },
          query: this.$route.query,
        });
      });
    },
  },
  mounted() {
    if (this.$route.query.lang) {
      this.language = this.$route.query.lang;
      this.languages = [this.language];
      this.options.language = this.language;
      /* eslint-disable max-len */
      this.messages[this.language] = this.$messages.submitted[this.language] || this.$messages.submitted.en;
      /* eslint-enable max-len */
    }
    this.getTranslations(this.$route.query.lang)
      .then((data) => {
        if (!_isEmpty(data.translations)) {
          _forEach(Object.keys(data.translations), (key) => {
            if (this.languages.indexOf(key) === -1) {
              this.languages.push(key);
            }
          });
          this.options.i18n = data.translations;
        }
        if (!_isEmpty(data.messages)) {
          this.messages = data.messages;
        }
        this.initializeForm(this.options);
      })
      .catch((error) => {
        this.ready = true;
        /* eslint-disable no-console */
        console.warn('translations not found: ', error);
        /* eslint-enable no-console */
      })
      .finally(
        setTimeout(() => {
          if (!this.rendered) {
            this.$router.push({
              name: 'error',
              params: { error: 'request timeout', url: this.src, code: 408 },
              query: this.$route.query,
            });
          }
        }, this.timeout),
      );
  },
};

</script>

<style lang="scss">

.app-formview {

  .formio-form {
    > div {
      > .alert-danger:first-child {
        display: none !important;
      }
    }

    .formio-choices[data-type="select-multiple"] {

      > .form-control {
        height: auto !important;

        > .choices__list--multiple {

          > .choices__item {
            margin-bottom: 0 !important;
          }
        }

        > input {
          margin-bottom: 0 !important;
          width: 250px !important;
          padding: 0;
          background-color: transparent;
        }
      }
    }
  }

  [dir=rtl] {
    [class="col"],
    [class^="col-xs-"],
    [class^="col-sm-"],
    [class^="col-md-"],
    [class^="col-lg-"] {
      float: right !important;
    }

    .choices__input {
      text-align: right;
    }

    .formio-component .input-group-addon:last-child {
      border-left-style: solid;
      border-left-width: 1px;
      border-right: 0;
      border-radius: 4px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .formio-component:not(.has-error) .input-group-addon {
      border-left-color: #ccc;
    }

    .formio-component-file .list-group {
      padding-right: 0;
    }

    .formio-component-select .choices__list,
    .formio-component-resource .choices__list {
      text-align: right;
    }
  }
}

@media only screen and (max-width: 600px) {

  .app-formview {
    label {
      float: none !important;
      width: 100% !important;
      margin: 0 inherit !important;
    }

    .formio-component {
      padding-top: 5px;
      padding-bottom: 5px;

      > .form-control, > .form-group, > .input-group, > div[style*="width:"] {
        width: 100% !important;
        margin: 0 !important;
      }

      .formio-choices .form-control {
        overflow-y: hidden;

        > input {
          width: 100% !important;
        }
      }
    }

    .formio-component-button {

      > button {
        display: block;
        width: 100%;
        margin-bottom: 8px;
      }
    }

    [dir=ltr] {
      label {
        text-align: left !important;
      }
    }

    [dir=rtl] {
      label {
        text-align: right !important;
      }

      .has-feedback .form-control {
        padding-left: inherit;
        text-align: right;
        overflow: hidden;
      }
    }
  }
}
</style>
