const Memory = require("lowdb/adapters/Memory")
const low = require("lowdb")
const path = require("path")

module.exports = function(file) {
  file = path.resolve(__dirname, file)
  const contents = require(file)
  const adapter = new Memory()
  const db = low(adapter)
  db.defaults(contents).write()
  return db
}
