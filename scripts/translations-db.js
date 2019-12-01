async function getTranslation(db, key) {
  let result = await db
    .get("translations")
    .find({ original: key.toLowerCase() })
    .value()
  if (!result) {
    const reverse = await db
      .get("translations")
      .find({ translation: key })
      .value()
    result = reverse && {
      original: reverse.translation,
      translation: reverse.translation
    }
  }
  return result || { original: key }
}

class TranslationsDb {
  constructor(db) {
    this.db = db
    this.db.defaults({ translations: [] }).write()
  }

  async storeTranslations(originals, translations) {
    for (let [i, original] of originals.entries()) {
      original = original.toLowerCase()
      await this.db
        .get("translations")
        .push({ original, translation: translations[i] })
        .write()
    }
  }

  async getTranslation(key) {
    const result = await getTranslation(this.db, key)
    return result.translation
  }

  async getTranslations(keys) {
    let translations = keys.map(key => getTranslation(this.db, key))
    translations = await Promise.all(translations)
    const untranslated = translations
      .filter(t => !t.translation)
      .map(t => t.original)
    return {
      success: translations.every(t => t.translation),
      translations: translations.map(t => t.translation),
      untranslated
    }
  }

  async translateRecipe(ingredients) {
    const products = ingredients.getProducts()
    const { translations } = await this.getTranslations(products)
    ingredients.setProducts(translations)
  }
}

module.exports = TranslationsDb
