Number.prototype.pad = function(size) {
  var s = String(this)
  while (s.length < (size || 2)) {
    s = "0" + s
  }
  return s
}

module.exports = function(date) {
  date = date || new Date()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${date.getFullYear()}-${month.pad(2)}-${day.pad(
    2
  )} ${date.toLocaleTimeString("en-GB")}`
}
