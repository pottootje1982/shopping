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

  storeOrder(recipes) {
    recipes.forEach(recipe => {
      db.get("recipes")
        .push(recipe)
        .write()
    })
  }

  async translateRecipes(...recipes) {
    recipes.forEach(recipe => {
      if (!recipe.parsedIngredients) {
        recipe.parsedIngredients = Ingredients.create(recipe.ingredients)
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
    delete newRecipe.mappings
    delete newRecipe.parsedIngredients
    this.setHash(newRecipe)
    await this.db
      .get("recipes")
      .find({
        uid: recipe.uid
      })
      .assign(newRecipe)
      .write()
    return newRecipe
  }

  addRecipe(recipe) {
    this.setHash(recipe)
    return this.db
      .get("recipes")
      .push(recipe)
      .write()
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

module.exports = RecipeDb
