const express = require('express')
const router = express.Router()
const { PAPRIKA_API } = require('../config')
const { uniqBy } = require('ramda')

const Paprika = require(PAPRIKA_API)
let recipeDb, translationsDb, ingToProduct, orderDb, userDb
require('../scripts/db/tables')().then((dbs) => {
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
  const orders = await orderDb.getHydrated(req.user, recipes)
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

router.post('/', async (req, res, next) => {
  const recipe = { ...defaultRecipe, ...req.body }
  await recipeDb.addRecipe(recipe).catch(next)
  const paprika = await Paprika.create(recipeDb, userDb, req.user).catch(next)
  await paprika.updateRecipe(recipe).catch(next)
  res.status(201).send(await recipeDb.getRecipe(recipe.uid).catch(next))
})

router.delete('/', async (req, res, next) => {
  const recipes = req.body
  const paprika = await Paprika.create(recipeDb, userDb, req.user)
  const successes = await Promise.all(
    recipes.map(async (recipe) => {
      const success = await paprika
        .deleteRecipe(recipe)
        .catch(() => next({ err: 'Fail to delete from Paprika' }))
      const { _id } = recipe
      const removedRecipe = await recipeDb
        .removeRecipe(_id)
        .catch(() => next({ err: 'Fail to delete from recipe db' }))
      return removedRecipe && success
    })
  )

  const ok = successes.every((s) => s)
  res.status(ok ? 204 : 500).send()
})

router.get('/sync', async (req, res) => {
  const paprika = await Paprika.create(recipeDb, userDb, req.user)
  await paprika.synchronize(await recipeDb.all())
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

router.post('/translate', async (req, res, next) => {
  const recipe = await recipeDb.getRecipe(req.body.recipeId).catch(next)
  if (!recipe) res.sendStatus(404)
  else {
    const translator = new Translator(translationsDb)
    try {
      await translator
        .translate(recipe.parsedIngredients.map((i) => i.ingredient))
        .catch(next)
      const recipes = await recipeDb.translateRecipes(
        [recipe],
        req.query.supermarket
      )
      res.send({ recipe: recipes[0] })
    } catch (err) {
      next(err)
    }
  }
})

module.exports = router
