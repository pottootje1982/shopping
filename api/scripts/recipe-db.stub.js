const RecipeDb = require('./recipe-db')
const TranslationsDb = require('./translations-db')

const translationsDb = new TranslationsDb('db.test.json')
const recipeDb = new RecipeDb(translationsDb, 'db.test.json')
module.exports = recipeDb
