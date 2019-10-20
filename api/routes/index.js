var express = require('express')
var router = express.Router()
const RecipeDb = require('../scripts/recipe-db')
const {
  translationsDb
} = require('../scripts/translations-db')
const IngredientProductDb = require('../scripts/ingredient-product-db')
const AhApi = require('../scripts/ah-api')
const {
  ahUser,
  ahPass
} = require('../config')
const request = require('request-promise')

const recipeDb = new RecipeDb(translationsDb)
const mapping = new IngredientProductDb('data/db.json')
const Translator = require('../scripts/translator')

/* GET home page. */
router.get('/', function (_req, res) {
  res.render('index', {
    title: 'Express'
  })
})

router.get('/recipes', async function (_req, res) {
  const recipes = await recipeDb.getRecipes()
  res.send(recipes)
})

router.get('/search', async function (req, res) {
  const response = await request.get(
    `https://www.ah.nl/zoeken/api/products/search?query=${req.query.query}`
  )
  const cards = JSON.parse(response).cards
  res.send(cards.map(card => card.products[0]))
})

router.post('/translate', async function (req, res) {
  const recipe = recipeDb.getRecipe(req.body.recipeId)
  await Translator.create().translate(
    recipe.ingredients.map(i => i.ingredient)
  )
  // update recipe with values from cache
  translationsDb.translateRecipe(recipe.ingredients)
  res.send(recipe)
})

router.post('/choose', async function (req, res) {
  mapping.storeMapping(req.body.ingredient, req.body.product)
  res.send()
})

router.get('/mappings', async function (req, res) {
  const recipe = recipeDb.getRecipe(req.query.uid)
  const mappings = mapping.getMappings(recipe)
  res.send(mappings)
})

router.post('/order', async function (req, res) {
  const api = new AhApi(ahUser, ahPass)
  api.login()
  req.body.recipes.forEach(id => {
    const recipe = recipeDb.getRecipe(id)
    const order = mapping.pickOrder(recipe)
    api.addToShoppingList(order)
  })
})

module.exports = router