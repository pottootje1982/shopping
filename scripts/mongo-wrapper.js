const db = require("./mongo-client")

class MongoWrapper {
  constructor(db) {
    this.db = db
  }

  get(table) {
    return new MongoTableWrapper(db.collection(table))
  }

  cloneDeep() {}

  async find(query) {
    return db.findOne(query)
  }
}

class MongoTableWrapper {
  constructor(table) {
    this.table = table
  }
}
