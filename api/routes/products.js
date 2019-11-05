var express = require('express')
var router = express.Router()
const RecipeDb = require('../scripts/recipe-db')
const { translationsDb } = require('../scripts/translations-db')
const { ingToProduct } = require('../scripts/ingredient-product-db')
const AhApi = require('../scripts/ah-api')
const { ahUser, ahPass } = require('../config')

const recipeDb = new RecipeDb(translationsDb)
const api = new AhApi(ahUser, ahPass)

router.get('/', async function(req, res) {
  const products = await api.search(req.query.query, req.query.full)
  res.send(products)
})

router.post('/choose', async function(req, res) {
  ingToProduct.storeMapping(req.body.ingredient, req.body.product)
  res.send()
})

router.get('/mappings', async function(req, res) {
  const recipe = recipeDb.getRecipe(req.query.uid)
  const mappings = ingToProduct.getMappings(recipe)
  res.send(mappings)
})

router.post('/order', async function(req, res) {
  api.login()
  req.body.recipes.forEach(async function(id) {
    const recipe = recipeDb.getRecipe(id)
    const order = ingToProduct.pickOrder(recipe)
    await api.addToShoppingList(order)
  })
  res.send()
})

module.exports = router
