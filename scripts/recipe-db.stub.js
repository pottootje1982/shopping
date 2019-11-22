const { RecipeDb } = require("./recipe-db")
const { TranslationsDb } = require("./translations-db")
const { IngredientProductDb } = require("./ingredient-product-db")
const createDb = require("./memory-db")

const translationsDb = new TranslationsDb("data/db.test.json")
const ingToProduct = new IngredientProductDb(createDb("data/db.test.json"))

module.exports = function(file) {
  return new RecipeDb(
    createDb(file || "./data/db.test.json"),
    translationsDb,
    ingToProduct
  )
}
