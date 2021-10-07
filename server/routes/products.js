const express = require('express')
const router = express.Router()

const createSupermarket = require('../scripts/supermarkets')

let ingToProduct
require('../scripts/db/tables')('./mongo-client').then((dbs) => {
  ;({ ingToProduct } = dbs)
})

router.get('/', async (req, res) => {
  const { supermarket, authKey, query, full } = req.query
  const api = createSupermarket(supermarket, ingToProduct, authKey)
  await api.login()
  const products = await api.search(query, full).catch((err) => {
    console.log(err.message, err.error, err.stack)
  })
  res.send(products)
})

router.post('/choose', async (req, res) => {
  const { ingredient, product, supermarket } = req.body
  ingToProduct.storeMapping(ingredient, product, supermarket).catch((err) => {
    console.log(err)
  })
  res.send()
})

router.get('/:productId/product', async (req, res) => {
  const api = createSupermarket(req.query.supermarket, ingToProduct)
  const product = await api.getProduct(parseInt(req.params.productId))
  res.send(product)
})

module.exports = router
