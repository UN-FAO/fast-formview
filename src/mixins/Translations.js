import { Formio } from 'formiojs';

export default {
  data() {
    return {
      translations: {},
    };
  },
  methods: {
    getTranslationsAsync(url, lang, limit = 100, skip = 0) {
      return new Promise((resolve, reject) => {
        if (!url || url.indexOf('http') !== 0) {
          reject('invalid url');
        }

        const requestUrl = `${url}?limit=${limit}&skip=${skip}&select=data.label,data.${lang}`;

        Formio.request(requestUrl, 'get', null, null, { getHeaders: true }).then((response) => {
          const data = response.result || [];
          const headers = response.headers || {};

          data.forEach((translation) => {
            this.translations[translation.data.label] = translation.data[lang];
          });

          if (typeof headers['content-range'] === 'string') {
            const range = parseInt(headers['content-range'].split('/')[1], 10);

            if (range > limit + skip) {
              this.getTranslationsAsync(url, lang, limit, skip + limit);
            } else {
              resolve(this.translations);
            }
          }
          resolve(this.translations);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    async getTranslations(url, lang) {
      /* eslint-disable prefer-const */
      this.translations = {};
      /* eslint-enable */

      await this.getTranslationsAsync(url, lang)
        .catch((error) => {
          /* eslint-disable no-console */
          console.warn('could not get translations: ', error);
          /* eslint-enable */
        });

      return this.translations;
    },
  },
};
