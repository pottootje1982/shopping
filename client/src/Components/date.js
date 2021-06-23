function pad(s, size) {
  s = s.toString()
  while (s.length < (size || 2)) {
    s = "0" + s
  }
  return s
}

module.exports = function (date) {
  date = date || new Date()
  const month = pad(date.getMonth() + 1, 2)
  const day = pad(date.getDate(), 2)
  return `${date.getFullYear()}-${month}-${day} ${date.toLocaleTimeString(
    "en-GB"
  )}`
}
