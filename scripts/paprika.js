const { PaprikaApi } = require("paprika-api")
const { paprikaUser, paprikaPass } = require("../config")

PaprikaApi.prototype.upsertRecipe = async function(recipe) {
  const request = require("request-promise")
  var formData = {
    data: recipe
  }
  await request.post(`https://www.paprikaapp.com/api/v1/sync/recipe/${uid}/`, {
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

  async getRecipes() {
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
    for (const local of upsertToRemote) {
      let remote = remoteRecipes.find(r => r.uid === local.uid)
      remote = remote && this.paprikaApi.recipe(remote.uid)
      if (
        !remote ||
        (remote.hash !== local.hash && local.created > remote.created)
      ) {
        await this.paprikaApi.upsertRecipe(local)
      } else if (
        remote &&
        remote.hash !== local.hash &&
        remote.created > local.created
      ) {
        localRecipes.splice(localRecipes.indexOf(local), 1, remote)
      }
    }
    const insertToLocal = remoteRecipes.filter(recipe => {
      const local = localRecipes.find(remote => remote.uid === recipe.uid)
      return !local
    })
    for (let remote of insertToLocal) {
      let local = localRecipes.find(l => l.uid === remote.uid)
      remote = this.paprikaApi.recipe(remote.uid)
      localRecipes.push(remote)
    }
  }
}

module.exports = Paprika
