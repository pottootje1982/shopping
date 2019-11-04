const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const { Ingredients } = require("./ingredients")
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
    if (typeof recipe.ingredients === "object") return recipe
    recipe.ingredients = Ingredients.create(recipe.ingredients)
    this.translationDb.translateRecipe(recipe.ingredients)
    return recipe
  }

  getRecipes() {
    const recipes = this.db.get("recipes").value()
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
}

module.exports = RecipeDb
