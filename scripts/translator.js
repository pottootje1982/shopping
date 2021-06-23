const { googleApiKey } = require("../config")
const { Translate } = require("@google-cloud/translate")

class Translator {
  constructor(cache, translateService) {
    this.cache = cache
    this.service = translateService || new Translate({ key: googleApiKey })
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
