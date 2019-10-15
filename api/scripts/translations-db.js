const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Memory = require('lowdb/adapters/Memory')

function getTranslation(db, key) {
  const result = db
    .get('translations')
    .find({ original: key })
    .value()
  return result || { original: key }
}

class TranslationsDb {
  constructor(file) {
    const adapter = file ? new FileSync(file) : new Memory()
    this.db = low(adapter)
    this.db.defaults({ translations: [] }).write()
  }

  storeTranslations(originals, translations) {
    for (const [i, original] of originals.entries()) {
      this.db
        .get('translations')
        .push({ original, translation: translations[i] })
        .write()
    }
  }

  getTranslation(key) {
    return getTranslation(this.db, key).translation
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

module.exports = TranslationsDb
