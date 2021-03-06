class IngredientProductDb {
  constructor (db, tableName) {
    this.tableName = tableName || 'ing-to-product'
    this.db = db
    this.db
      .defaults({
        mapping: []
      })
      .write()
  }

  storeMapping (ingredient, product) {
    ingredient = ingredient.toLowerCase()
    return this.db
      .get(this.tableName)
      .find({
        ingredient
      })
      .upsert({ ingredient, product })
      .write()
  }

  getMapping (ingredient) {
    ingredient = ingredient.toLowerCase()
    return this.db
      .get(this.tableName)
      .find({
        ingredient
      })
      .value()
  }

  getAllMappings () {
    return this.db.get(this.tableName).value() || []
  }

  async getMappings (...recipes) {
    const mappings = await this.getAllMappings()
    recipes.forEach((recipe) => {
      const result = {}
      recipe.parsedIngredients.forEach((i) => {
        const mapping = mappings.find(
          (m) => m.ingredient === i.ingredient.toLowerCase()
        )
        const product = (mapping && mapping.product) || {}
        const quantity = i.quantityToOrder()
        result[i.ingredient] = {
          ...product,
          quantity
        }
      })
      recipe.mappings = result
    })
  }

  async pickOrder (...recipes) {
    const mappings = recipes.map((recipe) =>
      Object.values(recipe.mappings).filter(
        (mapping) => !mapping.ignore && !mapping.notAvailable && mapping.id
      )
    )
    let items = [].concat(...mappings)
    items = items.map(({ quantity, id }) => ({ id, quantity }))

    return { items }
  }
}

module.exports = IngredientProductDb
