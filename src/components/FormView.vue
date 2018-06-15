<template>
  <section class="app-formview">

    <app-header
      :lang="language">
    </app-header>

    <div class="container">

      <app-spinner
        v-if="!rendered">
      </app-spinner>

      <app-language-picker
        v-if="rendered"
        :form="form"
        :language="options.language"
        :languages="languages"
        @languageChanged="onLanguageChanged">
      </app-language-picker>

      <formio-form
        v-if="ready && !submitted"
        v-show="rendered"
        :src="src"
        :options="options"
        @render="onRender"
        @change="onChange"
        @submit="onSubmit"
        @error="onError"
      ></formio-form>

      <app-message
        v-if="submitted"
        :message="message">
      </app-message>
    </div>

  </section>
</template>

<script>
import { Form as FormioFormComponent } from 'vue-formio';

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
    'formio-form': FormioFormComponent,
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
      formId: '',
      language: 'en',
      languages: ['en'],
      messages: {},
      errors: [],
      timeout: 5000,
    };
  },
  computed: {
    src() {
      return this.encodedUrl ? atob(this.encodedUrl) : `https://${this.machine}.form.io/${this.formPath}`;
    },
    projectUrl() {
      return (new this.$formio(this.src)).projectUrl;
    },
    message() {
      return this.messages[this.language] || this.$messages.submitted[this.language];
    },
  },
  methods: {
    onChange() {
      // console.log(e);
    },
    onRender() {
      this.rendered = true;
      if (!_isEmpty(this.$formio.forms)) {
        this.formId = Object.keys(this.$formio.forms)[0];
        this.form = this.$formio.forms[this.formId];
        this.form.language = this.language;
        this.$formio.forms = {};
      }
    },
    onSubmit() {
      this.submitted = true;
    },
    onError(errors) {
      this.errors = errors;

      _forEach(errors, (error) => {
        if (!error.component && error.message.toLowerCase() === 'unauthorized') {
          this.$router.push({
            name: 'error',
            params: { error, url: this.src, type: 'unauthorized' },
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
      return new Promise((resolve, reject) => {
        let translations = {};
        let messages = {};
        const select = language ? `data.label,data.${language}` : 'data';
        const filter = `?limit=${limit}&skip=${skip}&select=${select}`;

        this.$formio.request(`${this.projectUrl}/translations/submission${filter}`, 'get', null, null, { getHeaders: true })
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
            reject(error);
          });
      });
    },
    runFixes() {
      this.fixSurveysResponsive();
      this.fixPanelsHeading();
      this.fixFlatpickrCalendar();
    },
    fixSurveysResponsive() {
      this.form.element.querySelectorAll('.formio-component-survey').forEach((el) => {
        const table = el.querySelector('table');
        if (table) {
          const parent = table.parentNode;
          const wrapper = document.createElement('div');
          wrapper.className = 'table-responsive';
          parent.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }
      });
    },
    fixPanelsHeading() {
      this.eachComponent(this.form.components, (component) => {
        if (component.component.type === 'panel') {
          const header = document.createElement('div');
          const body = component.element.querySelector('.card-body');
          header.className = 'card-header panel-heading';
          /* eslint-disable max-len */
          header.innerText = this.options.i18n.resources[this.language].translation[component.component.title] || component.component.title;
          /* eslint-enable max-len */
          component.element.insertBefore(header, body);
        }
      });
    },
    fixFlatpickrCalendar() {
      const elements = document.getElementsByClassName('flatpickr-calendar');
      while (elements.length > 1) {
        elements[0].remove();
      }
    },
    eachComponent(components, callback) {
      _forEach(components, (component) => {
        if (typeof callback === 'function') {
          callback(component);
          if (!_isEmpty(component.components)) {
            this.eachComponent(component.components, callback);
          }
        }
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
        this.ready = true;
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
              params: { error: 'request timeout', url: this.src },
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

  .container {
    overflow-y: hidden;
  }

  .formio-form {
    > div {
      > .alert-danger:first-child {
        display: none !important;
      }
    }
  }

  [dir=rtl] {
    .choices__input {
      text-align: right;
    }

    .input-group-addon:last-child {
      border-color: #ccc;
    }

    .formio-component-select .choices__list,
    .formio-component-resource .choices__list {
      text-align: right;
    }
  }
}

@media only screen and (max-width: 600px) {

  .app-formview {

    [dir=rtl] {
      .has-feedback .form-control {
        padding-left: inherit;
        text-align: right;
        overflow: hidden;
      }
    }

    label {
      float: none !important;
      width: 100% !important;
      margin: 0 inherit !important;
    }

    .formio-component {
      padding-top: 5px;
      padding-bottom: 5px;

      > input, > div {
        width: 100% !important;
        margin: 0 !important;
      }
    }
  }
}
</style>
