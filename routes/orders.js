"use strict"

var express = require("express")
var router = express.Router()
const AhApi = require("../scripts/ah-api")
const { ahUser, ahPass } = require("../config")
let ingToProduct, orderDb, api
require("../scripts/db/tables")("./mongo-client").then(dbs => {
  ;({ ingToProduct, orderDb } = dbs)
  api = new AhApi(ahUser, ahPass, ingToProduct)
})

router.get("/", async function(req, res) {
  const orders = await orderDb.get()
  res.send(orders)
})

router.post("/product", async function(req, res) {
  const result = await api.addToShoppingList(req.body)
  res.send(result)
})

router.post("/cookie", async function(req, res) {
  api.setCookie(req.body.cookie)
  res.sendStatus(200)
})

router.post("/", async function(req, res) {
  //await api.login()
  let recipes = req.body.recipes
  const order = await ingToProduct.pickOrder(...recipes)
  const failed = await api.addToShoppingList(order).catch(error => {
    res.send({ error })
  })
  if (!failed) return
  if (failed.length > 0) {
    res.send({ failed })
  } else {
    orderDb.storeOrder(recipes)
    res.sendStatus(200)
  }
})

module.exports = router
