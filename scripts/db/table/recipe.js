const { Ingredients } = require("../../ingredients")
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

  async translateRecipes(...recipes) {
    recipes.forEach(recipe => {
      if (typeof recipe.ingredients !== "object") {
        recipe.ingredients = Ingredients.create(recipe.ingredients)
      }
    })
    await this.translationDb.translateRecipes(...recipes)
    return this.ingToProduct.getMappings(...recipes)
  }

  async getRecipes() {
    const recipes = await this.db
      .get("recipes")
      .cloneDeep()
      .value()
    await this.translateRecipes(...recipes)
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
    await this.translateRecipes(recipe)
    return recipe
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

  async removeRecipe(recipe) {
    const oldRecipe = await this.getRecipeRaw(recipe.uid)
    const success = await this.db
      .get("recipes")
      .remove({
        uid: recipe.uid
      })
      .write()
    return { success, oldRecipe }
  }
}

module.exports = RecipeDb
