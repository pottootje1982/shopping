class IngredientProductDb {
  constructor(db, tableName) {
    this.tableName = tableName || "ing-to-product"
    this.db = db
    this.db
      .defaults({
        mapping: []
      })
      .write()
  }

  storeMapping(ingredient, product) {
    ingredient = ingredient.toLowerCase()
    return this.db
      .get(this.tableName)
      .find({
        ingredient
      })
      .upsert({ ingredient, product })
      .write()
  }

  getMapping(ingredient) {
    ingredient = ingredient.toLowerCase()
    return this.db
      .get(this.tableName)
      .find({
        ingredient
      })
      .value()
  }

  getAllMappings() {
    return this.db.get(this.tableName).value() || []
  }

  async getMappings(...recipes) {
    const mappings = await this.getAllMappings()
    recipes.forEach(recipe => {
      const result = {}
      recipe.ingredients.forEach(i => {
        const mapping = mappings.find(
          m => m.ingredient === i.ingredient.toLowerCase()
        )
        if (mapping) {
          const product = mapping.product
          const quantity = (i.unit ? 1 : i.quantity) || 1
          result[i.ingredient] = {
            ...product,
            quantity
          }
        }
      })
      recipe.mappings = result
    })
  }

  async pickOrder(recipe) {
    await this.getMappings(recipe)
    return {
      items: Object.values(recipe.mappings).filter(
        mapping => !mapping.ignore && mapping.id
      )
    }
  }
}

module.exports = IngredientProductDb
