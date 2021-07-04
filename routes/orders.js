"use strict"

var express = require("express")
var router = express.Router()
const AhApi = require("../scripts/ah-api")
let ingToProduct, orderDb, api
require("../scripts/db/tables")("./mongo-client").then((dbs) => {
  ;({ ingToProduct, orderDb } = dbs)
  api = new AhApi(ingToProduct)
})

router.get("/", async function (_req, res) {
  const orders = await orderDb.get()
  res.send(orders)
})

router.delete("/:id", async function (req, res) {
  const { id } = req.params
  const orders = await orderDb.deleteOrder(id)
  if (orders) res.send(orders)
  else res.sendStatus(404)
})

router.post("/product", async function (req, res) {
  const { success, failures } = await api.addToShoppingList(req.body)
  if (success) return res.sendStatus(200)
  else res.send({ failures })
})

var path = require("path")
var fs = require("fs")

router.get("/extension", async function (req, res) {
  var file = __dirname + "/../extension.crx"

  var filename = path.basename(file)
  //var mimetype = mime.lookup(file)

  res.setHeader("Content-disposition", "attachment; filename=" + filename)
  // Do not set mime type or otherwise chrome tries to install
  // the extension automatically resulting in crx_required_proof_missing
  // error
  //res.setHeader("Content-type", mimetype)

  var filestream = fs.createReadStream(file)
  filestream.pipe(res)
})

router.post("/", async function (req, res) {
  let recipes = req.body.recipes
  const newOrder = await orderDb.storeOrder(recipes)
  res.send(newOrder)
})

module.exports = router
