let PaprikaApi = require('paprika-api')
const { paprikaUser, paprikaPass } = require('../config')

let paprikaApi = new PaprikaApi.PaprikaApi(paprikaUser, paprikaPass)

async function getRecipe(uid) {
  return await paprikaApi.recipe(uid)
}

async function getAllHydratedRecipes() {
  const recipesRaw = await paprikaApi.recipes()
  var recipes = []
  for (let i = 0; i < recipesRaw.length; i++) {
    const recipe = await getRecipe(recipesRaw[i].uid)
    recipes.push(recipe)
  }
  return recipes
}

module.exports = getAllHydratedRecipes
