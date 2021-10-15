module.exports = class Table {
  constructor(db, tableName) {
    this.db = db
    this.tableName = tableName
  }

  close() {
    this.db.close()
  }

  table() {
    return this.db.collection(this.tableName)
  }

  remove(query) {
    return this.table().deleteOne(query)
  }

  find(query) {
    return this.table().find(query).toArray()
  }

  all() {
    return this.table().find().toArray()
  }
}
