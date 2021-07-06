function getTranslation(translations, key) {
  let result = translations.find((t) => t.original === key.toLowerCase())
  if (!result) {
    const reverse = translations.find((t) => t.translation === key)
    result = reverse && {
      original: reverse.translation,
      translation: reverse.translation
    }
  }
  return result || { original: key }
}

function getTranslations(translations, keys) {
  translations = keys.map((key) => getTranslation(translations, key))
  const untranslated = translations
    .filter((t) => !t.translation)
    .map((t) => t.original)
  return {
    success: translations.every((t) => t.translation),
    translations: translations.map((t) => t.translation),
    untranslated
  }
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
        .get('translations')
        .push({ original, translation: translations[i] })
        .write()
    }
  }

  get translations() {
    return this.db.get('translations').value()
  }

  async getTranslation(key) {
    const result = getTranslation(await this.translations, key)
    return result.translation
  }

  async getTranslations(keys) {
    return getTranslations(await this.translations, keys)
  }

  async translateRecipes(...recipes) {
    const allTranslations = await this.translations
    return recipes.map(({ parsedIngredients, ...r }) => {
      const ingredients = parsedIngredients
      const products = parsedIngredients.map((i) => i.ingredient)
      const { translations } = getTranslations(allTranslations, products)
      const translated = ingredients.translate(translations)
      return { ...r, parsedIngredients: translated }
    })
  }
}

module.exports = TranslationsDb
