const getDateStr = require('../../../../client/src/Components/date')
const Table = require('./table')
const { ObjectId } = require('mongodb')

class OrderDb extends Table {
  constructor (db) {
    super(db, 'orders')
    this.db = db
    this.db.defaults({ orders: [] }).write()
  }

  async storeOrder (recipes) {
    const date = getDateStr()
    recipes = recipes.map((r) => ({ uid: r.uid, mappings: r.mappings }))
    const order = { date, recipes }
    const newOrder = await this.store(order)
    return newOrder
  }

  getOrder (uid) {
    return this.db.get('orders').find({ uid }).cloneDeep().value()
  }

  deleteOrder (id) {
    return this.remove({ _id: ObjectId(id) })
  }

  async getHydrated (recipes) {
    const orders = await this.get()
    for (const order of orders) {
      for (const recipeOrder of order.recipes) {
        const recipe = recipes.find((r) => r.uid === recipeOrder.uid)
        recipeOrder.parsedIngredients = recipe && recipe.parsedIngredients
        recipeOrder.name = recipe && recipe.name
      }
    }
    return orders
  }
}

module.exports = OrderDb
