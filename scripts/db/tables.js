const IngredientProductDb = require("./table/ingredient-product")
const TranslationsDb = require("./table/translations")
const RecipeDb = require("./table/recipe")
const OrderDb = require("./table/order")

module.exports = async function createRecipeDb(connector, file) {
  const createDb = require(connector)

  file = file === undefined ? "data/db.json" : file
  const db = await createDb(file)
  const translationsDb = new TranslationsDb(db)
  const ingToProduct = new IngredientProductDb(db)
  const orderDb = new OrderDb(db)

  const recipeDb = new RecipeDb(db, translationsDb, ingToProduct)
  return { recipeDb, ingToProduct, translationsDb, orderDb }
}
