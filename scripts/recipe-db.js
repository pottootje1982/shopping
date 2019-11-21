const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const { Ingredients } = require("./ingredients")
const { ingToProduct } = require("../scripts/ingredient-product-db")
const { translationsDb } = require("../scripts/translations-db")
const path = require("path")
var crypto = require("crypto")

class RecipeDb {
  constructor(translationDb, file) {
    file = path.resolve(__dirname, file || "data/recipes.json")
    const adapter = new FileSync(file)
    this.db = low(adapter)
    this.db.defaults({ recipes: [] }).write()
    this.translationDb = translationDb
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
    recipe.mappings = ingToProduct.getMappings(recipe)
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
    return this.getRecipe(recipe.uid)
  }

  save() {
    this.db.get("recipes").write()
  }

  addRecipe(recipe) {
    this.setHash(recipe)
    this.db
      .get("recipes")
      .push(recipe)
      .write()
    return this.getRecipe(recipe.uid)
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

const recipeDb = new RecipeDb(translationsDb)

module.exports = { RecipeDb, recipeDb }
