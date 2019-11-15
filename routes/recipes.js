var express = require('express')
const router = express.Router()
const RecipeDb = require('../scripts/recipe-db')
const { translationsDb } = require('../scripts/translations-db')
const { ingToProduct } = require('../scripts/ingredient-product-db')

const recipeDb = new RecipeDb(translationsDb)
const Translator = require('../scripts/translator')

router.get('/', async function(req, res) {
  const uid = req.query.uid
  const result = uid
    ? await recipeDb.getRecipe(uid)
    : await recipeDb.getRecipes()
  res.send(result)
})

router.put('/', async function(req, res) {
  const recipe = recipeDb.editRecipe(req.body)
  res.send(recipe)
})

router.post('/', async function(req, res) {
  const recipe = recipeDb.addRecipe(req.body)
  res.send(recipe)
})

router.delete('/', async function(req, res) {
  const success = recipeDb.removeRecipe(req.body)
  res.send(success)
})

router.post('/translate', async function(req, res) {
  const recipe = recipeDb.getRecipe(req.body.recipeId)
  await Translator.create().translate(recipe.ingredients.map(i => i.ingredient))
  // update recipe with values from cache
  translationsDb.translateRecipe(recipe.ingredients)
  const mapping = ingToProduct.getMappings(recipe)
  res.send({ recipe, mapping })
})

module.exports = router
