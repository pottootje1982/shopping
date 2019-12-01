const { Ingredients } = require("./ingredients")
const IngredientProductDb = require("./ingredient-product-db")
const TranslationsDb = require("./translations-db")
var crypto = require("crypto")

class RecipeDb {
  constructor(db, translationDb, ingToProduct) {
    this.db = db
    this.db.defaults({ recipes: [] }).write()
    this.translationDb = translationDb
    this.ingToProduct = ingToProduct
  }

  close() {
    this.db.close()
  }

  storeRecipes(recipes) {
    recipes.forEach(recipe => {
      db.get("recipes")
        .push(recipe)
        .write()
    })
  }

  async translateRecipe(recipe) {
    if (typeof recipe.ingredients !== "object") {
      recipe.ingredients = Ingredients.create(recipe.ingredients)
    }
    await this.translationDb.translateRecipe(recipe.ingredients)
    recipe.mappings = await this.ingToProduct.getMappings(recipe)
    return recipe
  }

  async getRecipes() {
    const recipes = await this.db
      .get("recipes")
      .cloneDeep()
      .value()
    for (const recipe of recipes) {
      await this.translateRecipe(recipe)
    }
    return recipes
  }

  getRecipesRaw() {
    return this.db.get("recipes").value()
  }

  getRecipeRaw(uid) {
    return this.db
      .get("recipes")
      .find({ uid })
      .cloneDeep()
      .value()
  }

  async getRecipe(uid) {
    const recipe = await this.getRecipeRaw(uid)
    return this.translateRecipe(recipe)
  }

  setHash(recipe) {
    const str = JSON.stringify(recipe)
    recipe.hash = crypto
      .createHash("sha256")
      .update(str)
      .digest("hex")
  }

  async editRecipe(recipe) {
    const oldRecipe = await this.getRecipeRaw(recipe.uid)
    const newRecipe = { ...oldRecipe, ...recipe }
    this.setHash(newRecipe)
    await this.db
      .get("recipes")
      .find({
        uid: recipe.uid
      })
      .assign(newRecipe)
      .unset("mappings")
      .write()
    return await this.getRecipeRaw(recipe.uid)
  }

  addRecipe(recipe) {
    this.setHash(recipe)
    this.db
      .get("recipes")
      .push(recipe)
      .write()
    return this.getRecipeRaw(recipe.uid)
  }

  removeRecipe(recipe) {
    return this.db
      .get("recipes")
      .remove({
        uid: recipe.uid
      })
      .write()
  }
}

async function createRecipeDb(connector, file) {
  const createDb = require(connector)

  file = file === undefined ? "data/db.json" : file
  const db = await createDb(file)
  const translationsDb = new TranslationsDb(db)
  const ingToProduct = new IngredientProductDb(db)

  const recipeDb = new RecipeDb(db, translationsDb, ingToProduct)
  return { recipeDb, ingToProduct, translationsDb }
}

module.exports = createRecipeDb
