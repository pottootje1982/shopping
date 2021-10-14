const express = require('express')
const router = express.Router()

const create = require('../scripts/supermarkets')

let ingToProduct, userDb
require('../scripts/db/tables')('./mongo-client').then((dbs) => {
  ;({ ingToProduct, userDb } = dbs)
})

router.use((req, res, next) => {
  const { supermarket } = req.query
  const { user } = req
  if (!supermarket) return res.status(400).send('Specify supermarket in query')
  if (!user && supermarket === 'picnic' && !req.url.startsWith('/choose'))
    return res
      .status(401)
      .send(`For supermarket ${supermarket} you need to be signed in`)
  next()
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
  const { ingredient, product } = req.body
  const { supermarket } = req.query
  ingToProduct.storeMapping(ingredient, product, supermarket).catch((err) => {
    console.log(err)
  })
  res.status(201).send()
})

router.get('/:productId/product', async (req, res) => {
  const { user, query } = req
  const api = await create(query.supermarket, ingToProduct, userDb, user)
  const product = await api.getProduct(req.params.productId)
  if (!product) res.status(404).send()
  else res.send(product)
})

module.exports = router
