var express = require("express")
var router = express.Router()
const AhApi = require("../scripts/ah-api")
const { dbConnector } = require("../config")
let recipeDb, ingToProduct, api
require("../scripts/db/tables")(dbConnector).then((dbs) => {
  ;({ recipeDb, ingToProduct } = dbs)
  api = new AhApi(ingToProduct)
})

router.get("/", async function (req, res) {
  const products = await api
    .search(req.query.query, req.query.full)
    .catch((err) => {
      console.log(err.message, err.error, err.stack)
    })
  res.send(products)
})

router.post("/choose", async function (req, res) {
  ingToProduct
    .storeMapping(req.body.ingredient, req.body.product)
    .catch((err) => {
      console.log(err)
    })
  res.send()
})

router.get("/:productId/product", async function (req, res) {
  const product = await api.getProduct(parseInt(req.params.productId))
  res.send(product)
})

router.get("/mappings", async function (req, res) {
  const recipe = await recipeDb.getRecipe(req.query.uid)
  await ingToProduct.getMappings(recipe)
  res.send(recipe.mappings)
})

module.exports = router
