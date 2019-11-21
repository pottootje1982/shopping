const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const path = require("path")

module.exports = function(file) {
  file = path.resolve(__dirname, file)
  const adapter = new FileSync(file)
  return low(adapter)
}
