const express = require('express')
const router = express.Router()

const create = require('../scripts/supermarkets')

let ingToProduct, userDb
require('../scripts/db/tables')('./mongo-client').then((dbs) => {
  ;({ ingToProduct, userDb } = dbs)
})

router.get('/', async (req, res) => {
  const { supermarket, query, full } = req.query
  const api = await create(supermarket, ingToProduct, userDb, req.user)
  const products = await api.search(query, full).catch((err) => {
    console.log(`Searching for ${query} failed: ${err.message}`)
    return []
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
  const { mail, query } = req
  const api = await create(query.supermarket, ingToProduct, userDb, mail)
  const product = await api.getProduct(parseInt(req.params.productId))
  res.send(product)
})

module.exports = router
