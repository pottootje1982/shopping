const { Ingredient } = require('../../ingredients')

class IngredientProductDb {
  constructor(db, tableName) {
    this.tableName = tableName || 'ing-to-product'
    this.db = db
    this.db
      .defaults({
        mapping: []
      })
      .write()
  }

  storeMapping(ingredient, { id, title, ignore, notAvailable }, supermarket) {
    ingredient = ingredient.toLowerCase()
    return this.db
      .get(this.tableName)
      .find({
        ingredient,
        supermarket
      })
      .upsert({
        ingredient,
        supermarket,
        product: { id, title, ignore, notAvailable }
      })
      .write()
  }

  getMapping(ingredient, supermarket) {
    ingredient = ingredient.toLowerCase()
    return this.db
      .get(this.tableName)
      .find({
        ingredient,
        supermarket
      })
      .value()
  }

  getAllMappings() {
    return this.db.get(this.tableName).value() || []
  }

  async getMappings(recipes, supermarket) {
    const mappings = await this.getAllMappings()
    return recipes.map(({ parsedIngredients, ...r }) => {
      parsedIngredients = parsedIngredients.map((i) => {
        const mapping = mappings.find(
          (m) =>
            m.ingredient === i.ingredient.toLowerCase() &&
            m.supermarket === supermarket
        )
        const ing = Ingredient.createFromObject(i)
        const quantity = ing.quantityToOrder()
        let product = mapping?.product
        return { ...i, quantity, product }
      })
      return { ...r, parsedIngredients }
    })
  }
}

module.exports = IngredientProductDb
