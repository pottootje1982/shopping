'use strict'

const express = require('express')
const router = express.Router()
let orderDb

require('../scripts/db/tables')('./mongo-client').then((dbs) => {
  ;({ orderDb } = dbs)
})

router.get('/', async function(_req, res) {
  const orders = await orderDb.get()
  res.send(orders)
})

router.delete('/:id', async function(req, res) {
  const { id } = req.params
  const orders = await orderDb.deleteOrder(id)
  if (orders) res.send(orders)
  else res.sendStatus(404)
})

const path = require('path')
const fs = require('fs')

router.get('/extension', async function(req, res) {
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

router.post('/', async function(req, res) {
  const recipes = req.body.recipes
  const newOrder = await orderDb.storeOrder(recipes)
  res.send(newOrder)
})

module.exports = router
