const { Ingredients } = require("./ingredients")
const { ingToProduct } = require("./ingredient-product-db")
const { translationsDb } = require("./translations-db")
const createDb = require("./file-db")
var crypto = require("crypto")

class RecipeDb {
  constructor(db, translationDb, ingToProduct) {
    this.db = db
    this.db.defaults({ recipes: [] }).write()
    this.translationDb = translationDb
    this.ingToProduct = ingToProduct
  }

  storeRecipes(recipes) {
    recipes.forEach(recipe => {
      db.get("recipes")
        .push(recipe)
        .write()
    })
  }

  translateRecipe(recipe) {
    if (typeof recipe.ingredients !== "object") {
      recipe.ingredients = Ingredients.create(recipe.ingredients)
    }
    this.translationDb.translateRecipe(recipe.ingredients)
    recipe.mappings = this.ingToProduct.getMappings(recipe)
    return recipe
  }

  getRecipes() {
    const recipes = this.db
      .get("recipes")
      .cloneDeep()
      .value()
    for (const recipe of recipes) {
      this.translateRecipe(recipe)
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

  getRecipe(uid) {
    const recipe = this.getRecipeRaw(uid)
    return this.translateRecipe(recipe)
  }

  setHash(recipe) {
    const str = JSON.stringify(recipe)
    recipe.hash = crypto
      .createHash("sha256")
      .update(str)
      .digest("hex")
  }

  editRecipe(recipe) {
    const oldRecipe = this.getRecipeRaw(recipe.uid)
    const newRecipe = { ...oldRecipe, ...recipe }
    this.setHash(newRecipe)
    this.db
      .get("recipes")
      .find({
        uid: recipe.uid
      })
      .assign(newRecipe)
      .unset("mappings")
      .write()
    return this.getRecipeRaw(recipe.uid)
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

const recipeDb = new RecipeDb(
  createDb("./data/recipes.json"),
  translationsDb,
  ingToProduct
)

module.exports = { RecipeDb, recipeDb }
