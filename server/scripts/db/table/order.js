const getDateStr = require('../../../../client/src/Components/date')
const Table = require('./table')
const { ObjectId } = require('mongodb')

class OrderDb extends Table {
  constructor(db) {
    super(db, 'orders')
    this.db = db
    this.db.defaults({ orders: [] }).write()
  }

  storeOrder(recipes, supermarket, user) {
    const date = getDateStr()
    recipes = recipes.map(({ uid, parsedIngredients }) => ({
      uid,
      parsedIngredients
    }))
    const order = { date, recipes, supermarket, user }
    return this.store(order)
  }

  getOrders(user) {
    return this.db.get('orders').findAll({ user }).cloneDeep().value()
  }

  getOrder(user, uid) {
    return this.db.get('orders').find({ user, uid }).cloneDeep().value()
  }

  deleteOrder(user, id) {
    return this.remove({ user, _id: ObjectId(id) })
  }

  async getHydrated(user, recipes) {
    const getProduct = ({ parsedIngredients }, ing) => {
      const found = parsedIngredients.find(
        (i) => i.ingredient.toLowerCase() === ing.ingredient.toLowerCase()
      )
      return {
        ...ing.product,
        ...found?.product
      }
    }

    const orders = await this.getOrders(user)
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
