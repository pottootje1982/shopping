const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const { Ingredients } = require("./ingredients")
const { ingToProduct } = require("../scripts/ingredient-product-db")
const path = require("path")

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

  getRecipe(uid) {
    const recipe = this.db
      .get("recipes")
      .find({ uid })
      .value()
    return this.translateRecipe(recipe)
  }

  editRecipe(recipe) {
    const table = this.db.get("recipes")
    const foundRecipe = table.find({
      uid: recipe.uid
    })
    if (foundRecipe.value()) {
      foundRecipe.assign(recipe).write()
    }
  }
}

module.exports = RecipeDb
