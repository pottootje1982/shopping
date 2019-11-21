const createDb = require("./file-db")

class IngredientProductDb {
  constructor(db) {
    this.db = db
    this.db
      .defaults({
        mapping: []
      })
      .write()
  }

  storeMapping(ingredient, product) {
    ingredient = ingredient.toLowerCase()
    const table = this.db.get("mapping")
    const mapping = table.find({
      ingredient
    })
    if (mapping.value()) {
      mapping
        .assign({
          product
        })
        .write()
    } else {
      table
        .push({
          ingredient,
          product
        })
        .write()
    }
  }

  getMapping(ingredient) {
    ingredient = ingredient.toLowerCase()
    return this.db
      .get("mapping")
      .find({
        ingredient
      })
      .value()
  }

  getAllMappings() {
    return this.db.get("mapping").value()
  }

  getMappings(recipe) {
    const result = {}
    recipe.ingredients.forEach(i => {
      const mapping = this.getMapping(i.ingredient)
      if (mapping) {
        const product = mapping.product
        const quantity = (i.unit ? 1 : i.quantity) || 1
        result[mapping.ingredient] = {
          ...product,
          quantity
        }
      }
    })
    return result
  }

  pickOrder(recipe) {
    const mappings = this.getMappings(recipe)
    return {
      items: Object.values(mappings).filter(
        mapping => !mapping.ignore && mapping.id
      )
    }
  }
}

const ingToProduct = new IngredientProductDb(
  createDb("data/ing-to-product.json")
)
module.exports = { IngredientProductDb, ingToProduct }
