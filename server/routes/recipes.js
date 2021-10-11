const express = require('express')
const router = express.Router()
const { PAPRIKA_API } = require('../config')
const { uniqBy } = require('ramda')

const Paprika = require(PAPRIKA_API)
let recipeDb, translationsDb, ingToProduct, orderDb, userDb
require('../scripts/db/tables')('./mongo-client').then((dbs) => {
  ;({ recipeDb, ingToProduct, translationsDb, orderDb, userDb } = dbs)
})

const Translator = require('../scripts/translator')

router.get('/', async (req, res) => {
  const paprika = await Paprika.create(recipeDb, userDb, req.user)
  const categories = await paprika.categories()
  const recipes = await recipeDb.getRecipes(
    categories,
    req.query.supermarket,
    req.user
  )
  const orders = await orderDb.getHydrated(recipes)
  const uniqRecipes = uniqBy((r) => r.uid, recipes)
  res.send({ recipes: uniqRecipes, orders, categories })
})

router.put('/', async (req, res) => {
  let recipe = req.body
  recipe = await recipeDb.editRecipe(recipe)
  const paprika = await Paprika.create(recipeDb, userDb, req.user)
  paprika.updateRecipe(recipe)
  recipe ? res.send(await recipeDb.getRecipe(recipe.uid)) : res.sendStatus(404)
})

const defaultRecipe = {
  photo: null,
  image_url: null,
  photo_hash: null,
  source: null,
  nutritional_info: '',
  scale: null,
  deleted: false,
  categories: [],
  servings: '',
  rating: 0,
  difficulty: null,
  notes: '',
  on_favorites: false,
  cook_time: '',
  prep_time: ''
}

router.post('/', async (req, res) => {
  const recipe = { ...defaultRecipe, ...req.body }
  await recipeDb.addRecipe(recipe)
  const paprika = await Paprika.create(recipeDb, userDb, req.user)
  await paprika.updateRecipe(recipe)
  res.send(await recipeDb.getRecipe(recipe.uid))
})

router.delete('/', async (req, res) => {
  const recipes = req.body
  const paprika = await Paprika.create(recipeDb, userDb, req.user)
  const successes = await Promise.all(
    recipes.map(async (recipe) => {
      const success = await paprika.deleteRecipe(req.body)
      const removedRecipe = await recipeDb.removeRecipe(recipe)
      return removedRecipe && success
    })
  )
  res.send(successes.every((s) => s))
})

router.get('/sync', async (req, res) => {
  const paprika = await Paprika.create(recipeDb, userDb, req.user)
  await paprika.synchronize(await recipeDb.getRecipesRaw())
  const categories = await paprika.categories()
  const recipes = await recipeDb.getRecipes(
    categories,
    req.query.supermarket,
    req.user
  )
  const uniqRecipes = uniqBy((r) => r.uid, recipes)
  res.send(uniqRecipes)
})

router.post('/download', async (req, res) => {
  const url = req.body.url
  const paprika = await Paprika.create(recipeDb, userDb, req.user)
  const recipe = await paprika.downloadRecipe(url)
  if (recipe) {
    await recipeDb.translateRecipes([recipe])
    recipe.source_url = url
  }
  res.send(recipe)
})

router.post('/translate', async (req, res) => {
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
      const supermarket = req.query.supermarket
      const mapping = await ingToProduct.getMappings(recipe, supermarket)
      res.send({ recipe, mapping })
    } catch ({ code, errors }) {
      console.log(errors)
      res.status(code).send(errors)
    }
  }
})

module.exports = router
