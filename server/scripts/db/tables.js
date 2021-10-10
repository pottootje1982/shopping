const IngredientProductDb = require('./table/ingredient-product')
const TranslationsDb = require('./table/translations')
const RecipeDb = require('./table/recipe')
const OrderDb = require('./table/order')
const UserDb = require('./table/user')

const { USE_MEMORY_DB } = require('../../config')

module.exports = async function createRecipeDb(connector, file) {
  connector = USE_MEMORY_DB ? './memory-db' : connector

  const createDb = require(connector)

  file = USE_MEMORY_DB ? 'data/db.api-test.json' : file
  const db = await createDb(file)
  const translationsDb = new TranslationsDb(db)
  const ingToProduct = new IngredientProductDb(db)
  const orderDb = new OrderDb(db)
  const userDb = new UserDb(db)

  const recipeDb = new RecipeDb(db, translationsDb, ingToProduct)
  return { recipeDb, ingToProduct, translationsDb, orderDb, userDb }
}
