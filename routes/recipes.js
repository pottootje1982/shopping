var express = require("express")
const router = express.Router()
const { recipeDb } = require("../scripts/recipe-db")
const Paprika = require("../scripts/paprika")
const { translationsDb } = require("../scripts/translations-db")
const { ingToProduct } = require("../scripts/ingredient-product-db")

const Translator = require("../scripts/translator")
const paprika = new Paprika()

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
  recipe = recipeDb.addRecipe(recipe)
  console.log("Adding recipe to Paprika:", recipe)
  paprika.updateRecipe(recipe)
  res.send(await recipeDb.getRecipe(recipe.uid))
})

router.delete("/", async function(req, res) {
  const success = recipeDb.removeRecipe(req.body)
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
    recipe = recipeDb.translateRecipe(recipe)
    recipe.source_url = url
  }
  res.send(recipe)
})

router.post("/translate", async function(req, res) {
  const recipe = await recipeDb.getRecipe(req.body.recipeId)
  await Translator.create().translate(recipe.ingredients.map(i => i.ingredient))
  // update recipe with values from cache
  translationsDb.translateRecipe(recipe.ingredients)
  const mapping = ingToProduct.getMappings(recipe)
  res.send({ recipe, mapping })
})

module.exports = router
