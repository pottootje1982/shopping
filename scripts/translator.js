const { GOOGLE_API_KEY } = require("../config")
const { Translate } = require("@google-cloud/translate")

class Translator {
  constructor(cache, translateService) {
    this.cache = cache
    this.service = translateService || new Translate({ key: GOOGLE_API_KEY })
  }

  async translate(itemsToTranslate, source, target) {
    let { success, translations, untranslated } =
      await this.cache.getTranslations(itemsToTranslate)

    source = source || "en"
    target = target || "nl"

    if (!success) {
      ;[translations] = await this.service.translate(untranslated, target)
      await this.cache.storeTranslations(untranslated, translations)
    }

    ;({ success, translations, untranslated } =
      await this.cache.getTranslations(itemsToTranslate))

    return translations
  }
}

module.exports = Translator
