const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { Ingredients } = require('./ingredients')
const path = require('path')

function getRecipes(db) {
  const recipes = db.get('recipes').value()
  for (const recipe of recipes) {
    if (typeof recipe.ingredients === 'object') continue
    recipe.ingredients = Ingredients.create(recipe.ingredients)
  }
  return recipes
}

class RecipeDb {
  constructor(translationDb, file) {
    file = path.resolve(__dirname, file || 'data/db.json')
    const adapter = new FileSync(file)
    const db = low(adapter)
    db.defaults({ recipes: [] }).write()

    this.recipes = getRecipes(db)
    this.recipes.forEach(recipe => {
      translationDb.translateRecipe(recipe.ingredients)
    })
  }

  storeRecipes(recipes) {
    recipes.forEach(recipe => {
      db.get('recipes')
        .push(recipe)
        .write()
    })
  }

  getRecipes() {
    return this.recipes
  }

  getRecipe(uid) {
    return this.recipes.find(r => r.uid === uid)
  }
}

module.exports = RecipeDb
