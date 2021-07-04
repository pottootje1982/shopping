const { ObjectId } = require("mongodb")

class FileDbWrapper {
  constructor(db) {
    this.db = db
  }

  close() {}

  get(table) {
    return new FileTableWrapper(this.db, table, this.db.get(table))
  }

  defaults(table) {
    const wrapper = new FileTableWrapper(
      this.db,
      table,
      this.db.defaults(table)
    )
    return wrapper
  }
}

class FileTableWrapper {
  constructor(db, tableName, table) {
    this.db = db
    this.table = table
    this.tableName = tableName
  }

  find(query) {
    this.query = query
    this.table = this.table.find(query)
    return this
  }

  cloneDeep() {
    this.table = this.table.cloneDeep()
    return this
  }

  assign(value) {
    this.table = this.table.assign(value)
    return this
  }

  push(value) {
    value._id = new ObjectId()
    this.value = value
    this.table = this.table.push(value)
    return this
  }

  upsert(value) {
    if (this.table.value()) {
      this.table = this.db.get(this.tableName).find(this.query).assign(value)
    } else {
      value._id = new ObjectId()
      this.value = value
      this.table = this.db.get(this.tableName).push(value)
    }
    return this
  }

  remove(query) {
    this.table = this.table.remove(query)
    return this
  }

  unset(key) {
    this.table = this.table.unset(key)
    return this
  }

  value() {
    return this.table.value()
  }

  async write() {
    await this.table.write()
    return this.value
  }
}

module.exports = FileDbWrapper
