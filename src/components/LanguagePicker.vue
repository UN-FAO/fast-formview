<template>
  <section class="app-language-picker">
    <div class="btn-group" v-show="languages.length > 1">
      <button
        :ref="language"
        class="btn btn-default"
        v-for="language in languages"
        :key="language"
        @click="setLanguage(language, $event)">
        {{ getLanguageName(language) }}
      </button>
    </div>
  </section>
</template>

<script>
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _forEach from 'lodash/forEach';
import _clone from 'lodash/clone';

export default {
  name: 'app-language-picker',
  props: {
    language: {
      type: String,
      default: 'en',
      required: true,
    },
    languages: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
    form: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      currentLanguage: {
        code: 'en',
        direction: 'ltr',
      },
      previousLanguage: {
        code: 'en',
        direction: 'ltr',
      },
      active: null,
    };
  },
  computed: {
    element() {
      return this.form.element || document.getElementsByTagName('body')[0];
    },
    languageList() {
      return _isEmpty(this.languages) ? [this.language] : this.languages;
    },
  },
  methods: {
    findLanguage(code) {
      return code ? _find(this.$resources.languages, { code }) : false;
    },
    setLanguage(code, event) {
      const language = _clone(this.findLanguage(code));
      if (language && !_isEmpty(this.form)) {
        this.form.language = language.code;
        this.previousLanguage = _clone(this.currentLanguage);
        this.currentLanguage = language;
        this.updateDirection();
        this.fixFlatpickrCalendar();
        this.$emit('languageChanged', this.currentLanguage);
      }
      if (event) {
        this.active.disabled = false;
        this.active = event.currentTarget;
        this.active.disabled = true;
      }
    },
    getLanguageName(code, local = true) {
      const language = this.findLanguage(code);
      if (language) {
        return local ? language.localName : language.name;
      }
      return code;
    },
    fixFlatpickrCalendar() {
      const elements = document.getElementsByClassName('flatpickr-calendar');
      while (elements.length > 1) {
        elements[0].remove();
      }
    },
    updateDirection() {
      this.element.setAttribute('dir', this.currentLanguage.direction);
      const oldFloat = this.previousLanguage.direction === 'rtl' ? 'right' : 'left';
      const newFloat = this.currentLanguage.direction === 'rtl' ? 'right' : 'left';

      if (oldFloat !== newFloat) {
        _forEach(this.element.querySelectorAll(`*[dir="${this.previousLanguage.direction}"]`), (el) => {
          el.setAttribute('dir', this.currentLanguage.direction);
        });
        _forEach(this.element.querySelectorAll('.form-group.formio-component'), (component) => {
          const label = component.querySelector('label');
          const sibling = label ? label.nextSibling : null;
          if (label && ['left', 'right'].indexOf(label.style.float) !== -1) {
            const labelMargin = label.style['margin-left'] || label.style['margin-right'];
            const siblingMargin = sibling.style['margin-right'] || sibling.style['margin-left'];

            label.style.float = newFloat;
            label.style[`margin-${oldFloat}`] = labelMargin;
            label.style[`margin-${newFloat}`] = '';

            sibling.style[`margin-${newFloat}`] = siblingMargin;
            sibling.style[`margin-${oldFloat}`] = '';

            // if (component.classList.contains('formio-component-select') ||
            //     component.classList.contains('formio-component-resource')) {
            //   const list = sibling.querySelector('.choices__list');
            //   list.setAttribute('dir', this.dir);
            //   list.style['text-align'] = newFloat;
            //   list.style[`padding-${newFloat}`] = '16px';
            //   list.style[`padding-${oldFloat}`] = '4px';
            //   const input = sibling.querySelector('input');
            //   input.style['text-align'] = newFloat;
            // }
          }
        });
      }
    },
  },
  created() {
    this.setLanguage(this.language);
  },
  mounted() {
    this.active = this.$refs[this.language][0] || null;
    this.active.disabled = true;
  },
};

</script>

<style lang="scss">
.app-language-picker {
  text-align: center;
  margin: 20px auto;
}
</style>
