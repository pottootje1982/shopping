const Table = require('./table')

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

class TranslationsDb extends Table {
  constructor(client) {
    super(client, 'translations')
  }

  async storeTranslations(originals, translations) {
    for (let [i, original] of originals.entries()) {
      original = original.toLowerCase()
      await this.table().insertOne({ original, translation: translations[i] })
    }
  }

  async getTranslation(key) {
    const result = getTranslation(await this.all(), key)
    return result.translation
  }

  async getTranslations(keys) {
    return getTranslations(await this.all(), keys)
  }

  async translateRecipes(recipes) {
    const allTranslations = await this.all()
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
