var express = require("express")
const router = express.Router()
const uuidv1 = require("uuid/v1")
const { dbConnector, useMemoryDb } = require("../config")

const Paprika = require("../scripts/paprika")
let recipeDb, translationsDb, ingToProduct, paprika
require("../scripts/db/tables")(dbConnector).then((dbs) => {
  ;({ recipeDb, ingToProduct, translationsDb, orderDb } = dbs)
  paprika = new Paprika(null, recipeDb)
})

const Translator = require("../scripts/translator")

router.get("/", async function (req, res) {
  const recipes = await recipeDb.getRecipes()
  const orders = await orderDb.getHydrated(recipes)
  const categories = await paprika.categories()
  res.send({ recipes, orders, categories })
})

router.put("/", async function (req, res) {
  let recipe = req.body
  recipe = await recipeDb.editRecipe(recipe)
  console.log(`Updating Paprika recipe: ${recipe.name}`)
  paprika.updateRecipe(recipe)
  res.send(await recipeDb.getRecipe(recipe.uid))
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
  recipe.uid = recipe.uid || uuidv1()
  await recipeDb.addRecipe(recipe)
  console.log("Adding recipe to Paprika:", recipe.name)
  await paprika.updateRecipe(recipe)
  res.send(await recipeDb.getRecipe(recipe.uid))
})

router.delete("/", async function (req, res) {
  const success = await recipeDb.removeRecipe(req.body)
  paprika.deleteRecipe(req.body)
  res.send(success)
})

router.get("/sync", async (_req, res) => {
  if (!useMemoryDb) {
    const result = await paprika.synchronize(await recipeDb.getRecipesRaw())
    res.send(result)
  } else res.status(200).send()
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
  const translator = new Translator(translationsDb)
  await translator.translate(recipe.parsedIngredients.map((i) => i.ingredient))
  // update recipe with values from cache
  await translationsDb.translateRecipes(recipe)
  const mapping = await ingToProduct.getMappings(recipe)
  res.send({ recipe, mapping })
})

module.exports = router
