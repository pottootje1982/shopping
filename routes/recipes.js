var express = require("express")
const router = express.Router()
const { PAPRIKA_API } = require("../config")

const Paprika = require(PAPRIKA_API)
let recipeDb, translationsDb, ingToProduct, paprika
require("../scripts/db/tables")("./mongo-client").then((dbs) => {
  ;({ recipeDb, ingToProduct, translationsDb, orderDb } = dbs)
  paprika = new Paprika(null, recipeDb)
})

const Translator = require("../scripts/translator")

router.get("/", async function (_req, res) {
  const recipes = await recipeDb.getRecipes()
  const orders = await orderDb.getHydrated(recipes)
  const categories = await paprika.categories()
  res.send({ recipes, orders, categories })
})

router.put("/", async function (req, res) {
  let recipe = req.body
  recipe = await recipeDb.editRecipe(recipe)
  paprika.updateRecipe(recipe)
  recipe ? res.send(await recipeDb.getRecipe(recipe.uid)) : res.sendStatus(404)
})

const defaultRecipe = {
  photo: null,
  image_url: null,
  photo_hash: null,
  source: null,
  nutritional_info: "",
  scale: null,
  deleted: false,
  categories: [],
  servings: "",
  rating: 0,
  difficulty: null,
  notes: "",
  on_favorites: false,
  cook_time: "",
  prep_time: "",
}

router.post("/", async function (req, res) {
  const recipe = { ...defaultRecipe, ...req.body }
  await recipeDb.addRecipe(recipe)
  await paprika.updateRecipe(recipe)
  res.send(await recipeDb.getRecipe(recipe.uid))
})

router.delete("/", async function (req, res) {
  const success = await recipeDb.removeRecipe(req.body)
  paprika.deleteRecipe(req.body)
  res.send(success)
})

router.get("/sync", async (_req, res) => {
  const result = await paprika.synchronize(await recipeDb.getRecipesRaw())
  res.send(result)
})

router.post("/download", async (req, res) => {
  const url = req.body.url
  let recipe = await paprika.downloadRecipe(url)
  if (recipe) {
    await recipeDb.translateRecipes(recipe)
    recipe.source_url = url
  }
  res.send(recipe)
})

router.post("/translate", async function (req, res) {
  const recipe = await recipeDb.getRecipe(req.body.recipeId)
  if (!recipe) res.sendStatus(404)
  else {
    const translator = new Translator(translationsDb)
    try {
      await translator.translate(
        recipe.parsedIngredients.map((i) => i.ingredient)
      )
      // update recipe with values from cache
      await translationsDb.translateRecipes(recipe)
      const mapping = await ingToProduct.getMappings(recipe)
      res.send({ recipe, mapping })
    } catch ({ code, errors }) {
      console.log(errors)
      res.status(code).send(errors)
    }
  }
})

module.exports = router
