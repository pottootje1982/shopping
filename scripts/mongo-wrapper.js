const db = require("./mongo-client")

class MongoWrapper {
  constructor(client) {
    this.client = client
    this.db = client.db()
  }

  close() {
    client.close()
  }

  get(table) {
    return new MongoTableWrapper(this.db.collection(table))
  }

  defaults() {
    return this
  }

  write() {
    // Stub for defaults to do nothing
  }

  async find(query) {
    return db.findOne(query)
  }
}

class MongoTableWrapper {
  constructor(table) {
    this.table = table
  }

  find(query) {
    this.query = query
    return this
  }

  cloneDeep() {
    return this
  }

  assign(value) {
    this.newValue = value
    return this
  }

  unset(key) {
    delete this.newValue[key]
    return this
  }

  async value() {
    if (this.query) return await this.table.findOne(this.query)
    return await this.table.find().toArray()
  }

  async write() {
    if (this.query) {
      await this.table.findOneAndReplace(this.query, this.newValue)
    }
  }
}

module.exports = MongoWrapper
