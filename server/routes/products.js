const express = require('express')
const router = express.Router()
const AhApi = require('../scripts/ah-api')
let recipeDb, ingToProduct, api
require('../scripts/db/tables')('./mongo-client').then((dbs) => {
  ;({ recipeDb, ingToProduct } = dbs)
  api = new AhApi(ingToProduct)
})

router.get('/', async function(req, res) {
  const products = await api
    .search(req.query.query, req.query.full)
    .catch((err) => {
      console.log(err.message, err.error, err.stack)
    })
  res.send(products)
})

router.post('/choose', async function(req, res) {
  ingToProduct
    .storeMapping(req.body.ingredient, req.body.product)
    .catch((err) => {
      console.log(err)
    })
  res.send()
})

router.get('/:productId/product', async function(req, res) {
  const product = await api.getProduct(parseInt(req.params.productId))
  res.send(product)
})

router.get('/mappings', async function(req, res) {
  const recipe = await recipeDb.getRecipe(req.query.uid)
  if (!recipe) return res.sendStatus(404)
  else {
    await ingToProduct.getMappings(recipe)
    res.send(recipe.mappings)
  }
})

module.exports = router
