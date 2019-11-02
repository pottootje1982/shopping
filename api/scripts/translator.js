const { googleApiKey } = require("../config")
const { Translate } = require("@google-cloud/translate")
const { translationsDb } = require("../scripts/translations-db")

class Translator {
  constructor(cache, translateService) {
    this.cache = cache
    this.service = translateService || new Translate({ key: googleApiKey })
  }

  async translate(itemsToTranslate, source, target) {
    let { success, translations, untranslated } = this.cache.getTranslations(
      itemsToTranslate
    )

    source = source || "en"
    target = target || "nl"

    if (!success) {
      translations = await this.service.translate(untranslated, target)
      this.cache.storeTranslations(untranslated, translations)
    }

    ;({ success, translations, untranslated } = this.cache.getTranslations(
      itemsToTranslate
    ))

    return translations
  }
}

function create() {
  return new Translator(translationsDb)
}

module.exports = { Translator, create }
