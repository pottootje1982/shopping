const RecipeDb = require('./recipe-db')
const TranslationsDb = require('./translations-db')

const translationsDb = new TranslationsDb('data/db.test.json')
const recipeDb = new RecipeDb(translationsDb, 'data/db.test.json')
module.exports = recipeDb
