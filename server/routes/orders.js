'use strict'

const express = require('express')
const router = express.Router()
let orderDb, ingToProduct, userDb
const create = require('../scripts/supermarkets')

require('../scripts/db/tables')('./mongo-client').then((dbs) => {
  ;({ orderDb, ingToProduct, userDb } = dbs)
})

router.get('/', async (_req, res) => {
  const orders = await orderDb.get(req.user)
  res.send(orders)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const response = await orderDb.deleteOrder(req.user, id)
  res.status(response.deletedCount > 0 ? 204 : 404).send(response.result)
})

const path = require('path')
const fs = require('fs')

router.get('/extension', async (_req, res) => {
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
  const api = await create(supermarket, ingToProduct, userDb, req.user)
  await api.order(recipes)
  const response = await orderDb.storeOrder(recipes, supermarket, req.user)
  res.status(201).send(response)
})

module.exports = router
