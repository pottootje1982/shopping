const IngredientProductDb = require('./table/ingredient-product')
const TranslationsDb = require('./table/translations')
const RecipeDb = require('./table/recipe')
const OrderDb = require('./table/order')
const UserDb = require('./table/user')

module.exports = async function createRecipeDb(connector) {
  const createDb = require(connector)

  const db = await createDb()
  const translationsDb = new TranslationsDb(db)
  const ingToProduct = new IngredientProductDb(db)
  const orderDb = new OrderDb(db)
  const userDb = new UserDb(db)

  const recipeDb = new RecipeDb(db, translationsDb, ingToProduct)
  return { recipeDb, ingToProduct, translationsDb, orderDb, userDb }
}
