const { RecipeDb } = require("./recipe-db")
const { TranslationsDb } = require("./translations-db")
const { IngredientProductDb } = require("./ingredient-product-db")
const createDb = require("./mongo-client")
const fileDb = require("./file-db")

const translationsDb = new TranslationsDb("data/db.test.json")
const ingToProduct = new IngredientProductDb(fileDb("data/db.test.json"))

module.exports = async function() {
  return new RecipeDb(await createDb(), translationsDb, ingToProduct)
}
