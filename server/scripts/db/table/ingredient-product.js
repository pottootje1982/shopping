const { Ingredient } = require('../../ingredients')
const Table = require('./table')

class IngredientProductDb extends Table {
  constructor(db) {
    super(db, 'ing-to-product')
    this.db
      .defaults({
        mapping: []
      })
      .write()
  }

  storeMapping(ingredient, { id, title, ignore, notAvailable }, supermarket) {
    ingredient = ingredient.toLowerCase()
    return this.table()
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

  storeMappings(mappings) {
    return this.table().push(mappings).write()
  }

  getMapping(ingredient, supermarket) {
    ingredient = ingredient.toLowerCase()
    return this.table()
      .find({
        ingredient,
        supermarket
      })
      .value()
  }

  getAllMappings() {
    return this.table().value() || []
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
