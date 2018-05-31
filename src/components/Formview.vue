<template>
  <section class="formview">
    <AppHeader v-if="showHeader"></AppHeader>
    <div class="container">
      <AppLoader v-if="!ready"></AppLoader>
      <div v-if="!submitted" id="formio"></div>
      <div v-if="submitted">
        <div class="well">
          <strong>{{ submitTitle }}</strong>
          <hr/>
          <p>
            {{ submitMessage }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Formio } from 'formiojs';
import Translations from '@/mixins/Translations';
import LoaderComponent from './Loader';

export default {
  name: 'Formview',
  components: {
    AppLoader: LoaderComponent,
  },
  props: {
    machine: { type: String, default: 'examples' },
    formPath: { type: String, default: 'example' },
    encodedUrl: { type: String },
  },
  mixins: [Translations],
  data() {
    return {
      ready: false,
      submitted: false,
      formUrl: '',
      formio: {},
      form: {},
      submission: {},
      submitTitle: 'Submission Sent!',
      submitMessage: 'Your submission has been sent.',
      options: {},
    };
  },
  created() {
    const machine = this.$route.params.machine || '';
    const formPath = this.$route.params.formPath || '';
    const encodedUrl = this.$route.params.encodedUrl;

    // Check if custom formUrl is given
    if (encodedUrl) {
      this.formUrl = atob(encodedUrl);
    } else {
      // If no custom formUrl given, asume form.io hosted form
      this.formUrl = `https://${machine}.form.io/${formPath}`;
    }
    // Create a new Formio instance with the provided formUrl
    this.formio = new Formio(this.formUrl);
  },
  mounted() {
    // Try to get the translations (if any)
    this.getTranslations(this.langUrl, this.lang).then((translations) => {
      // Define the options object to store the translations
      this.options = {
        language: this.lang,
        i18n: {},
      };
      // Check if there are translations available
      if (translations) {
        this.options.i18n[this.lang] = translations;
        // Check if submit_title has been defined (if not use default)
        if (this.options.i18n[this.lang].submit_title) {
          this.submitTitle = this.options.i18n[this.lang].submit_title;
        }
        // Check if submit_message has been defined (if not use default)
        if (this.options.i18n[this.lang].submit_message) {
          this.submitMessage = this.options.i18n[this.lang].submit_message;
        }
      }
      // Create and render the Form.io form with the provided options
      Formio.createForm(document.getElementById('formio'), this.formUrl, this.options).then((form) => {
        // Register the submit event to display the submit message
        form.on('submit', (submission) => {
          this.onSubmit(submission);
        });
        // Save the FormioForm instance and tell the application we are ready to show the form
        this.form = form;
        this.ready = true;
      }).catch((err) => {
        // If the form could not be render, treat it as a 404 error
        // and redirect to 'not-found' route.
        this.$router.push({
          name: 'not-found',
          params: { error: err, url: this.formUrl },
          query: this.$route.query,
        });
      });
    });
  },
  methods: {
    onSubmit(submission) {
      // Save the submission and updated submitted state
      this.submission = submission;
      this.submitted = true;
    },
  },
  computed: {
    /**
   *
   *
   * @memberof a
   */
    projectUrl() {
      // Return
      return this.formio.projectUrl;
    },
    /**
   *
   *
   * @memberof a
   */
    langUrl() {
      return this.$route.query.translations || `${this.projectUrl}/translations/submission`;
    },
    /**
   *
   *
   * @memberof a
   */
    lang() {
      return this.$route.query.lang || 'en';
    },
  },
};

</script>


<style lang="scss" scoped>
.alert-success {
  margin-top: 50px;
}
</style>
