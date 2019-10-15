const { googleApiKey } = require('../config')
const { TranslateService } = require('@google-cloud/translate')

module.exports = class Translator {
  constructor(cache, translateService) {
    this.cache = cache
    this.service =
      translateService ||
      new TranslateService({ key: googleApiKey, model: 'base' })
  }

  async translate(itemsToTranslate, target) {
    let { success, translations, untranslated } = this.cache.getTranslations(
      itemsToTranslate
    )

    if (!success) {
      ;[translations] = await this.service.translate(untranslated, target)
      this.cache.storeTranslations(untranslated, translations)
    }

    ;({ success, translations, untranslated } = this.cache.getTranslations(
      itemsToTranslate
    ))

    return translations
  }
}
