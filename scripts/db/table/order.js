const getDateStr = require("../../../client/src/Components/date")
const Table = require("./table")

class OrderDb extends Table {
  constructor(db) {
    super(db, "orders")
    this.db = db
    this.db.defaults({ orders: [] }).write()
  }

  storeRecipes(recipes) {
    const date = getDateStr()
    recipes = recipes.map(r => ({ uid: r.uid, products: r.mappings }))
    return this.store({ date, recipes })
  }
}

module.exports = OrderDb
