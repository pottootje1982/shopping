const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const Memory = require("lowdb/adapters/Memory")
const path = require("path")

function getTranslation(db, key) {
  const result = db
    .get("translations")
    .find({ original: key })
    .value()
  return result || { original: key }
}

class TranslationsDb {
  constructor(file) {
    file = file && path.resolve(__dirname, file)
    const adapter = file ? new FileSync(file) : new Memory()
    this.db = low(adapter)
    this.db.defaults({ translations: [] }).write()
  }

  storeTranslations(originals, translations) {
    for (const [i, original] of originals.entries()) {
      this.db
        .get("translations")
        .push({ original, translation: translations[i] })
        .write()
    }
  }

  getTranslation(key) {
    const result = getTranslation(this.db, key)
    return result.translation
  }

  getTranslations(keys) {
    const translations = keys.map(key => getTranslation(this.db, key))
    const untranslated = translations
      .filter(t => !t.translation)
      .map(t => t.original)
    return {
      success: translations.every(t => t.translation),
      translations: translations.map(t => t.translation),
      untranslated
    }
  }

  translateRecipe(ingredients) {
    const products = ingredients.getProducts()
    const { translations } = this.getTranslations(products)
    ingredients.setProducts(translations)
  }
}

const translationsDb = new TranslationsDb("data/translations.json")

module.exports = { TranslationsDb, translationsDb }
