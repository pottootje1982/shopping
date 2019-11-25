var express = require("express")
var router = express.Router()
const { recipeDb } = require("../scripts/recipe-db")
const { ingToProduct } = require("../scripts/ingredient-product-db")
const AhApi = require("../scripts/ah-api")
const { ahUser, ahPass } = require("../config")

const api = new AhApi(ahUser, ahPass)

router.get("/", async function(req, res) {
  const products = await api
    .search(req.query.query, req.query.full)
    .catch(res => {
      console.log(res.message, res.error)
    })
  res.send(products)
})

router.post("/choose", async function(req, res) {
  ingToProduct.storeMapping(req.body.ingredient, req.body.product)
  res.send()
})

router.get("/mappings", async function(req, res) {
  const recipe = recipeDb.getRecipe(req.query.uid)
  const mappings = ingToProduct.getMappings(recipe)
  res.send(mappings)
})

router.post("/order", async function(req, res) {
  await api.login()
  req.body.recipes.forEach(async function(id) {
    const recipe = recipeDb.getRecipe(id)
    const order = ingToProduct.pickOrder(recipe)
    await api.addToShoppingList(order).catch(err => {
      console.log(err)
      res.send(err)
    })
  })
  res.send()
})

module.exports = router
