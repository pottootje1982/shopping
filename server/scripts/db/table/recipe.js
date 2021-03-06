const { Ingredients } = require('../../ingredients')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')

class RecipeDb {
  constructor (db, translationDb, ingToProduct) {
    this.db = db
    this.db.defaults({ recipes: [] }).write()
    this.translationDb = translationDb
    this.ingToProduct = ingToProduct
  }

  close () {
    this.db.close()
  }

  storeOrder (recipes) {
    recipes.forEach((recipe) => {
      this.db.get('recipes').push(recipe).write()
    })
  }

  async translateRecipes (...recipes) {
    recipes.forEach((recipe) => {
      if (
        !recipe.parsedIngredients ||
        recipe.parsedIngredients.constructor.name !== 'Ingredients'
      ) {
        recipe.parsedIngredients = Ingredients.create(recipe.ingredients)
      }
    })
    await this.translationDb.translateRecipes(...recipes)
    return this.ingToProduct.getMappings(...recipes)
  }

  addCategoryNames (recipes, cats = []) {
    return recipes.map((recipe) => {
      const { categories = [] } = recipe
      const categoryNames = categories
        .map((uid) =>
          cats.find((c) => c.uid.toLowerCase() === uid.toLowerCase())
        )
        .filter((c) => c)
        .map((c) => c.name)
      return {
        ...recipe,
        categoryNames: categoryNames || []
      }
    })
  }

  async getRecipes (categories) {
    const recipes = await this.db.get('recipes').cloneDeep().value()
    const recipesWithCategoryNames = this.addCategoryNames(recipes, categories)
    await this.translateRecipes(...recipesWithCategoryNames)
    return recipesWithCategoryNames
  }

  getRecipesRaw () {
    return this.db.get('recipes').value()
  }

  getRecipeRaw (uid) {
    return this.db.get('recipes').find({ uid }).cloneDeep().value()
  }

  async getRecipe (uid) {
    const recipe = await this.getRecipeRaw(uid)
    if (recipe) await this.translateRecipes(recipe)
    return recipe
  }

  setHash (recipe) {
    const str = JSON.stringify(recipe)
    recipe.hash = crypto.createHash('sha256').update(str).digest('hex')
  }

  async editRecipe (recipe) {
    const oldRecipe = await this.getRecipeRaw(recipe.uid)
    if (!oldRecipe) return null
    const newRecipe = { ...oldRecipe, ...recipe }
    delete newRecipe.mappings
    delete newRecipe.parsedIngredients
    delete newRecipe.categoryNames
    this.setHash(newRecipe)
    await this.db
      .get('recipes')
      .find({
        uid: recipe.uid
      })
      .assign(newRecipe)
      .write()
    return newRecipe
  }

  addRecipe (recipe) {
    // delete recipe.parsedIngredients
    recipe.uid = recipe.uid || uuidv1()
    this.setHash(recipe)
    return this.db.get('recipes').push(recipe).write()
  }

  removeRecipe (recipe) {
    return this.db
      .get('recipes')
      .remove({
        uid: recipe.uid
      })
      .write()
  }
}

module.exports = RecipeDb
