const { PaprikaApi } = require("paprika-api")
const { paprikaUser, paprikaPass } = require("../config")
const request = require("request")
const { recipeDb } = require("../scripts/recipe-db")

const fs = require("fs")
const zlib = require("zlib")

function createZip(recipe, fn) {
  return new Promise((resolve, reject) => {
    const { Readable } = require("stream")
    const s = new Readable()
    s.push(recipe)
    s.push(null)

    const writeStream = fs.createWriteStream(fn)
    const zip = zlib.createGzip()
    s.pipe(zip)
      .pipe(writeStream)
      .on("finish", err => {
        if (err) return reject(err)
        else resolve()
      })
  })
}

PaprikaApi.prototype.upsertRecipe = async function(recipe) {
  await createZip(JSON.stringify(recipe), "./file.gz")
  const res = await request.post(
    `https://www.paprikaapp.com/api/v1/sync/recipe/${recipe.uid}/`,
    {
      auth: {
        user: this.email,
        pass: this.password
      },
      formData: {
        data: await fs.createReadStream("./file.gz")
      }
    }
  )
  return res
}

class Paprika {
  constructor(paprikaApi, db) {
    this.paprikaApi = paprikaApi || new PaprikaApi(paprikaUser, paprikaPass)
    this.recipeDb = db || recipeDb
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

  async syncRecipe(recipe) {
    await this.paprikaApi.upsertRecipe(recipe)
  }

  async synchronize(localRecipes) {
    const remoteRecipes = await this.paprikaApi.recipes()
    const upsertToRemote = localRecipes.filter(local => {
      const remote = remoteRecipes.find(remote => remote.uid === local.uid)
      return !remote || remote.hash !== local.hash
    })
    for (const local of upsertToRemote) {
      let remote = remoteRecipes.find(r => r.uid === local.uid)
      remote = remote && (await this.paprikaApi.recipe(remote.uid))
      if (
        !remote ||
        (remote.hash !== local.hash && local.created > remote.created)
      ) {
        console.log(`Saving recipe '${local.name}' to Paprika`)
        await this.paprikaApi.upsertRecipe(local)
      } else if (
        remote &&
        remote.hash !== local.hash &&
        remote.created > local.created
      ) {
        this.recipeDb.editRecipe(remote)
      }
    }
    const insertToLocal = remoteRecipes.filter(recipe => {
      const local = localRecipes.find(remote => remote.uid === recipe.uid)
      return !local
    })
    for (let remote of insertToLocal) {
      remote = await this.paprikaApi.recipe(remote.uid)
      console.log(
        `Get new version of recipe '${remote.name}' from Paprika to local`
      )
      this.recipeDb.addRecipe(remote)
    }
    return insertToLocal.length > 0 ? this.recipeDb.getRecipes() : null
  }
}

module.exports = Paprika
