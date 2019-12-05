var express = require("express")
var router = express.Router()
const AhApi = require("../scripts/ah-api")
const { ahUser, ahPass } = require("../config")
let recipeDb, ingToProduct, api
require("../scripts/recipe-db")("./mongo-client").then(dbs => {
  ;({ recipeDb, ingToProduct } = dbs)
  api = new AhApi(ahUser, ahPass, ingToProduct)
})

router.get("/", async function(req, res) {
  const products = await api
    .search(req.query.query, req.query.full)
    .catch(err => {
      console.log(err.message, err.error, err.stack)
    })
  res.send(products)
})

router.post("/choose", async function(req, res) {
  ingToProduct
    .storeMapping(req.body.ingredient, req.body.product)
    .catch(err => {
      console.log(err)
    })
  res.send()
})

router.get("/mappings", async function(req, res) {
  const recipe = await recipeDb.getRecipe(req.query.uid)
  const mappings = await ingToProduct.getMappings(recipe)
  res.send(mappings)
})

router.post("/order", async function(req, res) {
  await api.login()
  const order = await ingToProduct.pickOrder(...req.body.recipes)
  await api.addToShoppingList(order).catch(err => {
    console.log(err)
    res.send(err)
  })
  res.send()
})

module.exports = router
