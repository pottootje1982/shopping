const getDateStr = require('../../../../client/src/Components/date')
const Table = require('./table')
const { ObjectId } = require('mongodb')

class OrderDb extends Table {
  constructor(db) {
    super(db, 'orders')
  }

  storeOrder(recipes, supermarket, user) {
    const date = getDateStr()
    recipes = recipes.map(({ uid, parsedIngredients }) => ({
      uid,
      parsedIngredients
    }))
    const order = { date, recipes, supermarket, user }
    return this.table().insertOne(order)
  }

  getOrders(user) {
    return this.table().find({ user }).toArray()
  }

  getOrder(user, uid) {
    return this.table().findOne({ user, uid })
  }

  deleteOrder(user, id) {
    return this.table().deleteOne({ user, _id: ObjectId(id) })
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
