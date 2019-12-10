var express = require("express")
const router = express.Router()

const Paprika = require("../scripts/paprika")
let recipeDb, translationsDb, ingToProduct, paprika
require("../scripts/recipe-db")("./mongo-client").then(dbs => {
  ;({ recipeDb, ingToProduct, translationsDb } = dbs)
  paprika = new Paprika(null, recipeDb)
})

const Translator = require("../scripts/translator")

router.get("/", async function(req, res) {
  const uid = req.query.uid
  const result = uid
    ? await recipeDb.getRecipe(uid)
    : await recipeDb.getRecipes()
  res.send(result)
})

router.put("/", async function(req, res) {
  const recipe = await recipeDb.editRecipe(req.body)
  console.log("Updating Paprika recipe:")
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
  prep_time: ""
}

router.post("/", async function(req, res) {
  let recipe = { ...defaultRecipe, ...req.body }
  recipe = await recipeDb.addRecipe(recipe)
  console.log("Adding recipe to Paprika:", recipe)
  await paprika.updateRecipe(recipe)
  res.send(await recipeDb.getRecipe(recipe.uid))
})

router.delete("/", async function(req, res) {
  const { success, recipe } = await recipeDb.removeRecipe(req.body)
  paprika.deleteRecipe(recipe)
  res.send(success)
})

router.get("/sync", async (req, res) => {
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

router.post("/translate", async function(req, res) {
  const recipe = await recipeDb.getRecipe(req.body.recipeId)
  const translator = new Translator(translationsDb)
  await translator.translate(recipe.ingredients.map(i => i.ingredient))
  // update recipe with values from cache
  await translationsDb.translateRecipes(recipe)
  const mapping = await ingToProduct.getMappings(recipe)
  res.send({ recipe, mapping })
})

module.exports = router
