const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Memory = require('lowdb/adapters/Memory')

class IngredientProductDb {
  constructor(file) {
    const adapter = file ? new FileSync(file) : new Memory()
    this.db = low(adapter)
    this.db.defaults({ mapping: [] }).write()
  }

  storeMapping(ingredient, product) {
    ingredient = ingredient.toLowerCase()
    const table = this.db.get('mapping')
    const mapping = table.find({ ingredient })
    if (mapping.value()) {
      mapping.assign({ product }).write()
    } else {
      table.push({ ingredient, product }).write()
    }
  }

  getMapping(ingredient) {
    ingredient = ingredient.toLowerCase()
    return this.db
      .get('mapping')
      .find({ ingredient })
      .value()
  }

  getMappings(recipe) {
    const result = {}
    recipe.ingredients.ingredientsList.forEach(i => {
      const mapping = this.getMapping(i.ingredient)
      if (mapping) {
        result[mapping.ingredient] = mapping.product
      }
    })
    return result
  }
}

module.exports = IngredientProductDb
