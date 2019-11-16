const { PaprikaApi } = require("paprika-api")
const { paprikaUser, paprikaPass } = require("../config")

PaprikaApi.prototype.upsertRecipe = function(recipe) {
  const request = require("request-promise")
  var formData = {
    data: recipe
  }
  request.post(`https://www.paprikaapp.com/api/v1/sync/recipe/${uid}/`, {
    formData
  })
}

class Paprika {
  constructor(paprikaApi) {
    this.paprikaApi = paprikaApi || new PaprikaApi(paprikaUser, paprikaPass)
  }

  async getRecipe(uid) {
    return await this.paprikaApi.recipe(uid)
  }

  async getAllHydratedRecipes() {
    const recipesRaw = await this.paprikaApi.recipes()
    var recipes = []
    for (let i = 0; i < recipesRaw.length; i++) {
      const recipe = await this.getRecipe(recipesRaw[i].uid)
      recipes.push(recipe)
    }
    return recipes
  }

  async synchronize(localRecipes) {
    const remoteRecipes = await this.paprikaApi.recipes()
    const upsertToRemote = localRecipes.filter(local => {
      const remote = remoteRecipes.find(remote => remote.uid === local.uid)
      return !remote || remote.hash !== local.hash
    })
    for (const local in upsertToRemote) {
      this.paprikaApi.upsertRecipe(local)
    }
  }
}

module.exports = Paprika
