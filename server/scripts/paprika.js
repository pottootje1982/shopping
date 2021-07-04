const { PaprikaApi } = require("paprika-api")
const { PAPRIKA_USER, PAPRIKA_PASS } = require("../config")

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
      .on("finish", (err) => {
        if (err) return reject(err)
        else resolve()
      })
  })
}

PaprikaApi.prototype.upsertRecipe = async function (recipe) {
  delete recipe.mappings
  delete recipe.parsedIngredients
  delete recipe.categoryNames
  const request = require("request-promise")
  await createZip(JSON.stringify(recipe), "./file.gz")
  const res = await request.post(
    `https://www.paprikaapp.com/api/v1/sync/recipe/${recipe.uid}/`,
    {
      auth: {
        user: this.email,
        pass: this.password,
      },
      formData: {
        data: await fs.createReadStream("./file.gz"),
      },
    }
  )
  console.log(res)
  return res
}

PaprikaApi.prototype.downloadRecipe = async function (url) {
  const request = require("request-promise")
  const contents = await request.get(url)
  await createZip(contents, "./recipe.gz")
  let res = await request.post(`https://www.paprikaapp.com/api/v1/recipe/`, {
    auth: {
      user: this.email,
      pass: this.password,
    },
    formData: {
      url,
      html: await fs.createReadStream("./recipe.gz"),
    },
  })
  res = JSON.parse(res)
  return res.result
}

function compare(cat1, cat2) {
  const name1 = cat1.name.toLowerCase()
  const name2 = cat2.name.toLowerCase()
  if (name1 < name2) {
    return -1
  } else if (name1 > name2) {
    return 1
  } else {
    return 0
  }
}

class Paprika {
  constructor(paprikaApi, db) {
    this.paprikaApi = paprikaApi || new PaprikaApi(PAPRIKA_USER, PAPRIKA_PASS)
    this.recipeDb = db || recipeDb
  }

  getRecipe(uid) {
    return this.paprikaApi.recipe(uid)
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

  categories() {
    return this.paprikaApi.categories().then((categories) => {
      return categories.sort(compare)
    })
  }

  updateRecipe(recipe) {
    console.log("Updating Paprika recipe:", recipe.name)
    return this.paprikaApi.upsertRecipe(recipe)
  }

  deleteRecipe(recipe) {
    recipe.in_trash = true
    return this.paprikaApi.upsertRecipe(recipe)
  }

  downloadRecipe(url) {
    return this.paprikaApi.downloadRecipe(url)
  }

  async synchronize(localRecipes) {
    const remoteRecipes = await this.paprikaApi.recipes()
    const upsertToRemote = localRecipes.filter((local) => {
      const remote = remoteRecipes.find((remote) => remote.uid === local.uid)
      return !remote || remote.hash !== local.hash
    })
    for (const local of upsertToRemote) {
      let remote = remoteRecipes.find((r) => r.uid === local.uid)
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
    const insertToLocal = remoteRecipes.filter((recipe) => {
      const local = localRecipes.find((remote) => remote.uid === recipe.uid)
      return !local
    })
    for (let remote of insertToLocal) {
      remote = await this.paprikaApi.recipe(remote.uid)
      if (!remote.in_trash) {
        console.log(
          `Get new version of recipe '${remote.name}' from Paprika to local`
        )
        this.recipeDb.addRecipe(remote)
      }
    }
    return insertToLocal.length > 0
  }
}

module.exports = Paprika
