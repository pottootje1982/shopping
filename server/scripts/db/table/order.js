const getDateStr = require('../../../../client/src/Components/date')
const Table = require('./table')
const { ObjectId } = require('mongodb')

class OrderDb extends Table {
  constructor(db) {
    super(db, 'orders')
    this.db = db
    this.db.defaults({ orders: [] }).write()
  }

  async storeOrder(recipes) {
    const date = getDateStr()
    recipes = recipes.map(({ uid, parsedIngredients }) => ({
      uid,
      parsedIngredients
    }))
    const order = { date, recipes }
    const newOrder = await this.store(order)
    return newOrder
  }

  getOrder(uid) {
    return this.db.get('orders').find({ uid }).cloneDeep().value()
  }

  deleteOrder(id) {
    return this.remove({ _id: ObjectId(id) })
  }

  async getHydrated(recipes) {
    const getProduct = ({ parsedIngredients }, ing) => {
      const found = parsedIngredients.find(
        (i) => i.ingredient.toLowerCase() === ing.ingredient.toLowerCase()
      )
      return {
        ...ing.product,
        ...found?.product
      }
    }

    const orders = await this.get()
    for (const order of orders) {
      for (const orderedRecipe of order.recipes) {
        const recipe = recipes.find((r) => r.uid === orderedRecipe.uid)
        orderedRecipe.parsedIngredients = recipe?.parsedIngredients.map(
          (ing) => ({
            ...ing,
            product: getProduct(orderedRecipe, ing)
          })
        )
        orderedRecipe.name = recipe?.name
      }
    }
    return orders
  }
}

module.exports = OrderDb
