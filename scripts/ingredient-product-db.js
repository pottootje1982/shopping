const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Memory = require('lowdb/adapters/Memory')
const path = require('path')

class IngredientProductDb {
  constructor(file) {
    file = file && path.resolve(__dirname, file)
    const adapter = file ? new FileSync(file) : new Memory()
    this.db = low(adapter)
    this.db
      .defaults({
        mapping: [],
      })
      .write()
  }

  storeMapping(ingredient, product) {
    ingredient = ingredient.toLowerCase()
    const table = this.db.get('mapping')
    const mapping = table.find({
      ingredient,
    })
    if (mapping.value()) {
      mapping
        .assign({
          product,
        })
        .write()
    } else {
      table
        .push({
          ingredient,
          product,
        })
        .write()
    }
  }

  getMapping(ingredient) {
    ingredient = ingredient.toLowerCase()
    return this.db
      .get('mapping')
      .find({
        ingredient,
      })
      .value()
  }

  getAllMappings() {
    return this.db.get('mapping').value()
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
          quantity,
        }
      }
    })
    return result
  }

  pickOrder(recipe) {
    const mappings = this.getMappings(recipe)
    return {
      items: Object.values(mappings),
    }
  }
}

const ingToProduct = new IngredientProductDb('data/ing-to-product.json')
module.exports = { IngredientProductDb, ingToProduct }
