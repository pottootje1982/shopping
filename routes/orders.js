"use strict"

var express = require("express")
var router = express.Router()
const AhApi = require("../scripts/ah-api")
const { ahUser, ahPass } = require("../config")
let ingToProduct, orderDb, api
require("../scripts/db/tables")("./mongo-client").then((dbs) => {
  ;({ ingToProduct, orderDb } = dbs)
  api = new AhApi(ahUser, ahPass, ingToProduct)
})
const config = require("../config")
const { getCookie } = require("../scripts/cookie")

router.get("/", async function (req, res) {
  const orders = await orderDb.get()
  res.send(orders)
})

router.delete("/:id", async function (req, res) {
  const { id } = req.params
  const orders = await orderDb.deleteOrder(id)
  res.send(orders)
})

router.post("/product", async function (req, res) {
  const result = await api.addToShoppingList(req.body)
  res.send(result)
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

router.post("/cookie", async function (req, res) {
  api.setCookie(req.body.cookie)
  res.sendStatus(200)
})

router.post("/", async function (req, res) {
  let { ah_token, ah_token_presumed } = req.headers
  let loginResult
  if (!ah_token) {
    ah_token_presumed = ah_token_presumed || config.ah_token_presumed
    loginResult = await api.login(ah_token_presumed)
    ah_token = getCookie(loginResult.headers["set-cookie"], "ah_token")
  }

  let recipes = req.body.recipes
  const order = await ingToProduct.pickOrder(...recipes)
  const { success, error, failed } = await api
    .addToShoppingList(order, ah_token)
    .catch((error) => {
      res.send({ error })
    })
  if (!success) res.send({ error })
  else if (failed) {
    res.send({ failed })
  } else {
    orderDb.storeOrder(recipes)
    res.sendStatus(200)
  }
})

module.exports = router
