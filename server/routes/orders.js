'use strict'

const express = require('express')
const router = express.Router()
let orderDb, ingToProduct
const createSupermarket = require('../scripts/supermarkets')

require('../scripts/db/tables')('./mongo-client').then((dbs) => {
  ;({ orderDb, ingToProduct } = dbs)
})

router.get('/', async (_req, res) => {
  const orders = await orderDb.get()
  res.send(orders)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const response = await orderDb.deleteOrder(id)
  res.status(response.deletedCount > 0 ? 204 : 404).send(response.result)
})

const path = require('path')
const fs = require('fs')

router.get('/extension', async (req, res) => {
  const file = path.join(__dirname, '/../extension.crx')

  const filename = path.basename(file)
  // var mimetype = mime.lookup(file)
  res.setHeader('Content-disposition', 'attachment; filename=' + filename)
  // Do not set mime type or otherwise chrome tries to install
  // the extension automatically resulting in crx_required_proof_missing
  // error
  // res.setHeader("Content-type", mimetype)
  const filestream = fs.createReadStream(file)
  filestream.pipe(res)
})

router.post('/', async (req, res) => {
  const { recipes, supermarket } = req.body
  const api = createSupermarket(supermarket, ingToProduct)
  await api.login()
  await api.order(recipes)
  const response = await orderDb.storeOrder(recipes)
  const success = response.insertedCount > 0
  res.status(success ? 201 : 400).send(success && response.ops[0])
})

module.exports = router
